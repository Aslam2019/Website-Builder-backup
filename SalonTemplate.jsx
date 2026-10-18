import { useEffect, useState, useMemo } from 'react'
import { UPLOADS_BASE } from '../../../utils/constants'
import { buildWhatsAppLink } from '../../../utils/whatsapp'
import useScrollReveal from '../../../hooks/useScrollReveal'
import './salon.css'

/* ============ Hero fallback images ============ */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1920&q=80',
]

/* ============ Base Icons ============ */
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconPin = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const IconPhone = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconEmail = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconWhatsApp = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 .4C7.2.4 0 7.6 0 16.4c0 2.9.8 5.6 2.1 7.9L0 32l7.8-2a15.9 15.9 0 0 0 8.2 2.2h.01c8.8 0 16-7.2 16-16S24.8.4 16 .4Zm0 29.2c-2.4 0-4.8-.7-6.8-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5a13.2 13.2 0 0 1-2-7c0-7.3 5.9-13.2 13.3-13.2 3.5 0 6.9 1.4 9.4 3.9a13.2 13.2 0 0 1 3.9 9.4c0 7.3-6 13.2-13.3 13.2Zm7.3-9.9c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.2-1.2-3-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.3 0 2 1.4 3.9 1.6 4.1.2.3 2.8 4.3 6.8 6 .9.4 1.7.7 2.3.8.9.3 1.8.3 2.5.2.8-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5Z" />
  </svg>
)
const IconClock = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
  </svg>
)
const IconScissors = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
)
const IconSparkle = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2 2-7z" />
  </svg>
)
const IconFlower = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2a4 4 0 0 0 0 8 4 4 0 0 0 0-8ZM12 14a4 4 0 0 0 0 8 4 4 0 0 0 0-8ZM2 12a4 4 0 0 0 8 0 4 4 0 0 0-8 0ZM14 12a4 4 0 0 0 8 0 4 4 0 0 0-8 0Z" />
  </svg>
)
const IconQuote = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.4 5.8c-3.1.9-5.2 3.6-5.2 6.7 0 3.1 2.1 5.6 5.2 5.6 2.3 0 4.1-1.8 4.1-4.1 0-2.3-1.8-4.1-4.1-4.1-.4 0-.8.1-1.1.2.4-1.6 1.6-2.9 3.1-3.4l-2-1Zm9.3 0c-3.1.9-5.2 3.6-5.2 6.7 0 3.1 2.1 5.6 5.2 5.6 2.3 0 4.1-1.8 4.1-4.1 0-2.3-1.8-4.1-4.1-4.1-.4 0-.8.1-1.1.2.4-1.6 1.6-2.9 3.1-3.4l-2-1Z" />
  </svg>
)
const IconInstagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.39C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.12.66.66 1.33 1.08 2.12 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.12-1.39.66-.66 1.08-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.39-2.12a5.9 5.9 0 0 0-2.12-1.39c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
  </svg>
)
const IconFacebook = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  </svg>
)

/* ============ Menu Icons ============ */
const IconHomeMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconUserMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconScissorsMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
)
const IconSparkleMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 5.8L20 12l-6.1 3.2L12 21l-1.9-5.8L4 12l6.1-3.2z" />
  </svg>
)
const IconImageMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)
const IconStarMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconMailMenu = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)
const IconChevronRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

/* Helper: extract only digits from a value */
const digitsOnly = (val) => {
  const s = String(val ?? '').replace(/\D/g, '')
  return s || '0'
}

