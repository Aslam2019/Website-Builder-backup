import { useEffect, useState, useMemo, useRef } from 'react'
import { getUploadsBase } from './utils/constants'
import { buildWhatsAppLink } from './utils/whatsapp'
import useScrollReveal from './hooks/useScrollReveal'
import './photography.css'

/* ============ Hero fallback images ============ */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80',
]

/* ============ Icons ============ */
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
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
const IconCamera = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)
const IconAperture = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
    <line x1="9.69" y1="8" x2="21.17" y2="8" />
    <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
    <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
    <line x1="14.31" y1="16" x2="2.83" y2="16" />
    <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
  </svg>
)
const IconImage = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)
const IconStar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

/* ============ Animated Counter ============ */
function AnimatedCounter({ value, duration = 1800 }) {
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
            const eased = 1 - Math.pow(1 - p, 3)
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

  return <span ref={ref}>{count}</span>
}

/* ============================================================
   MAIN TEMPLATE
   ============================================================ */
export default function PhotographyTemplate({ data: propData, website }) {
  // ✅ 1. Window data or Prop data ah edukkanum
  const data = window.__SITE_DATA__ || propData || {};
  
  // ✅ 2. Uploads Base ah correct ah set pannanum
  const uploadsBase = window.__UPLOADS_BASE__ || getUploadsBase(data) || "https://d24e11dzjriy3b.cloudfront.net";

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [heroIndex, setHeroIndex] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const [booking, setBooking] = useState({ name: '', phone: '', service: '', date: '', message: '' })

  const portfolio = Array.isArray(data.portfolio) ? data.portfolio : []
  const services = Array.isArray(data.services) ? data.services : []
  const gallery = Array.isArray(data.gallery) ? data.gallery : []
  const reviews = Array.isArray(data.reviews) && data.reviews.length > 0
    ? data.reviews
    : [
        { client_name: 'Priya S.', rating: 5, text: 'Absolutely stunning work! Every photo captured the emotion perfectly.' },
        { client_name: 'Rahul M.', rating: 5, text: 'Professional, creative, and delivered ahead of schedule.' },
        { client_name: 'Anjali K.', rating: 5, text: 'Our wedding photos are breathtaking!' },
      ]

  const heroSlides = useMemo(() => {
    const imgs = [
      ...portfolio.map(p => p.image).filter(Boolean),
      ...gallery,
    ].map(img => `${uploadsBase}${img}`)
    if (imgs.length >= 2) return imgs.slice(0, 5)
    return HERO_IMAGES
  }, [portfolio, gallery, uploadsBase])

  useScrollReveal([data])

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
    const ids = ['home', 'about', 'portfolio', 'packages', 'why', 'reviews', 'gallery', 'contact']
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.3 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Lightbox ESC key */
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

  const studio = data.studio_name || data.photographer_name || website?.name || 'Lens Studio'
  const initials = studio.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const waLink = buildWhatsAppLink(
    data.whatsapp || data.phone,
    `Hi ${studio}, I'd like to enquire about a photoshoot.`
  )

  // ✅ Nav links always show aagum
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'packages', label: 'Packages' },
    { id: 'why', label: 'Why Us' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ]

  // ✅ Socials always show aagum (data illa na fallback '#' use pannum)
  const socials = [
    { url: data.social_instagram || '#', Icon: IconInstagram, label: 'Instagram' },
    { url: data.social_facebook || '#', Icon: IconFacebook, label: 'Facebook' },
  ]

  const whyItems = Array.isArray(data.why_us) && data.why_us.length > 0
    ? data.why_us
    : [
        { title: 'Creative Vision', description: "Every shot is composed with an artist's eye and story-driven approach." },
        { title: 'Professional Equipment', description: 'Top-tier cameras, lenses, and lighting for exceptional quality.' },
        { title: 'Fast Delivery', description: 'Edited photos delivered within 7 days of your shoot.' },
      ]

  const submitBooking = (e) => {
    e.preventDefault()
    const { name, phone, service, date, message } = booking
    if (!name || !phone) return
    const msg = `Hi ${studio}, I'd like to book a session.

Name: ${name}
Phone: ${phone}
Service: ${service || '—'}
Preferred Date: ${date || '—'}
${message ? `\nMessage: ${message}` : ''}`
    const link = buildWhatsAppLink(data.whatsapp || data.phone, msg)
    if (link) window.open(link, '_blank')
  }

  const heroWords = (data.tagline || 'Capturing Moments That Last Forever').split(' ')
  const accentWords = ['Moments', 'Forever', 'Stories', 'Story', 'Life', 'Last']

  return (
    <div className="ph-root">
      {/* ============ NAVBAR ============ */}
      <nav className={`ph-nav ${scrolled ? 'ph-nav-scrolled' : ''}`}>
        <div className="ph-nav-inner">
          <div className="ph-nav-logo" onClick={() => scrollTo('home')}>
            {data.logo ? (
              <img src={`${uploadsBase}${data.logo}`} alt={studio} className="ph-nav-logo-img" />
            ) : (
              <span className="ph-nav-logo-mark">{initials}</span>
            )}
            <span className="ph-nav-logo-text">{studio}</span>
          </div>

          <ul className="ph-nav-links">
            {navLinks.map(l => (
              <li key={l.id}>
                <button className={`ph-nav-link ${activeSection === l.id ? 'active' : ''}`}
                  onClick={() => scrollTo(l.id)}>{l.label}</button>
              </li>
            ))}
          </ul>

          <div className="ph-nav-socials">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer"
                aria-label={s.label} className="ph-nav-social">
                <s.Icon size={15} />
              </a>
            ))}
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="ph-nav-cta">
                Book Now <IconArrow size={13} />
              </a>
            )}
          </div>

          <button className={`ph-menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer OUTSIDE nav */}
      <div className={`ph-mobile-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div className={`ph-mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="ph-mobile-inner">
          {navLinks.map((l, i) => (
            <button key={l.id}
              className={`ph-mobile-link ${activeSection === l.id ? 'active' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => scrollTo(l.id)}>
              <span className="ph-mobile-num">0{i + 1}</span>{l.label}
            </button>
          ))}
          <div className="ph-mobile-divider" />
          {socials.length > 0 && (
            <div className="ph-mobile-socials">
              <div className="ph-mobile-socials-label">Follow Us</div>
              <div className="ph-mobile-socials-row">
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    aria-label={s.label} className="ph-mobile-social">
                    <s.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer"
              className="ph-mobile-cta" onClick={() => setMenuOpen(false)}>
              <IconWhatsApp size={16} /> Book on WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section id="home" className="ph-hero">
        <div className="ph-hero-slides">
          {heroSlides.map((src, i) => (
            <div key={i}
              className={`ph-hero-slide ${i === heroIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${src})` }} />
          ))}
          <div className="ph-hero-overlay" />
          <div className="ph-hero-grain" />
        </div>

        <div className="ph-hero-content">
          <div className="ph-hero-eyebrow ph-anim-fadeup">
            <span className="ph-hero-eyebrow-dot" />
            Professional Photography
          </div>

          <h1 className="ph-hero-title ph-anim-fadeup" style={{ animationDelay: '0.1s' }}>
            {heroWords.map((word, i) => {
              const clean = word.replace(/[^\w]/g, '')
              return (
                <span key={i} className="ph-word-wrap">
                  <span className="ph-word" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                    {accentWords.includes(clean) ? <em className="ph-hero-accent">{word}</em> : word}
                  </span>{' '}
                </span>
              )
            })}
          </h1>

          <p className="ph-hero-desc ph-anim-fadeup" style={{ animationDelay: '0.5s' }}>
            {data.about
              ? data.about.length > 180 ? data.about.slice(0, 180) + '...' : data.about
              : 'Turning fleeting moments into timeless memories through the art of photography.'}
          </p>

          <div className="ph-hero-actions ph-anim-fadeup" style={{ animationDelay: '0.7s' }}>
            <button className="ph-btn ph-btn-primary" onClick={() => scrollTo('portfolio')}>
              View Portfolio <IconArrow size={15} />
            </button>
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="ph-btn ph-btn-outline">
                <IconWhatsApp size={15} /> Book a Shoot
              </a>
            )}
          </div>

          <div className="ph-hero-stats ph-anim-fadeup" style={{ animationDelay: '0.9s' }}>
            <div className="ph-hero-stat">
              <div className="ph-hero-stat-num">
                <AnimatedCounter value={portfolio.length || 50} />+
              </div>
              <div className="ph-hero-stat-label">Portfolio Shots</div>
            </div>
            <div className="ph-hero-stat">
              <div className="ph-hero-stat-num">
                <AnimatedCounter value={data.years_experience || 8} />+
              </div>
              <div className="ph-hero-stat-label">Years Experience</div>
            </div>
            <div className="ph-hero-stat">
              <div className="ph-hero-stat-num">
                <AnimatedCounter value={data.happy_clients || 500} />+
              </div>
              <div className="ph-hero-stat-label">Happy Clients</div>
            </div>
          </div>
        </div>

        <div className="ph-hero-scroll">
          <span>Scroll</span>
          <div className="ph-hero-scroll-line" />
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      {data.about && (
        <section id="about" className="ph-section ph-section-alt">
          <div className="ph-section-inner">
            <div className="ph-about-wrap">
              <div className="ph-about-visual reveal">
                <div className="ph-about-visual-inner">
                  {data.profile_image ? (
                    <img src={`${uploadsBase}${data.profile_image}`} alt={studio} className="ph-about-visual-img" />
                  ) : portfolio[0]?.image ? (
                    <img src={`${uploadsBase}${portfolio[0].image}`} alt={studio} className="ph-about-visual-img" />
                  ) : (
                    <div className="ph-about-visual-fallback"><IconCamera size={80} /></div>
                  )}
                </div>
                <div className="ph-about-badge">
                  <div className="ph-about-badge-num">
                    <AnimatedCounter value={data.years_experience || 8} />+
                  </div>
                  <div className="ph-about-badge-label">Years Behind Lens</div>
                </div>
                <div className="ph-about-deco" />
              </div>

              <div className="ph-about-content reveal">
                <div className="ph-about-eyebrow">
                  <span className="ph-about-eyebrow-line" />
                  About the Photographer
                </div>
                <h2 className="ph-about-title">
                  {data.photographer_name || 'The Storyteller'} <em>Behind the Lens</em>
                </h2>
                <p className="ph-about-desc">{data.about_full || data.about}</p>

                <div className="ph-about-meta">
                  {data.speciality && (
                    <div className="ph-about-meta-item">
                      <div className="ph-about-meta-icon"><IconAperture size={18} /></div>
                      <div>
                        <div className="ph-about-meta-label">Speciality</div>
                        <div className="ph-about-meta-value">{data.speciality}</div>
                      </div>
                    </div>
                  )}
                  {data.working_hours && (
                    <div className="ph-about-meta-item">
                      <div className="ph-about-meta-icon"><IconCamera size={18} /></div>
                      <div>
                        <div className="ph-about-meta-label">Working Hours</div>
                        <div className="ph-about-meta-value">{data.working_hours}</div>
                      </div>
                    </div>
                  )}
                  {data.address && (
                    <div className="ph-about-meta-item">
                      <div className="ph-about-meta-icon"><IconPin size={18} /></div>
                      <div>
                        <div className="ph-about-meta-label">Studio</div>
                        <div className="ph-about-meta-value">{data.address}</div>
                      </div>
                    </div>
                  )}
                </div>

                {waLink && (
                  <a href={waLink} target="_blank" rel="noreferrer" className="ph-btn ph-btn-primary">
                    <IconWhatsApp size={15} /> Let's Talk
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ PORTFOLIO ============ */}
      {portfolio.length > 0 && (
        <section id="portfolio" className="ph-section">
          <div className="ph-section-inner">
            <div className="ph-section-head reveal">
              <div className="ph-section-eyebrow">Featured Work</div>
              <h2 className="ph-section-title">Our <em>Portfolio</em></h2>
              <p className="ph-section-sub">A curated selection of our favorite shoots and stories.</p>
            </div>

            <div className="ph-portfolio-grid">
              {portfolio.slice(0, 9).map((p, i) => (
                <div
                  key={i}
                  className={`ph-portfolio-item ${i === 0 || i === 5 ? 'large' : ''} reveal`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                  onClick={() => p.image && setLightbox(`${uploadsBase}${p.image}`)}
                >
                  {p.image ? (
                    <img src={`${uploadsBase}${p.image}`} alt={p.title} className="ph-portfolio-img" />
                  ) : (
                    <div className="ph-portfolio-placeholder"><IconImage size={60} /></div>
                  )}
                  {p.category && <span className="ph-portfolio-cat">{p.category}</span>}
                  <div className="ph-portfolio-overlay">
                    <div className="ph-portfolio-info">
                      <div className="ph-portfolio-title">{p.title || 'Untitled'}</div>
                      {p.description && (
                        <div className="ph-portfolio-sub">{p.description.slice(0, 60)}</div>
                      )}
                    </div>
                  </div>
                  <div className="ph-portfolio
