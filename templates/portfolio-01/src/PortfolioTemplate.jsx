import { useEffect, useState, useRef } from 'react'
import { getUploadsBase } from './utils/constants'
import { buildWhatsAppLink } from './utils/whatsapp'
import useScrollReveal from './hooks/useScrollReveal'
import { SkillLogo } from './TechIcons'
import './portfolio.css'

/* ============================================================
   ICONS
   ============================================================ */
const IconLinkedIn = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
  </svg>
)
const IconGitHub = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18a4.64 4.64 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.83.57A12 12 0 0 0 12 .3Z" />
  </svg>
)
const IconTwitter = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64Z" />
  </svg>
)
const IconDownload = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)
const IconArrow = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconPin = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const IconTrend = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)
const IconEmail = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconPhone = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconWhatsApp = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 .4C7.2.4 0 7.6 0 16.4c0 2.9.8 5.6 2.1 7.9L0 32l7.8-2a15.9 15.9 0 0 0 8.2 2.2h.01c8.8 0 16-7.2 16-16S24.8.4 16 .4Zm0 29.2c-2.4 0-4.8-.7-6.8-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5a13.2 13.2 0 0 1-2-7c0-7.3 5.9-13.2 13.3-13.2 3.5 0 6.9 1.4 9.4 3.9a13.2 13.2 0 0 1 3.9 9.4c0 7.3-6 13.2-13.3 13.2Zm7.3-9.9c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.2-1.2-3-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.3 0 2 1.4 3.9 1.6 4.1.2.3 2.8 4.3 6.8 6 .9.4 1.7.7 2.3.8.9.3 1.8.3 2.5.2.8-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5Z" />
  </svg>
)

/* ========== MENU ICONS (Mobile Drawer) ========== */
const IconHomeMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconUserMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconCodeMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)
const IconBriefcaseMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)
const IconFolderMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)
const IconMailMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)
const IconChevronRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

/* ============================================================
   3D TILT HOOK — Mouse-tracked 3D rotation
   ============================================================ */
function use3DTilt(maxTilt = 15, scale = 1.02) {
  const ref = useRef(null)
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
  })

  const onMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (0.5 - y) * maxTilt * 2
    const tiltY = (x - 0.5) * maxTilt * 2
    setStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const onMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    })
  }

  return { ref, style, onMouseMove, onMouseLeave }
}

/* ============================================================
   SKILL CHIP — Individual tilt
   ============================================================ */
