import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { categoryApi } from '../../api/categoryApi'
import { pricingApi } from '../../api/pricingApi'
import { isMobile } from '../../utils/validators'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

export default function Register() {
  const { register, login } = useAuth()
  const notify = useNotify()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [slideDir, setSlideDir] = useState('right')

  const [categories, setCategories] = useState([])
  const [plans, setPlans] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

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

        // ✅ Filter: only Basic & Pro
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

  const validateStep1 = () => {
    const err = {}
    const u = form.username.trim()
    if (!u) err.username = 'Username is required'
    else if (!/^[a-zA-Z0-9_]{3,30}$/.test(u))
      err.username = '3–30 chars (letters, numbers, underscore)'
    if (!form.password) err.password = 'Password is required'
    else if (form.password.length < 6) err.password = 'Minimum 6 characters'
    if (form.password !== form.confirm_password)
      err.confirm_password = 'Passwords do not match'
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

  /* ============================================================
     ✅ SUBMIT — Register + Auto-login + Redirect to Dashboard
     ============================================================ */
  const submit = async () => {
    setSubmitting(true)
    setServerError('')
    try {
      // 1. Register user
      await register({
        username: form.username.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
        mobile: form.mobile.trim(),
        category_id: form.category_id,
        preferred_plan_id: form.preferred_plan_id || undefined,
      })

      // 2. Show success state
      setSuccess(true)
      notify.success('Account created! Signing you in…')

      // 3. Auto-login with same credentials
      try {
        const user = await login(form.username.trim(), form.password)
        const token = localStorage.getItem('token')

        if (!token) throw new Error('Auto-login failed')

        // 4. Redirect to dashboard after brief delay (for success screen)
        setTimeout(() => {
          if (user?.role === 'admin' || user?.role === 'super_admin') {
            navigate('/admin', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
        }, 1800)

      } catch (loginErr) {
        // Auto-login fail aana → login page-ku redirect with message
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

  /* Password strength */
  const strength = (() => {
    const p = form.password
    if (!p) return { level: 0, label: '', color: '#e5e7eb' }
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 2) return { level: 1, label: 'Weak', color: '#ef4444' }
    if (score <= 3) return { level: 2, label: 'Fair', color: '#f59e0b' }
    if (score <= 4) return { level: 3, label: 'Good', color: '#3b82f6' }
    return { level: 4, label: 'Strong', color: '#10b981' }
  })()

  return (
    <div className="reg-root" style={interStyle}>
      {/* Background */}
      <div className="reg-bg" aria-hidden="true">
        <div className="reg-blob reg-blob-1" />
        <div className="reg-blob reg-blob-2" />
        <div className="reg-blob reg-blob-3" />
        <div className="reg-grid" />
      </div>

      <div className="reg-container">
        {/* ========== LEFT — Branding ========== */}
        <aside className="reg-aside">
          <Link to="/" className="reg-brand">
            <span className="reg-brand-mark">WB</span>
            <span className="reg-brand-text">
              Website<span>Builder</span>
            </span>
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

          <div className="reg-aside-foot">
            <div className="reg-aside-avatars">
              <span className="reg-aside-avatar" style={{ background: '#6366f1' }}>A</span>
              <span className="reg-aside-avatar" style={{ background: '#a855f7' }}>R</span>
              <span className="reg-aside-avatar" style={{ background: '#06b6d4' }}>K</span>
              <span className="reg-aside-avatar reg-aside-avatar-more">+2k</span>
            </div>
            <p className="reg-aside-foot-text">
              <strong>2,000+</strong> businesses registered
            </p>
          </div>
        </aside>

        {/* ========== RIGHT — Form ========== */}
        <main className="reg-main">
          <div className="reg-card">

            {/* Back link */}
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
                <span className="reg-step-label">
                  Step {step} of 2
                </span>
              </div>
            )}

            {/* ================= SUCCESS ================= */}
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
                {/* Head */}
                <div className="reg-head">
                  <h1 className="reg-title">Create your account</h1>
                  <p className="reg-subtitle">
                    {step === 1
                      ? "Let's start with your basic details"
                      : 'Choose the plan that fits your needs'}
                  </p>
                </div>

                {/* Step indicator */}
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

                {/* Server error */}
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
                    />

                    <div className="reg-row">
                      <Field
                        id="reg-password"
                        name="password"
                        label="Password"
                        type={showPw ? 'text' : 'password'}
                        value={form.password}
                        onChange={change}
                        error={errors.password}
                        autoComplete="new-password"
                        toggle={showPw ? 'hide' : 'show'}
                        onToggle={() => setShowPw(!showPw)}
                      />
                      <Field
                        id="reg-confirm"
                        name="confirm_password"
                        label="Confirm"
                        type={showCpw ? 'text' : 'password'}
                        value={form.confirm_password}
                        onChange={change}
                        error={errors.confirm_password}
                        autoComplete="new-password"
                        toggle={showCpw ? 'hide' : 'show'}
                        onToggle={() => setShowCpw(!showCpw)}
                      />
                    </div>

                    {form.password && (
                      <div className="reg-strength">
                        <div className="reg-strength-bars">
                          {[1, 2, 3, 4].map((i) => (
                            <span
                              key={i}
                              className="reg-strength-bar"
                              style={{
                                background: i <= strength.level ? strength.color : '#e5e7eb',
                              }}
                            />
                          ))}
                        </div>
                        <span className="reg-strength-label" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      </div>
                    )}

                    <Field
                      id="reg-mobile"
                      name="mobile"
                      label="Mobile Number"
                      value={form.mobile}
                      onChange={change}
                      error={errors.mobile}
                      maxLength={10}
                      inputMode="numeric"
                    />

                    <div className="reg-field">
                      <label htmlFor="reg-category" className="reg-label">
                        Business Category <span className="reg-req">*</span>
                      </label>
                      <div className="reg-select-wrap">
                        <select
                          id="reg-category"
                          name="category_id"
                          className={`reg-select ${errors.category_id ? 'has-error' : ''}`}
                          value={form.category_id}
                          onChange={change}
                          disabled={loadingOptions}
                        >
                          <option value="" disabled hidden></option>
                          {loadingOptions ? (
                            <option value="" disabled>Loading…</option>
                          ) : (
                            categories.map((c) => (
                              <option key={c._id || c.id} value={c._id || c.id}>
                                {c.name}
                              </option>
                            ))
                          )}
                        </select>
                        <svg className="reg-select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
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
                        <p className="reg-empty">
                          No plans available. You can choose a plan later.
                        </p>
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
                            {isPopular && (
                              <span className="reg-plan-badge">POPULAR</span>
                            )}

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
                      <p className="reg-hint">
                        You can change this any time before payment.
                      </p>
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

      {/* ============================================================
          STYLES
          ============================================================ */}
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

        /* ============ BACKGROUND ============ */
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

        .reg-aside-foot {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .reg-aside-avatars { display: flex; align-items: center; }
        .reg-aside-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          border: 2px solid #0b0a1f;
          margin-left: -8px;
        }
        .reg-aside-avatar:first-child { margin-left: 0; }
        .reg-aside-avatar-more {
          background: rgba(255,255,255,0.1);
          font-size: 10.5px;
          color: #cbd5e1;
        }
        .reg-aside-foot-text {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }
        .reg-aside-foot-text strong { color: #fff; }

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

        /* Top bar */
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
        .reg-back:hover {
          color: #6366f1;
          background: rgba(99,102,241,0.06);
        }
        .reg-step-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        /* Head */
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

        /* Steps */
        .reg-steps {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .reg-step {
          display: flex;
          align-items: center;
          gap: 10px;
        }
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
        .reg-step.done .reg-step-text {
          color: #0f172a;
        }
        .reg-step-line {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          border-radius: 2px;
          transition: background 0.3s ease;
        }
        .reg-step-line.done {
          background: linear-gradient(90deg, #6366f1, #a855f7);
        }

        /* Alert */
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

        /* Step content */
        .reg-step-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
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
        .reg-field { display: flex; flex-direction: column; gap: 7px; }
        .reg-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          letter-spacing: -0.005em;
        }
        .reg-req { color: #ef4444; }

        .reg-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

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
        .reg-input.has-error:focus {
          box-shadow: 0 0 0 4px rgba(239,68,68,0.12);
        }
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
        .reg-input-toggle:hover {
          color: #6366f1;
          background: #eef2ff;
        }

        .reg-err {
          font-size: 12px;
          font-weight: 500;
          color: #ef4444;
        }

        /* Select */
        .reg-select-wrap { position: relative; }
        .reg-select {
          width: 100%;
          padding: 13px 42px 13px 14px;
          font-size: 14px;
          font-family: inherit;
          color: #0f172a;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }
        .reg-select:hover { border-color: #cbd5e1; }
        .reg-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
        }
        .reg-select.has-error { border-color: #ef4444; }
        .reg-select:disabled { opacity: 0.6; cursor: wait; }
        .reg-select-icon {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        /* Password strength */
        .reg-strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: -4px;
        }
        .reg-strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .reg-strength-bar {
          flex: 1;
          height: 4px;
          border-radius: 999px;
          transition: background 0.2s ease;
        }
        .reg-strength-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
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
        .reg-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
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
        .reg-btn-outline:hover:not(:disabled) {
          border-color: #cbd5e1;
          background: #f8fafc;
        }
        .reg-btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }

        .reg-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: regSpin 0.7s linear infinite;
        }
        @keyframes regSpin { to { transform: rotate(360deg); } }

        /* Foot */
        .reg-foot {
          text-align: center;
          font-size: 13.5px;
          color: #64748b;
          margin-top: 8px;
        }
        .reg-foot a {
          color: #6366f1;
          font-weight: 700;
          text-decoration: none;
        }
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
        .reg-plan.is-popular {
          border-color: rgba(168,85,247,0.4);
        }
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
        .reg-success {
          text-align: center;
          padding: 20px 8px;
        }
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
        .reg-success-sub {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 24px;
        }

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
        .reg-creds-row + .reg-creds-row {
          border-top: 1px dashed #bbf7d0;
        }
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
          .reg-main {
            padding: 24px 20px;
            align-items: flex-start;
          }
          .reg-card { max-width: 100%; padding-top: 12px; }
          .reg-title { font-size: 25px; }
          .reg-subtitle { font-size: 13.5px; }
          .reg-head { margin-bottom: 22px; }
          .reg-top { margin-bottom: 24px; }

          .reg-steps { margin-bottom: 24px; }
          .reg-step-text { font-size: 12px; }

          .reg-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .reg-input, .reg-select {
            padding: 12px 13px;
            font-size: 14px;
          }

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

          .reg-input, .reg-select {
            padding: 11px 12px;
            font-size: 13.5px;
            border-radius: 11px;
          }
          .reg-input.has-toggle { padding-right: 42px; }

          .reg-creds { padding: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .slide-right, .slide-left, .reg-spinner, .reg-success-icon, .reg-redirect-spinner {
            animation: none !important;
          }
          .reg-btn-primary:hover, .reg-plan:hover { transform: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ============================================================
   REUSABLE FIELD COMPONENT
   ============================================================ */
function Field({
  id, name, label, value, onChange, error,
  type = 'text', autoComplete, autoFocus,
  maxLength, inputMode, toggle, onToggle,
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
          placeholder=""
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
      {error && <div className="reg-err">{error}</div>}
    </div>
  )
}