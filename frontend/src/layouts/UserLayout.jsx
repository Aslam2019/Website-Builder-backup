import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  IconDashboard, IconTemplate, IconForm, IconWebsite,
  IconPayment, IconUser, IconLogout, IconChevronLeft, IconChevronRight,
} from '../components/dashboard/Icons'

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

const links = [
  { to: '/dashboard', label: 'Dashboard', end: true, Icon: IconDashboard },
  { to: '/dashboard/templates', label: 'Templates', Icon: IconTemplate },
  { to: '/dashboard/website-form', label: 'Website Form', Icon: IconForm },
  { to: '/dashboard/my-website', label: 'My Website', Icon: IconWebsite },
  { to: '/dashboard/payments', label: 'Payments', Icon: IconPayment },
  { to: '/dashboard/profile', label: 'Profile', Icon: IconUser },
]

/* ============================================================
   HAMBURGER ICON
   ============================================================ */
const IconMenu = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconClose = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function UserLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  /* -------- Close drawer on route change -------- */
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  /* -------- Lock body scroll when drawer open -------- */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const W = collapsed ? 72 : 250

  const initial = (user?.username || 'U').charAt(0).toUpperCase()

  /* ============================================================
     SIDEBAR CONTENT (shared between desktop & mobile)
     ============================================================ */
  const SidebarContent = ({ onNavigate, mobile = false }) => {
    const isCollapsed = mobile ? false : collapsed
    const width = mobile ? 260 : W

    return (
      <aside
        className={`ul-sidebar ${mobile ? 'ul-sidebar-mobile' : ''} ${!mobile && collapsed ? 'is-collapsed' : ''} ${mobile && drawerOpen ? 'is-open' : ''}`}
        style={{
          width: mobile ? '100%' : width,
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
          color: '#c7d2fe',
          display: 'flex', flexDirection: 'column',
          transition: mobile ? 'none' : 'width 0.25s ease',
          position: mobile ? 'relative' : 'sticky',
          top: 0,
          height: mobile ? '100%' : '100vh',
          overflow: 'hidden',
          flexShrink: 0,
          ...interStyle,
        }}
      >
        {/* Header / Brand */}
        <div
          style={{
            padding: isCollapsed ? '22px 0' : '22px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            minHeight: 74,
            gap: 10,
          }}
        >
          {!isCollapsed ? (
            <Link
              to="/"
              onClick={onNavigate}
              style={{
                color: 'white', fontWeight: 800, fontSize: 17,
                letterSpacing: '-0.02em', textDecoration: 'none',
              }}
            >
              Website<span style={{ color: '#a5b4fc' }}>Builder</span>
            </Link>
          ) : (
            <div
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg,#6366f1,#a5b4fc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 14,
              }}
            >
              WB
            </div>
          )}

          {/* Close button (mobile only) */}
          {mobile && (
            <button
              onClick={() => setDrawerOpen(false)}
              className="ul-close-btn"
              aria-label="Close menu"
            >
              <IconClose size={20} />
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
          {links.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              title={isCollapsed ? label : undefined}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: isCollapsed ? '12px 0' : '11px 14px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                borderRadius: 9, marginBottom: 3,
                color: isActive ? 'white' : '#c7d2fe',
                background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
                fontWeight: 500, fontSize: 14,
                transition: 'all 0.15s ease',
                position: 'relative',
                textDecoration: 'none',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute', left: 0, top: 6, bottom: 6,
                        width: 3, background: '#a5b4fc', borderRadius: 2,
                      }}
                    />
                  )}
                  <Icon size={18} />
                  {!isCollapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: 12 }}>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: isCollapsed ? '10px 0' : '10px 14px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              width: '100%', background: 'transparent',
              color: '#fca5a5', fontWeight: 500, fontSize: 14,
              borderRadius: 8, border: 'none', cursor: 'pointer',
              ...interStyle,
            }}
          >
            <IconLogout size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>

          {!isCollapsed && user && (
            <div
              style={{
                padding: '10px 14px', marginTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12,
              }}
            >
              <div style={{ color: '#a5b4fc', marginBottom: 2 }}>Signed in as</div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                {user.username}
              </div>
            </div>
          )}
        </div>

        {/* Collapse button (desktop only) */}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
            style={{
              height: 40, background: 'rgba(0,0,0,0.25)',
              color: 'white', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {collapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
          </button>
        )}
      </aside>
    )
  }

  return (
    <div className="ul-root" style={interStyle}>

      {/* ============ MOBILE TOPBAR ============ */}
      <header className="ul-topbar">
        <button
          className="ul-hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <IconMenu size={20} />
        </button>

        <Link to="/" className="ul-topbar-brand">
          <span className="ul-topbar-logo">WB</span>
          <span className="ul-topbar-name">
            Website<span className="ul-topbar-accent">Builder</span>
          </span>
        </Link>

        <div className="ul-topbar-avatar">{initial}</div>
      </header>

      {/* ============ DESKTOP SIDEBAR ============ */}
      <div className="ul-desktop-sidebar">
        <SidebarContent />
      </div>

      {/* ============ MOBILE DRAWER ============ */}
      {drawerOpen && (
        <div
          className="ul-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`ul-mobile-drawer ${drawerOpen ? 'is-open' : ''}`}>
        <SidebarContent mobile onNavigate={() => setDrawerOpen(false)} />
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <main className="ul-main">
        <Outlet />
      </main>

      {/* ============================================================
          STYLES
         ============================================================ */}
      <style>{`
        /* ---------- Base ---------- */
        .ul-root {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .ul-desktop-sidebar {
          display: flex;
          flex-shrink: 0;
        }

        .ul-main {
          flex: 1;
          padding: 28px 32px;
          overflow-x: hidden;
          min-width: 0;
        }

        /* ---------- Mobile topbar (hidden on desktop) ---------- */
        .ul-topbar { display: none; }

        /* ---------- Mobile drawer (hidden on desktop) ---------- */
        .ul-mobile-drawer { display: none; }
        .ul-overlay { display: none; }
        .ul-close-btn { display: none; }

        /* ============================================
           MOBILE (≤900px)
           ============================================ */
        @media (max-width: 900px) {
          .ul-root {
            display: block;    /* Stack — no flex grid */
          }

          /* Hide desktop sidebar */
          .ul-desktop-sidebar {
            display: none !important;
          }

          /* -------- Mobile Topbar -------- */
          .ul-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 10px 16px;
            background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
            color: #fff;
            position: sticky;
            top: 0;
            z-index: 40;
            height: 60px;
            box-shadow: 0 2px 10px rgba(30, 27, 75, 0.15);
          }

          .ul-hamburger {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: rgba(255,255,255,0.08);
            border: none;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.15s;
          }
          .ul-hamburger:active {
            background: rgba(255,255,255,0.15);
          }

          .ul-topbar-brand {
            display: flex;
            align-items: center;
            gap: 9px;
            font-weight: 700;
            font-size: 15px;
            color: #fff;
            text-decoration: none;
            letter-spacing: -0.01em;
          }
          .ul-topbar-logo {
            width: 30px;
            height: 30px;
            background: linear-gradient(135deg, #6366f1, #a5b4fc);
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
            color: #fff;
          }
          .ul-topbar-accent { color: #a5b4fc; }

          .ul-topbar-avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 700;
            color: #fff;
          }

          /* -------- Mobile Drawer -------- */
          .ul-mobile-drawer {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 260px;
            height: 100vh;
            z-index: 60;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 6px 0 24px rgba(0,0,0,0.25);
          }
          .ul-mobile-drawer.is-open {
            transform: translateX(0);
          }

          /* Close button inside drawer */
          .ul-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            background: rgba(255,255,255,0.1);
            border: none;
            border-radius: 8px;
            color: #fff;
            cursor: pointer;
            flex-shrink: 0;
          }
          .ul-close-btn:active {
            background: rgba(255,255,255,0.18);
          }

          /* Overlay */
          .ul-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.55);
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            z-index: 55;
            animation: ulFadeIn 0.2s ease;
          }
          @keyframes ulFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }

          /* -------- Main content full width -------- */
          .ul-main {
            padding: 16px;
            min-height: calc(100vh - 60px);
          }
        }

        /* ============================================
           SMALL MOBILE (≤480px)
           ============================================ */
        @media (max-width: 480px) {
          .ul-main {
            padding: 12px;
          }
          .ul-topbar {
            padding: 8px 12px;
            height: 56px;
          }
          .ul-hamburger {
            width: 38px;
            height: 38px;
          }
          .ul-topbar-name {
            font-size: 14px;
          }
          .ul-topbar-logo {
            width: 28px;
            height: 28px;
            font-size: 11px;
          }
          .ul-topbar-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}