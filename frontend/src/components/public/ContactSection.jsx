import { useState, useRef } from 'react'
import { useNotify } from '../../context/NotificationContext'
import { isEmail } from '../../utils/validators'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const heading = {
  ...interStyle,
  fontWeight: 900,
  letterSpacing: '-0.04em',
}

const INFO = [
  {
    label: 'Address',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    lines: ['27 Division St, New York', 'NY 10002, USA'],
  },
  {
    label: 'Phone',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    lines: ['+1 800 123 456 789'],
  },
  {
    label: 'Working Hours',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    lines: ['Mon – Fri: 9 am – 6 pm'],
  },
  {
    label: 'Email',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
    lines: ['hello@ncube.com'],
  },
]

const SOCIALS = [
  {
    name: 'Instagram', url: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'Twitter', url: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  },
  {
    name: 'Facebook', url: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn', url: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

export default function ContactSection() {
  const notify = useNotify()
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', website: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (!form.email.trim()) err.email = 'Email is required'
    else if (!isEmail(form.email)) err.email = 'Invalid email'
    if (!form.message.trim() || form.message.trim().length < 10)
      err.message = 'Message must be at least 10 characters'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      notify.success("Message sent! We'll get back to you soon.")
      setForm({ name: '', email: '', website: '', message: '' })
    }, 600)
  }

  /* Mouse-follow 3D tilt + spotlight */
  const handleMove = (e, el) => {
    if (!el || window.innerWidth < 768) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotY = ((x - cx) / cx) * 3
    const rotX = ((cy - y) / cy) * 3
    el.style.setProperty('--rx', `${rotX}deg`)
    el.style.setProperty('--ry', `${rotY}deg`)
    el.style.setProperty('--mx', `${(x / rect.width) * 100}%`)
    el.style.setProperty('--my', `${(y / rect.height) * 100}%`)
  }
  const handleLeave = (el) => {
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <section id="contact" className="ct" style={interStyle}>
      {/* ============ BACKGROUND (same as pricing) ============ */}
      <div className="ct-bg" aria-hidden="true">
        <div className="ct-bg-spotlight" />
        <div className="ct-bg-glow ct-bg-glow-1" />
        <div className="ct-bg-glow ct-bg-glow-2" />
        <div className="ct-bg-dots" />
      </div>

      <div className="ct-wrap">

        {/* ============ HEADER ============ */}
        <header className="ct-head">
          <span className="ct-eyebrow">
            <span className="ct-eyebrow-dot" />
            Let's Talk
          </span>
          <h2 className="ct-title" style={heading}>
            Let's Start Work <span className="ct-title-accent">Together</span>
          </h2>
          <p className="ct-sub">
            Have a project in mind? Drop us a message — we'll get back to you
            within 24 hours.
          </p>
        </header>

        {/* ============ SPLIT LAYOUT ============ */}
        <div className="ct-split">

          {/* ---------- LEFT — INFO CARD ---------- */}
          <aside className="ct-left">
            <div
              className="ct-left-card"
              onMouseMove={(e) => handleMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleLeave(e.currentTarget)}
            >
              <span className="ct-shine" aria-hidden="true" />

              <a href="mailto:hello@ncube.com" className="ct-big-email">
                hello@ncube.com
              </a>

              <div className="ct-info-list">
                {INFO.map((item, i) => (
                  <div key={i} className="ct-info-item">
                    <div className="ct-info-icon">{item.icon}</div>
                    <div className="ct-info-body">
                      <div className="ct-info-label">{item.label}</div>
                      <div className="ct-info-value">
                        {item.lines.map((l, j) => (
                          <div key={j}>{l}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ct-socials-block">
                <div className="ct-socials-label">Follow Us</div>
                <div className="ct-socials-row">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      className="ct-social"
                      aria-label={s.name}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ---------- RIGHT — FORM CARD ---------- */}
          <div className="ct-right">
            <div
              ref={formRef}
              className="ct-form-card"
              onMouseMove={(e) => handleMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleLeave(e.currentTarget)}
            >
              <span className="ct-shine" aria-hidden="true" />

              <div className="ct-form-head">
                <h3 className="ct-form-title" style={heading}>
                  Send us a <span className="ct-form-accent">message</span>
                </h3>
                <p className="ct-form-sub">
                  Fill out the form and we'll be in touch shortly.
                </p>
              </div>

              <form className="ct-form" onSubmit={submit} noValidate>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label className="ct-label">Your Name *</label>
                    <input
                      name="name"
                      className={`ct-input ${errors.name ? 'is-error' : ''}`}
                      value={form.name}
                      onChange={change}
                      placeholder="John Doe"
                    />
                    {errors.name && <div className="ct-error">{errors.name}</div>}
                  </div>

                  <div className="ct-field">
                    <label className="ct-label">Your Email *</label>
                    <input
                      name="email"
                      type="email"
                      className={`ct-input ${errors.email ? 'is-error' : ''}`}
                      value={form.email}
                      onChange={change}
                      placeholder="you@example.com"
                    />
                    {errors.email && <div className="ct-error">{errors.email}</div>}
                  </div>
                </div>

                <div className="ct-field">
                  <label className="ct-label">Website (optional)</label>
                  <input
                    name="website"
                    className="ct-input"
                    value={form.website}
                    onChange={change}
                    placeholder="https://yourbusiness.com"
                  />
                </div>

                <div className="ct-field">
                  <label className="ct-label">Your Message *</label>
                  <textarea
                    name="message"
                    rows={5}
                    className={`ct-input ct-textarea ${errors.message ? 'is-error' : ''}`}
                    value={form.message}
                    onChange={change}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && <div className="ct-error">{errors.message}</div>}
                </div>

                <button type="submit" className="ct-submit" disabled={submitting}>
                  {submitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================
          STYLES
          ============================================================ */}
      <style>{`
        /* ============ SECTION ============ */
        .ct {
          position: relative;
          padding: 120px 0;
          background: #07051a;
          color: #fff;
          overflow: hidden;
          isolation: isolate;
        }

        /* ============ BACKGROUND (same as pricing) ============ */
        .ct-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .ct-bg-spotlight {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,85,247,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 50% 100%, rgba(59,130,246,0.12) 0%, transparent 70%);
        }

        .ct-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
        }
        .ct-bg-glow-1 {
          width: 560px;
          height: 560px;
          background: radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%);
          top: -10%;
          left: -5%;
        }
        .ct-bg-glow-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%);
          bottom: -15%;
          right: -8%;
        }

        .ct-bg-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%);
          opacity: 0.4;
        }

        .ct-wrap {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ============ HEADER ============ */
        .ct-head {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 72px;
        }
        .ct-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 10px;
          background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.25);
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .ct-eyebrow-dot {
          width: 6px;
          height: 6px;
          background: #a855f7;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(168,85,247,0.9);
          animation: ctPulse 2s ease-in-out infinite;
        }
        @keyframes ctPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(168,85,247,0.9); }
          50%      { box-shadow: 0 0 16px rgba(168,85,247,0.4); }
        }

        .ct-title {
          font-size: 54px;
          line-height: 1.08;
          color: #fff;
          margin: 0 0 18px;
        }
        .ct-title-accent {
          background: linear-gradient(120deg, #a855f7 0%, #818cf8 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ct-sub {
          font-size: 16px;
          line-height: 1.7;
          color: #94a3b8;
          margin: 0 auto;
          max-width: 520px;
        }

        /* ============ SPLIT ============ */
        .ct-split {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 28px;
          align-items: stretch;
          perspective: 1400px;
        }

        /* ============ COMMON CARD ============ */
        .ct-left-card,
        .ct-form-card {
          position: relative;
          padding: 40px 36px;
          background: linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 30px 60px -30px rgba(0,0,0,0.5);
          transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0);
          transform-style: preserve-3d;
          will-change: transform;
          overflow: hidden;
          height: 100%;
        }
        .ct-left-card:hover,
        .ct-form-card:hover {
          border-color: rgba(168,85,247,0.35);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.1) inset,
            0 40px 80px -30px rgba(168,85,247,0.35),
            0 0 0 1px rgba(168,85,247,0.15);
        }

        /* Shine layer */
        .ct-shine {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle 260px at var(--mx, 50%) var(--my, 0%),
            rgba(168,85,247,0.14) 0%,
            transparent 60%
          );
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        .ct-left-card:hover .ct-shine,
        .ct-form-card:hover .ct-shine {
          opacity: 1;
        }

        /* ============ LEFT CARD ============ */
        .ct-left { display: flex; }
        .ct-left-card {
          display: flex;
          flex-direction: column;
          gap: 32px;
          width: 100%;
        }

        /* Big email */
        .ct-big-email {
          position: relative;
          z-index: 2;
          display: inline-block;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 1.05;
          background: linear-gradient(120deg, #f472b6 0%, #a855f7 45%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.25s ease;
          word-break: break-all;
        }
        .ct-big-email:hover { transform: translateX(4px); }

        /* Info list */
        .ct-info-list {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 22px;
          flex: 1;
        }
        .ct-info-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .ct-info-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(99,102,241,0.1) 100%);
          border: 1px solid rgba(168,85,247,0.25);
          color: #c4b5fd;
          flex-shrink: 0;
        }
        .ct-info-body { flex: 1; min-width: 0; }
        .ct-info-label {
          font-size: 10.5px;
          font-weight: 700;
          color: #c4b5fd;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .ct-info-value {
          font-size: 14px;
          line-height: 1.6;
          color: #cbd5e1;
          font-weight: 500;
        }

        /* Socials */
        .ct-socials-block {
          position: relative;
          z-index: 2;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .ct-socials-label {
          font-size: 10.5px;
          font-weight: 700;
          color: #c4b5fd;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .ct-socials-row {
          display: flex;
          gap: 10px;
        }
        .ct-social {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          transition: all 0.25s ease;
        }
        .ct-social:hover {
          background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
          border-color: transparent;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -6px rgba(168,85,247,0.5);
        }

        /* ============ RIGHT FORM CARD ============ */
        .ct-right { display: flex; }
        .ct-form-card {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .ct-form-head {
          position: relative;
          z-index: 2;
          margin-bottom: 28px;
        }
        .ct-form-title {
          font-size: 30px;
          line-height: 1.15;
          color: #fff;
          margin: 0 0 10px;
        }
        .ct-form-accent {
          background: linear-gradient(120deg, #a855f7 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ct-form-sub {
          font-size: 13.5px;
          line-height: 1.6;
          color: #94a3b8;
          margin: 0;
        }

        /* Form */
        .ct-form {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex: 1;
        }
        .ct-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .ct-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .ct-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #cbd5e1;
          letter-spacing: 0.01em;
        }
        .ct-input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
          font-size: 13.5px;
          line-height: 1.5;
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
        }
        .ct-input::placeholder { color: #64748b; }
        .ct-input:focus {
          background: rgba(168,85,247,0.05);
          border-color: rgba(168,85,247,0.5);
          box-shadow: 0 0 0 4px rgba(168,85,247,0.1);
        }
        .ct-input.is-error {
          border-color: rgba(239,68,68,0.6);
          background: rgba(239,68,68,0.04);
        }
        .ct-textarea {
          resize: vertical;
          min-height: 110px;
        }
        .ct-error {
          font-size: 11.5px;
          font-weight: 500;
          color: #f87171;
          margin-top: 1px;
        }

        .ct-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          align-self: flex-start;
          padding: 13px 28px;
          background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
          color: #fff;
          border: none;
          border-radius: 13px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          box-shadow:
            0 10px 28px -10px rgba(168,85,247,0.6),
            inset 0 1px 0 rgba(255,255,255,0.2);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 6px;
        }
        .ct-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 16px 40px -10px rgba(168,85,247,0.8),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .ct-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .ct-submit svg { transition: transform 0.2s; }
        .ct-submit:hover:not(:disabled) svg { transform: translateX(3px); }

        /* ============================================================
           TABLET
           ============================================================ */
        @media (max-width: 1024px) {
          .ct { padding: 96px 0; }
          .ct-head { margin-bottom: 56px; }
          .ct-title { font-size: 42px; }
          .ct-split {
            grid-template-columns: 1fr;
            gap: 22px;
            perspective: none;
          }
          .ct-left-card,
          .ct-form-card {
            padding: 36px 30px;
            transform: none !important;
          }
          .ct-big-email { font-size: 28px; }
          .ct-form-title { font-size: 26px; }
        }

        /* ============================================================
           MOBILE
           ============================================================ */
        @media (max-width: 640px) {
          .ct { padding: 72px 0; }
          .ct-wrap { padding: 0 20px; }
          .ct-head { margin-bottom: 40px; }
          .ct-title { font-size: 32px; line-height: 1.1; }
          .ct-sub { font-size: 14.5px; }

          .ct-split { gap: 18px; }

          .ct-left-card,
          .ct-form-card {
            padding: 28px 22px;
            border-radius: 20px;
          }

          .ct-big-email { font-size: 22px; padding-bottom: 20px; }
          .ct-info-list { gap: 18px; }
          .ct-info-icon { width: 36px; height: 36px; border-radius: 10px; }
          .ct-info-label { font-size: 10px; }
          .ct-info-value { font-size: 13px; }

          .ct-socials-block { padding-top: 20px; }
          .ct-social { width: 38px; height: 38px; }

          .ct-form-title { font-size: 22px; }
          .ct-form-sub { font-size: 12.5px; }

          .ct-form { gap: 16px; }
          .ct-form-row { grid-template-columns: 1fr; gap: 16px; }
          .ct-input { padding: 12px 14px; font-size: 13px; }
          .ct-label { font-size: 12px; }
          .ct-textarea { min-height: 100px; }

          .ct-submit {
            width: 100%;
            justify-content: center;
            padding: 13px 22px;
            font-size: 13.5px;
          }
        }

        @media (max-width: 380px) {
          .ct-title { font-size: 28px; }
          .ct-left-card,
          .ct-form-card { padding: 24px 18px; }
          .ct-big-email { font-size: 18px; }
          .ct-form-title { font-size: 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ct-left-card,
          .ct-form-card,
          .ct-shine,
          .ct-social,
          .ct-submit,
          .ct-eyebrow-dot {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}