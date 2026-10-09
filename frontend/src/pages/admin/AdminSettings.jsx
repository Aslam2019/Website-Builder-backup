import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { adminApi } from '../../api/adminApi'

/* ============================================================
   INTER FONT (scoped)
   ============================================================ */
const interStyle = {
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}
const headingStyle = {
  ...interStyle,
  fontWeight: 700,
  letterSpacing: '-0.02em',
}

/* ============================================================
   ICONS
   ============================================================ */
const IconUser = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconLock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconEye = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const IconEyeOff = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ============================================================
   MAIN
   ============================================================ */
export default function AdminSettings() {
  const { user } = useAuth()
  const notify = useNotify()

  const [tab, setTab] = useState('account') // 'account' | 'security'

  /* -------- Username change -------- */
  const [newUsername, setNewUsername] = useState(user?.username || '')
  const [savingUsername, setSavingUsername] = useState(false)
  const [showUsernameForm, setShowUsernameForm] = useState(false)

  /* -------- Password change -------- */
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })
  const [savingPwd, setSavingPwd] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)

  const initials = (user?.username || 'A').charAt(0).toUpperCase()

  /* -------- Save username -------- */
  const saveUsername = async () => {
    const u = newUsername.trim()
    if (!u) return notify.error('Username cannot be empty')
    if (u === user?.username) return notify.error('No changes made')
    if (u.length < 3) return notify.error('Username must be at least 3 characters')

    setSavingUsername(true)
    try {
      await adminApi.updateProfile({ username: u })
      notify.success('Username updated')
      setShowUsernameForm(false)
      // Refresh page or update context
      setTimeout(() => window.location.reload(), 700)
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Update failed')
    } finally {
      setSavingUsername(false)
    }
  }

  /* -------- Save password -------- */
  const savePassword = async () => {
    const { current, next, confirm } = pwdForm
    if (!current) return notify.error('Enter current password')
    if (!next) return notify.error('Enter new password')
    if (next.length < 6) return notify.error('Password must be at least 6 characters')
    if (next !== confirm) return notify.error('Passwords do not match')
    if (current === next) return notify.error('New password must be different')

    setSavingPwd(true)
    try {
      await adminApi.changePassword({ current_password: current, new_password: next })
      notify.success('Password changed')
      setPwdForm({ current: '', next: '', confirm: '' })
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Password change failed')
    } finally {
      setSavingPwd(false)
    }
  }

  /* -------- Password strength -------- */
  const strength = (() => {
    const p = pwdForm.next
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
    <div className="as-root" style={interStyle}>

      {/* ---------- Page Head ---------- */}
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>Settings</h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            Manage your admin account
          </p>
        </div>
      </div>

      {/* ---------- Profile Banner ---------- */}
      <div className="as-profile-banner">
        <div className="as-avatar">{initials}</div>
        <div className="as-profile-info">
          <div className="as-profile-name">{user?.username || 'Admin'}</div>
          <div className="as-profile-role">
            <span className="as-role-badge">
              <IconUser size={11} /> {user?.role || 'admin'}
            </span>
            {user?.mobile && <span className="as-profile-mobile">{user.mobile}</span>}
          </div>
        </div>
      </div>

      {/* ---------- Tabs ---------- */}
      <div className="as-tabs">
        <button
          className={`as-tab ${tab === 'account' ? 'is-active' : ''}`}
          onClick={() => setTab('account')}
        >
          <IconUser size={15} /> Account
        </button>
        <button
          className={`as-tab ${tab === 'security' ? 'is-active' : ''}`}
          onClick={() => setTab('security')}
        >
          <IconLock size={15} /> Security
        </button>
      </div>

      {/* ================= ACCOUNT TAB ================= */}
      {tab === 'account' && (
        <div className="as-panel">
          {/* Username card */}
          <div className="as-card">
            <div className="as-card-head">
              <div>
                <div className="as-card-title">Username</div>
                <div className="as-card-sub">Your admin display name</div>
              </div>
              {!showUsernameForm && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => { setNewUsername(user?.username || ''); setShowUsernameForm(true) }}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  Change
                </button>
              )}
            </div>

            {!showUsernameForm ? (
              <div className="as-value-display">
                <span className="as-value-text">{user?.username || '—'}</span>
              </div>
            ) : (
              <div className="as-inline-form">
                <input
                  className="form-control"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="New username"
                  style={interStyle}
                  autoFocus
                />
                <div className="as-inline-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowUsernameForm(false)}
                    disabled={savingUsername}
                    style={{ ...interStyle, fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={saveUsername}
                    disabled={savingUsername}
                    style={{ ...interStyle, fontWeight: 500 }}
                  >
                    {savingUsername ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role card (read-only) */}
          <div className="as-card">
            <div className="as-card-head">
              <div>
                <div className="as-card-title">Role</div>
                <div className="as-card-sub">Account permission level</div>
              </div>
            </div>
            <div className="as-value-display">
              <span className="as-value-text">{user?.role || 'admin'}</span>
            </div>
          </div>

          {/* Mobile card (read-only) */}
          <div className="as-card">
            <div className="as-card-head">
              <div>
                <div className="as-card-title">Mobile</div>
                <div className="as-card-sub">Contact number</div>
              </div>
            </div>
            <div className="as-value-display">
              <span className="as-value-text">{user?.mobile || 'Not set'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECURITY TAB ================= */}
      {tab === 'security' && (
        <div className="as-panel">
          <div className="as-card">
            <div className="as-card-head">
              <div>
                <div className="as-card-title">Change Password</div>
                <div className="as-card-sub">
                  Use a strong password that you don't use elsewhere
                </div>
              </div>
            </div>

            <div className="as-form">
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
                  Current Password
                </label>
                <div className="as-pwd-wrap">
                  <input
                    className="form-control"
                    type={showCurrent ? 'text' : 'password'}
                    value={pwdForm.current}
                    onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                    placeholder="Enter current password"
                    style={interStyle}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="as-pwd-toggle"
                    onClick={() => setShowCurrent((v) => !v)}
                    tabIndex={-1}
                  >
                    {showCurrent ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
                  New Password
                </label>
                <div className="as-pwd-wrap">
                  <input
                    className="form-control"
                    type={showNext ? 'text' : 'password'}
                    value={pwdForm.next}
                    onChange={(e) => setPwdForm({ ...pwdForm, next: e.target.value })}
                    placeholder="At least 6 characters"
                    style={interStyle}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="as-pwd-toggle"
                    onClick={() => setShowNext((v) => !v)}
                    tabIndex={-1}
                  >
                    {showNext ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>

                {/* Strength bar */}
                {pwdForm.next && (
                  <div className="as-strength">
                    <div className="as-strength-bars">
                      {[1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className="as-strength-bar"
                          style={{
                            background: i <= strength.level ? strength.color : '#e5e7eb',
                          }}
                        />
                      ))}
                    </div>
                    <span className="as-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
                  Confirm New Password
                </label>
                <input
                  className="form-control"
                  type={showNext ? 'text' : 'password'}
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                  style={interStyle}
                  autoComplete="new-password"
                />
                {pwdForm.confirm && pwdForm.next === pwdForm.confirm && (
                  <div className="as-match">
                    <IconCheck size={12} /> Passwords match
                  </div>
                )}
                {pwdForm.confirm && pwdForm.next !== pwdForm.confirm && (
                  <div className="as-mismatch">Passwords do not match</div>
                )}
              </div>

              <div className="as-form-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setPwdForm({ current: '', next: '', confirm: '' })}
                  disabled={savingPwd}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  Clear
                </button>
                <button
                  className="btn btn-primary"
                  onClick={savePassword}
                  disabled={savingPwd}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  {savingPwd ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Responsive styles ---------- */}
      <style>{`
        .as-root { max-width: 780px; }

        /* Profile banner */
        .as-profile-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 14px;
          color: #fff;
          margin-bottom: 20px;
          box-shadow: 0 10px 24px -12px rgba(79, 70, 229, 0.5);
        }
        .as-avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .as-profile-info { flex: 1; min-width: 0; }
        .as-profile-name {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .as-profile-role {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        .as-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(255,255,255,0.2);
          padding: 3px 9px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .as-profile-mobile {
          font-size: 12px;
          opacity: 0.85;
        }

        /* Tabs */
        .as-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          padding: 5px;
          background: #f3f4f6;
          border-radius: 12px;
          width: fit-content;
        }
        .as-tab {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          font-size: 13.5px;
          font-weight: 600;
          color: #6b7280;
          background: transparent;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .as-tab:hover { color: #111827; }
        .as-tab.is-active {
          background: #fff;
          color: #4f46e5;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        /* Panel */
        .as-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Card */
        .as-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
        }
        .as-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid #f3f4f6;
        }
        .as-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.01em;
        }
        .as-card-sub {
          font-size: 12.5px;
          color: #6b7280;
          margin-top: 3px;
          font-weight: 400;
        }

        /* Value display */
        .as-value-display {
          padding: 11px 14px;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 10px;
        }
        .as-value-text {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        /* Inline form (username) */
        .as-inline-form { display: flex; flex-direction: column; gap: 12px; }
        .as-inline-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        /* Password wrap */
        .as-pwd-wrap { position: relative; }
        .as-pwd-wrap .form-control { padding-right: 44px; }
        .as-pwd-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.12s;
        }
        .as-pwd-toggle:hover { color: #4f46e5; background: #eef2ff; }

        /* Strength */
        .as-strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }
        .as-strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .as-strength-bar {
          flex: 1;
          height: 4px;
          border-radius: 999px;
          transition: background 0.2s ease;
        }
        .as-strength-label {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        /* Match indicator */
        .as-match, .as-mismatch {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 6px;
        }
        .as-match { color: #10b981; }
        .as-mismatch { color: #ef4444; }

        /* Form */
        .as-form { display: flex; flex-direction: column; gap: 16px; }
        .as-form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 8px;
          border-top: 1px solid #f3f4f6;
          margin-top: 4px;
        }

        /* ============================================
           MOBILE
           ============================================ */
        @media (max-width: 640px) {
          .as-profile-banner {
            padding: 16px;
            gap: 14px;
          }
          .as-avatar {
            width: 48px;
            height: 48px;
            font-size: 19px;
            border-radius: 12px;
          }
          .as-profile-name { font-size: 16px; }

          .as-tabs {
            width: 100%;
            justify-content: center;
          }
          .as-tab {
            flex: 1;
            justify-content: center;
            padding: 9px 12px;
            font-size: 13px;
          }

          .as-card { padding: 16px; }
          .as-card-title { font-size: 14px; }
          .as-card-sub { font-size: 12px; }

          .as-inline-actions {
            flex-direction: column-reverse;
          }
          .as-inline-actions .btn { width: 100%; }

          .as-form-actions {
            flex-direction: column-reverse;
          }
          .as-form-actions .btn { width: 100%; }
        }

        @media (max-width: 380px) {
          .as-card { padding: 14px; }
          .as-profile-name { font-size: 15px; }
        }
      `}</style>
    </div>
  )
}