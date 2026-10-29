import { useEffect, useState, useMemo, useRef } from 'react'
import { getUploadsBase } from './utils/constants'
import { buildWhatsAppLink } from './utils/whatsapp'
import './education.css'

/* ============ Hero fallback images ============ */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
]

/* ============ Icons ============ */
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconArrowNE = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
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
const IconClock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
  </svg>
)
const IconUsers = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconStar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
const IconSparkle = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 14 9l7 2-7 2-2 7-2-7-7-2 7-2 2-7z" />
  </svg>
)
const IconCode = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
)
const IconRocket = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
)
const IconAward = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
)
const IconBookOpen = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

/* ============ Animated Counter ============ */
function AnimatedCounter({ value, duration = 1800, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
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
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, duration, started])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ============ Split Text Reveal ============ */
function SplitText({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <span ref={ref} className={`ed-split ${visible ? 'is-visible' : ''} ${className}`}>
      {words.map((word, wi) => (
        <span key={wi} className="ed-split-word">
          <span className="ed-split-word-inner" style={{ transitionDelay: `${delay + wi * 0.06}s` }}>
            {word}
          </span>
          {wi < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}

/* ============ 3D Tilt Card ============ */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotY = ((x - cx) / cx) * 8
    const rotX = -((y - cy) / cy) * 8
    setStyle({
      transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`,
    })
  }

  const handleLeave = () => {
    setStyle({ transform: 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)' })
  }

  return (
    <div
      ref={ref}
      className={`ed-tilt ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}

/* ============================================================
   MAIN TEMPLATE
   ============================================================ */
export default function EducationTemplate({ data, website }) {
  const uploadsBase = getUploadsBase(data)

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const [enquiry, setEnquiry] = useState({ name: '', phone: '', course: '', message: '' })

  const courses = Array.isArray(data.courses) ? data.courses : []
  const mentors = Array.isArray(data.mentors) ? data.mentors : []
  const gallery = Array.isArray(data.gallery) ? data.gallery : []
  const features = Array.isArray(data.features) && data.features.length > 0
    ? data.features
    : [
        { title: 'Placement Support', description: '200+ hiring partners actively recruiting our students.' },
        { title: 'Live Projects', description: 'Ship real products — not just tutorial clones.' },
        { title: '1:1 Mentorship', description: 'Personal guidance from senior engineers.' },
        { title: 'Certification', description: 'Industry-recognized certificates on completion.' },
      ]
  const reviews = Array.isArray(data.reviews) && data.reviews.length > 0
    ? data.reviews
    : [
        { student_name: 'Priya S.', course: 'Full Stack Development', rating: 5, text: 'Best decision of my career! Got placed within 2 months.' },
        { student_name: 'Rahul M.', course: 'Data Science', rating: 5, text: 'Excellent mentors, real-world projects, and amazing support.' },
        { student_name: 'Anjali K.', course: 'UI/UX Design', rating: 5, text: 'The teaching quality is top-notch. Highly recommended!' },
      ]

  const heroSlides = useMemo(() => {
    const imgs = [
      ...courses.map(c => c.image).filter(Boolean),
      ...gallery,
    ].map(img => `${uploadsBase}${img}`)
    if (imgs.length >= 2) return imgs.slice(0, 5)
    return HERO_IMAGES
  }, [courses, gallery, uploadsBase])

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % heroSlides.length), 6000)
    return () => clearInterval(t)
  }, [heroSlides.length])

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
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMenuOpen(false)
  }

  const institute = data.institute_name || data.director_name || website?.name || 'Code Academy'
  const initials = institute.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const waLink = buildWhatsAppLink(
    data.whatsapp || data.phone,
    `Hi ${institute}, I'd like to enquire about your courses.`
  )

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'courses', label: 'Courses' },
    { id: 'features', label: 'Why Us' },
    { id: 'mentors', label: 'Mentors' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ]

  const socials = [
    { url: data.social_instagram || '#', Icon: IconInstagram, label: 'Instagram' },
    { url: data.social_facebook || '#', Icon: IconFacebook, label: 'Facebook' },
  ]

  const featureIcons = [IconRocket, IconCode, IconUsers, IconAward, IconBookOpen]

  const submitEnquiry = (e) => {
    e.preventDefault()
    const { name, phone, course, message } = enquiry
    if (!name || !phone) return
    const msg = `Hi ${institute}, I'd like to know more about your courses.

Name: ${name}
Phone: ${phone}
Course: ${course || '—'}
${message ? `\nMessage: ${message}` : ''}`
    const link = buildWhatsAppLink(data.whatsapp || data.phone, msg)
    if (link) window.open(link, '_blank')
  }

  const tagline = data.tagline || 'Build Your Tech Career With Real Skills'

  return (
    <div className="ed-root">
      {/* ============ NAVBAR ============ */}
      <nav className={`ed-nav ${scrolled ? 'ed-nav-scrolled' : ''}`}>
        <div className="ed-nav-inner">
          <div className="ed-nav-logo" onClick={() => scrollTo('home')}>
            {data.logo ? (
              <img src={`${uploadsBase}${data.logo}`} alt={institute} className="ed-nav-logo-img" />
            ) : (
              <span className="ed-nav-logo-mark">{initials}</span>
            )}
            <span className="ed-nav-logo-text">{institute}</span>
          </div>

          <ul className="ed-nav-links">
            {navLinks.map(l => (
              <li key={l.id}>
                <button className={`ed-nav-link ${scrolled ? 'on-dark' : ''}`}
                  onClick={() => scrollTo(l.id)}>{l.label}</button>
              </li>
            ))}
          </ul>

          <div className="ed-nav-right">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer"
                aria-label={s.label} className="ed-nav-social">
                <s.Icon size={15} />
              </a>
            ))}
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="ed-nav-cta">
                Enroll Now <IconArrow size={13} />
              </a>
            )}
          </div>

          <button className={`ed-menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer OUTSIDE nav */}
      <div className={`ed-mobile-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div className={`ed-mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="ed-mobile-inner">
          {navLinks.map((l, i) => (
            <button key={l.id}
              className="ed-mobile-link"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => scrollTo(l.id)}>
              <span className="ed-mobile-num">0{i + 1}</span>{l.label}
            </button>
          ))}
          <div className="ed-mobile-divider" />
          {socials.length > 0 && (
            <div className="ed-mobile-socials">
              <div className="ed-mobile-socials-label">Follow Us</div>
              <div className="ed-mobile-socials-row">
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    aria-label={s.label} className="ed-mobile-social">
                    <s.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer"
              className="ed-mobile-cta" onClick={() => setMenuOpen(false)}>
              <IconWhatsApp size={16} /> Enroll on WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section id="home" className="ed-hero">
        <div className="ed-hero-bg">
          <div className="ed-hero-mesh m1" />
          <div className="ed-hero-mesh m2" />
          <div className="ed-hero-mesh m3" />
          <div className="ed-hero-grid" />
        </div>

        <div className="ed-hero-inner">
          <div className="ed-hero-top">
            <span className="ed-hero-index">01 — {new Date().getFullYear()} Admission Open</span>
            <span className="ed-hero-loc">
              <IconPin size={12} /> {data.address ? data.address.split(',')[0] : 'Online Worldwide'}
            </span>
          </div>

          <div className="ed-hero-main">
            <div className="ed-hero-left">
              <div className="ed-hero-eyebrow ed-anim-fadeup">
                <span className="ed-hero-dot" /> Now accepting new students
              </div>

              <h1 className="ed-hero-title" style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px', lineHeight: 1.1 }}>
                {tagline.split(' ').map((word, i) => (
                  <span key={i} className="ed-hero-line" style={{ display: 'inline-block' }}>
                    <span className="ed-hero-line-inner" style={{ animationDelay: `${0.3 + i * 0.1}s`, display: 'inline-block' }}>
                      {word}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="ed-hero-desc ed-anim-fadeup" style={{ animationDelay: '0.7s' }}>
                {data.about
                  ? data.about.length > 200 ? data.about.slice(0, 200) + '...' : data.about
                  : 'Learn from industry veterans, build real products, and get placed at top companies.'}
              </p>

              {/* ✅ FIXED: Buttons color and text visibility */}
              <div className="ed-hero-actions ed-anim-fadeup" style={{ animationDelay: '0.9s' }}>
                <button className="ed-btn ed-btn-primary" onClick={() => scrollTo('courses')} style={{ background: '#0f172a', color: '#ffffff', border: 'none' }}>
                  Explore Courses <IconArrow size={15} />
                </button>
                {waLink && (
                  <a href={waLink} target="_blank" rel="noreferrer" className="ed-btn ed-btn-ghost" style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0' }}>
                    <IconWhatsApp size={15} /> Talk to Counsellor
                  </a>
                )}
              </div>

              <div className="ed-hero-stats ed-anim-fadeup" style={{ animationDelay: '1.1s' }}>
                <div className="ed-hero-stat">
                  <div className="ed-hero-stat-num">
                    <AnimatedCounter value={data.students_trained || 5000} suffix="+" />
                  </div>
                  <div className="ed-hero-stat-label">Students Trained</div>
                </div>
                <div className="ed-hero-stat">
                  <div className="ed-hero-stat-num">
                    <AnimatedCounter value={data.placement_rate || 95} suffix="%" />
                  </div>
                  <div className="ed-hero-stat-label">Placement Rate</div>
                </div>
                <div className="ed-hero-stat">
                  <div className="ed-hero-stat-num">
                    <AnimatedCounter value={data.years_experience || 8} suffix="+" />
                  </div>
                  <div className="ed-hero-stat-label">Years Experience</div>
                </div>
              </div>
            </div>

            <div className="ed-hero-right ed-anim-fadeup" style={{ animationDelay: '0.5s' }}>
              <div className="ed-hero-visual">
                <div className="ed-hero-visual-glow" />
                <div className="ed-hero-visual-frame">
                  <div className="ed-hero-visual-chrome">
                    <span className="ed-hero-visual-dot red" />
                    <span className="ed-hero-visual-dot yellow" />
                    <span className="ed-hero-visual-dot green" />
                    <span className="ed-hero-visual-url">code-academy / courses</span>
                  </div>
                  <div className="ed-hero-visual-body">
                    <div className="ed-hero-visual-sidebar">
                      <div className="ed-hero-visual-side-item active" />
                      <div className="ed-hero-visual-side-item" />
                      <div className="ed-hero-visual-side-item" />
                      <div className="ed-hero-visual-side-item" />
                    </div>
                    <div className="ed-hero-visual-content">
                      <div className="ed-hero-visual-line w80" />
                      <div className="ed-hero-visual-line w60" />
                      <div className="ed-hero-visual-blocks">
                        <div className="ed-hero-visual-block" />
                        <div className="ed-hero-visual-block" />
                        <div className="ed-hero-visual-block" />
                        <div className="ed-hero-visual-block" />
                      </div>
                      <div className="ed-hero-visual-line w40" />
                    </div>
                  </div>
                </div>

                <div className="ed-hero-float-card fc1">
                  <div className="ed-hero-float-icon"><IconCheck size={14} /></div>
                  <div>
                    <div className="ed-hero-float-title">Placement Ready</div>
                    <div className="ed-hero-float-sub">200+ hiring partners</div>
                  </div>
                </div>

                <div className="ed-hero-float-card fc2">
                  <div className="ed-hero-float-icon amber"><IconSparkle size={14} /></div>
                  <div>
                    <div className="ed-hero-float-title">Live Projects</div>
                    <div className="ed-hero-float-sub">Real-world skills</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo marquee */}
          <div className="ed-hero-marquee">
            <div className="ed-hero-marquee-track">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="ed-hero-marquee-item">
                  <IconSparkle size={12} /> Trusted by 5000+ students
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      {data.about && (
        <section id="about" className="ed-section ed-about">
          <div className="ed-section-inner">
            <div className="ed-about-grid">
              <div className="ed-about-left">
                <div className="ed-about-eyebrow">
                  <span className="ed-about-line" /> About
                </div>
                <h2 className="ed-about-heading">
                  <SplitText text="We don't just teach." />
                  <br />
                  <span className="ed-about-heading-accent">
                    <SplitText text="We transform careers." delay={0.4} />
                  </span>
                </h2>
                <p className="ed-about-text">{data.about_full || data.about}</p>

                <div className="ed-about-stats">
                  <div className="ed-about-stat">
                    <div className="ed-about-stat-num">
                      <AnimatedCounter value={data.total_courses || 25} suffix="+" />
                    </div>
                    <div className="ed-about-stat-label">Courses</div>
                  </div>
                  <div className="ed-about-stat">
                    <div className="ed-about-stat-num">
                      <AnimatedCounter value={data.years_experience || 8} suffix="+" />
                    </div>
                    <div className="ed-about-stat-label">Years</div>
                  </div>
                  <div className="ed-about-stat">
                    <div className="ed-about-stat-num">
                      <AnimatedCounter value={200} suffix="+" />
                    </div>
                    <div className="ed-about-stat-label">Hiring Partners</div>
                  </div>
                </div>
              </div>

              <div className="ed-about-right">
                <div className="ed-about-frame">
                  {data.profile_image ? (
                    <img src={`${uploadsBase}${data.profile_image}`} alt={institute} className="ed-about-img" />
                  ) : courses[0]?.image ? (
                    <img src={`${uploadsBase}${courses[0].image}`} alt={institute} className="ed-about-img" />
                  ) : (
                    <div className="ed-about-img-fallback">
                      <IconCode size={80} />
                    </div>
                  )}
                  <div className="ed-about-frame-tag">
                    <span className="ed-about-tag-dot" />
                    Est. {new Date().getFullYear() - (parseInt(data.years_experience) || 8)}
                  </div>
                </div>

                {data.director_name && (
                  <div className="ed-about-director">
                    <div className="ed-about-director-label">Director</div>
                    <div className="ed-about-director-name">{data.director_name}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ COURSES ============ */}
      {courses.length > 0 && (
        <section id="courses" className="ed-section ed-section-dark">
          <div className="ed-section-inner">
            <div className="ed-courses-head">
              <div>
                <div className="ed-section-eyebrow dark">
                  <span className="ed-eyebrow-line" /> Our Programs
                </div>
                <h2 className="ed-section-title dark">
                  <SplitText text="Courses built for" />
                  <br />
                  <span className="ed-title-accent">
                    <SplitText text="real careers." delay={0.3} />
                  </span>
                </h2>
              </div>
              <div className="ed-courses-head-right">
                <p className="ed-section-sub dark">
                  Industry-designed curriculum, taught by experts, focused on outcomes.
                </p>
              </div>
            </div>

            <div className="ed-courses-grid">
              {courses.map((c, i) => (
                <TiltCard key={i} className="ed-course-wrap">
                  <div className="ed-course-card">
                    <div className="ed-course-top">
                      <span className="ed-course-index">0{i + 1}</span>
                      {c.category && <span className="ed-course-cat">{c.category}</span>}
                    </div>
                    <h3 className="ed-course-name">{c.name || 'Course'}</h3>
                    {c.description && (
                      <p className="ed-course-desc">
                        {c.description.length > 140 ? c.description.slice(0, 140) + '...' : c.description}
                      </p>
                    )}
                    <div className="ed-course-tags">
                      {c.duration && <span className="ed-course-tag"><IconClock size={12} /> {c.duration}</span>}
                      {c.level && <span className="ed-course-tag"><IconBookOpen size={12} /> {c.level}</span>}
                      {c.mode && <span className="ed-course-tag"><IconUsers size={12} /> {c.mode}</span>}
                    </div>
                    <div className="ed-course-bottom">
                      <div className="ed-course-price">
                        <small>Fee</small>
                        <span>{c.price || '₹—'}</span>
                      </div>
                      {waLink && (
                        <a href={buildWhatsAppLink(
                          data.whatsapp || data.phone,
                          `Hi, I'm interested in the "${c.name}" course.`
                        )} target="_blank" rel="noreferrer" className="ed-course-btn">
                          Enroll <IconArrowNE size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FEATURES ============ */}
      <section id="features" className="ed-section ed-features">
        <div className="ed-section-inner">
          <div className="ed-features-head">
            <div className="ed-section-eyebrow">
              <span className="ed-eyebrow-line" /> Why Choose Us
            </div>
            <h2 className="ed-section-title">
              <SplitText text="Everything you need to" />
              <br />
              <span className="ed-title-accent">
                <SplitText text="succeed." delay={0.3} />
              </span>
            </h2>
          </div>

          <div className="ed-features-bento">
            {features.map((f, i) => {
              const Icon = featureIcons[i % featureIcons.length]
              const isLarge = i === 0 || i === 3
              return (
                <div key={i} className={`ed-feature-card ${isLarge ? 'large' : ''}`}>
                  <div className="ed-feature-head">
                    <div className="ed-feature-icon">
                      <Icon size={22} />
                    </div>
                    <span className="ed-feature-num">0{i + 1}</span>
                  </div>
                  <h3 className="ed-feature-title">{f.title}</h3>
                  <p className="ed-feature-desc">{f.description || f.desc}</p>
                  <div className="ed-feature-line" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ MENTORS ============ */}
      {mentors.length > 0 && (
        <section id="mentors" className="ed-section ed-section-dark">
          <div className="ed-section-inner">
            <div className="ed-mentors-head">
              <div className="ed-section-eyebrow dark">
                <span className="ed-eyebrow-line" /> Meet Your Mentors
              </div>
              <h2 className="ed-section-title dark">
                <SplitText text="Learn from those" />
                <br />
                <span className="ed-title-accent">
                  <SplitText text="who've done it." delay={0.3} />
                </span>
              </h2>
            </div>

            <div className="ed-mentors-grid">
              {mentors.map((m, i) => {
                const name = m.name || 'Mentor'
                const nameParts = name.trim().split(' ')
                const initials = nameParts.length > 1
                  ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                  : name.slice(0, 2).toUpperCase()

                return (
                  <div key={i} className="ed-mentor-card">
                    <div className="ed-mentor-img-wrap">
                      {m.image ? (
                        <img src={`${uploadsBase}${m.image}`} alt={name} className="ed-mentor-img" />
                      ) : (
                        <div className="ed-mentor-img-fallback">
                          <div className="ed-mentor-fallback-pattern" />
                          <div className="ed-mentor-fallback-initials">{initials}</div>
                          <div className="ed-mentor-fallback-glow" />
                        </div>
                      )}

                      {m.experience && (
                        <span className="ed-mentor-exp">
                          <span className="ed-mentor-exp-dot" />
                          {m.experience}
                        </span>
                      )}

                      <div className="ed-mentor-overlay" />
                    </div>

                    <div className="ed-mentor-body">
                      <div className="ed-mentor-name-row">
                        <h3 className="ed-mentor-name">{name}</h3>
                        {m.role && <span className="ed-mentor-role-pill">{m.role}</span>}
                      </div>
                      {m.expertise && (
                        <div className="ed-mentor-expertise">
                          <span className="ed-mentor-expertise-label">Expertise</span>
                          <span className="ed-mentor-expertise-value">{m.expertise}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ GALLERY ============ */}
      {gallery.length > 0 && (
        <section id="gallery" className="ed-section ed-gallery-section">
          <div className="ed-section-inner">
            <div className="ed-gallery-head">
              <div className="ed-section-eyebrow">
                <span className="ed-eyebrow-line" /> Campus Life
              </div>
              <h2 className="ed-section-title">
                <SplitText text="Life at" />
                <br />
                <span className="ed-title-accent">
                  <SplitText text="our academy." delay={0.3} />
                </span>
              </h2>
              <p className="ed-section-sub" style={{ marginTop: 18 }}>
                Classrooms, workshops, events, and the people who make it all happen.
              </p>
            </div>

            <div className="ed-gallery-grid">
              {gallery.slice(0, 8).map((url, i) => {
                const sizeClass =
                  i === 0 ? 'large' :
                  i === 3 ? 'wide' :
                  i === 5 ? 'tall' : ''
                return (
                  <div
                    key={i}
                    className={`ed-gallery-cell ${sizeClass}`}
                    onClick={() => setLightbox(`${uploadsBase}${url}`)}
                  >
                    <img src={`${uploadsBase}${url}`} alt={`Campus ${i + 1}`} />
                    <div className="ed-gallery-overlay">
                      <div className="ed-gallery-zoom">
                        <IconSparkle size={20} />
                      </div>
                      <div className="ed-gallery-index">0{i + 1}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ REVIEWS ============ */}
      <section id="reviews" className="ed-section ed-reviews">
        <div className="ed-section-inner">
          <div className="ed-reviews-head">
            <div className="ed-section-eyebrow">
              <span className="ed-eyebrow-line" /> Student Stories
            </div>
            <h2 className="ed-section-title">
              <SplitText text="Success, told by" />
              <br />
              <span className="ed-title-accent">
                <SplitText text="our students." delay={0.3} />
              </span>
            </h2>
          </div>

          <div className="ed-reviews-grid">
            {reviews.slice(0, 6).map((r, i) => (
              <div key={i} className="ed-review-card">
                <div className="ed-review-quote">"</div>
                <div className="ed-review-stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <IconStar key={s} size={14}
                      style={{ opacity: s < (r.rating || 5) ? 1 : 0.15 }} />
                  ))}
                </div>
                <p className="ed-review-text">{r.text}</p>
                <div className="ed-review-author">
                  <div className="ed-review-avatar">
                    {(r.student_name || 'A').charAt(0)}
                  </div>
                  <div>
                    <div className="ed-review-name">{r.student_name || 'Anonymous'}</div>
                    <div className="ed-review-course">{r.course || 'Student'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="ed-section ed-section-dark ed-contact-section">
        <div className="ed-section-inner">
          <div className="ed-contact-grid">
            <div className="ed-contact-left">
              <div className="ed-section-eyebrow dark">
                <span className="ed-eyebrow-line" /> Get in Touch
              </div>
              <h2 className="ed-section-title dark">
                <SplitText text="Your future" />
                <br />
                <span className="ed-title-accent">
                  <SplitText text="starts here." delay={0.3} />
                </span>
              </h2>

              <p className="ed-contact-desc">
                Talk to our counsellor for a free career guidance session. No commitment — just clarity.
              </p>

              <div className="ed-contact-cards">
                {data.phone && (
                  <a href={`tel:${data.phone}`} className="ed-contact-card">
                    <span className="ed-contact-icon"><IconPhone size={18} /></span>
                    <span className="ed-contact-text">
                      <small>Call</small>
                      <span>{data.phone}</span>
                    </span>
                  </a>
                )}
                {data.email && (
                  <a href={`mailto:${data.email}`} className="ed-contact-card">
                    <span className="ed-contact-icon"><IconEmail size={18} /></span>
                    <span className="ed-contact-text">
                      <small>Email</small>
                      <span>{data.email}</span>
                    </span>
                  </a>
                )}
                {data.address && (
                  <div className="ed-contact-card">
                    <span className="ed-contact-icon"><IconPin size={18} /></span>
                    <span className="ed-contact-text">
                      <small>Visit</small>
                      <span>{data.address}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <form className="ed-contact-form" onSubmit={submitEnquiry}>
              <div className="ed-form-head">
                <div className="ed-form-title">Book a Free Demo</div>
                <div className="ed-form-sub">Takes less than 30 seconds.</div>
              </div>

              <div className="ed-cf-row">
                <div className="ed-cf-field">
                  <label>Name</label>
                  <input type="text" value={enquiry.name}
                    onChange={e => setEnquiry({ ...enquiry, name: e.target.value })}
                    placeholder="Priya Sharma" required />
                </div>
                <div className="ed-cf-field">
                  <label>Phone</label>
                  <input type="tel" value={enquiry.phone}
                    onChange={e => setEnquiry({ ...enquiry, phone: e.target.value })}
                    placeholder="9876543210" required />
                </div>
              </div>

              <div className="ed-cf-field">
                <label>Course of Interest</label>
                <select value={enquiry.course}
                  onChange={e => setEnquiry({ ...enquiry, course: e.target.value })}>
                  <option value="">Select a course</option>
                  {courses.map((c, i) => (
                    <option key={i} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="ed-cf-field">
                <label>Message</label>
                <textarea rows={3} value={enquiry.message}
                  onChange={e => setEnquiry({ ...enquiry, message: e.target.value })}
                  placeholder="Tell us about your goals..." />
              </div>

              <button type="submit" className="ed-btn ed-btn-primary ed-btn-block">
                Send Enquiry <IconArrow size={15} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="ed-footer">
        {/* CTA Band */}
        <div className="ed-footer-cta">
          <div className="ed-footer-cta-inner">
            <div className="ed-footer-cta-left">
              <span className="ed-footer-cta-eyebrow">
                <span className="ed-footer-cta-dot" />
                Admission Open — Batch 2026
              </span>
              <h3 className="ed-footer-cta-title">
                Ready to start your <em>tech career?</em>
              </h3>
              <p className="ed-footer-cta-desc">
                Talk to our counsellor for a free career guidance session.
              </p>
            </div>
            <div className="ed-footer-cta-actions">
              {waLink && (
                <a href={waLink} target="_blank" rel="noreferrer" className="ed-footer-cta-btn primary">
                  <IconWhatsApp size={16} /> Enroll on WhatsApp
                </a>
              )}
              <button className="ed-footer-cta-btn ghost" onClick={() => scrollTo('courses')}>
                Browse Courses <IconArrow size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="ed-footer-marquee">
          <div className="ed-footer-marquee-track">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="ed-footer-marquee-item">
                {institute}
                <span className="ed-footer-marquee-sep"><IconSparkle size={11} /></span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="ed-footer-main">
          <div className="ed-footer-grid">

            {/* Column 1 — Brand */}
            <div className="ed-footer-col ed-footer-col-brand">
              <div className="ed-footer-brand-row">
                {data.logo ? (
                  <img src={`${uploadsBase}${data.logo}`} alt={institute} className="ed-footer-logo" />
                ) : (
                  <div className="ed-footer-mark">{initials}</div>
                )}
                <div className="ed-footer-brand-info">
                  <span className="ed-footer-name">{institute}</span>
                  <span className="ed-footer-tag">{data.tagline || 'Building careers through skills'}</span>
                </div>
              </div>

              {data.about && (
                <p className="ed-footer-about">
                  {data.about.length > 160 ? data.about.slice(0, 160) + '...' : data.about}
                </p>
              )}

              {socials.length > 0 && (
                <div className="ed-footer-socials">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer"
                      aria-label={s.label} className="ed-footer-social">
                      <s.Icon size={15} />
                    </a>
                  ))}
                  {waLink && (
                    <a href={waLink} target="_blank" rel="noreferrer"
                      aria-label="WhatsApp" className="ed-footer-social wa">
                      <IconWhatsApp size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Column 2 — Explore */}
            <div className="ed-footer-col">
              <h4 className="ed-footer-heading">
                <span className="ed-footer-heading-line" />
                Explore
              </h4>
              <ul className="ed-footer-list">
                {navLinks.map(l => (
                  <li key={l.id}>
                    <button className="ed-footer-link" onClick={() => scrollTo(l.id)}>
                      <span className="ed-footer-link-arrow">→</span>
                      <span>{l.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Courses */}
            {courses.length > 0 && (
              <div className="ed-footer-col">
                <h4 className="ed-footer-heading">
                  <span className="ed-footer-heading-line" />
                  Courses
                </h4>
                <ul className="ed-footer-list">
                  {courses.slice(0, 5).map((c, i) => (
                    <li key={i}>
                      <button className="ed-footer-link" onClick={() => scrollTo('courses')}>
                        <span className="ed-footer-link-arrow">→</span>
                        <span>{c.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 4 — Contact */}
            <div className="ed-footer-col">
              <h4 className="ed-footer-heading">
                <span className="ed-footer-heading-line" />
                Get in Touch
              </h4>
              <ul className="ed-footer-contact">
                {data.phone && (
                  <li>
                    <a href={`tel:${data.phone}`} className="ed-footer-contact-item">
                      <span className="ed-footer-contact-icon"><IconPhone size={14} /></span>
                      <span className="ed-footer-contact-text">{data.phone}</span>
                    </a>
                  </li>
                )}
                {data.email && (
                  <li>
                    <a href={`mailto:${data.email}`} className="ed-footer-contact-item">
                      <span className="ed-footer-contact-icon"><IconEmail size={14} /></span>
                      <span className="ed-footer-contact-text">{data.email}</span>
                    </a>
                  </li>
                )}
                {data.address && (
                  <li>
                    <span className="ed-footer-contact-item">
                      <span className="ed-footer-contact-icon"><IconPin size={14} /></span>
                      <span className="ed-footer-contact-text">{data.address}</span>
                    </span>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="ed-footer-bottom">
          <div className="ed-footer-bottom-inner">
            <div className="ed-footer-bottom-copy">
              <div className="ed-footer-bottom-line-1">
                © {new Date().getFullYear()}{' '}
                <span className="ed-footer-copy-brand">{institute}</span>
              </div>
              <div className="ed-footer-bottom-line-2">
                All Rights Reserved
                <span className="ed-footer-copy-sep">·</span>
                Crafted by{' '}
                <a href="https://qifawtechnologies.com/" target="_blank" rel="noreferrer"
                  className="ed-footer-credit-link">
                  Qifaw Technologies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ============ LIGHTBOX ============ */}
      {lightbox && (
        <div className="ed-lightbox" onClick={() => setLightbox(null)}>
          <button className="ed-lightbox-close" onClick={() => setLightbox(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img src={lightbox} alt="Preview" className="ed-lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}