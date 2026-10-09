import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'

export default function Login() {
  const { login } = useAuth()
  const notify = useNotify()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setServerError('')
  }

  const validate = () => {
    const err = {}
    if (!form.username.trim()) err.username = 'Username is required'
    if (!form.password) err.password = 'Password is required'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setServerError('')
    try {
      const user = await login(form.username.trim(), form.password)
      notify.success(`Welcome back, ${user.username}!`)
      const redirect = location.state?.from
      if (user.role === 'super_admin') navigate('/admin', { replace: true })
      else if (redirect) navigate(redirect, { replace: true })
      else navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed'
      setServerError(msg)
      notify.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-wrap-v2">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-blob b1" />
        <div className="auth-blob b2" />
        <div className="auth-blob b3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-card-v2">
        {/* Top: back + brand */}
        <div className="auth-card-top">
          <button type="button" className="auth-back-btn"
            onClick={() => navigate('/')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="auth-mini-brand">Website<span>Builder</span></div>
        </div>

        <div className="auth-head-v2">
          <h1>Welcome back</h1>
          <p>Sign in to continue building your website.</p>
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

        <form onSubmit={submit} noValidate>
          {/* Username */}
          <div className="field">
            <input
              id="login-username"
              name="username"
              className={`field-input ${errors.username ? 'error' : ''} ${form.username ? 'has-value' : ''}`}
              value={form.username}
              onChange={change}
              placeholder=" "
              autoComplete="username"
              autoFocus
            />
            <label htmlFor="login-username" className="field-label">
              Username <span className="field-req">*</span>
            </label>
            {errors.username && (
              <div className="field-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.username}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <input
              id="login-password"
              name="password"
              type={showPw ? 'text' : 'password'}
              className={`field-input ${errors.password ? 'error' : ''} ${form.password ? 'has-value' : ''}`}
              value={form.password}
              onChange={change}
              placeholder=" "
              autoComplete="current-password"
              style={{ paddingRight: 46 }}
            />
            <label htmlFor="login-password" className="field-label">
              Password <span className="field-req">*</span>
            </label>
            <button type="button" className="field-toggle"
              onClick={() => setShowPw(!showPw)}
              tabIndex={-1}
              aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
            {errors.password && (
              <div className="field-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.password}
              </div>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? (
              <>
                <span className="btn-spinner" /> Signing in...
              </>
            ) : (
              <>
                Sign In
                <svg className="arrow" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-foot-v2">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  )
}