import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  IconDashboard, IconUsers, IconCategory, IconTemplate,
  IconPricing, IconWebsite, IconPayment, IconSettings,
  IconLogout, IconChevronLeft, IconChevronRight,
} from '../components/admin/Icons'
import './admin-layout.css'

/* ============================================================
   INLINE ICONS (not in Icons.jsx)
   ============================================================ */
const IconEnquiry = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)



/* ============================================================
   SIDEBAR NAV SECTIONS
   ============================================================ */
const NAV_SECTIONS = [
  {
    label: 'Main',
    links: [
      { to: '/admin', label: 'Dashboard', end: true, Icon: IconDashboard },
    ],
  },
  {
    label: 'Manage',
    links: [
      { to: '/admin/users', label: 'Users', Icon: IconUsers },
      { to: '/admin/categories', label: 'Categories', Icon: IconCategory },
      { to: '/admin/templates', label: 'Templates', Icon: IconTemplate },
      { to: '/admin/pricing', label: 'Pricing', Icon: IconPricing },
    ],
  },
  {
    label: 'Operations',
    links: [
      { to: '/admin/websites', label: 'Websites', Icon: IconWebsite },
      { to: '/admin/payments', label: 'Payments', Icon: IconPayment },
      { to: '/admin/enquiries', label: 'Enquiries', Icon: IconEnquiry },

    ],
  },
  {
    label: 'System',
    links: [
      { to: '/admin/settings', label: 'Settings', Icon: IconSettings },
    ],
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('wb_admin_sidebar_collapsed') === '1'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem('wb_admin_sidebar_collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = (user?.username || 'A').charAt(0).toUpperCase()

  return (
    <div className={`admin-shell ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>

      {/* ─── Mobile topbar ─── */}
      <header className="admin-mobile-topbar">
        <button
          className="admin-mobile-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
        <Link to="/" className="admin-mobile-brand">
          Website<span>Builder</span>
        </Link>
        <div className="admin-mobile-avatar">{initials}</div>
      </header>

      {/* ─── Mobile backdrop ─── */}
      <div
        className="admin-backdrop"
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ─── Sidebar ─── */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <Link to="/" className="admin-brand-link">
            <div className="admin-brand-mark">WB</div>
            {!collapsed && (
              <div className="admin-brand-text">
                <div className="admin-brand-name">
                  Website<span>Builder</span>
                </div>
                <div className="admin-brand-role">Super Admin</div>
              </div>
            )}
          </Link>

          <button
            className="admin-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="admin-nav-section">
              {!collapsed && (
                <div className="admin-nav-section-label">{section.label}</div>
              )}
              {collapsed && <div className="admin-nav-section-divider" />}

              <ul className="admin-nav-list">
                {section.links.map(({ to, label, end, Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      className={({ isActive }) =>
                        `admin-nav-item ${isActive ? 'is-active' : ''}`
                      }
                      title={collapsed ? label : undefined}
                    >
                      <span className="admin-nav-item-icon">
                        <Icon size={18} />
                      </span>
                      <span className="admin-nav-item-label">{label}</span>
                      <span className="admin-nav-item-badge" />

                      {collapsed && (
                        <span className="admin-nav-tooltip">{label}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="admin-user">
          <div className="admin-user-card">
            <div className="admin-user-avatar">{initials}</div>
            {!collapsed && (
              <div className="admin-user-info">
                <div className="admin-user-name">{user?.username || 'Admin'}</div>
                <div className="admin-user-role">Super Admin</div>
              </div>
            )}
            <button
              className="admin-user-logout"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <IconLogout size={16} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        <button
          className="admin-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}