/* ============================================================ */
export default function SalonTemplate({ data, website }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [filter, setFilter] = useState('all')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [booking, setBooking] = useState({
    name: '', phone: '', service: '', date: '', time: '', message: '',
  })

  const services = Array.isArray(data.services) ? data.services : []
  const gallery = Array.isArray(data.gallery) ? data.gallery : []

  const heroSlides = useMemo(() => {
    const uploaded = [...gallery]
      .filter(Boolean)
      .map((img) => `${UPLOADS_BASE}${img}`)
    if (uploaded.length >= 2) return uploaded.slice(0, 5)
    return HERO_IMAGES
  }, [gallery])

  useScrollReveal([data])

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((i) => (i + 1) % 3)
    }, 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['home', 'about', 'services', 'why', 'gallery', 'testimonials', 'contact']
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.3 }
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  const salon = data.salon_name || website?.name || 'Glow Studio'
  const initials = salon.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const waLink = buildWhatsAppLink(
    data.whatsapp || data.phone,
    `Hi ${salon}, I'd like to book an appointment.`
  )

  const categories = ['all', ...new Set(services.map((s) => (s.category || '').toLowerCase()).filter(Boolean))]
  const visibleServices = filter === 'all'
    ? services
    : services.filter((s) => (s.category || '').toLowerCase() === filter)

  const navLinks = [
    { id: 'home', label: 'Home', Icon: IconHomeMenu },
    data.about && { id: 'about', label: 'About', Icon: IconUserMenu },
    services.length > 0 && { id: 'services', label: 'Services', Icon: IconScissorsMenu },
    { id: 'why', label: 'Why Us', Icon: IconSparkleMenu },
    gallery.length > 0 && { id: 'gallery', label: 'Gallery', Icon: IconImageMenu },
    { id: 'testimonials', label: 'Reviews', Icon: IconStarMenu },
    { id: 'contact', label: 'Contact', Icon: IconMailMenu },
  ].filter(Boolean)

  const socials = [
    data.social_instagram && { url: data.social_instagram, Icon: IconInstagram, label: 'Instagram' },
    data.social_facebook && { url: data.social_facebook, Icon: IconFacebook, label: 'Facebook' },
  ].filter(Boolean)

  const whyItems = [
    { Icon: IconSparkle, title: 'Premium Products', desc: 'Only top-brand, salon-grade products used in every service.' },
    { Icon: IconScissors, title: 'Expert Stylists', desc: 'Trained professionals with years of hands-on experience.' },
    { Icon: IconFlower, title: 'Hygiene First', desc: 'Sterilized tools, sanitized stations, and clean linens always.' },
    { Icon: IconClock, title: 'On-Time Service', desc: 'Booked slots are honored — no long waiting times.' },
  ]

  const testimonials = [
    { name: 'Priya Sharma', role: 'Regular Client', text: 'Absolutely love this place! The stylists are so talented and the ambiance is serene. My hair has never looked better.' },
    { name: 'Ananya Reddy', role: 'Bridal Client', text: "They did my bridal makeup and I couldn't be happier. The team was patient, professional, and made me feel like a queen." },
    { name: 'Meera Krishnan', role: 'Spa Lover', text: 'The aroma massage is pure bliss. Clean, calm, and every detail is thought through. My favorite weekend escape!' },
  ]

  const submitBooking = (e) => {
    e.preventDefault()
    const { name, phone, service, date, time, message } = booking
    if (!name || !phone) return
    const msg = `Hi ${salon}, I'd like to book an appointment.

Name: ${name}
Phone: ${phone}
Service: ${service || '—'}
Preferred Date: ${date || '—'}
Preferred Time: ${time || '—'}
${message ? `\nMessage: ${message}` : ''}`

    const link = buildWhatsAppLink(data.whatsapp || data.phone, msg)
    if (link) window.open(link, '_blank')
  }

  const heroWords = (data.tagline || 'Where Beauty Meets Elegance').split(' ').filter(Boolean)
  const accentWords = ['Beauty', 'Elegance', 'Glow', 'Luxury', 'Radiant', 'Beautiful']

  return (
    <div className="sa2-root">
      {/* ============ NAVBAR ============ */}
      <nav className={`sa2-nav ${scrolled ? 'sa2-nav-scrolled' : ''}`}>
        <div className="sa2-nav-inner">
          <div className="sa2-nav-logo" onClick={() => scrollTo('home')}>
            {data.logo ? (
              <img src={`${UPLOADS_BASE}${data.logo}`} alt={salon} className="sa2-nav-logo-img" />
            ) : (
              <span className="sa2-nav-logo-mark">{initials}</span>
            )}
            <span className="sa2-nav-logo-text">{salon}</span>
          </div>

          <ul className="sa2-nav-links">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button className={`sa2-nav-link ${activeSection === l.id ? 'active' : ''}`}
                  onClick={() => scrollTo(l.id)}>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="sa2-nav-socials">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer"
                aria-label={s.label} className="sa2-nav-social">
                <s.Icon size={15} />
              </a>
            ))}
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="sa2-nav-cta">
                Book Now <IconArrow size={13} />
              </a>
            )}
          </div>

          <button className={`sa2-menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ============ MOBILE DRAWER ============ */}
      <div className={`sa2-mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="sa2-mobile-header">
          <div className="sa2-mobile-header-logo">
            <span className="sa2-mobile-header-mark">{initials}</span>
            <span className="sa2-mobile-header-name">{salon}</span>
          </div>
          <button
            className="sa2-mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sa2-mobile-inner">
          <nav className="sa2-mobile-nav">
            {navLinks.map((l, i) => (
              <button
                key={l.id}
                className={`sa2-mobile-link ${activeSection === l.id ? 'active' : ''}`}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => scrollTo(l.id)}
              >
                <span className="sa2-mobile-link-icon">
                  <l.Icon size={17} />
                </span>
                <span className="sa2-mobile-link-label">{l.label}</span>
                <span className="sa2-mobile-link-arrow">
                  <IconChevronRight size={13} />
                </span>
              </button>
            ))}
          </nav>

          {socials.length > 0 && (
            <div className="sa2-mobile-socials">
              <div className="sa2-mobile-socials-label">Follow Us</div>
              <div className="sa2-mobile-socials-row">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="sa2-mobile-social"
                  >
                    <s.Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {waLink && (
          <div className="sa2-mobile-footer">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="sa2-mobile-cta"
              onClick={() => setMenuOpen(false)}
            >
              <IconWhatsApp size={15} /> Book on WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* ============ HERO ============ */}
      <section id="home" className="sa2-hero">
        <div className="sa2-hero-bg">
          {heroSlides.map((src, i) => (
            <div key={i}
              className={`sa2-hero-bg-img ${i === 0 ? 'active' : ''}`}
              style={{ backgroundImage: `url(${src})` }} />
          ))}
          <div className="sa2-hero-overlay" />
        </div>

        <div className="sa2-petals" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => {
            const colors = [
              'linear-gradient(135deg, #fce4ec, #f8bbd0)',
              'linear-gradient(135deg, #f5ede1, #c9a96a)',
              'linear-gradient(135deg, #fce4ec, #e91e63)',
              'linear-gradient(135deg, #ffffff, #fce4ec)',
            ]
            const isOdd = i % 2 === 0
            return (
              <span
                key={i}
                className={`sa2-petal ${isOdd ? 'sa2-petal-odd' : ''}`}
                style={{
                  left: `${(i * 5.3) % 100}%`,
                  background: colors[i % colors.length],
                  animationDelay: `${i * 0.9}s`,
                  animationDuration: `${10 + (i % 6) * 1.8}s`,
                  width: `${8 + (i % 3) * 3}px`,
                  height: `${8 + (i % 3) * 3}px`,
                }}
              />
            )
          })}
        </div>

        <div className="sa2-hero-content">
          <div className="sa2-hero-eyebrow reveal">
            <IconSparkle size={13} /> Luxury Salon & Spa
          </div>

          {/* ✅ FIXED: Hero title with proper spacing between words */}
          <h1 className="sa2-hero-title reveal">
            {heroWords.map((word, i) => {
              const clean = word.replace(/[^\w]/g, '')
              const isAccent = accentWords.includes(clean)
              return (
                <span key={i} className="sa2-hero-word">
                  {isAccent ? (
                    <em className="sa2-hero-accent">{word}</em>
                  ) : (
                    <span>{word}</span>
                  )}
                  {i < heroWords.length - 1 && ' '}
                </span>
              )
            })}
          </h1>

          <div className="sa2-hero-divider reveal">
            <span /><IconFlower size={18} /><span />
          </div>

          <p className="sa2-hero-desc reveal">
            {data.about
              ? data.about.length > 180 ? data.about.slice(0, 180) + '...' : data.about
              : 'Pamper yourself with luxury treatments — hair, skin, nails, and spa.'}
          </p>

          <div className="sa2-hero-actions reveal">
            <button className="sa2-btn sa2-btn-primary" onClick={() => scrollTo('services')}>
              View Services <IconArrow size={15} />
            </button>
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="sa2-btn sa2-btn-outline">
                <IconWhatsApp size={15} /> Book Appointment
              </a>
            )}
          </div>

          {/* ✅ FIXED: Stats use digitsOnly to prevent double "+" */}
          <div className="sa2-hero-stats reveal">
            <div className="sa2-hero-stat">
              <div className="sa2-hero-stat-icon"><IconScissors size={20} /></div>
              <div className="sa2-hero-stat-num">{digitsOnly(services.length)}+</div>
              <div className="sa2-hero-stat-label">Services</div>
            </div>
            <div className="sa2-hero-stat">
              <div className="sa2-hero-stat-icon"><IconSparkle size={20} /></div>
              <div className="sa2-hero-stat-num">{digitsOnly(data.years_experience || 8)}+</div>
              <div className="sa2-hero-stat-label">Years</div>
            </div>
            <div className="sa2-hero-stat">
              <div className="sa2-hero-stat-icon"><IconFlower size={20} /></div>
              <div className="sa2-hero-stat-num">{digitsOnly(data.happy_clients || 5000)}+</div>
              <div className="sa2-hero-stat-label">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      {data.about && (
        <section id="about" className="sa2-section sa2-about-section">
          <div className="sa2-section-inner">
            <div className="sa2-about-wrap">
              <div className="sa2-about-collage reveal">
                <div className="sa2-about-img-main">
                  {gallery[0] ? (
                    <img src={`${UPLOADS_BASE}${gallery[0]}`} alt="Salon" />
                  ) : (
                    <div className="sa2-about-img-fallback">
                      <IconScissors size={60} />
                    </div>
                  )}
                </div>
                <div className="sa2-about-img-overlap">
                  {gallery[1] ? (
                    <img src={`${UPLOADS_BASE}${gallery[1]}`} alt="Salon" />
                  ) : (
                    <div className="sa2-about-img-fallback sa2-about-img-fallback-2">
                      <IconFlower size={40} />
                    </div>
                  )}
                </div>
                <div className="sa2-about-badge">
                  <IconSparkle size={14} />
                  <span>Est. {2024 - (parseInt(data.years_experience) || 8)}</span>
                </div>
              </div>

              <div className="sa2-about-content reveal">
                <div className="sa2-about-eyebrow">
                  <span className="sa2-about-eyebrow-line" />
                  About {salon}
                </div>

                <h2 className="sa2-about-title">
                  Where Every Visit <em>Feels Like a Retreat</em>
                </h2>

                <p className="sa2-about-desc">
                  {data.about_full || data.about}
                </p>

                <div className="sa2-about-info">
                  {data.working_hours && (
                    <div className="sa2-about-info-row">
                      <div className="sa2-about-info-icon"><IconClock size={16} /></div>
                      <div>
                        <div className="sa2-about-info-label">Open Hours</div>
                        <div className="sa2-about-info-value">{data.working_hours}</div>
                      </div>
                    </div>
                  )}
                  {data.address && (
                    <div className="sa2-about-info-row">
                      <div className="sa2-about-info-icon"><IconPin size={16} /></div>
                      <div>
                        <div className="sa2-about-info-label">Visit Us</div>
                        <div className="sa2-about-info-value">{data.address}</div>
                      </div>
                    </div>
                  )}
                  {data.phone && (
                    <div className="sa2-about-info-row">
                      <div className="sa2-about-info-icon"><IconPhone size={16} /></div>
                      <div>
                        <div className="sa2-about-info-label">Call Us</div>
                        <div className="sa2-about-info-value">{data.phone}</div>
                      </div>
                    </div>
                  )}
                </div>

                {waLink && (
                  <a href={waLink} target="_blank" rel="noreferrer" className="sa2-btn sa2-btn-primary">
                    <IconWhatsApp size={15} /> Book Appointment
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ SERVICES ============ */}
      {services.length > 0 && (
        <section id="services" className="sa2-section sa2-services-section">
          <div className="sa2-section-inner">
            <div className="sa2-section-head-center reveal">
              <div className="sa2-section-eyebrow">
                <span /><IconFlower size={14} /><span />
              </div>
              <h2 className="sa2-section-title">
                Our <em>Signature</em> Services
              </h2>
              <p className="sa2-section-sub">
                Handcrafted beauty treatments, tailored just for you.
              </p>
            </div>

            {categories.length > 1 && (
              <div className="sa2-filters reveal">
                {categories.map((c) => (
                  <button key={c}
                    className={`sa2-filter-btn ${filter === c ? 'active' : ''}`}
                    onClick={() => setFilter(c)}>
                    {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            )}

            <div className="sa2-services-list">
              {visibleServices.map((s, i) => (
                <article key={i} className="sa2-service-row reveal"
                  style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className="sa2-service-num">0{i + 1}</div>

                  <div className="sa2-service-content">
                    <div className="sa2-service-head">
                      <h3 className="sa2-service-name">{s.name || 'Service'}</h3>
                      {s.category && (
                        <span className="sa2-service-cat">{s.category}</span>
                      )}
                    </div>
                    {s.description && (
                      <p className="sa2-service-desc">{s.description}</p>
                    )}
                    <div className="sa2-service-meta">
                      {s.duration && (
                        <span className="sa2-service-meta-item">
                          <IconClock size={13} /> {s.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sa2-service-right">
                    <div className="sa2-service-price">{s.price || '₹—'}</div>
                    {waLink && (
                      <a href={buildWhatsAppLink(
                        data.whatsapp || data.phone,
                        `Hi, I'd like to book "${s.name}" (${s.price || ''}).`
                      )}
                        target="_blank" rel="noreferrer"
                        className="sa2-service-book">
                        Book <IconArrow size={13} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ WHY CHOOSE US ============ */}
      <section id="why" className="sa2-section sa2-why-section">
        <div className="sa2-section-inner">
          <div className="sa2-section-head-center reveal">
            <div className="sa2-section-eyebrow">
              <span /><IconSparkle size={14} /><span />
            </div>
            <h2 className="sa2-section-title">
              Why Choose <em>Us</em>
            </h2>
            <p className="sa2-section-sub">
              Excellence in every detail, from the moment you walk in.
            </p>
          </div>

          <div className="sa2-why-timeline">
            {whyItems.map((w, i) => (
              <div key={i} className="sa2-why-item reveal"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="sa2-why-marker">
                  <div className="sa2-why-marker-inner">
                    <w.Icon size={22} />
                  </div>
                </div>
                <div className="sa2-why-content">
                  <div className="sa2-why-num">0{i + 1}</div>
                  <h3 className="sa2-why-title">{w.title}</h3>
                  <p className="sa2-why-desc">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      {gallery.length > 0 && (
        <section id="gallery" className="sa2-section sa2-gallery-section">
          <div className="sa2-section-inner">
            <div className="sa2-section-head-center reveal">
              <div className="sa2-section-eyebrow">
                <span /><IconFlower size={14} /><span />
              </div>
              <h2 className="sa2-section-title">
                Our <em>Gallery</em>
              </h2>
              <p className="sa2-section-sub">
                A peek inside our world of beauty and relaxation.
              </p>
            </div>

            <div className="sa2-gallery-masonry">
              {gallery.map((url, i) => {
                const sizeClass = i % 5 === 0 ? 'large' : i % 5 === 3 ? 'wide' : ''
                return (
                  <div key={i} className={`sa2-gallery-cell ${sizeClass} reveal`}
                    style={{ transitionDelay: `${i * 40}ms` }}>
                    <img src={`${UPLOADS_BASE}${url}`} alt={`Gallery ${i + 1}`} />
                    <div className="sa2-gallery-overlay">
                      <IconSparkle size={22} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="sa2-section sa2-testimonials-section">
        <div className="sa2-section-inner">
          <div className="sa2-section-head-center reveal">
            <div className="sa2-section-eyebrow sa2-section-eyebrow-light">
              <span /><IconSparkle size={14} /><span />
            </div>
            <h2 className="sa2-section-title sa2-section-title-light">
              What Our <em>Clients</em> Say
            </h2>
            <p className="sa2-section-sub sa2-section-sub-light">
              Real stories from real people who love what we do.
            </p>
          </div>

          <div className="sa2-testimonial-wrap reveal">
            <div className="sa2-testimonial-quote-mark">
              <IconQuote size={50} />
            </div>

            <div className="sa2-testimonial-content">
              <p className="sa2-testimonial-text">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="sa2-testimonial-author">
                <div className="sa2-testimonial-avatar">
                  {testimonials[activeTestimonial].name.charAt(0)}
                </div>
                <div>
                  <div className="sa2-testimonial-name">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="sa2-testimonial-role">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </div>

            <div className="sa2-testimonial-dots">
              {testimonials.map((_, i) => (
                <button key={i}
                  className={`sa2-testimonial-dot ${i === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="sa2-section sa2-contact-section">
        <div className="sa2-section-inner">
          <div className="sa2-section-head-center reveal">
            <div className="sa2-section-eyebrow">
              <span /><IconClock size={14} /><span />
            </div>
            <h2 className="sa2-section-title">
              Book Your <em>Appointment</em>
            </h2>
            <p className="sa2-section-sub">
              Reserve your spot — we'll confirm on WhatsApp instantly.
            </p>
          </div>

          <div className="sa2-contact-wrap">
            <div className="sa2-contact-left reveal">
              {data.phone && (
                <a href={`tel:${data.phone}`} className="sa2-contact-card">
                  <div className="sa2-contact-card-icon"><IconPhone size={20} /></div>
                  <div className="sa2-contact-card-body">
                    <div className="sa2-contact-card-label">Call Us</div>
                    <div className="sa2-contact-card-value">{data.phone}</div>
                  </div>
                </a>
              )}
              {data.email && (
                <a href={`mailto:${data.email}`} className="sa2-contact-card">
                  <div className="sa2-contact-card-icon"><IconEmail size={20} /></div>
                  <div className="sa2-contact-card-body">
                    <div className="sa2-contact-card-label">Email</div>
                    <div className="sa2-contact-card-value">{data.email}</div>
                  </div>
                </a>
              )}
              {data.address && (
                <div className="sa2-contact-card">
                  <div className="sa2-contact-card-icon"><IconPin size={20} /></div>
                  <div className="sa2-contact-card-body">
                    <div className="sa2-contact-card-label">Visit Us</div>
                    <div className="sa2-contact-card-value">{data.address}</div>
                  </div>
                </div>
              )}
              {data.working_hours && (
                <div className="sa2-contact-card">
                  <div className="sa2-contact-card-icon"><IconClock size={20} /></div>
                  <div className="sa2-contact-card-body">
                    <div className="sa2-contact-card-label">Open Hours</div>
                    <div className="sa2-contact-card-value">{data.working_hours}</div>
                  </div>
                </div>
              )}
            </div>

            <form className="sa2-booking-form reveal" onSubmit={submitBooking}>
              <div className="sa2-booking-form-head">
                <IconSparkle size={16} />
                <h3>Request Appointment</h3>
              </div>

              <div className="sa2-booking-grid">
                <div className="sa2-cf-field">
                  <label>Your Name *</label>
                  <input type="text" value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                    placeholder="e.g. Priya Sharma" required />
                </div>
                <div className="sa2-cf-field">
                  <label>Phone *</label>
                  <input type="tel" value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                    placeholder="9876543210" required />
                </div>
                <div className="sa2-cf-field">
                  <label>Service</label>
                  <select value={booking.service}
                    onChange={(e) => setBooking({ ...booking, service: e.target.value })}>
                    <option value="">Select service</option>
                    {services.map((s, i) => (
                      <option key={i} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sa2-cf-field">
                  <label>Preferred Date</label>
                  <input type="date" value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })} />
                </div>
                <div className="sa2-cf-field">
                  <label>Preferred Time</label>
                  <input type="time" value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })} />
                </div>
                <div className="sa2-cf-field sa2-cf-full">
                  <label>Message (optional)</label>
                  <textarea rows={3} value={booking.message}
                    onChange={(e) => setBooking({ ...booking, message: e.target.value })}
                    placeholder="Anything we should know?" />
                </div>
              </div>

              <button type="submit" className="sa2-btn sa2-btn-primary sa2-btn-block">
                <IconWhatsApp size={16} /> Book via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="sa2-footer">
        <div className="sa2-footer-inner">
          <div className="sa2-footer-top">
            <div className="sa2-footer-brand">
              <div className="sa2-footer-mark">{initials}</div>
              <div className="sa2-footer-brand-text">
                <div className="sa2-footer-name">{salon}</div>
                <div className="sa2-footer-role">Luxury Salon & Spa</div>
                {data.tagline && (
                  <p className="sa2-footer-tagline">{data.tagline}</p>
                )}
              </div>
            </div>

            <div className="sa2-footer-col">
              <h4 className="sa2-footer-heading">Explore</h4>
              <ul className="sa2-footer-list">
                {navLinks.slice(0, 5).map((l) => (
                  <li key={l.id}>
                    <button className="sa2-footer-link-btn" onClick={() => scrollTo(l.id)}>
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {services.length > 0 && (
              <div className="sa2-footer-col">
                <h4 className="sa2-footer-heading">Services</h4>
                <ul className="sa2-footer-list">
                  {services.slice(0, 4).map((s, i) => (
                    <li key={i}>
                      <button
                        className="sa2-footer-link-btn"
                        onClick={() => scrollTo('services')}
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="sa2-footer-col">
              <h4 className="sa2-footer-heading">Get in Touch</h4>
              <ul className="sa2-footer-list sa2-footer-contact-list">
                {data.phone && (
                  <li>
                    <a href={`tel:${data.phone}`} className="sa2-footer-contact">
                      <IconPhone size={13} />
                      <span>{data.phone}</span>
                    </a>
                  </li>
                )}
                {data.email && (
                  <li>
                    <a href={`mailto:${data.email}`} className="sa2-footer-contact">
                      <IconEmail size={13} />
                      <span>{data.email}</span>
                    </a>
                  </li>
                )}
                {data.address && (
                  <li>
                    <div className="sa2-footer-contact sa2-footer-address">
                      <IconPin size={13} />
                      <span>{data.address}</span>
                    </div>
                  </li>
                )}
              </ul>

              {socials.length > 0 && (
                <div className="sa2-footer-socials">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="sa2-footer-social"
                    >
                      <s.Icon size={14} />
                    </a>
                  ))}
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      className="sa2-footer-social sa2-footer-social-wa"
                    >
                      <IconWhatsApp size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="sa2-footer-bottom">
            <p className="sa2-footer-copy">
              © {new Date().getFullYear()}{' '}
              <span className="sa2-footer-copy-brand">{salon}</span>
              <span className="sa2-footer-copy-sep">·</span>
              All Rights Reserved
              <span className="sa2-footer-copy-sep">·</span>
              Crafted by{' '}
              <a
                href="https://qifawtechnologies.com/"
                target="_blank"
                rel="noreferrer"
                className="sa2-footer-credit"
              >
                Qifaw Technologies
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}