import { useEffect, useState, useMemo } from 'react'
import { getUploadsBase } from './utils/constants'
import { buildWhatsAppLink } from './utils/whatsapp'
import useScrollReveal from './hooks/useScrollReveal'
import './realestate.css'

/* ============ Hero fallback images ============ */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80',
]

/* ============ Icons ============ */
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
const IconBed = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
    <path d="M2 12V6a2 2 0 0 1 2-2h6v8" /><path d="M22 12V6a2 2 0 0 0-2-2h-6v8" />
  </svg>
)
const IconArea = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
)
const IconCalendar = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
/* Why Choose Us icons */
const IconShieldCheck = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)
const IconUsers = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconStar = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconTag = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)
const IconClock = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
  </svg>
)
const IconHeadset = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)
/* Social */
const IconFacebook = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  </svg>
)
const IconInstagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.39C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.12.66.66 1.33 1.08 2.12 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.12-1.39.66-.66 1.08-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.39-2.12a5.9 5.9 0 0 0-2.12-1.39c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
  </svg>
)

/* ============================================================
   ICON MAP for dynamic features
   ============================================================ */
const ICON_MAP = {
  'Shield Check': IconShieldCheck,
  'Users': IconUsers,
  'Star': IconStar,
  'Tag': IconTag,
  'Clock': IconClock,
  'Headset': IconHeadset,
  'Home': IconStar,
  'Building': IconStar,
  'Award': IconStar,
  'Thumbs Up': IconShieldCheck,
  'Map': IconPin,
  'Trending Up': IconStar,
}

/* ============================================================
   MAIN TEMPLATE
   ============================================================ */
