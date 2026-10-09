import { useEffect, useState, useRef } from 'react'
import { UPLOADS_BASE } from '../../../utils/constants'
import { buildWhatsAppLink } from '../../../utils/whatsapp'
import './medical.css'

/* ============ Hero fallback images ============ */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
]

/* ============ Icons ============ */
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconArrowNE = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
)
const IconPin = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const IconPhone = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconEmail = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconWhatsApp = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 .4C7.2.4 0 7.6 0 16.4c0 2.9.8 5.6 2.1 7.9L0 32l7.8-2a15.9 15.9 0 0 0 8.2 2.2h.01c8.8 0 16-7.2 16-16S24.8.4 16 .4Zm0 29.2c-2.4 0-4.8-.7-6.8-1.9l-.5-.3-5 1.3 1.3-4.9-.3-.5a13.2 13.2 0 0 1-2-7c0-7.3 5.9-13.2 13.3-13.2 3.5 0 6.9 1.4 9.4 3.9a13.2 13.2 0 0 1 3.9 9.4c0 7.3-6 13.2-13.3 13.2Zm7.3-9.9c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.2-1.2-3-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.3 0 2 1.4 3.9 1.6 4.1.2.3 2.8 4.3 6.8 6 .9.4 1.7.7 2.3.8.9.3 1.8.3 2.5.2.8-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5Z" />
  </svg>
)
const IconClock = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
  </svg>
)
const IconStar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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
const IconHeart = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)
const IconStethoscope = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
)
const IconShield = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const IconAmbulance = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 10H6" /><path d="M8 8v4" />
    <path d="M9 18h6" /><path d="M12 15v6" />
    <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h11l4 4z" />
    <circle cx="6.5" cy="18.5" r="1.5" />
    <circle cx="17.5" cy="18.5" r="1.5" />
  </svg>
)
const IconAward = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
)
const IconSparkle = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2 2-7z" />
  </svg>
)

/* ============ Counter ============ */
function Counter({ value, duration = 1800, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        const target = parseInt(String(value).replace(/\D/g, ''), 10) || 0
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 4)
          setCount(Math.floor(eased * target))
          if (p < 1) requestAnimationFrame(tick)
          else setCount(target)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [value, duration, started])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ============================================================
   MAIN TEMPLATE
   ============================================================ */
