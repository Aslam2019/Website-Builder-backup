import { useEffect, useState, useRef } from 'react'
import { getUploadsBase } from './utils/constants'
import { buildWhatsAppLink } from './utils/whatsapp'
import './gym.css'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1920&q=80',
]

const STUDIO_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=1200&q=80',
]

/* ========== ARROWS & UTILITY ========== */
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconArrowNE = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
)
const IconChevronRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

/* ========== MENU ICONS ========== */
const IconHome = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconUser = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconDumbbell = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="9" width="3" height="6" rx="1" />
    <rect x="19" y="9" width="3" height="6" rx="1" />
    <rect x="5" y="10" width="2" height="4" rx="0.5" />
    <rect x="17" y="10" width="2" height="4" rx="0.5" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
)
const IconUsers = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconCard = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)
const IconQuote = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
)
const IconMail = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)

/* ========== OTHER ICONS ========== */
const IconPin = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const IconPhone = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconEmail = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
  </svg>
)
const IconStar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

export default function GymTemplate({ data, website }) {
  // ✅ Get uploads base from config
  const uploadsBase = getUploadsBase(data)

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [heroIndex, setHeroIndex] = useState(0)
  const [join, setJoin] = useState({
    name: '', phone: '', plan: '', goal: '', message: ''
  })

  const programs = Array.isArray(data.programs) ? data.programs : []
  const trainers = Array.isArray(data.trainers) ? data.trainers : []
  const plans = Array.isArray(data.plans) ? data.plans : []
  const rawGallery = Array.isArray(data.gallery) ? data.gallery.filter(Boolean) : []

  const gallery = rawGallery.length > 0
    ? rawGallery.map(img => `${uploadsBase}${img}`)
    : STUDIO_IMAGES

  const features = Array.isArray(data.features) && data.features.length > 0
    ? data.features
    : [
        { title: 'Certified Coaches', description: 'Every trainer is professionally certified and continuously trained.' },
        { title: 'Personalized Programs', description: 'Custom workout plans tailored to your body and goals.' },
        { title: 'Premium Equipment', description: 'Top-tier machines maintained daily for the best experience.' },
        { title: 'Nutrition Guidance', description: 'Meal plans designed by nutritionists to fuel your progress.' },
      ]
  const reviews = Array.isArray(data.reviews) && data.reviews.length > 0
    ? data.reviews
    : [
        { member_name: 'Priya S.', plan: 'Pro Member', rating: 5, text: 'The most professional gym I\'ve been to. Trainers really know their craft.' },
        { member_name: 'Rahul M.', plan: 'Elite Member', rating: 5, text: 'Lost 15kg in 5 months. The personalized program made all the difference.' },
        { member_name: 'Anjali K.', plan: 'Pro Member', rating: 5, text: 'Beautiful studio, incredible energy, and results that speak for themselves.' },
      ]

  const heroSlides = gallery.length >= 2 ? gallery.slice(0, 3) : HERO_IMAGES

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
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  const gym = data.gym_name || data.director_name || website?.name || 'Vitality Studio'
  const initials = gym.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const waLink = buildWhatsAppLink(
    data.whatsapp || data.phone,
    `Hi ${gym}, I'd like to join your gym.`
  )

  const navLinks = [
    { id: 'home', label: 'Home', Icon: IconHome },
    data.about && { id: 'about', label: 'About', Icon: IconUser },
    programs.length > 0 && { id: 'programs', label: 'Programs', Icon: IconDumbbell },
    trainers.length > 0 && { id: 'trainers', label: 'Coaches', Icon: IconUsers },
    plans.length > 0 && { id: 'plans', label: 'Membership', Icon: IconCard },
    { id: 'reviews', label: 'Stories', Icon: IconQuote },
    { id: 'contact', label: 'Contact', Icon: IconMail },
  ].filter(Boolean)

  const socials = [
    data.social_instagram && { url: data.social_instagram, Icon: IconInstagram, label: 'Instagram' },
    data.social_facebook && { url: data.social_facebook, Icon: IconFacebook, label: 'Facebook' },
  ].filter(Boolean)

  const submitJoin = (e) => {
    e.preventDefault()
    const { name, phone, plan, goal, message } = join
    if (!name || !phone) return
    const msg = `Hi ${gym}, I'd like to join.

Name: ${name}
Phone: ${phone}
Plan: ${plan || '—'}
Goal: ${goal || '—'}
${message ? `\nMessage: ${message}` : ''}`
    const link = buildWhatsAppLink(data.whatsapp || data.phone, msg)
    if (link) window.open(link, '_blank')
  }

  const tagline = data.tagline || 'Strength, refined.'

  return (
    <div className="gy-root">
      {/* ============ NAVBAR ============ */}
      <nav className={`gy-nav ${scrolled ? 'gy-nav-scrolled' : ''}`}>
        <div className="gy-nav-inner">
          <div className="gy-nav-logo" onClick={() => scrollTo('home')}>
            {data.logo ? (
              <img src={`${uploadsBase}${data.logo}`} alt={gym} className="gy-nav-logo-img" />
            ) : (
              <span className="gy-nav-logo-mark">{initials}</span>
            )}
            <span className="gy-nav-logo-text">{gym}</span>
          </div>

          <ul className="gy-nav-links">
            {navLinks.map(l => (
              <li key={l.id}>
                <button className="gy-nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
              </li>
            ))}
          </ul>

          <div className="gy-nav-right">
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="gy-nav-cta">
                Book a Trial <IconArrow size={13} />
              </a>
            )}
          </div>

          <button className={`gy-menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ============ MOBILE DRAWER ============ */}
      <div className={`gy-mobile-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)} aria-hidden="true" />

      <div className={`gy-mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="gy-mobile-header">
          <div className="gy-mobile-header-logo">
            <span className="gy-mobile-header-mark">{initials}</span>
            <span className="gy-mobile-header-name">{gym}</span>
          </div>
          <button className="gy-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="gy-mobile-inner">
          <nav className="gy-mobile-nav">
            {navLinks.map((l, i) => (
              <button key={l.id}
                className="gy-mobile-link"
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => scrollTo(l.id)}>
                <span className="gy-mobile-link-icon">
                  <l.Icon size={17} />
                </span>
                <span className="gy-mobile-link-label">{l.label}</span>
                <span className="gy-mobile-link-arrow">
                  <IconChevronRight size={13} />
                </span>
              </button>
            ))}
          </nav>

          {socials.length > 0 && (
            <div className="gy-mobile-socials">
              <div className="gy-mobile-socials-label">Follow</div>
              <div className="gy-mobile-socials-row">
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                    aria-label={s.label} className="gy-mobile-social">
                    <s.Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {waLink && (
          <div className="gy-mobile-footer">
            <a href={waLink} target="_blank" rel="noreferrer"
              className="gy-mobile-cta" onClick={() => setMenuOpen(false)}>
              <IconWhatsApp size={15} /> Book a Free Trial
            </a>
          </div>
        )}
      </div>

      {/* ============ HERO ============ */}
      <section id="home" className="gy-hero">
        <div className="gy-hero-bg">
          {heroSlides.map((src, i) => (
            <div key={i}
              className={`gy-hero-slide ${i === heroIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${src})` }} />
          ))}
          <div className="gy-hero-overlay" />
        </div>

        <div className="gy-hero-side-left">
          <span>Est. {new Date().getFullYear() - (parseInt(data.years_experience) || 10)}</span>
          <div className="gy-hero-side-line" />
          <span>Movement Studio</span>
        </div>

        <div className="gy-hero-side-right">
          <span>Scroll</span>
          <div className="gy-hero-side-arrow">↓</div>
        </div>

        <div className="gy-hero-inner">
          <div className="gy-hero-eyebrow">
            <span className="gy-hero-eyebrow-dot" />
            A refined approach to training
          </div>

          <h1 className="gy-hero-title">
            {tagline.split(' ').map((word, i) => (
              <span key={i} className="gy-hero-word">
                <span className="gy-hero-word-inner" style={{ animationDelay: `${0.4 + i * 0.12}s` }}>
                  {word}
                </span>{' '}
              </span>
            ))}
          </h1>

          <div className="gy-hero-bottom">
            <p className="gy-hero-desc">
              {data.about
                ? data.about.length > 220 ? data.about.slice(0, 220) + '...' : data.about
                : 'A thoughtful space for people who value precision over noise. Expert coaching, considered programming, and an environment built for lasting progress.'}
            </p>

            <div className="gy-hero-actions">
              <button className="gy-btn gy-btn-primary" onClick={() => scrollTo('plans')}>
                Membership <IconArrow size={14} />
              </button>
              {waLink && (
                <a href={waLink} target="_blank" rel="noreferrer" className="gy-btn gy-btn-ghost">
                  Free Trial
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="gy-hero-strip">
          <div className="gy-hero-strip-inner">
            <div className="gy-hero-stat">
              <div className="gy-hero-stat-num">
                <Counter value={data.total_members || 1500} suffix="+" />
              </div>
              <div className="gy-hero-stat-label">Members</div>
            </div>
            <div className="gy-hero-stat-sep" />
            <div className="gy-hero-stat">
              <div className="gy-hero-stat-num">
                <Counter value={data.total_trainers || 15} suffix="+" />
              </div>
              <div className="gy-hero-stat-label">Coaches</div>
            </div>
            <div className="gy-hero-stat-sep" />
            <div className="gy-hero-stat">
              <div className="gy-hero-stat-num">
                <Counter value={data.years_experience || 10} suffix="+" />
              </div>
              <div className="gy-hero-stat-label">Years</div>
            </div>
            <div className="gy-hero-stat-sep" />
            <div className="gy-hero-stat">
              <div className="gy-hero-stat-num">4.9</div>
              <div className="gy-hero-stat-label">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="gy-marquee">
        <div className="gy-marquee-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="gy-marquee-item">
              Discipline · Strength · Precision · Consistency
              <span className="gy-marquee-sep">✻</span>
            </span>
          ))}
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      {data.about && (
        <section id="about" className="gy-section gy-about">
          <div className="gy-section-inner">
            <div className="gy-about-head">
              <div className="gy-section-eyebrow">
                <span className="gy-section-eyebrow-line" />
                About
              </div>
              <h2 className="gy-section-title">
                Not just a gym.<br />
                <em>A practice.</em>
              </h2>
            </div>

            <div className="gy-about-grid">
              <div className="gy-about-visual">
                <div className="gy-about-visual-img">
                  {data.profile_image ? (
                    <img src={`${uploadsBase}${data.profile_image}`} alt={gym} />
                  ) : trainers[0]?.image ? (
                    <img src={`${uploadsBase}${trainers[0].image}`} alt={gym} />
                  ) : (
                    <img src={STUDIO_IMAGES[0]} alt={gym} />
                  )}
                </div>
                <div className="gy-about-badge">
                  <div className="gy-about-badge-num">
                    <Counter value={data.years_experience || 10} suffix="+" />
                  </div>
                  <div className="gy-about-badge-label">Years crafting<br />stronger bodies</div>
                </div>
              </div>

              <div className="gy-about-content">
                <p className="gy-about-text">{data.about_full || data.about}</p>

                <div className="gy-about-list">
                  {[
                    'Personalized programming',
                    'Small group sessions',
                    'Certified expert coaches',
                    'Holistic wellness approach',
                  ].map((p, i) => (
                    <div key={i} className="gy-about-item">
                      <div className="gy-about-item-num">0{i + 1}</div>
                      <div className="gy-about-item-text">{p}</div>
                      <div className="gy-about-item-icon">
                        <IconCheck size={11} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="gy-about-meta">
                  {data.director_name && (
                    <div className="gy-about-meta-item">
                      <div className="gy-about-meta-label">Head Coach</div>
                      <div className="gy-about-meta-value">{data.director_name}</div>
                    </div>
                  )}
                  {data.working_hours && (
                    <div className="gy-about-meta-item">
                      <div className="gy-about-meta-label">Studio Hours</div>
                      <div className="gy-about-meta-value">{data.working_hours}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ PROGRAMS ============ */}
      {programs.length > 0 && (
        <section id="programs" className="gy-section gy-programs">
          <div className="gy-section-inner">
            <div className="gy-programs-head">
              <div className="gy-section-eyebrow">
                <span className="gy-section-eyebrow-line" />
                Programs
              </div>
              <h2 className="gy-section-title">
                Designed for <em>every goal.</em>
              </h2>
            </div>

            <div className="gy-programs-list">
              {programs.map((p, i) => (
                <div key={i} className="gy-program-row">
                  <div className="gy-program-row-num">0{i + 1}</div>
                  <div className="gy-program-row-img">
                    {p.image ? (
                      <img src={`${uploadsBase}${p.image}`} alt={p.name} />
                    ) : (
                      <img src={STUDIO_IMAGES[i % STUDIO_IMAGES.length]} alt={p.name} />
                    )}
                  </div>
                  <div className="gy-program-row-content">
                    {p.category && <div className="gy-program-row-cat">{p.category}</div>}
                    <h3 className="gy-program-row-name">{p.name || 'Program'}</h3>
                    {p.description && (
                      <p className="gy-program-row-desc">
                        {p.description.length > 130 ? p.description.slice(0, 130) + '...' : p.description}
                      </p>
                    )}
                    <div className="gy-program-row-meta">
                      {p.duration && (
                        <span><IconClock size={12} /> {p.duration}</span>
                      )}
                      {p.level && <span>{p.level}</span>}
                    </div>
                  </div>
                  <div className="gy-program-row-cta">
                    <button className="gy-program-row-btn"
                      onClick={() => waLink && window.open(waLink, '_blank')}>
                      <IconArrowNE size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TRAINERS ============ */}
      {trainers.length > 0 && (
        <section id="trainers" className="gy-section gy-trainers">
          <div className="gy-section-inner">
            <div className="gy-trainers-head">
              <div className="gy-section-eyebrow">
                <span className="gy-section-eyebrow-line" />
                The Coaches
              </div>
              <h2 className="gy-section-title">
                Meet your <em>coaches.</em>
              </h2>
            </div>

            <div className="gy-trainers-grid">
              {trainers.map((t, i) => {
                const name = t.name || 'Coach'
                const parts = name.trim().split(' ')
                const initials = parts.length > 1
                  ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                  : name.slice(0, 2).toUpperCase()

                return (
                  <div key={i} className="gy-trainer-card">
                    <div className="gy-trainer-img-wrap">
                      {t.image ? (
                        <img src={`${uploadsBase}${t.image}`} alt={name} className="gy-trainer-img" />
                      ) : (
                        <div className="gy-trainer-img-fallback">{initials}</div>
                      )}
                      {t.experience && (
                        <div className="gy-trainer-exp">{t.experience}</div>
                      )}
                    </div>
                    <div className="gy-trainer-body">
                      <h3 className="gy-trainer-name">{name}</h3>
                      {t.specialization && (
                        <div className="gy-trainer-spec">{t.specialization}</div>
                      )}
                      {t.certifications && (
                        <div className="gy-trainer-cert">{t.certifications}</div>
                      )}
                      {t.bio && (
                        <p className="gy-trainer-bio">{t.bio}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ MEMBERSHIP ============ */}
      {plans.length > 0 && (
        <section id="plans" className="gy-section gy-plans">
          <div className="gy-section-inner">
            <div className="gy-plans-head">
              <div className="gy-section-eyebrow">
                <span className="gy-section-eyebrow-line" />
                Membership
              </div>
              <h2 className="gy-section-title">
                Choose your <em>practice.</em>
              </h2>
              <p className="gy-section-sub">
                Simple, transparent memberships. Pause or cancel anytime.
              </p>
            </div>

            <div className="gy-plans-grid">
              {plans.map((p, i) => {
                const isPopular = String(p.is_popular || '').toLowerCase() === 'yes'
                return (
                  <div key={i} className={`gy-plan ${isPopular ? 'popular' : ''}`}>
                    <div className="gy-plan-top">
                      <div className="gy-plan-duration">{p.duration || 'Monthly'}</div>
                      {isPopular && <div className="gy-plan-tag">Recommended</div>}
                    </div>
                    <h3 className="gy-plan-name">{p.name || 'Membership'}</h3>
                    <div className="gy-plan-price">{p.price || '₹—'}</div>
                    {p.description && (
                      <p className="gy-plan-desc">{p.description}</p>
                    )}
                    {waLink && (
                      <a href={buildWhatsAppLink(
                        data.whatsapp || data.phone,
                        `Hi, I'm interested in the "${p.name}" membership.`
                      )} target="_blank" rel="noreferrer" className="gy-plan-cta">
                        Join Now <IconArrow size={13} />
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ WHY US ============ */}
      <section className="gy-section gy-why">
        <div className="gy-section-inner">
          <div className="gy-why-head">
            <div className="gy-section-eyebrow">
              <span className="gy-section-eyebrow-line" />
              Why Choose Us
            </div>
            <h2 className="gy-section-title">
              Everything you need,<br />
              <em>nothing you don't.</em>
            </h2>
          </div>

          <div className="gy-why-grid">
            {features.map((f, i) => (
              <div key={i} className="gy-why-card">
                <div className="gy-why-card-num">0{i + 1}</div>
                <h3 className="gy-why-card-title">{f.title}</h3>
                <p className="gy-why-card-desc">{f.description || f.desc}</p>
                <div className="gy-why-card-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section id="reviews" className="gy-section gy-reviews">
        <div className="gy-section-inner">
          <div className="gy-reviews-head">
            <div className="gy-section-eyebrow">
              <span className="gy-section-eyebrow-line" />
              Member Stories
            </div>
            <h2 className="gy-section-title">
              Real progress, <em>real people.</em>
            </h2>
          </div>

          <div className="gy-reviews-grid">
            {reviews.slice(0, 3).map((r, i) => (
              <div key={i} className="gy-review-card">
                <div className="gy-review-quote">"</div>
                <p className="gy-review-text">{r.text}</p>
                <div className="gy-review-foot">
                  <div className="gy-review-author">
                    <div className="gy-review-avatar">
                      {(r.member_name || 'A').charAt(0)}
                    </div>
                    <div>
                      <div className="gy-review-name">{r.member_name || 'Anonymous'}</div>
                      <div className="gy-review-plan">{r.plan || 'Member'}</div>
                    </div>
                  </div>
                  <div className="gy-review-stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <IconStar key={s} size={12}
                        style={{ opacity: s < (r.rating || 5) ? 1 : 0.2 }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section id="gallery" className="gy-section gy-gallery">
        <div className="gy-section-inner">
          <div className="gy-gallery-head">
            <div className="gy-section-eyebrow">
              <span className="gy-section-eyebrow-line" />
              Inside the Studio
            </div>
            <h2 className="gy-section-title">
              A space built for <em>focus.</em>
            </h2>
          </div>

          <div className="gy-gallery-grid">
            {gallery.slice(0, 6).map((url, i) => (
              <div key={i} className={`gy-gallery-cell gy-gallery-cell-${i + 1}`}
                onClick={() => setLightbox(url)}>
                <img src={url} alt={`Studio ${i + 1}`} />
                <div className="gy-gallery-overlay">
                  <IconArrowNE size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="gy-section gy-contact">
        <div className="gy-section-inner">
          <div className="gy-contact-grid">
            <div className="gy-contact-left">
              <div className="gy-section-eyebrow">
                <span className="gy-section-eyebrow-line" />
                Get in Touch
              </div>
              <h2 className="gy-section-title">
                Start your <em>journey.</em>
              </h2>
              <p className="gy-contact-desc">
                Book a complimentary trial session. Our team will reach out within 24 hours.
              </p>

              <div className="gy-contact-items">
                {data.phone && (
                  <a href={`tel:${data.phone}`} className="gy-contact-item">
                    <div className="gy-contact-item-label">Call</div>
                    <div className="gy-contact-item-value">{data.phone}</div>
                    <IconArrowNE size={14} />
                  </a>
                )}
                {data.email && (
                  <a href={`mailto:${data.email}`} className="gy-contact-item">
                    <div className="gy-contact-item-label">Email</div>
                    <div className="gy-contact-item-value">{data.email}</div>
                    <IconArrowNE size={14} />
                  </a>
                )}
                {data.address && (
                  <div className="gy-contact-item">
                    <div className="gy-contact-item-label">Studio</div>
                    <div className="gy-contact-item-value">{data.address}</div>
                  </div>
                )}
              </div>
            </div>

            <form className="gy-contact-form" onSubmit={submitJoin}>
              <div className="gy-form-head">
                <div className="gy-form-title">Book a Free Trial</div>
                <div className="gy-form-sub">No commitment. Just come and try.</div>
              </div>

              <div className="gy-cf-row">
                <div className="gy-cf-field">
                  <label>Full Name</label>
                  <input type="text" value={join.name}
                    onChange={e => setJoin({ ...join, name: e.target.value })}
                    placeholder="Rahul Kumar" required />
                </div>
                <div className="gy-cf-field">
                  <label>Phone</label>
                  <input type="tel" value={join.phone}
                    onChange={e => setJoin({ ...join, phone: e.target.value })}
                    placeholder="9876543210" required />
                </div>
              </div>

              <div className="gy-cf-row">
                <div className="gy-cf-field">
                  <label>Preferred Plan</label>
                  <select value={join.plan}
                    onChange={e => setJoin({ ...join, plan: e.target.value })}>
                    <option value="">Select plan</option>
                    {plans.map((p, i) => (
                      <option key={i} value={p.name}>{p.name}</option>
                    ))}
                    <option value="Not sure">Not sure yet</option>
                  </select>
                </div>
                <div className="gy-cf-field">
                  <label>Your Goal</label>
                  <select value={join.goal}
                    onChange={e => setJoin({ ...join, goal: e.target.value })}>
                    <option value="">Select goal</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Strength">Strength</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Endurance">Endurance</option>
                    <option value="General Fitness">General Fitness</option>
                  </select>
                </div>
              </div>

              <div className="gy-cf-field">
                <label>Message (optional)</label>
                <textarea rows={3} value={join.message}
                  onChange={e => setJoin({ ...join, message: e.target.value })}
                  placeholder="Anything we should know?" />
              </div>

              <button type="submit" className="gy-btn gy-btn-primary gy-btn-block">
                Send Request <IconArrow size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="gy-footer">
        <div className="gy-footer-inner">
          <div className="gy-footer-brand">
            {data.logo ? (
              <img src={`${uploadsBase}${data.logo}`} alt={gym} className="gy-footer-logo" />
            ) : (
              <div className="gy-footer-mark">{initials}</div>
            )}
            <div>
              <div className="gy-footer-name">{gym}</div>
              <div className="gy-footer-tag">{data.tagline || 'Move with purpose.'}</div>
            </div>
          </div>

          <div className="gy-footer-grid">
            <div className="gy-footer-col">
              <h4 className="gy-footer-heading">Explore</h4>
              <ul className="gy-footer-list">
                {navLinks.slice(0, 5).map(l => (
                  <li key={l.id}>
                    <button className="gy-footer-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            {programs.length > 0 && (
              <div className="gy-footer-col">
                <h4 className="gy-footer-heading">Programs</h4>
                <ul className="gy-footer-list">
                  {programs.slice(0, 4).map((p, i) => (
                    <li key={i}>
                      <button className="gy-footer-link" onClick={() => scrollTo('programs')}>
                        {p.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="gy-footer-col">
              <h4 className="gy-footer-heading">Contact</h4>
              <ul className="gy-footer-list">
                {data.phone && <li><a href={`tel:${data.phone}`} className="gy-footer-link">{data.phone}</a></li>}
                {data.email && <li><a href={`mailto:${data.email}`} className="gy-footer-link">{data.email}</a></li>}
              </ul>
            </div>
          </div>

          {socials.length > 0 && (
            <div className="gy-footer-socials">
              {socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer"
                  aria-label={s.label} className="gy-footer-social">
                  <s.Icon size={15} />
                </a>
              ))}
              {waLink && (
                <a href={waLink} target="_blank" rel="noreferrer"
                  aria-label="WhatsApp" className="gy-footer-social wa">
                  <IconWhatsApp size={15} />
                </a>
              )}
            </div>
          )}

          <div className="gy-footer-bottom">
            <p className="gy-footer-copy">
              © {new Date().getFullYear()} <span className="gy-footer-copy-brand">{gym}</span>
              <span className="gy-footer-copy-sep">·</span>
              All Rights Reserved
              <span className="gy-footer-copy-sep">·</span>
              Crafted by{' '}
              <a href="https://qifawtechnologies.com/" target="_blank" rel="noreferrer"
                className="gy-footer-credit-link">
                Qifaw Technologies
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ============ LIGHTBOX ============ */}
      {lightbox && (
        <div className="gy-lightbox" onClick={() => setLightbox(null)}>
          <button className="gy-lightbox-close" onClick={() => setLightbox(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img src={lightbox} alt="Preview" className="gy-lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}