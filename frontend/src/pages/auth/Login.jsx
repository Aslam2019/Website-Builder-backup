import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { adminApi } from '../../api/adminApi'

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
  
  // ✅ Site Settings State
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
        <span className="lg-brand-mark">
          {(site.site_name || 'WebsiteBuilder').charAt(0).toUpperCase()}
        </span>
      )}
      <span className="lg-brand-text">
        {site.site_name || 'WebsiteBuilder'}
      </span>
    </span>
  )

  return (
    <div className="lg-root" style={interStyle}>
      <div className="lg-container">
        
        {/* ========== LEFT — Branding ========== */}
        <aside className="lg-aside">
          
          {/* Top Logo */}
          <Link to="/" className="lg-brand" style={{ textDecoration: 'none' }}>
            <BrandLogo />
          </Link>

          {/* Center Content */}
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

      <style>{`
        /* ============ ROOT & BACKGROUND ============ */
        .lg-root { 
          position: relative; 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: #f8fafc;
          padding: 20px;
        }

        .lg-container { 
          display: grid; 
          grid-template-columns: 1fr 1.1fr; 
          width: 100%; 
          max-width: 1100px; 
          min-height: 700px;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 20px 60px -15px rgba(15,23,42,0.1);
          overflow: hidden;
        }

        /* ============ LEFT ASIDE ============ */
        .lg-aside { 
          background: linear-gradient(160deg, #0b0a1f 0%, #14122e 100%); 
          padding: 48px; 
          color: #fff; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between;
          position: relative;
        }
        .lg-aside::before { 
          content: ''; position: absolute; top: -20%; left: -20%; 
          width: 400px; height: 400px; 
          background: radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%); 
          filter: blur(80px); 
        }
        .lg-aside > * { position: relative; z-index: 1; }

        .lg-brand { 
          display: inline-flex; align-items: center; gap: 12px; 
          text-decoration: none; color: #fff; 
        }
        .lg-brand-mark { 
          width: 42px; height: 42px; border-radius: 12px; 
          background: linear-gradient(135deg, #6366f1, #a855f7); 
          display: flex; align-items: center; justify-content: center; 
          font-weight: 800; font-size: 16px; 
        }
        .lg-brand-text { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }

        .lg-aside-content { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          padding: 40px 0; 
          max-width: 400px; 
        }
        
        .lg-aside-title { font-size: 36px; font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; margin: 0 0 16px; }
        .lg-aside-accent { 
          background: linear-gradient(120deg, #a855f7, #818cf8); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
        }
        .lg-aside-sub { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 0 32px; }
        
        .lg-aside-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
        .lg-aside-features li { display: flex; align-items: center; gap: 12px; font-size: 14.5px; color: #cbd5e1; }
        .lg-aside-check { 
          width: 20px; height: 20px; border-radius: 50%; 
          background: rgba(16,185,129,0.15); color: #10b981; 
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; 
        }

        /* ============ RIGHT MAIN (FORM) ============ */
        .lg-main { padding: 60px; display: flex; align-items: center; justify-content: center; }
        .lg-card { width: 100%; max-width: 380px; }

        .lg-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .lg-back { 
          display: inline-flex; align-items: center; gap: 6px; 
          font-size: 13px; font-weight: 600; color: #64748b; 
          text-decoration: none; transition: color 0.15s ease; 
        }
        .lg-back:hover { color: #6366f1; }
        .lg-signup-link { font-size: 13px; color: #64748b; text-decoration: none; }
        .lg-signup-link strong { color: #6366f1; font-weight: 700; }
        .lg-signup-link:hover strong { color: #4f46e5; }

        .lg-head { margin-bottom: 32px; }
        .lg-title { font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; margin: 0 0 8px; }
        .lg-subtitle { font-size: 14px; color: #64748b; margin: 0; }

        .lg-form { display: flex; flex-direction: column; gap: 20px; }
        .lg-field { display: flex; flex-direction: column; gap: 8px; }
        .lg-label-row { display: flex; align-items: center; justify-content: space-between; }
        .lg-label { font-size: 13px; font-weight: 600; color: #334155; }
        .lg-req { color: #ef4444; }
        .lg-forgot { font-size: 12.5px; font-weight: 600; color: #6366f1; text-decoration: none; }
        .lg-forgot:hover { text-decoration: underline; }

        .lg-input-wrap { position: relative; }
        .lg-input { 
          width: 100%; padding: 13px 14px; font-size: 14px; 
          color: #0f172a; background: #f8fafc; 
          border: 1.5px solid #e2e8f0; border-radius: 12px; 
          outline: none; transition: all 0.2s ease; box-sizing: border-box;
        }
        .lg-input:hover { border-color: #cbd5e1; }
        .lg-input:focus { background: #fff; border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        .lg-input.has-icon { padding-left: 42px; }
        .lg-input.has-toggle { padding-right: 46px; }
        .lg-input.has-error { border-color: #ef4444; background: #fef2f2; }
        .lg-input.has-error:focus { box-shadow: 0 0 0 4px rgba(239,68,68,0.1); }

        .lg-input-icon { position: absolute; top: 50%; left: 14px; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .lg-input-toggle { 
          position: absolute; top: 50%; right: 10px; transform: translateY(-50%); 
          width: 32px; height: 32px; border-radius: 8px; 
          display: flex; align-items: center; justify-content: center; 
          background: transparent; border: none; color: #94a3b8; cursor: pointer; transition: all 0.15s ease;
        }
        .lg-input-toggle:hover { color: #6366f1; background: #eef2ff; }

        .lg-err { font-size: 12px; font-weight: 500; color: #ef4444; }
        .lg-alert-error { 
          display: flex; align-items: flex-start; gap: 10px; 
          padding: 12px 14px; background: #fef2f2; border: 1px solid #fecaca; 
          border-radius: 12px; color: #b91c1c; font-size: 13.5px; font-weight: 500; 
          margin-bottom: 20px; 
        }

        .lg-btn-primary { 
          display: flex; align-items: center; justify-content: center; gap: 8px; 
          width: 100%; padding: 14px 20px; font-size: 14.5px; font-weight: 700; 
          color: #fff; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); 
          border: none; border-radius: 12px; cursor: pointer; 
          transition: all 0.2s ease; box-shadow: 0 8px 20px -8px rgba(99,102,241,0.6); 
          margin-top: 8px;
        }
        .lg-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(99,102,241,0.8); }
        .lg-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .lg-spinner { 
          width: 16px; height: 16px; 
          border: 2px solid rgba(255,255,255,0.4); 
          border-top-color: #fff; border-radius: 50%; 
          animation: lgSpin 0.7s linear infinite; 
        }
        @keyframes lgSpin { to { transform: rotate(360deg); } }

        .lg-foot { text-align: center; font-size: 13.5px; color: #64748b; margin-top: 24px; }
        .lg-foot a { color: #6366f1; font-weight: 700; text-decoration: none; }
        .lg-foot a:hover { text-decoration: underline; }

        /* ============================================================
           MOBILE RESPONSIVE
           ============================================================ */
        @media (max-width: 900px) {
          .lg-root { padding: 0; background: #fff; }
          .lg-container { 
            grid-template-columns: 1fr; 
            min-height: 100vh; 
            border-radius: 0; 
            box-shadow: none; 
            max-width: 100%; 
          }
          .lg-aside { display: none; }
          
          .lg-main { padding: 40px 24px; }
          .lg-card { max-width: 420px; }
        }

        @media (max-width: 480px) {
          .lg-main { padding: 24px 16px; }
          .lg-title { font-size: 26px; }
          .lg-top { margin-bottom: 24px; }
          .lg-input { padding: 12px 14px; }
          .lg-input.has-icon { padding-left: 40px; }
          .lg-btn-primary { padding: 13px 18px; }
        }
      `}</style>
    </div>
  )
}