export default function RealEstateTemplate({ data, website }) {
  const uploadsBase = getUploadsBase(data)

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [filter, setFilter] = useState('all')
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [heroIndex, setHeroIndex] = useState(0)

  const properties = Array.isArray(data.properties) ? data.properties : []

  const heroSlides = useMemo(() => {
    const uploaded = properties
      .map((p) => p.image)
      .filter(Boolean)
      .map((img) => `${uploadsBase}${img}`)
    if (uploaded.length >= 2) return uploaded
    return HERO_IMAGES
  }, [properties, uploadsBase])

  useScrollReveal([data])

  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(t)
  }, [heroSlides.length])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['home', 'about', 'why', 'properties', 'contact']
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

  const company = data.company_name || website?.name || 'Real Estate Co.'
  const initials = company.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const waLink = buildWhatsAppLink(
    data.whatsapp || data.phone,
    `Hi ${company}, I'm interested in your properties.`
  )

  // ✅ Static Nav Links
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'why', label: 'Why Choose Us' },
    { id: 'properties', label: 'Property' },
    { id: 'contact', label: 'Contact' },
  ]

  // ✅ Static Socials
  const socials = [
    { url: data.social_facebook || '#', Icon: IconFacebook, label: 'Facebook' },
    { url: data.social_instagram || '#', Icon: IconInstagram, label: 'Instagram' },
  ]

  const defaultFeatures = [
    { Icon: IconShieldCheck, title: 'Trusted & Verified', desc: 'All properties are legally verified with clear titles and documentation.' },
    { Icon: IconUsers, title: 'Expert Team', desc: 'Experienced agents who understand your needs and guide you at every step.' },
    { Icon: IconStar, title: 'Premium Listings', desc: 'Handpicked premium properties in the most desirable locations.' },
    { Icon: IconTag, title: 'Best Price Guarantee', desc: 'Transparent pricing with no hidden charges — always fair deals.' },
    { Icon: IconClock, title: 'Quick Closures', desc: 'Fast and hassle-free buying process with complete legal support.' },
    { Icon: IconHeadset, title: '24/7 Support', desc: 'Dedicated customer support ready to assist you anytime.' },
  ]

  const features = (Array.isArray(data.features) && data.features.length > 0)
    ? data.features
        .filter((f) => f.title)
        .map((f) => ({
          Icon: ICON_MAP[f.icon] || IconShieldCheck,
          title: f.title,
          desc: f.description || '',
        }))
    : defaultFeatures

  // ✅ For Footer Types
  const footerTypes = ['villa', 'apartment', 'plot', 'commercial']

  const visibleProperties = filter === 'all'
    ? properties
    : properties.filter((p) => (p.type || '').toLowerCase() === filter)

  const heroTitleWords = (data.tagline || 'Find Your Dream Home In Just One Visit').split(' ')
  const highlightWords = ['Dream', 'Home', 'Property', 'Properties', 'Trusted']

  const sendContact = (e) => {
    e.preventDefault()
    const { name: cn, email: ce, message: cm } = contactForm
    if (!cn || !ce || !cm) return
    const msg = `Hi ${company},\n\nMy name is ${cn} (${ce}).\n\n${cm}`
    const link = buildWhatsAppLink(data.whatsapp || data.phone, msg)
    if (link) window.open(link, '_blank')
  }

  return (
    <div className="re-root">
      {/* ============ NAVBAR ============ */}
      <nav className={`re-nav ${scrolled ? 're-nav-scrolled' : ''}`}>
        <div className="re-nav-inner">
          <div className="re-nav-logo" onClick={() => scrollTo('home')}>
            {data.logo ? (
              <img src={`${uploadsBase}${data.logo}`} alt={company} className="re-nav-logo-img" />
            ) : (
              <span className="re-nav-logo-mark">{initials}</span>
            )}
            <span className="re-nav-logo-text">{company}</span>
          </div>

          <ul className="re-nav-links">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button className={`re-nav-link ${activeSection === l.id ? 'active' : ''}`}
                  onClick={() => scrollTo(l.id)}>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="re-nav-socials">
            {socials.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer"
                aria-label={s.label} className="re-nav-social">
                <s.Icon size={15} />
              </a>
            ))}
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="re-nav-cta">
                Get in Touch <IconArrow size={13} />
              </a>
            )}
          </div>

          <button className={`re-menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Drawer and Backdrop moved OUTSIDE the <nav> tag */}
      <div
        className={`re-mobile-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className={`re-mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="re-mobile-inner">
          {navLinks.map((l, i) => (
            <button key={l.id} className={`re-mobile-link ${activeSection === l.id ? 'active' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => scrollTo(l.id)}>
              <span className="re-mobile-num">0{i + 1}</span>{l.label}
            </button>
          ))}

          <div className="re-mobile-divider" />

          {socials.length > 0 && (
            <div className="re-mobile-socials">
              <div className="re-mobile-socials-label">Follow Us</div>
              <div className="re-mobile-socials-row">
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    aria-label={s.label} className="re-mobile-social">
                    <s.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer"
              className="re-mobile-cta" onClick={() => setMenuOpen(false)}>
              <IconWhatsApp size={16} /> Chat on WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section id="home" className="re-hero">
        <div className="re-hero-slides">
          {heroSlides.map((src, i) => (
            <div key={i}
              className={`re-hero-slide ${i === heroIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${src})` }} />
          ))}
          <div className="re-hero-overlay" />
        </div>

        <div className="re-hero-content">
          <div className="re-hero-eyebrow reveal">
            <span className="re-hero-dot" /> Trusted Real Estate Partner
          </div>

          <h1 className="re-hero-title reveal">
            {heroTitleWords.map((word, i) => {
              const clean = word.replace(/[^\w]/g, '')
              const isHighlight = highlightWords.includes(clean)
              return (
                <span key={i}>
                  {isHighlight ? (
                    <span className="re-gradient">{word} </span>
                  ) : (
                    <>{word} </>
                  )}
                </span>
              )
            })}
          </h1>

          <p className="re-hero-desc reveal">
            {data.about
              ? data.about.length > 200 ? data.about.slice(0, 200) + '...' : data.about
              : 'Premium properties in prime locations — handpicked for you.'}
          </p>

          <div className="re-hero-actions reveal">
            <button className="re-btn re-btn-primary" onClick={() => scrollTo('properties')}>
              Browse Properties <IconArrow size={15} />
            </button>
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="re-btn re-btn-outline">
                <IconWhatsApp size={15} /> WhatsApp Now
              </a>
            )}
          </div>

          <div className="re-hero-dots reveal">
            {heroSlides.map((_, i) => (
              <button key={i}
                className={`re-hero-dot-btn ${i === heroIndex ? 'active' : ''}`}
                onClick={() => setHeroIndex(i)}
                aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="re-hero-strip">
          <div className="re-hero-strip-inner">
            <div className="re-stat">
              <div className="re-stat-value">{properties.length}+</div>
              <div className="re-stat-label">Properties</div>
            </div>
            <div className="re-stat-divider" />
            <div className="re-stat">
              <div className="re-stat-value">{data.years_experience || 10}+</div>
              <div className="re-stat-label">Years Experience</div>
            </div>
            <div className="re-stat-divider" />
            <div className="re-stat">
              <div className="re-stat-value">{data.happy_clients || 500}+</div>
              <div className="re-stat-label">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT — Premium Split Layout ============ */}
      {data.about && (
        <section id="about" className="re-section">
          <div className="re-section-inner">
            <div className="re-section-head reveal">
              <span className="re-eyebrow">About Company</span>
              <h2 className="re-section-title">Who We Are</h2>
              <div className="re-section-line" />
            </div>

            <div className="re-about-wrap">
              {/* LEFT — Visual / Stats */}
              <div className="re-about-left reveal">
                <div className="re-about-visual">
                  {properties[0]?.image ? (
                    <img
                      src={`${uploadsBase}${properties[0].image}`}
                      alt={company}
                      className="re-about-visual-img"
                    />
                  ) : (
                    <div className="re-about-visual-img re-about-visual-fallback">
                      <svg width="70" height="70" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H10v7H4a1 1 0 0 1-1-1V9.5z" />
                      </svg>
                    </div>
                  )}

                  <div className="re-about-float">
                    <div className="re-about-float-num">
                      {data.years_experience || 10}+
                    </div>
                    <div className="re-about-float-label">
                      Years of Excellence
                    </div>
                  </div>

                  <div className="re-about-badge">
                    <span className="re-about-badge-dot" />
                    Trusted Since
                  </div>
                </div>

                <div className="re-about-mini-stats">
                  <div className="re-about-mini">
                    <div className="re-about-mini-num">{properties.length}+</div>
                    <div className="re-about-mini-label">Properties</div>
                  </div>
                  <div className="re-about-mini">
                    <div className="re-about-mini-num">
                      {data.happy_clients || 500}+
                    </div>
                    <div className="re-about-mini-label">Happy Clients</div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Content */}
              <div className="re-about-right reveal">
                <div className="re-about-tagline">
                  <span className="re-about-tagline-mark" />
                  ABOUT US
                </div>

                <h3 className="re-about-heading">
                  Building Trust Through{' '}
                  <span className="re-about-heading-accent">Every Property</span>
                </h3>

                <p className="re-about-text">
                  {data.about_full || data.about}
                </p>

                <div className="re-about-meta">
                  {data.address && (
                    <div className="re-about-meta-item">
                      <div className="re-about-meta-icon">
                        <IconPin size={20} />
                      </div>
                      <div className="re-about-meta-content">
                        <div className="re-about-meta-label">Office</div>
                        <div className="re-about-meta-value">{data.address}</div>
                      </div>
                    </div>
                  )}
                  {data.phone && (
                    <div className="re-about-meta-item">
                      <div className="re-about-meta-icon">
                        <IconPhone size={20} />
                      </div>
                      <div className="re-about-meta-content">
                        <div className="re-about-meta-label">Phone</div>
                        <div className="re-about-meta-value">{data.phone}</div>
                      </div>
                    </div>
                  )}
                  {data.email && (
                    <div className="re-about-meta-item">
                      <div className="re-about-meta-icon">
                        <IconEmail size={20} />
                      </div>
                      <div className="re-about-meta-content">
                        <div className="re-about-meta-label">Email</div>
                        <div className="re-about-meta-value">{data.email}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="re-about-actions">
                  <button className="re-btn re-btn-primary" onClick={() => scrollTo('properties')}>
                    View Properties <IconArrow size={15} />
                  </button>
                  {waLink && (
                    <a href={waLink} target="_blank" rel="noreferrer" className="re-btn re-btn-outline">
                      <IconWhatsApp size={15} /> Talk to Us
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ WHY CHOOSE US ============ */}
      <section id="why" className="re-section re-section-alt">
        <div className="re-section-inner">
          <div className="re-section-head reveal">
            <span className="re-eyebrow">Why Choose Us</span>
            <h2 className="re-section-title">What Sets Us Apart</h2>
            <div className="re-section-line" />
          </div>

          <div className="re-why-grid">
            {features.map((f, i) => (
              <div key={i} className="re-why-card reveal"
                style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="re-why-icon">
                  <f.Icon size={24} />
                </div>
                <h3 className="re-why-title">{f.title}</h3>
                <p className="re-why-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROPERTIES ============ */}
      {properties.length > 0 && (
        <section id="properties" className="re-section">
          <div className="re-section-inner">
            <div className="re-section-head reveal">
              <span className="re-eyebrow">Featured Listings</span>
              <h2 className="re-section-title">Discover Our Properties</h2>
              <div className="re-section-line" />
            </div>

            {/* ✅ FIX: Hardcoded Filters (Plot guaranteed to show) */}
            <div className="re-filters reveal">
              {['all', 'villa', 'apartment', 'plot', 'commercial'].map((t) => (
                <button key={t}
                  className={`re-filter-btn ${filter === t ? 'active' : ''}`}
                  onClick={() => setFilter(t)}>
                  {t === 'all' ? 'All Properties' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="re-properties-grid">
              {visibleProperties.map((p, i) => (
                <article key={i} className="re-property reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="re-property-img-wrap">
                    {p.image ? (
                      <img src={`${uploadsBase}${p.image}`} alt={p.name} className="re-property-img" />
                    ) : (
                      <div className="re-property-placeholder">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H10v7H4a1 1 0 0 1-1-1V9.5z" />
                        </svg>
                      </div>
                    )}
                    {p.type && <span className="re-property-type">{p.type}</span>}
                    {p.price && <span className="re-property-price">{p.price}</span>}
                  </div>

                  <div className="re-property-body">
                    <h3 className="re-property-name">{p.name || 'Untitled Property'}</h3>
                    {p.location && (
                      <div className="re-property-location">
                        <IconPin size={13} /> {p.location}
                      </div>
                    )}

                    {(p.beds || p.area || p.status) && (
                      <div className="re-property-meta">
                        {p.beds && <span><IconBed size={13} /> {p.beds}</span>}
                        {p.area && <span><IconArea size={13} /> {p.area}</span>}
                        {p.status && <span><IconCalendar size={13} /> {p.status}</span>}
                      </div>
                    )}

                    {p.description && (
                      <p className="re-property-desc">{p.description}</p>
                    )}
                    <div className="re-property-footer">
                      {waLink && (
                        <a href={buildWhatsAppLink(
                          data.whatsapp || data.phone,
                          `Hi, I'm interested in "${p.name}" (${p.price || ''}). Please share more details.`
                        )}
                          target="_blank" rel="noreferrer"
                          className="re-property-cta">
                          <IconWhatsApp size={14} /> Enquire Now
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}

              {visibleProperties.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  No properties found for this category.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============ CONTACT ============ */}
      <section id="contact" className="re-section re-section-alt">
        <div className="re-section-inner">
          <div className="re-section-head reveal">
            <span className="re-eyebrow">Get in Touch</span>
            <h2 className="re-section-title">Let's Talk Property</h2>
            <div className="re-section-line" />
          </div>

          <div className="re-contact-wrap">
            <div className="re-contact-info reveal">
              {data.phone && (
                <a href={`tel:${data.phone}`} className="re-contact-card">
                  <div className="re-contact-icon"><IconPhone /></div>
                  <div>
                    <div className="re-contact-label">Phone</div>
                    <div className="re-contact-value">{data.phone}</div>
                  </div>
                </a>
              )}
              {data.email && (
                <a href={`mailto:${data.email}`} className="re-contact-card">
                  <div className="re-contact-icon"><IconEmail /></div>
                  <div>
                    <div className="re-contact-label">Email</div>
                    <div className="re-contact-value">{data.email}</div>
                  </div>
                </a>
              )}
              {data.address && (
                <div className="re-contact-card">
                  <div className="re-contact-icon"><IconPin size={18} /></div>
                  <div>
                    <div className="re-contact-label">Office</div>
                    <div className="re-contact-value">{data.address}</div>
                  </div>
                </div>
              )}
              {waLink && (
                <a href={waLink} target="_blank" rel="noreferrer"
                  className="re-contact-card re-contact-card-wa">
                  <div className="re-contact-icon re-contact-icon-wa"><IconWhatsApp /></div>
                  <div>
                    <div className="re-contact-label">WhatsApp</div>
                    <div className="re-contact-value">{data.whatsapp || data.phone}</div>
                  </div>
                </a>
              )}
            </div>

            <form className="re-contact-form reveal" onSubmit={sendContact}>
              <h3 className="re-form-title">Send a Message</h3>
              <p className="re-form-sub">Fill the form — it opens WhatsApp instantly.</p>

              <div className="re-cf-field">
                <label>Your Name</label>
                <input type="text" value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Ravi Kumar" required />
              </div>
              <div className="re-cf-field">
                <label>Email</label>
                <input type="email" value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="you@example.com" required />
              </div>
              <div className="re-cf-field">
                <label>Message</label>
                <textarea rows={4} value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="I'm interested in..." required />
              </div>

              <button type="submit" className="re-btn re-btn-primary re-btn-block">
                <IconWhatsApp size={16} /> Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="re-footer">
        <div className="re-footer-main">
          <div className="re-footer-grid">
            <div className="re-footer-col re-footer-col-brand">
              <div className="re-footer-brand">
                {data.logo ? (
                  <img src={`${uploadsBase}${data.logo}`} alt={company} className="re-footer-logo" />
                ) : (
                  <div className="re-footer-mark">{initials}</div>
                )}
                <div className="re-footer-brand-text">
                  <div className="re-footer-name">{company}</div>
                  <div className="re-footer-role">Trusted Real Estate Partner</div>
                </div>
              </div>
              {data.about && (
                <p className="re-footer-desc">
                  {data.about.length > 140 ? data.about.slice(0, 140) + '...' : data.about}
                </p>
              )}
              {socials.length > 0 && (
                <div className="re-footer-social">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}>
                      <s.Icon size={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="re-footer-col">
              <h4 className="re-footer-h">Quick Links</h4>
              <ul className="re-footer-list">
                {navLinks.map((l) => (
                  <li key={l.id}>
                    <button onClick={() => scrollTo(l.id)} className="re-footer-link-btn">
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="re-footer-col">
              <h4 className="re-footer-h">Property Types</h4>
              <ul className="re-footer-list">
                {footerTypes.map((t) => (
                  <li key={t}>
                    <button className="re-footer-link-btn"
                      onClick={() => { setFilter(t); scrollTo('properties') }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="re-footer-col">
              <h4 className="re-footer-h">Get in Touch</h4>
              <ul className="re-footer-list re-footer-contact-list">
                {data.phone && (
                  <li><a href={`tel:${data.phone}`} className="re-footer-contact-item">
                    <IconPhone size={15} /> <span>{data.phone}</span>
                  </a></li>
                )}
                {data.email && (
                  <li><a href={`mailto:${data.email}`} className="re-footer-contact-item">
                    <IconEmail size={15} /> <span>{data.email}</span>
                  </a></li>
                )}
                {data.address && (
                  <li><span className="re-footer-contact-item">
                    <IconPin size={15} /> <span>{data.address}</span>
                  </span></li>
                )}
                {waLink && (
                  <li><a href={waLink} target="_blank" rel="noreferrer"
                    className="re-footer-contact-item re-footer-contact-wa">
                    <IconWhatsApp size={15} /> <span>Chat on WhatsApp</span>
                  </a></li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="re-footer-bottom">
          <div className="re-footer-bottom-inner">
            <div className="re-footer-copy">
              © {new Date().getFullYear()} {company}. All Rights Reserved.
            </div>
            <div className="re-footer-credit">
              Crafted with care · Powered by{' '}
              <a href="https://qifawtechnologies.com/" target="_blank"
                rel="noreferrer" className="re-footer-credit-link">
                Qifaw Technologies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}