function SkillChip3D({ name, delay = 0 }) {
  const { ref, style, onMouseMove, onMouseLeave } = use3DTilt(12, 1.06)
  return (
    <div
      ref={ref}
      className="pt-skill-item pt-skill-item-3d"
      style={{ ...style, transitionDelay: `${delay}ms` }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <span className="pt-skill-item-icon">
        <SkillLogo name={name} size={22} />
      </span>
      <span className="pt-skill-item-name">{name}</span>
    </div>
  )
}

/* ============================================================
   PROJECT CARD — 3D perspective
   ============================================================ */
function ProjectCard3D({ project, index, uploadsBase }) {
  const { ref, style, onMouseMove, onMouseLeave } = use3DTilt(10, 1.02)
  return (
    <article
      ref={ref}
      className="pt-project pt-project-3d reveal"
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="pt-project-image">
        {project.image ? (
          <img src={`${uploadsBase}${project.image}`} alt={project.name} />
        ) : (
          <div className="pt-project-placeholder">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
        )}
        <div className="pt-project-overlay" />
        {project.url && (
          <a href={project.url} target="_blank" rel="noreferrer" className="pt-project-view" aria-label="Open project">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
      <div className="pt-project-body">
        <h3 className="pt-project-title">{project.name}</h3>
        {project.description && <p className="pt-project-desc">{project.description}</p>}
        {project.url && (
          <a href={project.url} target="_blank" rel="noreferrer" className="pt-project-link">
            View Live <IconArrow size={13} />
          </a>
        )}
      </div>
    </article>
  )
}

/* ============================================================
   HERO 3D CARD — Mouse parallax
   ============================================================ */
function HeroCard3D({ data, name, initials, uploadsBase }) {
  const wrapRef = useRef(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setRot({ x: (0.5 - y) * 20, y: (x - 0.5) * 24 })
      setGlow({ x: x * 100, y: y * 100 })
    }
    const onLeave = () => {
      setRot({ x: 0, y: 0 })
      setGlow({ x: 50, y: 50 })
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="pt-hero-right reveal">
      <div
        ref={wrapRef}
        className="pt-3d-card-wrap"
        style={{
          transform: `perspective(1200px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div
          className="pt-3d-card-glow"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(165,180,252,0.35), transparent 55%)`,
          }}
        />

        <div className="pt-3d-ring pt-3d-ring-1" />
        <div className="pt-3d-ring pt-3d-ring-2" />
        <div className="pt-3d-ring pt-3d-ring-3" />

        <div className="pt-3d-avatar">
          {data.profile_image ? (
            <img src={`${uploadsBase}${data.profile_image}`} alt={name} />
          ) : (
            <div className="pt-3d-avatar-fallback">{initials}</div>
          )}
        </div>

        {data.title && (
          <div
            className="pt-3d-badge pt-3d-badge-1"
            style={{ transform: `translateZ(60px) translateX(${rot.y * -0.6}px) translateY(${rot.x * -0.6}px)` }}
          >
            <span className="pt-3d-badge-dot" />
            {data.title}
          </div>
        )}
        {data.location && (
          <div
            className="pt-3d-badge pt-3d-badge-2"
            style={{ transform: `translateZ(50px) translateX(${rot.y * 0.5}px) translateY(${rot.x * 0.5}px)` }}
          >
            <IconPin size={11} /> {data.location}
          </div>
        )}
        <div
          className="pt-3d-badge pt-3d-badge-3"
          style={{ transform: `translateZ(70px) translateX(${rot.y * -0.4}px) translateY(${rot.x * -0.4}px)` }}
        >
          <span className="pt-3d-status-dot" /> Available
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MAIN TEMPLATE
   ============================================================ */
export default function PortfolioTemplate({ data, website }) {
  const uploadsBase = getUploadsBase(data)

  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })

  useScrollReveal([data])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact']
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.4 }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNavClick = (id) => {
    scrollTo(id)
    setMenuOpen(false)
  }

  const name = data.full_name || website?.name || 'Your Name'
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const waLink = buildWhatsAppLink(
    data.whatsapp || data.contact_phone || data.phone,
    `Hi ${name}, I found your portfolio and would like to connect.`
  )
  const yearsExp =
    data.years_experience ||
    (typeof data.experience === 'string' ? data.experience : null)

  const skillGroups = (() => {
    const raw = data.skills
    if (!Array.isArray(raw) || raw.length === 0) return []
    if (typeof raw[0] === 'string') return [{ category: 'Skills', items: raw }]
    return raw
  })()

  const hasSkills = skillGroups.length > 0
  const totalSkills = skillGroups.reduce((n, g) => n + (g.items?.length || 0), 0)

  // ✅ Static nav links for portfolio
  const navLinks = [
    { id: 'home', label: 'Home', Icon: IconHomeMenu },
    { id: 'about', label: 'About', Icon: IconUserMenu },
    { id: 'skills', label: 'Skills', Icon: IconCodeMenu },
    { id: 'experience', label: 'Experience', Icon: IconBriefcaseMenu },
    { id: 'projects', label: 'Projects', Icon: IconFolderMenu },
    { id: 'contact', label: 'Contact', Icon: IconMailMenu },
  ]

  const sendContactMessage = (e) => {
    e.preventDefault()
    const { name: cn, email: ce, message: cm } = contactForm
    if (!cn || !ce || !cm) return
    const msg = `Hi ${name},\n\nMy name is ${cn} (${ce}).\n\n${cm}`
    const target = data.whatsapp || data.contact_phone || data.phone
    const link = buildWhatsAppLink(target, msg)
    if (link) window.open(link, '_blank')
  }

  return (
    <div className="pt-root">
      <div className="pt-bg-shapes" aria-hidden="true">
        <div className="pt-shape pt-shape-sphere" />
        <div className="pt-shape pt-shape-cube" />
        <div className="pt-shape pt-shape-torus" />
      </div>

      {/* ============ NAVBAR ============ */}
      <nav className={`pt-nav ${scrolled ? 'pt-nav-scrolled' : ''}`}>
        <div className="pt-nav-inner">
          <div className="pt-nav-logo" onClick={() => handleNavClick('home')}>
            <span className="pt-nav-logo-mark">{initials}</span>
            <span className="pt-nav-logo-text">{name.split(' ')[0]}</span>
          </div>

          <ul className="pt-nav-links">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button
                  className={`pt-nav-link ${activeSection === l.id ? 'active' : ''}`}
                  onClick={() => scrollTo(l.id)}
                >
                  {l.label}
                </button>
              </li>
            ))}
            {data.resume && (
              <li>
                <a
                  href={`${uploadsBase}${data.resume}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="pt-nav-link pt-nav-link-resume"
                >
                  Resume
                  <IconDownload size={12} />
                </a>
              </li>
            )}
          </ul>

          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer" className="pt-nav-cta">
              Hire Me <IconArrow size={13} />
            </a>
          )}

          <button
            className={`pt-menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* ============ MOBILE DRAWER — SVG Icons ============ */}
        <div className={`pt-mobile-drawer ${menuOpen ? 'open' : ''}`}>
          <div className="pt-mobile-inner">
            {navLinks.map((l, i) => (
              <button
                key={l.id}
                className={`pt-mobile-link ${activeSection === l.id ? 'active' : ''}`}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => handleNavClick(l.id)}
              >
                <span className="pt-mobile-link-icon">
                  <l.Icon size={17} />
                </span>
                <span className="pt-mobile-link-label">{l.label}</span>
                <span className="pt-mobile-link-arrow">
                  <IconChevronRight size={13} />
                </span>
              </button>
            ))}

            {data.resume && (
              <a
                href={`${uploadsBase}${data.resume}`}
                download
                target="_blank"
                rel="noreferrer"
                className="pt-mobile-link pt-mobile-link-resume"
                style={{ animationDelay: `${navLinks.length * 50}ms` }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="pt-mobile-link-icon">
                  <IconDownload size={17} />
                </span>
                <span className="pt-mobile-link-label">Download Resume</span>
                <span className="pt-mobile-link-arrow">
                  <IconChevronRight size={13} />
                </span>
              </a>
            )}

            <div className="pt-mobile-divider" />

            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer"
                className="pt-mobile-cta"
                onClick={() => setMenuOpen(false)}>
                <IconWhatsApp size={16} /> Hire Me on WhatsApp
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section id="home" className="pt-hero">
        <div className="pt-hero-bg">
          <div className="pt-blob pt-blob-1" />
          <div className="pt-blob pt-blob-2" />
          <div className="pt-blob pt-blob-3" />
        </div>

        <div className="pt-hero-content">
          <div className="pt-hero-left reveal">
            <div className="pt-hero-eyebrow">
              <span className="pt-hero-dot" />
              Available for work
            </div>
            <h1 className="pt-hero-title">
              Hi, I'm <span className="pt-gradient-text">{name}</span>
            </h1>
            {data.title && <h2 className="pt-hero-subtitle">{data.title}</h2>}
            {(data.tagline || data.about) && (
              <p className="pt-hero-desc">
                {data.tagline ||
                  (data.about.length > 180 ? data.about.slice(0, 180) + '...' : data.about)}
              </p>
            )}

            <div className="pt-hero-actions">
              {data.resume ? (
                <a href={`${uploadsBase}${data.resume}`} download
                  target="_blank" rel="noreferrer" className="pt-btn pt-btn-primary">
                  <IconDownload size={16} /> Download Resume
                </a>
              ) : (
                <button className="pt-btn pt-btn-primary" onClick={() => scrollTo('contact')}>
                  Hire Me <IconArrow size={15} />
                </button>
              )}
              <button className="pt-btn pt-btn-ghost" onClick={() => scrollTo('contact')}>
                Get in Touch
              </button>
            </div>

            <div className="pt-hero-socials">
              {data.social_linkedin && (
                <a href={data.social_linkedin} target="_blank" rel="noreferrer"
                  aria-label="LinkedIn" className="pt-social-btn">
                  <IconLinkedIn size={17} />
                </a>
              )}
              {data.social_github && (
                <a href={data.social_github} target="_blank" rel="noreferrer"
                  aria-label="GitHub" className="pt-social-btn">
                  <IconGitHub size={17} />
                </a>
              )}
              {data.social_twitter && (
                <a href={data.social_twitter} target="_blank" rel="noreferrer"
                  aria-label="Twitter" className="pt-social-btn">
                  <IconTwitter size={15} />
                </a>
              )}
            </div>
          </div>

          <HeroCard3D data={data} name={name} initials={initials} uploadsBase={uploadsBase} />
        </div>

        <div className="pt-hero-scroll">
          <span>Scroll to explore</span>
          <div className="pt-scroll-line" />
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      {data.about && (
        <section id="about" className="pt-section">
          <div className="pt-section-inner">
            <SectionHeader eyebrow="About Me" title="Get to know me" />

            <div className="pt-about-wrap">
              <div className="pt-about-left reveal">
                <div className="pt-about-image-wrap pt-3d-scene">
                  <div className="pt-about-image-glow" />
                  <div className="pt-about-image-ring" />
                  {data.profile_image ? (
                    <img src={`${uploadsBase}${data.profile_image}`}
                      alt={name} className="pt-about-image pt-about-image-3d" />
                  ) : (
                    <div className="pt-about-image pt-about-image-fallback pt-about-image-3d">
                      {initials}
                    </div>
                  )}

                  {data.title && (
                    <div className="pt-about-float-badge pt-about-float-badge-1 pt-float-3d">
                      <span className="pt-about-float-dot" />
                      {data.title}
                    </div>
                  )}

                  <div className="pt-about-float-badge pt-about-float-badge-2 pt-float-3d">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Open to work
                  </div>
                </div>

                <div className="pt-about-stats">
                  {yearsExp && (
                    <div className="pt-stat-card pt-stat-3d">
                      <div className="pt-stat-value">{String(yearsExp).split(' ')[0]}+</div>
                      <div className="pt-stat-label">Years Exp.</div>
                    </div>
                  )}
                  {Array.isArray(data.projects) && data.projects.length > 0 && (
                    <div className="pt-stat-card pt-stat-3d">
                      <div className="pt-stat-value">{data.projects.length}+</div>
                      <div className="pt-stat-label">Projects</div>
                    </div>
                  )}
                  {totalSkills > 0 && (
                    <div className="pt-stat-card pt-stat-3d">
                      <div className="pt-stat-value">{totalSkills}+</div>
                      <div className="pt-stat-label">Skills</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-about-right reveal">
                {data.tagline && (
                  <div className="pt-about-tagline-wrap">
                    <svg className="pt-quote-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.4 5.8c-3.1.9-5.2 3.6-5.2 6.7 0 3.1 2.1 5.6 5.2 5.6 2.3 0 4.1-1.8 4.1-4.1 0-2.3-1.8-4.1-4.1-4.1-.4 0-.8.1-1.1.2.4-1.6 1.6-2.9 3.1-3.4l-2-1Zm9.3 0c-3.1.9-5.2 3.6-5.2 6.7 0 3.1 2.1 5.6 5.2 5.6 2.3 0 4.1-1.8 4.1-4.1 0-2.3-1.8-4.1-4.1-4.1-.4 0-.8.1-1.1.2.4-1.6 1.6-2.9 3.1-3.4l-2-1Z" />
                    </svg>
                    <p className="pt-about-tagline">{data.tagline}</p>
                  </div>
                )}

                <div className="pt-about-body">
                  <div className="pt-about-body-accent" />
                  <p className="pt-about-text">{data.about}</p>
                </div>

                <div className="pt-about-meta">
                  {data.title && (
                    <div className="pt-about-meta-item pt-meta-3d">
                      <div className="pt-about-meta-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <div>
                        <div className="pt-about-meta-label">Role</div>
                        <div className="pt-about-meta-value">{data.title}</div>
                      </div>
                    </div>
                  )}

                  {data.location && (
                    <div className="pt-about-meta-item pt-meta-3d">
                      <div className="pt-about-meta-icon">
                        <IconPin size={16} />
                      </div>
                      <div>
                        <div className="pt-about-meta-label">Based in</div>
                        <div className="pt-about-meta-value">{data.location}</div>
                      </div>
                    </div>
                  )}

                  <div className="pt-about-meta-item pt-meta-3d">
                    <div className="pt-about-meta-icon pt-about-meta-icon-green">
                      <span className="pt-about-status-dot" />
                    </div>
                    <div>
                      <div className="pt-about-meta-label">Status</div>
                      <div className="pt-about-meta-value">Available now</div>
                    </div>
                  </div>
                </div>

                <div className="pt-about-ctas">
                  {data.resume && (
                    <a href={`${uploadsBase}${data.resume}`} download
                      target="_blank" rel="noreferrer" className="pt-btn pt-btn-primary">
                      <IconDownload size={15} /> Get Resume
                    </a>
                  )}
                  <button className="pt-btn pt-btn-ghost" onClick={() => scrollTo('contact')}>
                    Let's Talk <IconArrow size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ SKILLS — Professional Bento ============ */}
      {hasSkills && (
        <section id="skills" className="pt-section pt-section-alt">
          <div className="pt-section-inner">
            <SectionHeader eyebrow="What I do" title="Skills & Expertise" />

            <div className="pt-skills-bento">
              {skillGroups.map((g, gi) => {
                const items = g.items || []
                const total = items.length
                const sizeClass =
                  total >= 6 ? 'pt-skill-card-lg'
                    : total >= 4 ? 'pt-skill-card-md'
                    : 'pt-skill-card-sm'

                return (
                  <div
                    key={gi}
                    className={`pt-skill-card ${sizeClass} reveal`}
                    style={{ transitionDelay: `${gi * 70}ms` }}
                  >
                    <div className="pt-skill-card-head">
                      <div className="pt-skill-card-head-left">
                        <span className="pt-skill-card-index">
                          {String(gi + 1).padStart(2, '0')}
                        </span>
                        <h3 className="pt-skill-card-title">
                          {g.category || 'Skills'}
                        </h3>
                      </div>
                      <span className="pt-skill-card-count">
                        {total} {total === 1 ? 'skill' : 'skills'}
                      </span>
                    </div>

                    <div className="pt-skill-card-divider" />

                    <div className="pt-skill-card-items">
                      {items.map((s, si) => (
                        <div
                          key={si}
                          className="pt-skill-pill"
                          style={{ animationDelay: `${si * 40}ms` }}
                        >
                          <span className="pt-skill-pill-icon">
                            <SkillLogo name={s} size={24} />
                          </span>
                          <span className="pt-skill-pill-name">{s}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-skill-card-glow" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ EXPERIENCE ============ */}
      {Array.isArray(data.experience) && data.experience.length > 0 && (
        <section id="experience" className="pt-section">
          <div className="pt-section-inner">
            <SectionHeader eyebrow="My Journey" title="Work Experience" />
            <div className="pt-exp-list pt-exp-list-3d">
              {data.experience.map((e, i) => (
                <div key={i} className="pt-exp-item reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="pt-exp-marker">
                    <div className="pt-exp-dot" />
                    <div className="pt-exp-line" />
                  </div>
                  <div className="pt-exp-card pt-exp-card-3d">
                    <div className="pt-exp-top">
                      <div>
                        <h3 className="pt-exp-role">{e.role || 'Role'}</h3>
                        <div className="pt-exp-company">
                          <span className="pt-exp-company-dot" />
                          {e.company || 'Company'}
                        </div>
                      </div>
                      <span className="pt-exp-period">
                        {e.from_period || '?'} — {e.to_period || 'Present'}
                      </span>
                    </div>
                    {e.domain && <div className="pt-exp-domain">{e.domain}</div>}
                    {e.description && <p className="pt-exp-desc">{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ PROJECTS ============ */}
      {Array.isArray(data.projects) && data.projects.length > 0 && (
        <section id="projects" className="pt-section pt-section-alt">
          <div className="pt-section-inner">
            <SectionHeader eyebrow="Featured Work" title="Projects I've Built" />
            <div className="pt-projects-grid">
              {data.projects.map((p, i) => (
                <ProjectCard3D key={i} project={p} index={i} uploadsBase={uploadsBase} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ RESUME ============ */}
      {data.resume && (
        <section className="pt-section">
          <div className="pt-section-inner">
            <div className="pt-resume-card pt-resume-card-3d reveal">
              <div className="pt-resume-left">
                <div className="pt-resume-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <h3 className="pt-resume-title">Download My Resume</h3>
                  <p className="pt-resume-text">
                    Full details of my experience, education, and skills.
                  </p>
                </div>
              </div>
              <a href={`${uploadsBase}${data.resume}`} download
                target="_blank" rel="noreferrer" className="pt-btn pt-btn-primary">
                <IconDownload size={16} /> Download PDF
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ============ CONTACT ============ */}
      <section id="contact" className="pt-section pt-section-alt">
        <div className="pt-section-inner">
          <SectionHeader eyebrow="Let's talk" title="Get in Touch" />

          <div className="pt-contact-wrap">
            <div className="pt-contact-info">
              {data.email && (
                <a href={`mailto:${data.email}`} className="pt-contact-card pt-contact-card-3d reveal">
                  <div className="pt-contact-icon"><IconEmail /></div>
                  <div>
                    <div className="pt-contact-label">Email</div>
                    <div className="pt-contact-value">{data.email}</div>
                  </div>
                </a>
              )}
              {data.phone && (
                <a href={`tel:${data.phone}`} className="pt-contact-card pt-contact-card-3d reveal">
                  <div className="pt-contact-icon"><IconPhone /></div>
                  <div>
                    <div className="pt-contact-label">Phone</div>
                    <div className="pt-contact-value">{data.phone}</div>
                  </div>
                </a>
              )}
              {data.address && (
                <div className="pt-contact-card pt-contact-card-3d reveal">
                  <div className="pt-contact-icon"><IconPin size={20} /></div>
                  <div>
                    <div className="pt-contact-label">Location</div>
                    <div className="pt-contact-value">{data.address}</div>
                  </div>
                </div>
              )}
              {waLink && (
                <a href={waLink} target="_blank" rel="noreferrer"
                  className="pt-contact-card pt-contact-card-3d reveal">
                  <div className="pt-contact-icon pt-contact-icon-wa"><IconWhatsApp /></div>
                  <div>
                    <div className="pt-contact-label">WhatsApp</div>
                    <div className="pt-contact-value">{data.whatsapp || data.phone}</div>
                  </div>
                </a>
              )}
            </div>

            <form className="pt-contact-form pt-contact-form-3d reveal" onSubmit={sendContactMessage}>
              <h3 className="pt-contact-form-title">Send a Message</h3>
              <p className="pt-contact-form-sub">
                Fill the form and it will open WhatsApp with your message.
              </p>

              <div className="pt-cf-field">
                <label>Your Name</label>
                <input type="text" placeholder="e.g. Ravi Kumar"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required />
              </div>
              <div className="pt-cf-field">
                <label>Your Email</label>
                <input type="email" placeholder="you@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required />
              </div>
              <div className="pt-cf-field">
                <label>Message</label>
                <textarea rows={4} placeholder="Write your message here..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required />
              </div>

              <button type="submit" className="pt-btn pt-btn-primary pt-btn-block">
                <IconWhatsApp size={16} /> Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="pt-footer">
        <div className="pt-footer-inner">
          <div className="pt-footer-brand">
            <div className="pt-footer-mark">{initials}</div>
            <div>
              <div className="pt-footer-name">{name}</div>
              {data.title && <div className="pt-footer-role">{data.title}</div>}
            </div>
          </div>

          <div className="pt-footer-copy">
            <div className="pt-footer-line-1">
              © {new Date().getFullYear()} {name}. All Rights Reserved.
            </div>
            <div className="pt-footer-line-2">
              Crafted with passion · Powered by{' '}
              <a href="https://qifawtechnologies.com/" target="_blank"
                rel="noreferrer" className="pt-footer-link">
                Qifaw Technologies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="pt-section-head reveal">
      <span className="pt-section-eyebrow">{eyebrow}</span>
      <h2 className="pt-section-title">{title}</h2>
      <div className="pt-section-line" />
    </div>
  )
}