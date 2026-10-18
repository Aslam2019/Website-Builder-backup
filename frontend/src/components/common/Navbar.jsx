import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
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
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  return `${base}${url}`
}

/* ✅ Navbar height constant */
const NAVBAR_HEIGHT = 76

/* ============================================================
   SVG ICONS
   ============================================================ */
const IconHome = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconInfo = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)
const IconSteps = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)
const IconStar = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconTag = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)
const IconMail = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)
const IconArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconMenu = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
)
const IconGrid = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
)
const IconChevronRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const LINKS = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'about', label: 'About', Icon: IconInfo },
  { id: 'how-it-works', label: 'How It Works', Icon: IconSteps },
  { id: 'why-choose-us', label: 'Why Us', Icon: IconStar },
  { id: 'categories', label: 'Categories', Icon: IconGrid },
  { id: 'pricing', label: 'Pricing', Icon: IconTag },
  { id: 'contact', label: 'Contact', Icon: IconMail },
]

/* ============================================================
   MAIN NAVBAR
   ============================================================ */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [site, setSite] = useState({ logo_url: '', site_name: '' })
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  /* ============================================================
     ✅ Fetch site settings
     ============================================================ */
  useEffect(() => {
    const fetchSite = () => {
      adminApi.getSiteSettings()
        .then((res) => {
          const data = res.data?.data
          if (data) setSite(data)
        })
        .catch(() => {})
    }
    fetchSite()
    window.addEventListener('focus', fetchSite)
    const interval = setInterval(fetchSite, 30000)
    return () => {
      window.removeEventListener('focus', fetchSite)
      clearInterval(interval)
    }
  }, [])

  /* ============================================================
     ✅ Scroll shadow
     ============================================================ */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ============================================================
     ✅ Body scroll lock when drawer open
     ============================================================ */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* ============================================================
     ✅ Smart scroll helper — with manual fallback
     ============================================================ */
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (!el) return

    // ✅ Manual scroll with proper offset (more reliable than scrollIntoView)
    const elementTop = el.getBoundingClientRect().top + window.pageYOffset
    const offset = NAVBAR_HEIGHT + 10  // Navbar + breathing room

    window.scrollTo({
      top: elementTop - offset,
      behavior: 'smooth',
    })

    setActive(id)
  }

  /* ============================================================
     ✅ Handle incoming navigation from OTHER page
     ============================================================ */
  useEffect(() => {
    if (location.pathname !== '/') return
    const targetId = location.state?.scrollTo
    if (!targetId) return

    window.history.replaceState({}, document.title)

    const t = setTimeout(() => {
      scrollToSection(targetId)
    }, 200)

    return () => clearTimeout(t)
  }, [location.pathname, location.state])

  /* ============================================================
     ✅ Active section tracker
     ============================================================ */
  useEffect(() => {
    if (location.pathname !== '/') return

    const ids = LINKS.map((l) => l.id)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      {
        threshold: 0.3,
        rootMargin: `-${NAVBAR_HEIGHT + 20}px 0px -50% 0px`,
      }
    )

    const t = setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(t)
      observer.disconnect()
    }
  }, [location.pathname])

  /* ============================================================
     ✅ Click handler
     ============================================================ */
  const scrollTo = (e, id) => {
    e.preventDefault()
    setOpen(false)

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
      return
    }

    scrollToSection(id)
  }

  /* ============================================================
     ✅ Brand click
     ============================================================ */
  const handleBrandClick = (e) => {
    e.preventDefault()
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActive('home')
  }

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/')
  }

  /* ============================================================
     ✅ Brand Logo
     ============================================================ */
  const BrandLogo = () => (
    <span className="brand-wrap">
      {site.logo_url ? (
        <img
          src={getFullUrl(site.logo_url)}
          alt={site.site_name || 'Logo'}
          className="brand-logo"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <span className="brand-mark">WB</span>
      )}
      <span className="brand-text">
        {(() => {
          const name = site.site_name || 'WebsiteBuilder'
          const idx = name.lastIndexOf(' ')
          if (idx > 0) {
            return (
              <>
                {name.slice(0, idx + 1)}
                <span>{name.slice(idx + 1)}</span>
              </>
            )
          }
          const mid = Math.ceil(name.length / 2)
          return (
            <>
              {name.slice(0, mid)}
              <span>{name.slice(mid)}</span>
            </>
          )
        })()}
      </span>
    </span>
  )

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`} style={interStyle}>
        <div className="nav-inner">
          <Link to="/" className="brand" onClick={handleBrandClick}>
            <BrandLogo />
          </Link>

          <nav className="nav-links">
            {LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => scrollTo(e, id)}
                className={`nav-link ${location.pathname === '/' && active === id ? 'active' : ''}`}
              >
                <span className="nav-link-text">{label}</span>
                <span className="nav-link-bar" />
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-ghost">
                  Dashboard
                </Link>
                <button className="btn-primary" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                  <IconArrowRight size={13} />
                </Link>
              </>
            )}
          </div>

          <button
            className={`hamburger ${open ? 'open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <IconMenu size={22} />
          </button>
        </div>
      </header>

      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}

      <aside className={`mobile-drawer ${open ? 'is-open' : ''}`} style={interStyle}>
        <div className="drawer-head">
          <Link to="/" className="brand" onClick={handleBrandClick}>
            <BrandLogo />
          </Link>
          <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="drawer-nav">
          {LINKS.map(({ id, label, Icon }, i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => scrollTo(e, id)}
              className={`drawer-link ${location.pathname === '/' && active === id ? 'active' : ''}`}
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <span className="drawer-link-icon"><Icon size={16} /></span>
              <span className="drawer-link-label">{label}</span>
              <span className="drawer-link-chevron">
                <IconChevronRight size={14} />
              </span>
            </a>
          ))}
        </nav>

        <div className="drawer-actions">
          {isAuthenticated ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="drawer-btn drawer-btn-outline" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <button className="drawer-btn drawer-btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="drawer-btn drawer-btn-outline" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="drawer-btn drawer-btn-primary" onClick={() => setOpen(false)}>
                Get Started
                <IconArrowRight size={13} />
              </Link>
            </>
          )}
        </div>
      </aside>

      <style>{`
        /* ============================================================
           ✅ GLOBAL — Body padding for fixed navbar
           ============================================================ */
        html {
          scroll-behavior: smooth;
        }

        /* ✅ Fixed navbar means body needs padding-top */
        body {
          padding-top: ${NAVBAR_HEIGHT}px;
        }

        /* ✅ Sections need scroll-margin for scrollIntoView */
        section[id] {
          scroll-margin-top: ${NAVBAR_HEIGHT}px;
        }

        /* ============================================================
           ✅ NAVBAR — FIXED (always visible at top)
           ============================================================ */
        .site-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .site-nav.is-scrolled {
          border-bottom-color: #e2e8f0;
          box-shadow: 0 4px 20px -8px rgba(15, 23, 42, 0.08);
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          height: ${NAVBAR_HEIGHT}px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        /* ============================================================
           BRAND
           ============================================================ */
        .brand {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          transition: opacity 0.15s ease;
        }
        .brand:hover { opacity: 0.9; }
        .brand-wrap {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .brand-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: -0.02em;
          box-shadow: 0 6px 16px -6px rgba(99, 102, 241, 0.55);
          flex-shrink: 0;
        }
        .brand-logo {
          height: 40px;
          width: auto;
          max-width: 46px;
          object-fit: contain;
          display: block;
          flex-shrink: 0;
        }
        .brand-text {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.035em;
          white-space: nowrap;
          line-height: 1.15;
        }
        .brand-text span {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ============================================================
           NAV LINKS
           ============================================================ */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          justify-content: center;
        }
        .nav-link {
          position: relative;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.18s ease, background 0.18s ease;
          white-space: nowrap;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .nav-link-text { line-height: 1; }
        .nav-link-bar {
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #a855f7);
          border-radius: 2px;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 2px;
        }
        .nav-link:hover {
          color: #0f172a;
          background: rgba(99, 102, 241, 0.05);
        }
        .nav-link:hover .nav-link-bar { width: 60%; }
        .nav-link.active {
          color: #6366f1;
          font-weight: 600;
        }
        .nav-link.active .nav-link-bar { width: 60%; }

        /* ============================================================
           ACTIONS
           ============================================================ */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          font-size: 13.5px;
          font-weight: 600;
          color: #334155;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .btn-ghost:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          font-size: 13.5px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: none;
          border-radius: 10px;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          letter-spacing: -0.01em;
          box-shadow: 0 6px 16px -8px rgba(99, 102, 241, 0.7);
          white-space: nowrap;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px -8px rgba(99, 102, 241, 0.85);
        }
        .btn-primary svg { transition: transform 0.2s; }
        .btn-primary:hover svg { transform: translateX(2px); }

        /* ============================================================
           HAMBURGER
           ============================================================ */
        .hamburger {
          display: none;
          width: 42px;
          height: 42px;
          background: transparent;
          border: none;
          color: #0f172a;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: background 0.15s ease;
          padding: 0;
        }
        .hamburger:hover { background: #f1f5f9; }

        /* ============================================================
           OVERLAY
           ============================================================ */
        .nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ============================================================
           MOBILE DRAWER
           ============================================================ */
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 340px;
          max-width: 90vw;
          height: 100vh;
          height: 100dvh;
          background: #ffffff;
          z-index: 1001;
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          display: none;
          flex-direction: column;
          box-shadow: -16px 0 48px rgba(15, 23, 42, 0.2);
        }
        .mobile-drawer.is-open { transform: translateX(0); }

        .drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 20px 18px;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .drawer-close {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #f8fafc;
          border: none;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .drawer-close:hover { background: #f1f5f9; color: #0f172a; }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 14px 12px;
          flex: 1;
          overflow-y: auto;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          font-size: 14.5px;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.15s ease;
          cursor: pointer;
          animation: drawerLinkIn 0.32s ease backwards;
        }
        @keyframes drawerLinkIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .drawer-link-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .drawer-link-label { flex: 1; }
        .drawer-link-chevron {
          color: #cbd5e1;
          transition: all 0.15s;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .drawer-link:hover {
          background: #f8fafc;
          color: #0f172a;
        }
        .drawer-link:hover .drawer-link-icon {
          background: #eef2ff;
          color: #6366f1;
        }
        .drawer-link:hover .drawer-link-chevron {
          color: #6366f1;
          transform: translateX(2px);
        }
        .drawer-link.active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%);
          color: #6366f1;
          font-weight: 700;
        }
        .drawer-link.active .drawer-link-icon {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
        }
        .drawer-link.active .drawer-link-chevron { color: #6366f1; }

        .drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          border-top: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .drawer-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
          letter-spacing: -0.01em;
          border: none;
          width: 100%;
        }
        .drawer-btn-outline {
          background: #fff;
          color: #334155;
          border: 1.5px solid #e2e8f0;
        }
        .drawer-btn-outline:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }
        .drawer-btn-primary {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          box-shadow: 0 10px 24px -10px rgba(99, 102, 241, 0.8);
        }
        .drawer-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px -10px rgba(99, 102, 241, 0.9);
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width: 1100px) {
          .nav-inner { padding: 0 24px; gap: 20px; }
          .nav-link { padding: 10px 11px; font-size: 13.5px; }
          .btn-ghost, .btn-primary { padding: 8px 14px; font-size: 13px; }
        }

        @media (max-width: 900px) {
          .nav-links,
          .nav-actions { display: none; }
          .hamburger { display: flex; }
          .mobile-drawer { display: flex; }
          .nav-inner { height: 68px; padding: 0 20px; }
          body { padding-top: 68px; }
          section[id] { scroll-margin-top: 68px; }
        }

        @media (max-width: 480px) {
          .nav-inner { height: 62px; padding: 0 16px; }
          .brand-mark { width: 34px; height: 34px; }
          .brand-logo { height: 34px; max-width: 40px; }
          .brand-text { font-size: 16px; }
          .brand-wrap { gap: 10px; }
          body { padding-top: 62px; }
          section[id] { scroll-margin-top: 62px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-link-bar,
          .btn-primary,
          .drawer-link,
          .drawer-btn { transition: none !important; }
          .btn-primary:hover { transform: none !important; }
          .drawer-link { animation: none !important; }
        }
      `}</style>
    </>
  )
}