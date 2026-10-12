import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const heading = {
  ...interStyle,
  fontWeight: 800,
  letterSpacing: '-0.035em',
}

const FEATURES = [
  {
    label: 'No Coding',
    sub: 'Needed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: 'Fast & Easy',
    sub: 'Process',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'Secure',
    sub: 'Payments',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: '24/7',
    sub: 'Support',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
]

export default function AboutSection() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`abt ${visible ? 'is-visible' : ''}`}
      style={interStyle}
    >
      {/* Background */}
      <div className="abt-bg" aria-hidden="true">
        <div className="abt-bg-glow abt-bg-glow-1" />
        <div className="abt-bg-glow abt-bg-glow-2" />
      </div>

      <div className="abt-wrap">
        <div className="abt-grid">

          {/* ============================================================
              LEFT — Content
              ============================================================ */}
          <div className="abt-left">

            {/* Badge */}
            <div className="abt-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.8L20 10.6l-6.1 1.8L12 18l-1.9-5.6L4 10.6l6.1-1.8L12 3z" />
              </svg>
              <span>About Our Platform</span>
            </div>

            {/* Title */}
            <h2 className="abt-title" style={heading}>
              Your Website. Your Vision.<br />
              <span className="abt-title-accent">Live in Minutes.</span>
            </h2>

            {/* Description */}
            <p className="abt-desc">
              Create your own professional website without any coding or
              technical skills. Our easy-to-use platform helps you go from
              sign up to live in just a few simple steps.
            </p>

            {/* Features row */}
            <div className="abt-features">
              {FEATURES.map((f, idx) => (
                <div
                  key={f.label}
                  className="abt-feature"
                  style={{ '--d': `${0.15 + idx * 0.08}s` }}
                >
                  <span className="abt-feature-icon">{f.icon}</span>
                  <div className="abt-feature-text">
                    <span className="abt-feature-label">{f.label}</span>
                    <span className="abt-feature-sub">{f.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link to="/register" className="abt-cta">
              <span>Start Building</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

          </div>

          {/* ============================================================
              RIGHT — Illustration Image (BIGGER)
              ============================================================ */}
          <div className="abt-right">
            <div className="abt-image-wrap">
              <img
                src="/images/about-illustration.png"
                alt="About N Cube illustration"
                className="abt-image"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================
          STYLES
          ============================================================ */}
      <style>{`
        /* ============ SECTION ============ */
        .abt {
          position: relative;
          padding: 100px 0;
          background: #ffffff;
          color: #0a0f1e;
          overflow: hidden;
          isolation: isolate;
        }

        /* ============ BACKGROUND ============ */
        .abt-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .abt-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
        }
        .abt-bg-glow-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
          top: -8%; left: -10%;
        }
        .abt-bg-glow-2 {
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          bottom: -15%; right: -10%;
        }

        .abt-wrap {
          position: relative;
          z-index: 1;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* ============ GRID ============ */
        /* ✅ More space to image */
        .abt-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 56px;
          align-items: center;
        }

        /* ============================================================
           LEFT — Content
           ============================================================ */
        .abt-left {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .abt.is-visible .abt-left {
          opacity: 1;
          transform: translateY(0);
        }

        /* Badge */
        .abt-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px 7px 13px;
          background: #f5f3ff;
          border: 1px solid #e9d5ff;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #7c3aed;
          letter-spacing: 0.01em;
          margin-bottom: 22px;
        }
        .abt-badge svg { color: #a855f7; }

        /* ✅ Title — Reduced from 60px to 48px */
        .abt-title {
          font-size: 48px;
          line-height: 1.08;
          color: #0a0f1e;
          margin: 0 0 20px;
          letter-spacing: -0.035em;
        }
        .abt-title-accent {
          background: linear-gradient(120deg, #6366f1 0%, #a855f7 60%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ✅ Description — Smaller */
        .abt-desc {
          font-size: 15.5px;
          line-height: 1.65;
          color: #64748b;
          margin: 0 0 36px;
          max-width: 500px;
          font-weight: 500;
        }

        /* Features row */
        .abt-features {
          display: flex;
          gap: 28px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .abt-feature {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          opacity: 0;
          transform: translateY(16px);
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--d);
        }
        .abt.is-visible .abt-feature {
          opacity: 1;
          transform: translateY(0);
        }

        .abt-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          color: #7c3aed;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .abt-feature:hover .abt-feature-icon {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: #ffffff;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 24px -8px rgba(124,58,237,0.55);
        }

        .abt-feature-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .abt-feature-label,
        .abt-feature-sub {
          font-size: 13.5px;
          font-weight: 700;
          color: #0a0f1e;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        /* CTA */
        .abt-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
          color: #ffffff;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.01em;
          box-shadow:
            0 14px 36px -12px rgba(124,58,237,0.6),
            inset 0 1px 0 rgba(255,255,255,0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .abt-cta:hover {
          transform: translateY(-3px);
          box-shadow:
            0 20px 44px -12px rgba(124,58,237,0.7),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .abt-cta svg { transition: transform 0.25s ease; }
        .abt-cta:hover svg { transform: translateX(4px); }

        /* ============================================================
           RIGHT — Image
           ============================================================ */
        .abt-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
        }
        .abt.is-visible .abt-right {
          opacity: 1;
          transform: translateY(0);
        }

        .abt-image-wrap {
          position: relative;
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Soft glow behind image */
        .abt-image-wrap::before {
          content: '';
          position: absolute;
          inset: 8%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(139,92,246,0.16) 0%,
            rgba(99,102,241,0.07) 45%,
            transparent 70%
          );
          filter: blur(70px);
          z-index: 0;
          animation: abtGlow 6s ease-in-out infinite;
        }
        @keyframes abtGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%      { transform: scale(1.05); opacity: 1; }
        }

        /* ✅ Image — bigger, fits grid properly */
        .abt-image {
          position: relative;
          z-index: 1;
          width: 100%;
          height: auto;
          max-width: 100%;
          display: block;
          animation: abtFloat 7s ease-in-out infinite;
        }
        @keyframes abtFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }

        /* ============================================================
           TABLET
           ============================================================ */
        @media (max-width: 1024px) {
          .abt { padding: 84px 0; }
          .abt-wrap { padding: 0 32px; }
          .abt-grid {
            grid-template-columns: 1fr;
            gap: 44px;
          }
          .abt-right {
            order: -1;
            max-width: 620px;
            margin: 0 auto;
            width: 100%;
          }
          .abt-title { font-size: 42px; }
          .abt-desc { font-size: 15px; margin-bottom: 28px; }
          .abt-features { gap: 22px; margin-bottom: 28px; }
        }

        /* ============================================================
           MOBILE
           ============================================================ */
        @media (max-width: 640px) {
          .abt { padding: 60px 0 68px; }
          .abt-wrap { padding: 0 20px; }
          .abt-grid { gap: 32px; }

          .abt-image-wrap { max-width: 100%; }

          /* Badge */
          .abt-badge {
            font-size: 11.5px;
            padding: 6px 14px 6px 11px;
            margin-bottom: 16px;
          }
          .abt-badge svg { width: 12px; height: 12px; }

          /* ✅ Title — Mobile smaller */
          .abt-title {
            font-size: 30px;
            line-height: 1.12;
            margin-bottom: 14px;
          }

          /* Description */
          .abt-desc {
            font-size: 14px;
            line-height: 1.65;
            margin-bottom: 26px;
            max-width: 100%;
          }

          /* Features — 2x2 grid */
          .abt-features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 18px 16px;
            margin-bottom: 28px;
          }
          .abt-feature { gap: 9px; }
          .abt-feature-icon { width: 40px; height: 40px; }
          .abt-feature-icon svg { width: 17px; height: 17px; }
          .abt-feature-label,
          .abt-feature-sub { font-size: 12.5px; }

          /* CTA */
          .abt-cta {
            width: 100%;
            padding: 15px 26px;
            font-size: 14.5px;
          }
        }

        @media (max-width: 380px) {
          .abt-title { font-size: 26px; }
          .abt-desc { font-size: 13px; }
          .abt-features { gap: 14px 12px; }
          .abt-feature-icon { width: 36px; height: 36px; }
          .abt-feature-icon svg { width: 15px; height: 15px; }
          .abt-feature-label,
          .abt-feature-sub { font-size: 12px; }
          .abt-cta { padding: 13px 22px; font-size: 14px; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .abt-left,
          .abt-right,
          .abt-feature,
          .abt-image,
          .abt-image-wrap::before {
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}