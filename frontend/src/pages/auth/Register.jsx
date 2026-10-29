import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { categoryApi } from '../../api/categoryApi'
import { pricingApi } from '../../api/pricingApi'
import { adminApi } from '../../api/adminApi'
import { isMobile } from '../../utils/validators'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

/* ✅ Build full URL for images */
const getFullUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  const base = import.meta.env.VITE_UPLOADS_BASE_URL 
    || import.meta.env.VITE_API_URL?.replace('/api', '') 
    || 'https://98.130.23.135'
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}

/* ============================================================
   ✅ PASSWORD VALIDATION
   ============================================================ */
const COMMON_PASSWORDS = [
  'password', 'password1', 'password123', '123456', '12345678',
  'qwerty', 'abc123', 'letmein', 'welcome', 'admin', 'admin123',
  'iloveyou', 'monkey', 'dragon', 'master', 'sunshine', 'princess',
  'football', 'baseball', 'welcome1', 'qwerty123', 'passw0rd',
  'pass123', 'test123', 'user123', 'login123', 'changeme',
]

const getPasswordChecks = (password) => {
  const p = password || ''
  return {
    length: p.length >= 8,
    length10: p.length >= 10,
    uppercase: /[A-Z]/.test(p),
    lowercase: /[a-z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p),
    noSpaces: p.length > 0 && !/\s/.test(p),
    notCommon: p.length > 0 && !COMMON_PASSWORDS.includes(p.toLowerCase()),
    noRepeat: !/(.)\1{3,}/.test(p),
    noSequence: !/(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(p),
  }
}

const getPasswordStrength = (password) => {
  const p = password || ''
  if (!p) return { level: 0, label: '', color: '#e5e7eb', score: 0 }
  const checks = getPasswordChecks(p)
  let score = 0
  if (checks.length) score++
  if (checks.uppercase) score++
  if (checks.lowercase) score++
  if (checks.number) score++
  if (checks.special) score++
  if (checks.length10) score++
  if (checks.notCommon) score++
  if (checks.noRepeat) score++
  if (checks.noSequence) score++
  if (!checks.notCommon) return { level: 1, label: 'Very Weak', color: '#dc2626', score: 0 }
  if (score <= 3) return { level: 1, label: 'Weak', color: '#ef4444', score }
  if (score <= 5) return { level: 2, label: 'Fair', color: '#f59e0b', score }
  if (score <= 7) return { level: 3, label: 'Good', color: '#3b82f6', score }
  return { level: 4, label: 'Strong', color: '#10b981', score }
}

/* ============================================================
   ✅ CUSTOM SELECT COMPONENT
   ============================================================ */
function CustomSelect({ value, onChange, options, placeholder, error, disabled }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setSearch('')
      }
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [open])

  const selected = options.find((o) => String(o.value) === String(value))
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase().trim())
  )

  const handleSelect = (opt) => {
    onChange({ target: { name: 'category_id', value: opt.value } })
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="cs-wrap" ref={wrapperRef}>
      <button
        type="button"
        className={`cs-trigger ${open ? 'is-open' : ''} ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
      >
        <span className={`cs-trigger-text ${selected ? '' : 'is-placeholder'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className="cs-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="cs-dropdown">
          {options.length > 5 && (
            <div className="cs-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="cs-search"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          <div className="cs-options">
            {filtered.length === 0 ? (
              <div className="cs-empty">No results</div>
            ) : (
              filtered.map((opt) => {
                const isSelected = String(opt.value) === String(value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`cs-option ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(opt)}
                  >
                    <span className="cs-option-label">{opt.label}</span>
                    {isSelected && (
                      <span className="cs-option-check">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================================================
   MAIN
   ============================================================ */
export default function Register() {
  const { register, login } = useAuth()
  const notify = useNotify()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [slideDir, setSlideDir] = useState('right')

  const [categories, setCategories] = useState([])
  const [plans, setPlans] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  // ✅ Site Settings State (Logo & Name)
  const [site, setSite] = useState(() => {
    try {
      const cached = localStorage.getItem('wb_site_settings')
      return cached ? JSON.parse(cached) : { logo_url: '', site_name: 'WebsiteBuilder' }
    } catch {
      return { logo_url: '', site_name: 'WebsiteBuilder' }
    }
  })

  // ✅ Fetch Site Settings
  useEffect(() => {
    adminApi.getSiteSettings()
      .then((res) => {
        const data = res.data?.data
        if (data) {
          setSite(data)
          localStorage.setItem('wb_site_settings', JSON.stringify(data))
        }
      })
      .catch(() => {})
  }, [])

  const [form, setForm] = useState({
    username: '', password: '', confirm_password: '',
    mobile: '', category_id: '', preferred_plan_id: '',
  })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          categoryApi.list(),
          pricingApi.list(),
        ])
        if (!alive) return
        setCategories(cRes.data?.data?.categories || [])
        const allPlans = pRes.data?.data?.plans || []
        const filtered = allPlans.filter((p) => {
          const name = String(p.name || '').toLowerCase()
          return !name.includes('custom') && !name.includes('enterprise')
        })
        setPlans(filtered)
      } catch {
        if (alive) notify.error('Failed to load options')
      } finally {
        if (alive) setLoadingOptions(false)
      }
    })()
    return () => { alive = false }
  }, [notify])

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setServerError('')
  }

  const pwChecks = useMemo(() => getPasswordChecks(form.password), [form.password])
  const pwStrength = useMemo(() => getPasswordStrength(form.password), [form.password])

  const validateStep1 = () => {
    const err = {}
    const u = form.username.trim()

    if (!u) err.username = 'Username is required'
    else if (!/^[a-zA-Z0-9_]{3,30}$/.test(u))
      err.username = '3–30 chars (letters, numbers, underscore only)'

    if (!form.password) {
      err.password = 'Password is required'
    } else if (form.password.length < 8) {
      err.password = `Password too short — at least 8 characters needed (now ${form.password.length})`
    } else if (COMMON_PASSWORDS.includes(form.password.toLowerCase())) {
      err.password = 'This password is too common. Choose something unique.'
    } else if (!/[A-Z]/.test(form.password)) {
      err.password = 'Add at least 1 uppercase letter (A–Z)'
    } else if (!/[a-z]/.test(form.password)) {
      err.password = 'Add at least 1 lowercase letter (a–z)'
    } else if (!/[0-9]/.test(form.password)) {
      err.password = 'Add at least 1 number (0–9)'
    } else if (/\s/.test(form.password)) {
      err.password = 'Password cannot contain spaces'
    } else if (/(.)\1{3,}/.test(form.password)) {
      err.password = 'Avoid repeating same character 4+ times (e.g., "aaaa")'
    }

    if (!form.confirm_password) {
      err.confirm_password = 'Please confirm your password'
    } else if (form.password !== form.confirm_password) {
      err.confirm_password = 'Passwords do not match'
    }

    if (!form.mobile.trim()) err.mobile = 'Mobile number is required'
    else if (!isMobile(form.mobile)) err.mobile = 'Enter a valid 10-digit mobile'

    if (!form.category_id) err.category_id = 'Please select a category'

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const goNext = () => {
    if (!validateStep1()) return
    setSlideDir('right')
    setStep(2)
  }

  const goBack = () => {
    setSlideDir('left')
    setStep(1)
  }

  const submit = async () => {
    setSubmitting(true)
    setServerError('')
    try {
      await register({
        username: form.username.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
        mobile: form.mobile.trim(),
        category_id: form.category_id,
        preferred_plan_id: form.preferred_plan_id || undefined,
      })
      setSuccess(true)
      notify.success('Account created! Signing you in…')

      try {
        const user = await login(form.username.trim(), form.password)
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Auto-login failed')
        setTimeout(() => {
          if (user?.role === 'admin' || user?.role === 'super_admin') {
            navigate('/admin', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
        }, 1800)
      } catch (loginErr) {
        console.warn('Auto-login failed:', loginErr)
        notify.warning('Account created! Please login manually.')
        setTimeout(() => navigate('/login'), 1800)
      }
    } catch (err) {
      const data = err?.response?.data
      const msg = data?.message || 'Registration failed'
      setServerError(msg)
      if (data?.errors) {
        setErrors(data.errors)
        setSlideDir('left')
        setStep(1)
      }
      notify.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const slideClass = slideDir === 'right' ? 'slide-right' : 'slide-left'

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c._id || c.id, label: c.name })),
    [categories]
  )

  /* ✅ Dynamic Brand Component */
  const BrandLogo = () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      {site.logo_url ? (
        <img
          src={getFullUrl(site.logo_url)}
          alt={site.site_name || 'Logo'}
          style={{ height: '42px', width: 'auto', maxWidth: '60px', objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <span className="reg-brand-mark">
          {(site.site_name || 'WebsiteBuilder').charAt(0).toUpperCase()}
        </span>
      )}
      <span className="reg-brand-text">
        {site.site_name || 'WebsiteBuilder'}
      </span>
    </span>
  )

  return (
    <div className="reg-root" style={interStyle}>
      <div className="reg-bg" aria-hidden="true">
        <div className="reg-blob reg-blob-1" />
        <div className="reg-blob reg-blob-2" />
        <div className="reg-blob reg-blob-3" />
        <div className="reg-grid" />
      </div>

      <div className="reg-container">
        {/* LEFT */}
        <aside className="reg-aside">
          <Link to="/" className="reg-brand" style={{ textDecoration: 'none' }}>
            <BrandLogo />
          </Link>

          <div className="reg-aside-content">
            <h2 className="reg-aside-title">
              Start building your<br />
              <span className="reg-aside-accent">dream website</span>
            </h2>
            <p className="reg-aside-sub">
              Join thousands of businesses who trust us to build their online presence.
            </p>

            <ul className="reg-aside-features">
              <li>
                <span className="reg-aside-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Free forever plan available</span>
              </li>
              <li>
                <span className="reg-aside-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Launch in under 10 minutes</span>
              </li>
              <li>
                <span className="reg-aside-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>No credit card required</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="reg-main">
          <div className="reg-card">
            {!success && (
              <div className="reg-top">
                {step === 2 ? (
                  <button type="button" className="reg-back" onClick={goBack}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <Link to="/" className="reg-back">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Home
                  </Link>
                )}
                <span className="reg-step-label">Step {step} of 2</span>
              </div>
            )}

            {success ? (
              <div className="reg-success">
                <div className="reg-success-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h1>Welcome, {form.username}!</h1>
                <p className="reg-success-sub">
                  Your account is ready. Taking you to your dashboard…
                </p>
                <div className="reg-creds">
                  <div className="reg-creds-label">Account Details</div>
                  <div className="reg-creds-row">
                    <span className="reg-creds-key">Username</span>
                    <strong className="reg-creds-val">{form.username}</strong>
                  </div>
                  <div className="reg-creds-row">
                    <span className="reg-creds-key">Password</span>
                    <strong className="reg-creds-val">{form.password}</strong>
                  </div>
                </div>
                <div className="reg-redirect-row">
                  <span className="reg-redirect-spinner" />
                  <span>Redirecting to dashboard…</span>
                </div>
              </div>
            ) : (
              <>
                <div className="reg-head">
                  <h1 className="reg-title">Create your account</h1>
                  <p className="reg-subtitle">
                    {step === 1
                      ? "Let's start with your basic details"
                      : 'Choose the plan that fits your needs'}
                  </p>
                </div>

                <div className="reg-steps">
                  <div className={`reg-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
                    <div className="reg-step-dot">
                      {step > 1 ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : '1'}
                    </div>
                    <span className="reg-step-text">Account</span>
                  </div>
                  <div className={`reg-step-line ${step > 1 ? 'done' : ''}`} />
                  <div className={`reg-step ${step === 2 ? 'active' : ''}`}>
                    <div className="reg-step-dot">2</div>
                    <span className="reg-step-text">Plan</span>
                  </div>
                </div>

                {serverError && (
                  <div className="reg-alert-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{serverError}</span>
                  </div>
                )}

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                  <div className={`reg-step-content ${slideClass}`} key="step1">
                    <Field
                      id="reg-username"
                      name="username"
                      label="Username"
                      value={form.username}
                      onChange={change}
                      error={errors.username}
                      autoComplete="username"
                      autoFocus
                      hint="3–30 chars, letters/numbers/underscore"
                    />

                    {/* Password */}
                    <div className="reg-field">
                      <label htmlFor="reg-password" className="reg-label">
                        Password <span className="reg-req">*</span>
                      </label>
                      <div className="reg-input-wrap">
                        <input
                          id="reg-password"
                          name="password"
                          type={showPw ? 'text' : 'password'}
                          value={form.password}
                          onChange={change}
                          onFocus={() => setPwFocused(true)}
                          onBlur={() => setPwFocused(false)}
                          autoComplete="new-password"
                          className={`reg-input has-toggle ${errors.password ? 'has-error' : ''}`}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          className="reg-input-toggle"
                          onClick={() => setShowPw(!showPw)}
                          tabIndex={-1}
                          aria-label={showPw ? 'Hide password' : 'Show password'}
                        >
                          {showPw ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {errors.password && <div className="reg-err">{errors.password}</div>}

                      {(pwFocused || form.password) && (
                        <div className="reg-pw-panel">
                          <div className="reg-pw-strength">
                            <div className="reg-pw-bars">
                              {[1, 2, 3, 4].map((i) => (
                                <span
                                  key={i}
                                  className="reg-pw-bar"
                                  style={{ background: i <= pwStrength.level ? pwStrength.color : '#e5e7eb' }}
                                />
                              ))}
                            </div>
                            <span className="reg-pw-label" style={{ color: pwStrength.color }}>
                              {pwStrength.label}
                            </span>
                          </div>
                          <ul className="reg-pw-rules">
                            <PwRule passed={pwChecks.length} text="At least 8 characters" />
                            <PwRule passed={pwChecks.uppercase} text="One uppercase letter (A–Z)" />
                            <PwRule passed={pwChecks.lowercase} text="One lowercase letter (a–z)" />
                            <PwRule passed={pwChecks.number} text="One number (0–9)" />
                            <PwRule passed={pwChecks.special} text="One special character (!@#$…)" optional />
                            <PwRule passed={pwChecks.notCommon} text="Not a commonly used password" />
                            <PwRule passed={pwChecks.noRepeat} text="No repeated characters (aaaa)" />
                            <PwRule passed={pwChecks.noSequence} text="No simple sequences (1234, abcd)" />
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="reg-field">
                      <label htmlFor="reg-confirm" className="reg-label">
                        Confirm Password <span className="reg-req">*</span>
                      </label>
                      <div className="reg-input-wrap">
                        <input
                          id="reg-confirm"
                          name="confirm_password"
                          type={showCpw ? 'text' : 'password'}
                          value={form.confirm_password}
                          onChange={change}
                          autoComplete="new-password"
                          className={`reg-input has-toggle ${errors.confirm_password ? 'has-error' : ''}`}
                          placeholder="Re-enter your password"
                        />
                        <button
                          type="button"
                          className="reg-input-toggle"
                          onClick={() => setShowCpw(!showCpw)}
                          tabIndex={-1}
                          aria-label={showCpw ? 'Hide password' : 'Show password'}
                        >
                          {showCpw ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <div className="reg-err">{errors.confirm_password}</div>
                      )}
                      {form.confirm_password && form.password === form.confirm_password && (
                        <div className="reg-match-ok">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Passwords match
                        </div>
                      )}
                    </div>

                    {/* Mobile */}
                    <Field
                      id="reg-mobile"
                      name="mobile"
                      label="Mobile Number"
                      value={form.mobile}
                      onChange={change}
                      error={errors.mobile}
                      maxLength={10}
                      inputMode="numeric"
                      hint="10-digit Indian mobile number"
                    />

                    {/* ✅ CUSTOM CATEGORY DROPDOWN */}
                    <div className="reg-field">
                      <label className="reg-label">
                        Business Category <span className="reg-req">*</span>
                      </label>
                      <CustomSelect
                        value={form.category_id}
                        onChange={change}
                        options={categoryOptions}
                        placeholder={loadingOptions ? 'Loading…' : 'Select a category'}
                        error={errors.category_id}
                        disabled={loadingOptions}
                      />
                      {errors.category_id && <div className="reg-err">{errors.category_id}</div>}
                    </div>

                    <button
                      type="button"
                      className="reg-btn-primary"
                      onClick={goNext}
                      disabled={loadingOptions}
                    >
                      Continue
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>

                    <div className="reg-foot">
                      Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                  </div>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                  <div className={`reg-step-content ${slideClass}`} key="step2">
                    <div className="reg-plans">
                      {plans.length === 0 && !loadingOptions && (
                        <p className="reg-empty">No plans available. You can choose a plan later.</p>
                      )}
                      {plans.map((p, idx) => {
                        const id = p._id || p.id
                        const selected = form.preferred_plan_id === id
                        const isPopular = idx === 1 || String(p.name || '').toLowerCase().includes('pro')
                        return (
                          <button
                            type="button"
                            key={id}
                            className={`reg-plan ${selected ? 'selected' : ''} ${isPopular ? 'is-popular' : ''}`}
                            onClick={() => setForm({ ...form, preferred_plan_id: id })}
                          >
                            {isPopular && <span className="reg-plan-badge">POPULAR</span>}
                            <div className="reg-plan-radio">
                              {selected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <div className="reg-plan-info">
                              <div className="reg-plan-name">{p.name}</div>
                              <div className="reg-plan-desc">
                                {p.description || (isPopular ? 'Best for growing businesses' : 'Perfect for getting started')}
                              </div>
                            </div>
                            <div className="reg-plan-price">
                              <div className="reg-plan-amount">
                                <span>₹</span>
                                {Number(p.price || 0).toLocaleString('en-IN')}
                              </div>
                              <div className="reg-plan-unit">one-time</div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {form.preferred_plan_id && (
                      <p className="reg-hint">You can change this any time before payment.</p>
                    )}

                    <div className="reg-btn-row">
                      <button
                        type="button"
                        className="reg-btn-outline"
                        onClick={goBack}
                        disabled={submitting}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="reg-btn-primary"
                        onClick={submit}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="reg-spinner" />
                            Creating…
                          </>
                        ) : (
                          <>
                            Complete Registration
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <style>{`
        /* ============ ROOT ============ */
        .reg-root {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          background: #f8fafc;
          overflow-x: hidden;
          display: flex;
          align-items: stretch;
        }

        .reg-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .reg-blob { position: absolute; border-radius: 50%; filter: blur(120px); }
        .reg-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%);
          top: -15%; left: -10%;
        }
        .reg-blob-2 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%);
          bottom: -20%; right: -10%;
        }
        .reg-blob-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
          top: 40%; right: 20%;
        }
        .reg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%);
        }

        .reg-container {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          min-height: 100vh;
        }

        /* ============ LEFT ASIDE ============ */
        .reg-aside {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 56px;
          background: linear-gradient(160deg, #0b0a1f 0%, #14122e 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .reg-aside::before {
          content: '';
          position: absolute;
          top: -40%; right: -30%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 60%);
          filter: blur(100px);
          pointer-events: none;
        }
        .reg-aside::after {
          content: '';
          position: absolute;
          bottom: -30%; left: -20%;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 60%);
          filter: blur(100px);
          pointer-events: none;
        }
        .reg-aside > * { position: relative; z-index: 1; }

        .reg-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #fff;
          margin-bottom: 24px;
        }
        .reg-brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px; height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: -0.02em;
          box-shadow: 0 10px 24px -8px rgba(124,58,237,0.7);
        }
        .reg-brand-text {
          font-size: 19px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .reg-brand-text span { color: #a78bfa; }

        .reg-aside-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0;
          max-width: 460px;
        }
        .reg-aside-title {
          font-size: 40px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 20px;
        }
        .reg-aside-accent {
          background: linear-gradient(120deg, #a855f7 0%, #818cf8 60%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .reg-aside-sub {
          font-size: 15.5px;
          line-height: 1.7;
          color: #94a3b8;
          margin: 0 0 36px;
        }
        .reg-aside-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .reg-aside-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14.5px;
          font-weight: 500;
          color: #cbd5e1;
        }
        .reg-aside-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(16,185,129,0.15);
          color: #10b981;
          flex-shrink: 0;
        }

        /* ============ RIGHT MAIN ============ */
        .reg-main {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 40px;
          overflow-y: auto;
        }
        .reg-card {
          width: 100%;
          max-width: 500px;
        }

        .reg-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .reg-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          background: transparent;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .reg-back:hover { color: #6366f1; background: rgba(99,102,241,0.06); }
        .reg-step-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .reg-head { margin-bottom: 28px; }
        .reg-title {
          font-size: 30px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin: 0 0 8px;
          line-height: 1.15;
        }
        .reg-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.55;
        }

        .reg-steps {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .reg-step { display: flex; align-items: center; gap: 10px; }
        .reg-step-dot {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          background: #f1f5f9;
          color: #94a3b8;
          border: 1.5px solid #e2e8f0;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .reg-step.active .reg-step-dot {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 6px 16px -6px rgba(99,102,241,0.65);
        }
        .reg-step.done .reg-step-dot {
          background: #d1fae5;
          color: #059669;
          border-color: #a7f3d0;
        }
        .reg-step-text {
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
        }
        .reg-step.active .reg-step-text,
        .reg-step.done .reg-step-text { color: #0f172a; }
        .reg-step-line {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          border-radius: 2px;
          transition: background 0.3s ease;
        }
        .reg-step-line.done { background: linear-gradient(90deg, #6366f1, #a855f7); }

        .reg-alert-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          color: #b91c1c;
          font-size: 13.5px;
          font-weight: 500;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .reg-alert-error svg { flex-shrink: 0; margin-top: 2px; }

        .reg-step-content { display: flex; flex-direction: column; gap: 16px; }
        .slide-right { animation: slideRight 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        .slide-left { animation: slideLeft 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* ============ FIELDS ============ */
        .reg-field { display: flex; flex-direction: column; gap: 7px; position: relative; }
        .reg-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          letter-spacing: -0.005em;
        }
        .reg-req { color: #ef4444; }

        .reg-input-wrap { position: relative; }
        .reg-input {
          width: 100%;
          padding: 13px 14px;
          font-size: 14px;
          font-family: inherit;
          color: #0f172a;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }
        .reg-input::placeholder { color: #94a3b8; }
        .reg-input:hover { border-color: #cbd5e1; }
        .reg-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
        }
        .reg-input.has-error { border-color: #ef4444; }
        .reg-input.has-error:focus { box-shadow: 0 0 0 4px rgba(239,68,68,0.12); }
        .reg-input.has-toggle { padding-right: 46px; }

        .reg-input-toggle {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .reg-input-toggle:hover { color: #6366f1; background: #eef2ff; }

        .reg-err { font-size: 12px; font-weight: 500; color: #ef4444; }
        .reg-hint-text { font-size: 11.5px; color: #94a3b8; margin: 0; }

        .reg-match-ok {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #059669;
        }

        /* ============================================================
           ✅ CUSTOM SELECT
           ============================================================ */
        .cs-wrap {
          position: relative;
          width: 100%;
          z-index: 10;
        }

        .cs-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          padding: 13px 14px;
          font-size: 14px;
          font-family: inherit;
          color: #0f172a;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          box-sizing: border-box;
        }
        .cs-trigger:hover { border-color: #cbd5e1; }
        .cs-trigger.is-open {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
        }
        .cs-trigger.has-error { border-color: #ef4444; }
        .cs-trigger.has-error.is-open { box-shadow: 0 0 0 4px rgba(239,68,68,0.12); }
        .cs-trigger.is-disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f8fafc;
        }
        .cs-trigger-text {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cs-trigger-text.is-placeholder { color: #94a3b8; }
        .cs-arrow {
          flex-shrink: 0;
          color: #64748b;
          transition: transform 0.25s ease;
        }
        .cs-trigger.is-open .cs-arrow {
          transform: rotate(180deg);
          color: #6366f1;
        }

        .cs-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          z-index: 100;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          box-shadow:
            0 20px 40px -12px rgba(15, 23, 42, 0.15),
            0 8px 16px -8px rgba(15, 23, 42, 0.08);
          overflow: hidden;
          animation: csDropdownIn 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 300px;
          display: flex;
          flex-direction: column;
        }
        @keyframes csDropdownIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cs-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-bottom: 1px solid #f1f5f9;
          color: #94a3b8;
          flex-shrink: 0;
        }
        .cs-search {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          font-size: 13.5px;
          font-family: inherit;
          color: #0f172a;
          padding: 2px 0;
        }
        .cs-search::placeholder { color: #cbd5e1; }

        .cs-options {
          overflow-y: auto;
          flex: 1;
          padding: 6px;
          max-height: 240px;
        }
        .cs-options::-webkit-scrollbar { width: 6px; }
        .cs-options::-webkit-scrollbar-track { background: transparent; }
        .cs-options::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        .cs-options::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

        .cs-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          font-family: inherit;
          font-weight: 500;
          color: #334155;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.12s ease;
        }
        .cs-option:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .cs-option.is-selected {
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.06) 100%);
          color: #4f46e5;
          font-weight: 700;
        }
        .cs-option.is-selected:hover {
          background: linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 100%);
        }
        .cs-option-label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cs-option-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          flex-shrink: 0;
        }

        .cs-empty {
          padding: 20px 12px;
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
        }

        /* ============================================================
           PASSWORD PANEL
           ============================================================ */
        .reg-pw-panel {
          margin-top: 4px;
          padding: 14px 14px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          animation: pwPanelIn 0.25s ease;
        }
        @keyframes pwPanelIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .reg-pw-strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px dashed #e2e8f0;
        }
        .reg-pw-bars { display: flex; gap: 4px; flex: 1; }
        .reg-pw-bar {
          flex: 1;
          height: 5px;
          border-radius: 999px;
          transition: background 0.25s ease;
        }
        .reg-pw-label {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .reg-pw-rules {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
        }
        .reg-pw-rule {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 500;
          color: #94a3b8;
          transition: color 0.2s ease;
        }
        .reg-pw-rule.is-passed { color: #059669; }
        .reg-pw-rule-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #94a3b8;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }
        .reg-pw-rule.is-passed .reg-pw-rule-icon {
          background: #d1fae5;
          color: #059669;
        }
        .reg-pw-rule-icon svg { width: 9px; height: 9px; }
        .reg-pw-rule-optional {
          font-size: 10.5px;
          color: #94a3b8;
          font-style: italic;
          margin-left: 4px;
        }

        /* ============ BUTTONS ============ */
        .reg-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 20px;
          font-size: 14.5px;
          font-weight: 700;
          font-family: inherit;
          color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: -0.01em;
          box-shadow: 0 10px 24px -10px rgba(99,102,241,0.75);
          margin-top: 8px;
        }
        .reg-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px -10px rgba(99,102,241,0.9);
        }
        .reg-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .reg-btn-primary svg { transition: transform 0.2s; }
        .reg-btn-primary:hover:not(:disabled) svg { transform: translateX(2px); }

        .reg-btn-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 10px;
          margin-top: 8px;
        }
        .reg-btn-outline {
          padding: 14px 20px;
          font-size: 14.5px;
          font-weight: 700;
          font-family: inherit;
          color: #334155;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .reg-btn-outline:hover:not(:disabled) { border-color: #cbd5e1; background: #f8fafc; }
        .reg-btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }

        .reg-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: regSpin 0.7s linear infinite;
        }
        @keyframes regSpin { to { transform: rotate(360deg); } }

        .reg-foot {
          text-align: center;
          font-size: 13.5px;
          color: #64748b;
          margin-top: 8px;
        }
        .reg-foot a { color: #6366f1; font-weight: 700; text-decoration: none; }
        .reg-foot a:hover { text-decoration: underline; }

        .reg-hint {
          font-size: 12.5px;
          color: #94a3b8;
          text-align: center;
          margin: 0;
        }
        .reg-empty {
          font-size: 13.5px;
          color: #94a3b8;
          text-align: center;
          padding: 24px 20px;
          margin: 0;
        }

        /* ============ PLANS ============ */
        .reg-plans {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 4px;
        }
        .reg-plan {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 18px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          text-align: left;
          width: 100%;
        }
        .reg-plan:hover {
          border-color: #cbd5e1;
          background: #fafbff;
          transform: translateY(-1px);
        }
        .reg-plan.selected {
          border-color: #6366f1;
          background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.04) 100%);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .reg-plan.is-popular { border-color: rgba(168,85,247,0.4); }
        .reg-plan.is-popular.selected {
          border-color: #a855f7;
          box-shadow: 0 0 0 4px rgba(168,85,247,0.12);
        }
        .reg-plan-badge {
          position: absolute;
          top: -10px;
          right: 16px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          background: linear-gradient(135deg, #a855f7, #7c3aed);
          color: #fff;
          padding: 4px 10px;
          border-radius: 999px;
          box-shadow: 0 4px 12px -3px rgba(168,85,247,0.6);
        }
        .reg-plan-radio {
          width: 24px; height: 24px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .reg-plan.selected .reg-plan-radio {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-color: transparent;
        }
        .reg-plan-info { min-width: 0; }
        .reg-plan-name {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.015em;
          margin-bottom: 3px;
        }
        .reg-plan-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.45;
        }
        .reg-plan-price { text-align: right; }
        .reg-plan-amount {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .reg-plan-amount span {
          font-size: 14px;
          color: #94a3b8;
          margin-right: 1px;
        }
        .reg-plan-unit {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-top: 2px;
        }

        /* ============ SUCCESS ============ */
        .reg-success { text-align: center; padding: 20px 8px; }
        .reg-success-icon {
          width: 76px; height: 76px;
          margin: 0 auto 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 14px 34px -14px rgba(16,185,129,0.6);
          animation: successPop 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes successPop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .reg-success h1 {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin: 0 0 8px;
        }
        .reg-success-sub { font-size: 14px; color: #64748b; margin: 0 0 24px; }

        .reg-creds {
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 1.5px solid #bbf7d0;
          border-radius: 14px;
          padding: 18px 20px;
          text-align: left;
          margin-bottom: 20px;
        }
        .reg-creds-label {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #15803d;
          margin-bottom: 14px;
        }
        .reg-creds-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          padding: 8px 0;
        }
        .reg-creds-row + .reg-creds-row { border-top: 1px dashed #bbf7d0; }
        .reg-creds-key { color: #166534; font-weight: 500; }
        .reg-creds-val {
          color: #065f46;
          font-family: 'SF Mono', Consolas, monospace;
          font-size: 13.5px;
          font-weight: 700;
        }

        .reg-redirect-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13px;
          color: #64748b;
          padding: 12px 0;
        }
        .reg-redirect-spinner {
          width: 16px; height: 16px;
          border: 2px solid #e2e8f0;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: regSpin 0.7s linear infinite;
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width: 1024px) {
          .reg-container { grid-template-columns: 1fr; }
          .reg-aside { display: none; }
          .reg-main {
            padding: 32px 24px;
            background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
            min-height: 100vh;
          }
          .reg-card { max-width: 480px; }
        }

        @media (max-width: 768px) {
          .reg-main { padding: 24px 20px; align-items: flex-start; }
          .reg-card { max-width: 100%; padding-top: 12px; }
          .reg-title { font-size: 25px; }
          .reg-subtitle { font-size: 13.5px; }
          .reg-head { margin-bottom: 22px; }
          .reg-top { margin-bottom: 24px; }
          .reg-steps { margin-bottom: 24px; }
          .reg-step-text { font-size: 12px; }

          .reg-plan {
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            gap: 8px 14px;
            padding: 16px;
          }
          .reg-plan-radio { grid-row: 1 / 3; }
          .reg-plan-info { grid-column: 2; grid-row: 1; }
          .reg-plan-price {
            grid-column: 2;
            grid-row: 2;
            text-align: left;
            display: flex;
            align-items: baseline;
            gap: 6px;
          }
          .reg-plan-amount { font-size: 17px; }
          .reg-plan-unit { margin-top: 0; }

          .reg-success h1 { font-size: 22px; }
          .reg-success-icon { width: 68px; height: 68px; }
        }

        @media (max-width: 480px) {
          .reg-main { padding: 20px 16px; }
          .reg-title { font-size: 22px; }
          .reg-subtitle { font-size: 13px; }

          .reg-steps { gap: 8px; margin-bottom: 22px; }
          .reg-step-dot { width: 28px; height: 28px; font-size: 12px; }
          .reg-step-text { font-size: 11.5px; }

          .reg-btn-row { grid-template-columns: 1fr; gap: 8px; }
          .reg-btn-row .reg-btn-outline { order: 2; }

          .reg-btn-primary { padding: 13px 18px; font-size: 14px; }

          .reg-input, .cs-trigger {
            padding: 11px 12px;
            font-size: 13.5px;
            border-radius: 11px;
          }
          .reg-input.has-toggle { padding-right: 42px; }

          .reg-creds { padding: 16px; }
          .reg-pw-panel { padding: 12px; }
          .reg-pw-rule { font-size: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .slide-right, .slide-left, .reg-spinner, .reg-success-icon,
          .reg-redirect-spinner, .reg-pw-panel, .cs-dropdown {
            animation: none !important;
          }
          .reg-btn-primary:hover, .reg-plan:hover { transform: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ============================================================
   REUSABLE FIELD
   ============================================================ */
function Field({
  id, name, label, value, onChange, error,
  type = 'text', autoComplete, autoFocus,
  maxLength, inputMode, toggle, onToggle, hint,
}) {
  return (
    <div className="reg-field">
      <label htmlFor={id} className="reg-label">
        {label} <span className="reg-req">*</span>
      </label>
      <div className="reg-input-wrap">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          inputMode={inputMode}
          className={`reg-input ${error ? 'has-error' : ''} ${toggle ? 'has-toggle' : ''}`}
        />
        {toggle && onToggle && (
          <button
            type="button"
            className="reg-input-toggle"
            onClick={onToggle}
            tabIndex={-1}
            aria-label={toggle === 'show' ? 'Show password' : 'Hide password'}
          >
            {toggle === 'hide' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {hint && !error && <div className="reg-hint-text">{hint}</div>}
      {error && <div className="reg-err">{error}</div>}
    </div>
  )
}

/* ============================================================
   PASSWORD RULE
   ============================================================ */
function PwRule({ passed, text, optional }) {
  return (
    <li className={`reg-pw-rule ${passed ? 'is-passed' : ''}`}>
      <span className="reg-pw-rule-icon">
        {passed ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
      </span>
      <span>
        {text}
        {optional && <span className="reg-pw-rule-optional">(optional)</span>}
      </span>
    </li>
  )
}