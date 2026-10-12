import { useState, useEffect } from 'react'
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Templates',
    to: '/dashboard/templates',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    label: 'Website Form',
    to: '/dashboard/website-form',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    label: 'My Website',
    to: '/dashboard/my-website',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: 'Payments',
    to: '/dashboard/payments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2.5" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    to: '/dashboard/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

const STORAGE_KEY = 'ud_sidebar_collapsed'

export default function UserLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
  })
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  /* Auto-close drawer on route change */
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  /* Persist collapsed state */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0') } catch {}
  }, [collapsed])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = (user?.username || 'U').slice(0, 1).toUpperCase()
  const toggleCollapse = () => setCollapsed((c) => !c)

  return (
    <div
      className={`ud ${collapsed ? 'collapsed' : ''}`}
      style={interStyle}
    >
      {/* ===================== SIDEBAR ===================== */}
      <aside className={`ud-side ${drawerOpen ? 'open' : ''}`}>
        {/* Brand + Collapse toggle */}
        <div className="ud-side-brand">
          <Link to="/dashboard" className="ud-logo">
            <span className="ud-logo-mark">WB</span>
            <span className="ud-logo-text">
              Website<span>Builder</span>
            </span>
          </Link>

          <button
            className="ud-collapse-btn"
            onClick={toggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s',
              }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="ud-nav">
          <div className="ud-nav-label">Menu</div>
          <ul className="ud-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `ud-nav-item ${isActive ? 'active' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="ud-nav-icon">{item.icon}</span>
                  <span className="ud-nav-text">{item.label}</span>
                  <span className="ud-nav-bar" />
                  {/* Tooltip (collapsed mode only) */}
                  <span className="ud-nav-tip">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User card */}
        <div className="ud-side-foot">
          <div className="ud-user-card" title={collapsed ? user?.username : undefined}>
            <div className="ud-avatar">{initials}</div>
            <div className="ud-user-info">
              <div className="ud-user-label">Signed in as</div>
              <div className="ud-user-name">{user?.username || 'User'}</div>
            </div>
          </div>

          <button
            className="ud-logout"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="ud-logout-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      <div
        className={`ud-overlay ${drawerOpen ? 'show' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ===================== MAIN ===================== */}
      <div className="ud-main">
        {/* Topbar (mobile) */}
        <header className="ud-topbar">
          <button
            className="ud-burger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link to="/dashboard" className="ud-topbar-brand">
            <span className="ud-logo-mark sm">WB</span>
          </Link>

          <div className="ud-topbar-avatar">{initials}</div>
        </header>

        <main className="ud-content">
          <Outlet />
        </main>
      </div>

      {/* ===================== STYLES ===================== */}
      <style>{`
        /* ============================================================
           LAYOUT
           ============================================================ */
        .ud {
          display: flex;
          min-height: 100vh;
          background: #f6f7fb;
          color: #0f172a;
        }

        /* ============================================================
           SIDEBAR
           ============================================================ */
        .ud-side {
          width: 260px;
          flex-shrink: 0;
          background: #0b0a1f;
          color: #cbd5e1;
          display: flex;
          flex-direction: column;
          padding: 20px 14px 18px;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          border-right: 1px solid rgba(255,255,255,0.04);
          transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .ud-side::-webkit-scrollbar { width: 4px; }
        .ud-side::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,0.2);
          border-radius: 4px;
        }

        /* Brand */
        .ud-side-brand {
          padding: 0 6px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          min-height: 46px;
        }
        .ud-logo {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          overflow: hidden;
          flex: 1;
          min-width: 0;
        }
        .ud-logo-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 11px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: -0.02em;
          box-shadow: 0 10px 22px -10px rgba(124,58,237,0.8);
          flex-shrink: 0;
        }
        .ud-logo-mark.sm { width: 32px; height: 32px; font-size: 12px; border-radius: 9px; }
        .ud-logo-text {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          white-space: nowrap;
          transition: opacity 0.2s, width 0.2s;
        }
        .ud-logo-text span { color: #a78bfa; }

        /* Collapse toggle */
        .ud-collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .ud-collapse-btn:hover {
          background: rgba(124,58,237,0.18);
          color: #a78bfa;
          border-color: rgba(124,58,237,0.35);
        }

        /* Nav */
        .ud-nav { flex: 1; overflow: hidden; }
        .ud-nav-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #64748b;
          padding: 0 12px 10px;
          white-space: nowrap;
          transition: opacity 0.2s;
        }
        .ud-nav-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ud-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.18s ease;
          position: relative;
          white-space: nowrap;
        }
        .ud-nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #e2e8f0;
        }
        .ud-nav-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px; height: 20px;
          flex-shrink: 0;
          opacity: 0.9;
        }
        .ud-nav-text {
          flex: 1;
          white-space: nowrap;
          transition: opacity 0.2s, width 0.2s;
        }
        .ud-nav-bar {
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 3px;
          height: 20px;
          background: linear-gradient(180deg, #7c3aed, #a855f7);
          border-radius: 0 3px 3px 0;
          transition: transform 0.2s ease;
        }
        .ud-nav-item.active {
          background: linear-gradient(90deg, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 100%);
          color: #fff;
        }
        .ud-nav-item.active .ud-nav-icon { opacity: 1; color: #a78bfa; }
        .ud-nav-item.active .ud-nav-bar { transform: translateY(-50%) scaleY(1); }

        /* Tooltip on collapsed */
        .ud-nav-tip {
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: #1e1b3a;
          color: #fff;
          font-size: 12.5px;
          font-weight: 600;
          padding: 7px 11px;
          border-radius: 8px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
          border: 1px solid rgba(124,58,237,0.35);
          box-shadow: 0 10px 24px -8px rgba(0,0,0,0.6);
          z-index: 100;
        }
        .ud-nav-tip::before {
          content: '';
          position: absolute;
          left: -5px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px; height: 8px;
          background: #1e1b3a;
          border-left: 1px solid rgba(124,58,237,0.35);
          border-bottom: 1px solid rgba(124,58,237,0.35);
        }

        /* Side foot */
        .ud-side-foot {
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
        }
        .ud-user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          overflow: hidden;
        }
        .ud-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800;
          font-size: 14px;
          flex-shrink: 0;
          box-shadow: 0 6px 14px -6px rgba(124,58,237,0.7);
        }
        .ud-user-info {
          min-width: 0;
          transition: opacity 0.2s, width 0.2s;
        }
        .ud-user-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
        }
        .ud-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 130px;
        }
        .ud-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.18);
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .ud-logout:hover {
          background: rgba(239,68,68,0.15);
          color: #fca5a5;
          border-color: rgba(239,68,68,0.3);
        }

        /* ============================================================
           MAIN
           ============================================================ */
        .ud-main {
          flex: 1;
          margin-left: 260px;
          min-width: 0;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ud-content {
          flex: 1;
          padding: 32px 40px 48px;
          max-width: 1400px;
          width: 100%;
        }

        /* Topbar (mobile only) */
        .ud-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 30;
        }
        .ud-burger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #f1f5f9;
          border: none;
          color: #0f172a;
          cursor: pointer;
          transition: background 0.18s;
        }
        .ud-burger:hover { background: #e2e8f0; }
        .ud-topbar-brand { text-decoration: none; }
        .ud-topbar-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800;
          font-size: 13px;
        }

        /* Overlay */
        .ud-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          z-index: 45;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .ud-overlay.show { display: block; opacity: 1; }

        /* ============================================================
           COLLAPSED STATE (desktop)
           ============================================================ */
        .ud.collapsed .ud-side { width: 78px; padding-left: 12px; padding-right: 12px; }
        .ud.collapsed .ud-main { margin-left: 78px; }

        .ud.collapsed .ud-logo-text,
        .ud.collapsed .ud-nav-text,
        .ud.collapsed .ud-nav-label,
        .ud.collapsed .ud-user-info,
        .ud.collapsed .ud-logout-text {
          opacity: 0;
          width: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .ud.collapsed .ud-nav-item {
          justify-content: center;
          padding: 12px 0;
        }
        .ud.collapsed .ud-nav-icon { opacity: 1; }
        .ud.collapsed .ud-side-brand {
          justify-content: center;
          padding: 0 0 16px;
        }
        .ud.collapsed .ud-logo { justify-content: center; flex: 0; }
        .ud.collapsed .ud-collapse-btn {
          position: absolute;
          top: 24px;
          right: -12px;
          background: #1e1b3a;
          border-color: rgba(124,58,237,0.4);
          box-shadow: 0 6px 18px -6px rgba(0,0,0,0.6);
        }
        .ud.collapsed .ud-user-card { justify-content: center; padding: 10px 0; }
        .ud.collapsed .ud-logout { padding: 11px 0; }

        /* Tooltip show on hover (collapsed only) */
        .ud.collapsed .ud-nav-item:hover .ud-nav-tip {
          opacity: 1;
          transform: translateY(-50%) translateX(2px);
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width: 1024px) {
          .ud-content { padding: 28px 28px 40px; }
        }

        @media (max-width: 900px) {
          .ud-side {
            transform: translateX(-100%);
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            width: 260px !important;
            padding: 20px 14px 18px !important;
          }
          .ud-side.open { transform: translateX(0); }
          .ud-main { margin-left: 0 !important; }
          .ud-topbar { display: flex; }
          .ud-content { padding: 22px 20px 40px; }

          /* Disable collapse on mobile — always expanded inside drawer */
          .ud.collapsed .ud-logo-text,
          .ud.collapsed .ud-nav-text,
          .ud.collapsed .ud-nav-label,
          .ud.collapsed .ud-user-info,
          .ud.collapsed .ud-logout-text {
            opacity: 1;
            width: auto;
            pointer-events: auto;
          }
          .ud.collapsed .ud-nav-item {
            justify-content: flex-start;
            padding: 11px 12px;
          }
          .ud.collapsed .ud-side-brand {
            justify-content: space-between;
            padding: 0 6px 16px;
          }
          .ud.collapsed .ud-logo { justify-content: flex-start; flex: 1; }
          .ud.collapsed .ud-collapse-btn {
            position: static;
            background: rgba(255,255,255,0.05);
            border-color: rgba(255,255,255,0.08);
            box-shadow: none;
          }
          .ud.collapsed .ud-user-card { justify-content: flex-start; padding: 10px; }
          .ud.collapsed .ud-logout { padding: 10px; }
        }

        @media (max-width: 480px) {
          .ud-content { padding: 18px 14px 32px; }
          .ud-side { width: 260px; }
        }
      `}</style>
    </div>
  )
}