import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../api/adminApi'
import {
  IconDashboard, IconUsers, IconCategory, IconTemplate,
  IconPricing, IconWebsite, IconPayment, IconSettings,
  IconLogout, IconChevronLeft, IconChevronRight,
} from '../components/admin/Icons'
import './admin-layout.css'

/* ============================================================
   INLINE ICONS
   ============================================================ */
const IconEnquiry = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

/* ✅ Image URL Helper */
const getFullUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  const base = import.meta.env.VITE_UPLOADS_BASE_URL 
    || import.meta.env.VITE_API_URL?.replace('/api', '') 
    || 'https://98.130.23.135'
  return `${base}${url.startsWith('/') ? url : `/${url}`}`
}

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

const interFont = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('wb_admin_sidebar_collapsed') === '1'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

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

  useEffect(() => {
    localStorage.setItem('wb_admin_sidebar_collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = (user?.username || 'A').charAt(0).toUpperCase()

  // ✅ Dynamic Brand Component (Fixed for collapse)
  const BrandLogo = () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', // Center align when collapsed
      gap: collapsed ? '0' : '12px',
      width: '100%',
      overflow: 'hidden'
    }}>
      {site.logo_url ? (
        <img
          src={getFullUrl(site.logo_url)}
          alt={site.site_name || 'Logo'}
          style={{ 
            height: '36px', 
            width: '36px', 
            objectFit: 'contain', 
            flexShrink: 0,
            borderRadius: '8px'
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="admin-brand-mark" style={{ flexShrink: 0 }}>
          {(site.site_name || 'WebsiteBuilder').charAt(0).toUpperCase()}
        </div>
      )}
      
      {!collapsed && (
        <div className="admin-brand-text" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div className="admin-brand-name" style={interFont}>
            {site.site_name || 'WebsiteBuilder'}
          </div>
          <div className="admin-brand-role" style={interFont}>Super Admin</div>
        </div>
      )}
    </div>
  )

  return (
    <div className={`admin-shell ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`} style={interFont}>

      {/* ─── Mobile topbar ─── */}
      <header className="admin-mobile-topbar" style={interFont}>
        <button className="admin-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
        <Link to="/" className="admin-mobile-brand" style={interFont}>
          {site.site_name || 'WebsiteBuilder'}
        </Link>
        <div className="admin-mobile-avatar">{initials}</div>
      </header>

      {/* ─── Mobile backdrop ─── */}
      <div className="admin-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />

      {/* ─── Sidebar ─── */}
      <aside className="admin-sidebar" style={interFont}>

        <div className="admin-brand">
          <Link to="/" className="admin-brand-link" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
            <BrandLogo /> 
          </Link>

          <button className="admin-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
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
                <div className="admin-nav-section-label" style={{ ...interFont, fontWeight: 700, letterSpacing: '0.08em', fontSize: '10px' }}>
                  {section.label}
                </div>
              )}
              {collapsed && <div className="admin-nav-section-divider" />}

              <ul className="admin-nav-list">
                {section.links.map(({ to, label, end, Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      className={({ isActive }) => `admin-nav-item ${isActive ? 'is-active' : ''}`}
                      title={collapsed ? label : undefined}
                      style={({ isActive }) => ({
                        ...interFont,
                        fontSize: '13.5px',
                        fontWeight: isActive ? 600 : 500,
                      })}
                    >
                      <span className="admin-nav-item-icon"><Icon size={18} /></span>
                      <span className="admin-nav-item-label">{label}</span>
                      <span className="admin-nav-item-badge" />
                      {collapsed && <span className="admin-nav-tooltip">{label}</span>}
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
              <div className="admin-user-info" style={interFont}>
                <div className="admin-user-name" style={{ ...interFont, fontSize: '13px', fontWeight: 600 }}>
                  {user?.username || 'Admin'}
                </div>
                <div className="admin-user-role" style={{ ...interFont, fontSize: '11px', fontWeight: 500 }}>
                  Super Admin
                </div>
              </div>
            )}
            <button className="admin-user-logout" onClick={handleLogout} title="Logout" aria-label="Logout" style={interFont}>
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