export default function MedicalTemplate({ data, website }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [appointment, setAppointment] = useState({
    name: '', phone: '', department: '', date: '', message: ''
  })

  const services = Array.isArray(data.services) ? data.services : []
  const doctors = Array.isArray(data.doctors) ? data.doctors : []
  const rawGallery = Array.isArray(data.gallery) ? data.gallery.filter(Boolean) : []

  // ✅ Gallery — use uploaded images, else fallback to demo images
  const gallery = rawGallery.length > 0
    ? rawGallery.map(img => `${UPLOADS_BASE}${img}`)
    : HERO_IMAGES

  const features = Array.isArray(data.features) && data.features.length > 0
    ? data.features
    : [
        { title: '24/7 Emergency', description: 'Round-the-clock emergency care with ambulance support.' },
        { title: 'Expert Doctors', description: 'Team of experienced specialists across all departments.' },
        { title: 'Advanced Equipment', description: 'Modern diagnostic and treatment technology.' },
        { title: 'Affordable Care', description: 'Transparent pricing and insurance support.' },
      ]
  const reviews = Array.isArray(data.reviews) && data.reviews.length > 0
    ? data.reviews
    : [
        { patient_name: 'Ramesh S.', treatment: 'Cardiac Checkup', rating: 5, text: 'Excellent care and professional doctors. Highly recommended!' },
        { patient_name: 'Priya M.', treatment: 'Pediatrics', rating: 5, text: 'My daughter loves the pediatric team. Very caring and patient.' },
        { patient_name: 'Anand K.', treatment: 'Orthopedics', rating: 5, text: 'Successful surgery and quick recovery. Thank you team!' },
      ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!lightbox) return
    const onEsc = (e) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [lightbox])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  const clinic = data.clinic_name || data.director_name || website?.name || 'Health Clinic'
  const initials = clinic.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const waLink = buildWhatsAppLink(
    data.whatsapp || data.phone,
    `Hi ${clinic}, I'd like to book an appointment.`
  )
  const emergencyLink = data.emergency_phone ? `tel:${data.emergency_phone}` : null

  const navLinks = [
    { id: 'home', label: 'Home' },
    data.about && { id: 'about', label: 'About' },
    services.length > 0 && { id: 'services', label: 'Services' },
    doctors.length > 0 && { id: 'doctors', label: 'Doctors' },
    { id: 'features', label: 'Why Us' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'gallery', label: 'Gallery' },       // ✅ Always show
    { id: 'contact', label: 'Contact' },
  ].filter(Boolean)

  const socials = [
    data.social_instagram && { url: data.social_instagram, Icon: IconInstagram, label: 'Instagram' },
    data.social_facebook && { url: data.social_facebook, Icon: IconFacebook, label: 'Facebook' },
  ].filter(Boolean)

  const featureIcons = [IconAmbulance, IconStethoscope, IconShield, IconHeart, IconAward]

  const submitAppointment = (e) => {
    e.preventDefault()
    const { name, phone, department, date, message } = appointment
    if (!name || !phone) return
    const msg = `Hi ${clinic}, I'd like to book an appointment.

Name: ${name}
Phone: ${phone}
Department: ${department || '—'}
Preferred Date: ${date || '—'}
${message ? `\nMessage: ${message}` : ''}`
    const link = buildWhatsAppLink(data.whatsapp || data.phone, msg)
    if (link) window.open(link, '_blank')
  }

  const tagline = data.tagline || 'Care that feels personal'

  return (
    <div className="md2-root">
      {/* ============ NAVBAR ============ */}
      <nav className={`md2-nav ${scrolled ? 'md2-nav-scrolled' : ''}`}>
        <div className="md2-nav-inner">
          <div className="md2-nav-logo" onClick={() => scrollTo('home')}>
            {data.logo ? (
              <img src={`${UPLOADS_BASE}${data.logo}`} alt={clinic} className="md2-nav-logo-img" />
            ) : (
              <span className="md2-nav-logo-mark">{initials}</span>
            )}
            <span className="md2-nav-logo-text">{clinic}</span>
          </div>

          <ul className="md2-nav-links">
            {navLinks.map(l => (
              <li key={l.id}>
                <button className="md2-nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
              </li>
            ))}
          </ul>

          <div className="md2-nav-right">
            {emergencyLink && (
              <a href={emergencyLink} className="md2-nav-emergency">
                <span className="md2-nav-emergency-dot" /> Emergency
              </a>
            )}
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="md2-nav-cta">
                <IconWhatsApp size={14} /> Book
              </a>
            )}
          </div>

          <button className={`md2-menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`md2-mobile-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div className={`md2-mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="md2-mobile-inner">
          {navLinks.map((l, i) => (
            <button key={l.id}
              className="md2-mobile-link"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => scrollTo(l.id)}>
              <span className="md2-mobile-num">0{i + 1}</span>{l.label}
            </button>
          ))}
          <div className="md2-mobile-divider" />
          {emergencyLink && (
            <a href={emergencyLink} className="md2-mobile-emergency">
              <IconAmbulance size={16} /> Emergency Call
            </a>
          )}
          {socials.length > 0 && (
            <div className="md2-mobile-socials">
              <div className="md2-mobile-socials-label">Follow Us</div>
              <div className="md2-mobile-socials-row">
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    aria-label={s.label} className="md2-mobile-social">
                    <s.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer"
              className="md2-mobile-cta" onClick={() => setMenuOpen(false)}>
              <IconWhatsApp size={16} /> Book Appointment
            </a>
          )}
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section id="home" className="md2-hero">
        <div className="md2-hero-inner">
          {/* Left: Image collage */}
          <div className="md2-hero-visual">
            <div className="md2-hero-visual-main">
              {doctors[0]?.image ? (
                <img src={`${UPLOADS_BASE}${doctors[0].image}`} alt={clinic} className="md2-hero-img" />
              ) : rawGallery[0] ? (
                <img src={`${UPLOADS_BASE}${rawGallery[0]}`} alt={clinic} className="md2-hero-img" />
              ) : (
                <img src={HERO_IMAGES[0]} alt={clinic} className="md2-hero-img" />
              )}
            </div>
            <div className="md2-hero-visual-sub">
              {doctors[1]?.image ? (
                <img src={`${UPLOADS_BASE}${doctors[1].image}`} alt="" className="md2-hero-img-sm" />
              ) : rawGallery[1] ? (
                <img src={`${UPLOADS_BASE}${rawGallery[1]}`} alt="" className="md2-hero-img-sm" />
              ) : (
                <img src={HERO_IMAGES[1]} alt="" className="md2-hero-img-sm" />
              )}
            </div>

            <div className="md2-hero-badge-float">
              <div className="md2-hero-badge-num">
                <Counter value={data.years_experience || 15} suffix="+" />
              </div>
              <div className="md2-hero-badge-label">Years of trusted care</div>
            </div>

            <div className="md2-hero-ring" />
          </div>

          {/* Right: Content */}
          <div className="md2-hero-content">
            <div className="md2-hero-top-tag">
              <span className="md2-hero-top-tag-dot" />
              Now accepting new patients
            </div>

            <h1 className="md2-hero-title">
              {tagline}
            </h1>

            <p className="md2-hero-desc">
              {data.about
                ? data.about.length > 200 ? data.about.slice(0, 200) + '...' : data.about
                : 'World-class medical care with a personal touch. Our expert team is here for you and your family.'}
            </p>

            <div className="md2-hero-actions">
              <button className="md2-btn md2-btn-primary" onClick={() => scrollTo('contact')}>
                Book Appointment <IconArrow size={15} />
              </button>
              {data.phone && (
                <a href={`tel:${data.phone}`} className="md2-btn md2-btn-outline">
                  <IconPhone size={15} /> Call Now
                </a>
              )}
            </div>

            <div className="md2-hero-stats">
              <div className="md2-hero-stat">
                <div className="md2-hero-stat-num">
                  <Counter value={data.happy_patients || 10000} suffix="+" />
                </div>
                <div className="md2-hero-stat-label">Happy Patients</div>
              </div>
              <div className="md2-hero-stat-divider" />
              <div className="md2-hero-stat">
                <div className="md2-hero-stat-num">
                  <Counter value={data.total_doctors || 12} suffix="+" />
                </div>
                <div className="md2-hero-stat-label">Expert Doctors</div>
              </div>
              <div className="md2-hero-stat-divider" />
              <div className="md2-hero-stat">
                <div className="md2-hero-stat-num">
                  <Counter value={24} suffix="/7" />
                </div>
                <div className="md2-hero-stat-label">Emergency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST MARQUEE ============ */}
      <section className="md2-trust">
        <div className="md2-trust-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="md2-trust-item">
              <IconAward size={20} />
              <span>NABH Accredited</span>
              <span className="md2-trust-dot">•</span>
              <IconAmbulance size={20} />
              <span>24/7 Emergency</span>
              <span className="md2-trust-dot">•</span>
              <IconShield size={20} />
              <span>Insurance Accepted</span>
              <span className="md2-trust-dot">•</span>
              <IconStethoscope size={20} />
              <span>Expert Specialists</span>
              <span className="md2-trust-dot">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      {data.about && (
        <section id="about" className="md2-section md2-about">
          <div className="md2-section-inner">
            <div className="md2-about-grid">
              <div className="md2-about-side">
                <div className="md2-section-num">01</div>
                <div className="md2-section-label">About</div>
              </div>

              <div className="md2-about-body">
                <h2 className="md2-section-title">
                  Your health is our <em>only priority</em>
                </h2>

                <p className="md2-about-text">{data.about_full || data.about}</p>

                <div className="md2-about-points">
                  {[
                    'Experienced team of specialists',
                    'State-of-the-art diagnostic equipment',
                    'Compassionate, patient-first care',
                    'Transparent pricing & insurance support',
                  ].map((p, i) => (
                    <div key={i} className="md2-about-point">
                      <span className="md2-about-point-icon"><IconCheck size={12} /></span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>

                <div className="md2-about-meta">
                  {data.director_name && (
                    <div className="md2-about-meta-item">
                      <div className="md2-about-meta-label">Chief Doctor</div>
                      <div className="md2-about-meta-value">{data.director_name}</div>
                    </div>
                  )}
                  {data.working_hours && (
                    <div className="md2-about-meta-item">
                      <div className="md2-about-meta-label">Working Hours</div>
                      <div className="md2-about-meta-value">{data.working_hours}</div>
                    </div>
                  )}
                  {data.address && (
                    <div className="md2-about-meta-item">
                      <div className="md2-about-meta-label">Location</div>
                      <div className="md2-about-meta-value">{data.address}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ SERVICES ============ */}
      {services.length > 0 && (
        <section id="services" className="md2-section md2-services">
          <div className="md2-section-inner">
            <div className="md2-services-head">
              <div className="md2-section-num">02</div>
              <div className="md2-section-label">Services</div>
              <h2 className="md2-section-title">
                Comprehensive <em>medical care</em>
              </h2>
            </div>

            <div className="md2-services-list">
              {services.map((s, i) => (
                <div key={i} className="md2-service-row">
                  <div className="md2-service-num">0{i + 1}</div>
                  <div className="md2-service-name-col">
                    <div className="md2-service-name">{s.name || 'Service'}</div>
                    {s.category && <div className="md2-service-cat">{s.category}</div>}
                  </div>
                  <div className="md2-service-desc-col">
                    {s.description && (
                      <p className="md2-service-desc">{s.description}</p>
                    )}
                  </div>
                  <div className="md2-service-meta-col">
                    {s.duration && (
                      <div className="md2-service-meta">
                        <IconClock size={13} /> {s.duration}
                      </div>
                    )}
                    <div className="md2-service-price">{s.price || '₹—'}</div>
                  </div>
                  {waLink && (
                    <a href={buildWhatsAppLink(
                      data.whatsapp || data.phone,
                      `Hi, I'd like to book "${s.name}" service.`
                    )} target="_blank" rel="noreferrer" className="md2-service-btn">
                      <IconArrowNE size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ DOCTORS ============ */}
      {doctors.length > 0 && (
        <section id="doctors" className="md2-section md2-doctors">
          <div className="md2-section-inner">
            <div className="md2-doctors-head">
              <div className="md2-section-num">03</div>
              <div className="md2-section-label">Our Team</div>
              <h2 className="md2-section-title">
                Meet our <em>expert doctors</em>
              </h2>
            </div>

            <div className="md2-doctors-grid">
              {doctors.map((d, i) => {
                const name = d.name || 'Doctor'
                const cleanName = name.replace(/^Dr\.?\s*/i, '').trim()
                const parts = cleanName.split(' ')
                const initials = parts.length > 1
                  ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                  : cleanName.slice(0, 2).toUpperCase()

                return (
                  <div key={i} className="md2-doctor-card">
                    <div className="md2-doctor-ring">
                      <div className="md2-doctor-img-wrap">
                        {d.image ? (
                          <img src={`${UPLOADS_BASE}${d.image}`} alt={name} className="md2-doctor-img" />
                        ) : (
                          <div className="md2-doctor-img-fallback">{initials}</div>
                        )}
                      </div>
                      {d.experience && (
                        <div className="md2-doctor-exp">{d.experience}</div>
                      )}
                    </div>

                    <h3 className="md2-doctor-name">{name}</h3>
                    {d.specialization && (
                      <div className="md2-doctor-spec">{d.specialization}</div>
                    )}
                    {d.department && (
                      <div className="md2-doctor-dept">{d.department}</div>
                    )}
                    {d.bio && (
                      <p className="md2-doctor-bio">{d.bio}</p>
                    )}
                    {waLink && (
                      <a href={buildWhatsAppLink(
                        data.whatsapp || data.phone,
                        `Hi, I'd like to book an appointment with ${name}.`
                      )} target="_blank" rel="noreferrer" className="md2-doctor-btn">
                        Book Appointment
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ FEATURES ============ */}
      <section id="features" className="md2-section md2-features">
        <div className="md2-section-inner">
          <div className="md2-features-head">
            <div className="md2-section-num">04</div>
            <div className="md2-section-label">Why Choose Us</div>
            <h2 className="md2-section-title">
              Healthcare you <em>can trust</em>
            </h2>
          </div>

          <div className="md2-features-grid">
            {features.map((f, i) => {
              const Icon = featureIcons[i % featureIcons.length]
              return (
                <div key={i} className="md2-feature-card">
                  <div className="md2-feature-num">0{i + 1}</div>
                  <div className="md2-feature-icon"><Icon size={24} /></div>
                  <h3 className="md2-feature-title">{f.title}</h3>
                  <p className="md2-feature-desc">{f.description || f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section id="reviews" className="md2-section md2-reviews">
        <div className="md2-section-inner">
          <div className="md2-reviews-head">
            <div className="md2-section-num">05</div>
            <div className="md2-section-label">Patient Stories</div>
            <h2 className="md2-section-title">
              Real stories, <em>real recovery</em>
            </h2>
          </div>

          <div className="md2-reviews-grid">
            {reviews.slice(0, 6).map((r, i) => (
              <div key={i} className="md2-review-card">
                <div className="md2-review-top">
                  <div className="md2-review-stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <IconStar key={s} size={13}
                        style={{ opacity: s < (r.rating || 5) ? 1 : 0.2 }} />
                    ))}
                  </div>
                  <span className="md2-review-num">0{i + 1}</span>
                </div>
                <p className="md2-review-text">"{r.text}"</p>
                <div className="md2-review-author">
                  <div className="md2-review-avatar">
                    {(r.patient_name || 'A').charAt(0)}
                  </div>
                  <div>
                    <div className="md2-review-name">{r.patient_name || 'Anonymous'}</div>
                    <div className="md2-review-treatment">{r.treatment || 'Patient'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY — Always shows ============ */}
      <section id="gallery" className="md2-section md2-gallery">
        <div className="md2-section-inner">
          <div className="md2-gallery-head">
            <div className="md2-section-num">06</div>
            <div className="md2-section-label">Our Facility</div>
            <h2 className="md2-section-title">
              Modern care <em>environment</em>
            </h2>
          </div>
        </div>

        <div className="md2-gallery-strip">
          <div className="md2-gallery-track">
            {gallery.concat(gallery).map((url, i) => (
              <div key={i} className="md2-gallery-cell"
                onClick={() => setLightbox(url)}>
                <img src={url} alt={`Facility ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="md2-section md2-contact">
        <div className="md2-section-inner">
          <div className="md2-contact-grid">
            <div className="md2-contact-left">
              <div className="md2-section-num">07</div>
              <div className="md2-section-label">Get in Touch</div>
              <h2 className="md2-section-title">
                Book your <em>appointment</em>
              </h2>
              <p className="md2-contact-desc">
                Fill the form or call us directly. Our team will confirm your appointment within 30 minutes.
              </p>

              <div className="md2-contact-cards">
                {data.phone && (
                  <a href={`tel:${data.phone}`} className="md2-contact-card">
                    <span className="md2-contact-icon"><IconPhone size={18} /></span>
                    <span className="md2-contact-text">
                      <small>Call Us</small>
                      <span>{data.phone}</span>
                    </span>
                  </a>
                )}
                {data.email && (
                  <a href={`mailto:${data.email}`} className="md2-contact-card">
                    <span className="md2-contact-icon"><IconEmail size={18} /></span>
                    <span className="md2-contact-text">
                      <small>Email</small>
                      <span>{data.email}</span>
                    </span>
                  </a>
                )}
                {data.address && (
                  <div className="md2-contact-card">
                    <span className="md2-contact-icon"><IconPin size={18} /></span>
                    <span className="md2-contact-text">
                      <small>Visit Us</small>
                      <span>{data.address}</span>
                    </span>
                  </div>
                )}
                {emergencyLink && (
                  <a href={emergencyLink} className="md2-contact-card md2-contact-emergency">
                    <span className="md2-contact-icon red"><IconAmbulance size={18} /></span>
                    <span className="md2-contact-text">
                      <small>24/7 Emergency</small>
                      <span>{data.emergency_phone}</span>
                    </span>
                  </a>
                )}
              </div>
            </div>

            <form className="md2-contact-form" onSubmit={submitAppointment}>
              <div className="md2-form-head">
                <div className="md2-form-title">Book Appointment</div>
                <div className="md2-form-sub">We'll confirm on WhatsApp instantly.</div>
              </div>

              <div className="md2-cf-row">
                <div className="md2-cf-field">
                  <label>Patient Name</label>
                  <input type="text" value={appointment.name}
                    onChange={e => setAppointment({ ...appointment, name: e.target.value })}
                    placeholder="Ramesh Kumar" required />
                </div>
                <div className="md2-cf-field">
                  <label>Phone</label>
                  <input type="tel" value={appointment.phone}
                    onChange={e => setAppointment({ ...appointment, phone: e.target.value })}
                    placeholder="9876543210" required />
                </div>
              </div>

              <div className="md2-cf-row">
                <div className="md2-cf-field">
                  <label>Department</label>
                  <select value={appointment.department}
                    onChange={e => setAppointment({ ...appointment, department: e.target.value })}>
                    <option value="">Select department</option>
                    {services.map((s, i) => (
                      <option key={i} value={s.category || s.name}>{s.category || s.name}</option>
                    ))}
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="md2-cf-field">
                  <label>Preferred Date</label>
                  <input type="date" value={appointment.date}
                    onChange={e => setAppointment({ ...appointment, date: e.target.value })} />
                </div>
              </div>

              <div className="md2-cf-field">
                <label>Message (optional)</label>
                <textarea rows={3} value={appointment.message}
                  onChange={e => setAppointment({ ...appointment, message: e.target.value })}
                  placeholder="Any symptoms or concern..." />
              </div>

              <button type="submit" className="md2-btn md2-btn-primary md2-btn-block">
                <IconWhatsApp size={16} /> Book via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="md2-footer">
        <div className="md2-footer-inner">
          <div className="md2-footer-top">
            <div className="md2-footer-brand">
              {data.logo ? (
                <img src={`${UPLOADS_BASE}${data.logo}`} alt={clinic} className="md2-footer-logo" />
              ) : (
                <div className="md2-footer-mark">{initials}</div>
              )}
              <div>
                <div className="md2-footer-name">{clinic}</div>
                <div className="md2-footer-tag">{data.tagline || 'Caring for you'}</div>
              </div>
            </div>

            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="md2-footer-cta">
                <IconWhatsApp size={15} /> Book Appointment
              </a>
            )}
          </div>

          <div className="md2-footer-grid">
            <div className="md2-footer-col">
              <h4 className="md2-footer-heading">Explore</h4>
              <ul className="md2-footer-list">
                {navLinks.slice(0, 5).map(l => (
                  <li key={l.id}>
                    <button className="md2-footer-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            {services.length > 0 && (
              <div className="md2-footer-col">
                <h4 className="md2-footer-heading">Services</h4>
                <ul className="md2-footer-list">
                  {services.slice(0, 5).map((s, i) => (
                    <li key={i}>
                      <button className="md2-footer-link" onClick={() => scrollTo('services')}>
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="md2-footer-col">
              <h4 className="md2-footer-heading">Contact</h4>
              <ul className="md2-footer-list">
                {data.phone && <li><a href={`tel:${data.phone}`} className="md2-footer-link">{data.phone}</a></li>}
                {data.email && <li><a href={`mailto:${data.email}`} className="md2-footer-link">{data.email}</a></li>}
                {data.address && (
                  <li>
                    <span className="md2-footer-link static">
                      {data.address.length > 40 ? data.address.slice(0, 40) + '...' : data.address}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {socials.length > 0 && (
              <div className="md2-footer-col">
                <h4 className="md2-footer-heading">Follow Us</h4>
                <div className="md2-footer-socials">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer"
                      aria-label={s.label} className="md2-footer-social">
                      <s.Icon size={15} />
                    </a>
                  ))}
                  {waLink && (
                    <a href={waLink} target="_blank" rel="noreferrer"
                      aria-label="WhatsApp" className="md2-footer-social wa">
                      <IconWhatsApp size={15} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="md2-footer-bottom">
            <p className="md2-footer-copy">
              © {new Date().getFullYear()} <span className="md2-footer-copy-brand">{clinic}</span>
              <span className="md2-footer-copy-sep">·</span>
              All Rights Reserved
              <span className="md2-footer-copy-sep">·</span>
              Crafted by{' '}
              <a href="https://qifawtechnologies.com/" target="_blank" rel="noreferrer"
                className="md2-footer-credit-link">
                Qifaw Technologies
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ============ LIGHTBOX ============ */}
      {lightbox && (
        <div className="md2-lightbox" onClick={() => setLightbox(null)}>
          <button className="md2-lightbox-close" onClick={() => setLightbox(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img src={lightbox} alt="Preview" className="md2-lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}