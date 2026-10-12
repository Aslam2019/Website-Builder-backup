import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

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
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token not saved')

      notify.success(`Welcome back, ${user.username}!`)

      const redirect = location.state?.from
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin', { replace: true })
      } else if (redirect) {
        navigate(redirect, { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed'
      setServerError(msg)
      notify.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="lg-root" style={interStyle}>
      {/* Background */}
      <div className="lg-bg" aria-hidden="true">
        <div className="lg-blob lg-blob-1" />
        <div className="lg-blob lg-blob-2" />
        <div className="lg-blob lg-blob-3" />
        <div className="lg-grid" />
      </div>

      <div className="lg-container">
        {/* ========== LEFT — Branding ========== */}
        <aside className="lg-aside">
          <Link to="/" className="lg-brand">
            <span className="lg-brand-mark">WB</span>
            <span className="lg-brand-text">
              Website<span>Builder</span>
            </span>
          </Link>

          <div className="lg-aside-content">
            <h2 className="lg-aside-title">
              Welcome back to<br />
              <span className="lg-aside-accent">your dashboard</span>
            </h2>
            <p className="lg-aside-sub">
              Sign in to continue building and managing your websites.
            </p>

            <ul className="lg-aside-features">
              <li>
                <span className="lg-aside-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Manage your live websites</span>
              </li>
              <li>
                <span className="lg-aside-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Update content in seconds</span>
              </li>
              <li>
                <span className="lg-aside-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>24/7 priority support</span>
              </li>
            </ul>
          </div>

          <div className="lg-aside-foot">
            <div className="lg-aside-avatars">
              <span className="lg-aside-avatar" style={{ background: '#6366f1' }}>A</span>
              <span className="lg-aside-avatar" style={{ background: '#a855f7' }}>R</span>
              <span className="lg-aside-avatar" style={{ background: '#06b6d4' }}>K</span>
              <span className="lg-aside-avatar lg-aside-avatar-more">+2k</span>
            </div>
            <p className="lg-aside-foot-text">
              <strong>2,000+</strong> businesses trust us
            </p>
          </div>
        </aside>

        {/* ========== RIGHT — Form ========== */}
        <main className="lg-main">
          <div className="lg-card">
            {/* Top bar */}
            <div className="lg-top">
              <Link to="/" className="lg-back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Home
              </Link>
              <Link to="/register" className="lg-signup-link">
                New here? <strong>Sign up →</strong>
              </Link>
            </div>

            {/* Head */}
            <div className="lg-head">
              <h1 className="lg-title">Welcome back</h1>
              <p className="lg-subtitle">Sign in to continue building your website.</p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="lg-alert-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={submit} noValidate className="lg-form">
              {/* Username */}
              <div className="lg-field">
                <label htmlFor="login-username" className="lg-label">
                  Username <span className="lg-req">*</span>
                </label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={change}
                    placeholder="Enter your username"
                    autoComplete="username"
                    autoFocus
                    className={`lg-input has-icon ${errors.username ? 'has-error' : ''}`}
                  />
                </div>
                {errors.username && <div className="lg-err">{errors.username}</div>}
              </div>

              {/* Password */}
              <div className="lg-field">
                <div className="lg-label-row">
                  <label htmlFor="login-password" className="lg-label">
                    Password <span className="lg-req">*</span>
                  </label>
                  <a
                    href="#"
                    className="lg-forgot"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Please contact admin to reset password')
                    }}
                  >
                    Forgot?
                  </a>
                </div>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={change}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`lg-input has-icon has-toggle ${errors.password ? 'has-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="lg-input-toggle"
                    onClick={() => setShowPw(!showPw)}
                    tabIndex={-1}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <div className="lg-err">{errors.password}</div>}
              </div>

              {/* Submit */}
              <button type="submit" className="lg-btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="lg-spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="lg-foot">
              Don't have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================
          STYLES
          ============================================================ */}
      <style>{`
        /* ============ ROOT ============ */
        .lg-root {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          background: #f8fafc;
          overflow-x: hidden;
          display: flex;
          align-items: stretch;
        }

        /* ============ BACKGROUND ============ */
        .lg-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .lg-blob { position: absolute; border-radius: 50%; filter: blur(120px); }
        .lg-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%);
          top: -15%; left: -10%;
        }
        .lg-blob-2 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%);
          bottom: -20%; right: -10%;
        }
        .lg-blob-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
          top: 40%; right: 20%;
        }
        .lg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%);
        }

        .lg-container {
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
        .lg-aside {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 56px;
          background: linear-gradient(160deg, #0b0a1f 0%, #14122e 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .lg-aside::before {
          content: '';
          position: absolute;
          top: -40%; right: -30%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 60%);
          filter: blur(100px);
          pointer-events: none;
        }
        .lg-aside::after {
          content: '';
          position: absolute;
          bottom: -30%; left: -20%;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 60%);
          filter: blur(100px);
          pointer-events: none;
        }
        .lg-aside > * { position: relative; z-index: 1; }

        .lg-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #fff;
          margin-bottom: 24px;
        }
        .lg-brand-mark {
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
        .lg-brand-text {
          font-size: 19px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .lg-brand-text span { color: #a78bfa; }

        .lg-aside-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0;
          max-width: 460px;
        }
        .lg-aside-title {
          font-size: 40px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 20px;
        }
        .lg-aside-accent {
          background: linear-gradient(120deg, #a855f7 0%, #818cf8 60%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lg-aside-sub {
          font-size: 15.5px;
          line-height: 1.7;
          color: #94a3b8;
          margin: 0 0 36px;
        }
        .lg-aside-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .lg-aside-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14.5px;
          font-weight: 500;
          color: #cbd5e1;
        }
        .lg-aside-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(16,185,129,0.15);
          color: #10b981;
          flex-shrink: 0;
        }

        .lg-aside-foot {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .lg-aside-avatars { display: flex; align-items: center; }
        .lg-aside-avatar {
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
        .lg-aside-avatar:first-child { margin-left: 0; }
        .lg-aside-avatar-more {
          background: rgba(255,255,255,0.1);
          font-size: 10.5px;
          color: #cbd5e1;
        }
        .lg-aside-foot-text {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }
        .lg-aside-foot-text strong { color: #fff; }

        /* ============ RIGHT MAIN ============ */
        .lg-main {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 40px;
          overflow-y: auto;
        }
        .lg-card {
          width: 100%;
          max-width: 460px;
        }

        /* Top bar */
        .lg-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .lg-back {
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
        .lg-back:hover {
          color: #6366f1;
          background: rgba(99,102,241,0.06);
        }
        .lg-signup-link {
          font-size: 13px;
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .lg-signup-link strong {
          color: #6366f1;
          font-weight: 700;
        }
        .lg-signup-link:hover strong { color: #4f46e5; }

        /* Head */
        .lg-head { margin-bottom: 28px; }
        .lg-title {
          font-size: 30px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin: 0 0 8px;
          line-height: 1.15;
        }
        .lg-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.55;
        }

        /* Alert */
        .lg-alert-error {
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
        .lg-alert-error svg { flex-shrink: 0; margin-top: 2px; }

        /* Form */
        .lg-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .lg-field { display: flex; flex-direction: column; gap: 7px; }

        .lg-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .lg-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          letter-spacing: -0.005em;
        }
        .lg-req { color: #ef4444; }
        .lg-forgot {
          font-size: 12.5px;
          font-weight: 600;
          color: #6366f1;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .lg-forgot:hover { color: #4f46e5; text-decoration: underline; }

        .lg-input-wrap { position: relative; }
        .lg-input {
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
        .lg-input::placeholder { color: #94a3b8; }
        .lg-input.has-icon { padding-left: 42px; }
        .lg-input.has-toggle { padding-right: 46px; }
        .lg-input:hover { border-color: #cbd5e1; }
        .lg-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
        }
        .lg-input.has-error { border-color: #ef4444; }
        .lg-input.has-error:focus {
          box-shadow: 0 0 0 4px rgba(239,68,68,0.12);
        }

        .lg-input-icon {
          position: absolute;
          top: 50%;
          left: 14px;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .lg-input-toggle {
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
        .lg-input-toggle:hover {
          color: #6366f1;
          background: #eef2ff;
        }

        .lg-err {
          font-size: 12px;
          font-weight: 500;
          color: #ef4444;
        }

        /* Submit */
        .lg-btn-primary {
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
          margin-top: 6px;
        }
        .lg-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px -10px rgba(99,102,241,0.9);
        }
        .lg-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .lg-btn-primary svg { transition: transform 0.2s; }
        .lg-btn-primary:hover:not(:disabled) svg { transform: translateX(2px); }

        .lg-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lgSpin 0.7s linear infinite;
        }
        @keyframes lgSpin { to { transform: rotate(360deg); } }

        /* Foot */
        .lg-foot {
          text-align: center;
          font-size: 13.5px;
          color: #64748b;
          margin-top: 26px;
          padding-top: 22px;
          border-top: 1px solid #f1f5f9;
        }
        .lg-foot a {
          color: #6366f1;
          font-weight: 700;
          text-decoration: none;
        }
        .lg-foot a:hover { text-decoration: underline; }

        /* ============================================================
           TABLET (≤1024px) — Hide aside, center card
           ============================================================ */
        @media (max-width: 1024px) {
          .lg-container {
            grid-template-columns: 1fr;
            min-height: 100vh;
            min-height: 100dvh;
          }
          .lg-aside { display: none; }

          .lg-main {
            /* ✅ FIX: Center content naturally, no forced height */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            min-height: 100vh;
            min-height: 100dvh;
            overflow-y: auto;
            background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          }
          .lg-card {
            /* ✅ FIX: Content-sized card with nice wrapper */
            width: 100%;
            max-width: 440px;
            padding: 32px 28px;
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #f1f5f9;
            box-shadow:
              0 1px 2px rgba(15,23,42,0.04),
              0 12px 32px -12px rgba(15,23,42,0.12);
          }
        }

        /* ============================================================
           MOBILE (≤768px) — Full width, comfortable padding
           ============================================================ */
        @media (max-width: 768px) {
          .lg-main {
            /* ✅ FIX: Start from top with breathing room */
            align-items: flex-start;
            padding: 24px 16px 40px;
          }
          .lg-card {
            max-width: 100%;
            padding: 24px 20px;
            border-radius: 18px;
            margin-top: 0;
          }

          .lg-top { margin-bottom: 22px; }
          .lg-back { padding: 4px 8px 4px 0; font-size: 13px; }
          .lg-signup-link { font-size: 12.5px; }

          .lg-head { margin-bottom: 22px; }
          .lg-title { font-size: 25px; margin-bottom: 6px; }
          .lg-subtitle { font-size: 13.5px; }

          .lg-form { gap: 16px; }
          .lg-input { padding: 13px 14px; font-size: 14px; }
          .lg-input.has-icon { padding-left: 42px; }
          .lg-input.has-toggle { padding-right: 46px; }

          .lg-btn-primary {
            padding: 14px 18px;
            font-size: 14.5px;
            margin-top: 4px;
          }

          .lg-foot {
            margin-top: 20px;
            padding-top: 18px;
            font-size: 13px;
          }
        }

        /* ============================================================
           SMALL MOBILE (≤480px)
           ============================================================ */
        @media (max-width: 480px) {
          .lg-main { padding: 20px 12px 32px; }
          .lg-card {
            padding: 22px 18px;
            border-radius: 16px;
          }

          .lg-top { margin-bottom: 20px; }
          .lg-head { margin-bottom: 20px; }
          .lg-title { font-size: 23px; }
          .lg-subtitle { font-size: 13px; }

          .lg-form { gap: 15px; }
          .lg-input {
            padding: 12px 13px;
            font-size: 14px;
            border-radius: 11px;
          }
          .lg-input.has-icon { padding-left: 40px; }
          .lg-input.has-toggle { padding-right: 44px; }

          .lg-input-icon { left: 12px; }
          .lg-input-toggle { right: 8px; width: 30px; height: 30px; }

          .lg-label { font-size: 12.5px; }
          .lg-forgot { font-size: 12px; }

          .lg-btn-primary {
            padding: 13px 16px;
            font-size: 14px;
            border-radius: 11px;
          }

          .lg-foot {
            margin-top: 18px;
            padding-top: 14px;
            font-size: 12.5px;
          }
        }

        /* ============================================================
           TINY MOBILE (≤380px)
           ============================================================ */
        @media (max-width: 380px) {
          .lg-main { padding: 16px 10px 24px; }
          .lg-card { padding: 20px 14px; }
          .lg-title { font-size: 21px; }
          .lg-input { padding: 11px 12px; font-size: 13.5px; }
          .lg-input.has-icon { padding-left: 38px; }
          .lg-btn-primary { padding: 12px 14px; font-size: 13.5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lg-spinner { animation: none !important; }
          .lg-btn-primary:hover { transform: none !important; }
        }
      `}</style>
    </div>
  )
}