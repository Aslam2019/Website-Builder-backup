import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { categoryApi } from '../../api/categoryApi'
import { pricingApi } from '../../api/pricingApi'
import { isMobile } from '../../utils/validators'

export default function Register() {
  const { register } = useAuth()
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
        setPlans(pRes.data?.data?.plans || [])
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
    else if (!isMobile(form.mobile)) err.mobile = 'Enter a valid 10-digit Indian mobile'
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
      notify.success('Registration successful!')
      setTimeout(() => navigate('/login'), 2200)
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

  const chosenPlan = plans.find((p) => (p._id || p.id) === form.preferred_plan_id)
  const slideClass = slideDir === 'right' ? 'slide-in-right' : 'slide-in-left'

  return (
    <div className="auth-wrap-v2">
      <div className="auth-bg">
        <div className="auth-blob b1" />
        <div className="auth-blob b2" />
        <div className="auth-blob b3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-card-v2">
        {/* Top bar */}
        <div className="auth-card-top">
          {step === 2 && !success ? (
            <button type="button" className="auth-back-btn" onClick={goBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
          ) : (
            <button type="button" className="auth-back-btn" onClick={() => navigate('/')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Home
            </button>
          )}
          <div className="auth-mini-brand">Website<span>Builder</span></div>
        </div>

        {/* ================= SUCCESS STATE ================= */}
        {success ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div className="success-check">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 style={{ fontSize: 22, marginBottom: 8 }}>Account created!</h1>
            <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
              Save your login details below.
            </p>

            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: 12,
              padding: '16px 20px',
              textAlign: 'left',
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11, color: '#15803d', fontWeight: 800,
                marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Your Login Credentials
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 13.5, marginBottom: 8, paddingBottom: 8,
                borderBottom: '1px dashed #bbf7d0',
              }}>
                <span style={{ color: '#166534' }}>Username</span>
                <strong style={{ color: '#065f46', fontFamily: 'monospace', fontSize: 14 }}>
                  {form.username}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                <span style={{ color: '#166534' }}>Password</span>
                <strong style={{ color: '#065f46', fontFamily: 'monospace', fontSize: 14 }}>
                  {form.password}
                </strong>
              </div>
            </div>

            <p className="muted" style={{ fontSize: 12.5, marginBottom: 18 }}>
              Redirecting to login in 2 seconds...
            </p>

            <button type="button" className="auth-btn"
              onClick={() => navigate('/login')}>
              Go to Login
              <svg className="arrow" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="auth-head-v2">
              <h1>Create your account</h1>
              <p>
                {step === 1
                  ? 'Step 1 of 2 — Tell us about yourself'
                  : 'Step 2 of 2 — Choose your preferred plan'}
              </p>
            </div>

            <div className="step-bar-v2">
              <div className={`step-dot-v2 ${step === 1 ? 'active' : 'done'}`}>
                <span>1</span>
              </div>
              <div className={`step-line-v2 ${step > 1 ? 'done' : ''}`} />
              <div className={`step-dot-v2 ${step === 2 ? 'active' : ''}`}>
                <span>2</span>
              </div>
            </div>

            {serverError && (
              <div className="auth-alert error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <div className={slideClass} key="step1">
                <div className="field">
                  <input
                    id="reg-username" name="username"
                    className={`field-input ${errors.username ? 'error' : ''} ${form.username ? 'has-value' : ''}`}
                    value={form.username} onChange={change}
                    placeholder=" " autoComplete="username" autoFocus
                  />
                  <label htmlFor="reg-username" className="field-label">
                    Username <span className="field-req">*</span>
                  </label>
                  {errors.username && <div className="field-error">{errors.username}</div>}
                </div>

                <div className="field-row">
                  <div className="field" style={{ marginBottom: 0 }}>
                    <input
                      id="reg-password" name="password"
                      type={showPw ? 'text' : 'password'}
                      className={`field-input ${errors.password ? 'error' : ''} ${form.password ? 'has-value' : ''}`}
                      value={form.password} onChange={change}
                      placeholder=" " autoComplete="new-password"
                      style={{ paddingRight: 44 }}
                    />
                    <label htmlFor="reg-password" className="field-label">
                      Password <span className="field-req">*</span>
                    </label>
                    <button type="button" className="field-toggle" tabIndex={-1}
                      onClick={() => setShowPw(!showPw)}>
                      {showPw ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                    {errors.password && <div className="field-error">{errors.password}</div>}
                  </div>

                  <div className="field" style={{ marginBottom: 0 }}>
                    <input
                      id="reg-confirm" name="confirm_password"
                      type={showCpw ? 'text' : 'password'}
                      className={`field-input ${errors.confirm_password ? 'error' : ''} ${form.confirm_password ? 'has-value' : ''}`}
                      value={form.confirm_password} onChange={change}
                      placeholder=" " autoComplete="new-password"
                      style={{ paddingRight: 44 }}
                    />
                    <label htmlFor="reg-confirm" className="field-label">
                      Confirm <span className="field-req">*</span>
                    </label>
                    <button type="button" className="field-toggle" tabIndex={-1}
                      onClick={() => setShowCpw(!showCpw)}>
                      {showCpw ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                    {errors.confirm_password && <div className="field-error">{errors.confirm_password}</div>}
                  </div>
                </div>

                <div className="field" style={{ marginTop: 18 }}>
                  <input
                    id="reg-mobile" name="mobile"
                    className={`field-input ${errors.mobile ? 'error' : ''} ${form.mobile ? 'has-value' : ''}`}
                    value={form.mobile} onChange={change}
                    placeholder=" " maxLength={10}
                    inputMode="numeric"
                  />
                  <label htmlFor="reg-mobile" className="field-label">
                    Mobile Number <span className="field-req">*</span>
                  </label>
                  {errors.mobile && <div className="field-error">{errors.mobile}</div>}
                </div>

                <div className="field field-select">
                  <select
                    id="reg-category"
                    name="category_id"
                    className={`field-input ${errors.category_id ? 'error' : ''}`}
                    value={form.category_id}
                    onChange={change}
                    disabled={loadingOptions}
                    style={{ appearance: 'none', cursor: 'pointer', paddingRight: 44 }}
                  >
                    <option value="" disabled hidden></option>
                    {loadingOptions ? (
                      <option value="" disabled>Loading...</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                      ))
                    )}
                  </select>
                  <label htmlFor="reg-category" className="field-label">
                    Business Category <span className="field-req">*</span>
                  </label>
                  <span className="field-chevron">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                  {errors.category_id && <div className="field-error">{errors.category_id}</div>}
                </div>

                <button type="button" className="auth-btn" onClick={goNext}
                  disabled={loadingOptions}>
                  Continue
                  <svg className="arrow" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <div className="auth-foot-v2">
                  Already have an account? <Link to="/login">Sign in</Link>
                </div>
              </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <div className={slideClass} key="step2">
                <div className="plan-list">
                  {plans.length === 0 && !loadingOptions && (
                    <p className="muted" style={{ fontSize: 13.5, textAlign: 'center', padding: 20 }}>
                      No plans available. You can choose a plan later.
                    </p>
                  )}
                  {plans.map((p) => {
                    const id = p._id || p.id
                    const selected = form.preferred_plan_id === id
                    return (
                      <div key={id}
                        className={`plan-card ${selected ? 'selected' : ''}`}
                        onClick={() => setForm({ ...form, preferred_plan_id: id })}
                      >
                        <div className="plan-info">
                          <div className="plan-name">{p.name}</div>
                          <div className="plan-desc">{p.description || '—'}</div>
                        </div>
                        <div className="plan-price">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                          <span>one-time</span>
                        </div>
                        <div className="plan-check">
                          {selected && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {chosenPlan && (
                  <p className="muted" style={{ fontSize: 12.5, marginBottom: 16, textAlign: 'center' }}>
                    You can change this any time before payment.
                  </p>
                )}

                <div className="auth-btn-row">
                  <button
                    type="button"
                    className="auth-btn auth-btn-outline"
                    onClick={goBack}
                    disabled={submitting}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="auth-btn"
                    onClick={submit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="btn-spinner" /> Creating...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <svg className="arrow" width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  )
}