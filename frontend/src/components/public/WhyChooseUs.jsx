import { useEffect, useRef, useState } from 'react'

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

const ITEMS = [
  {
    num: '01',
    title: 'No Coding Required',
    desc: 'Create a professional website without writing a single line of code. Simple for everyone.',
    tag: 'Simple',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Professional Templates',
    desc: 'Ready-made templates designed for different industries. Choose a design that fits your brand.',
    tag: 'Design',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Easy Customization',
    desc: 'Add your business details, images, services, and contact info effortlessly. Make it yours.',
    tag: 'Flexible',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Mobile-Friendly Design',
    desc: 'Your website adapts to desktops, tablets, and smartphones. Smooth on every screen.',
    tag: 'Responsive',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Simple Website Creation',
    desc: 'Follow a few easy steps from category to publishing. Turn your ideas into an online presence.',
    tag: 'Fast',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Quick & Easy Publishing',
    desc: 'Complete your details, choose a plan, make payment. Your website is live in minutes.',
    tag: 'Instant',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
]

export default function WhyChooseUs() {
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
      { threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className={`wy ${visible ? 'is-visible' : ''}`}
      style={interStyle}
    >
      {/* Background */}
      <div className="wy-bg" aria-hidden="true">
        <div className="wy-bg-grid" />
        <div className="wy-bg-glow wy-bg-glow-1" />
        <div className="wy-bg-glow wy-bg-glow-2" />
      </div>

      <div className="wy-wrap">

        {/* ============================================================
            HEADER — Center
            ============================================================ */}
        <header className="wy-head">
          <div className="wy-badge-row">
            <span className="wy-badge-line" />
            <span className="wy-badge">
              <span className="wy-badge-dot" />
              Why Choose Us
            </span>
            <span className="wy-badge-line" />
          </div>

          <h2 className="wy-title" style={heading}>
            Everything you need to <br />
            <span className="wy-title-accent">launch your website.</span>
          </h2>

          <p className="wy-sub">
            Six reasons why thousands of businesses trust us to bring
            their online presence to life.
          </p>
        </header>

        {/* ============================================================
            FEATURE GRID — 3 columns
            ============================================================ */}
        <div className="wy-grid">
          {ITEMS.map((item, idx) => (
            <article
              key={item.num}
              className="wy-card"
              style={{ '--d': `${0.05 + idx * 0.06}s` }}
            >
              {/* Top row: number + tag */}
              <div className="wy-card-top">
                <span className="wy-card-num">{item.num}</span>
                <span className="wy-card-tag">{item.tag}</span>
              </div>

              {/* Icon */}
              <div className="wy-card-icon">{item.icon}</div>

              {/* Title */}
              <h3 className="wy-card-title" style={heading}>
                {item.title}
              </h3>

              {/* Desc */}
              <p className="wy-card-desc">{item.desc}</p>

              {/* Hover accent */}
              <div className="wy-card-accent" aria-hidden="true" />
              <div className="wy-card-glow" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* ============================================================
            BOTTOM STATS STRIP
            ============================================================ */}
        <div className="wy-stats">
          <div className="wy-stat" style={{ '--d': '0.5s' }}>
            <div className="wy-stat-val">10K+</div>
            <div className="wy-stat-label">Websites Built</div>
          </div>
          <div className="wy-stat-divider" />
          <div className="wy-stat" style={{ '--d': '0.58s' }}>
            <div className="wy-stat-val">7+</div>
            <div className="wy-stat-label">Industries</div>
          </div>
          <div className="wy-stat-divider" />
          <div className="wy-stat" style={{ '--d': '0.66s' }}>
            <div className="wy-stat-val">99.9%</div>
            <div className="wy-stat-label">Uptime</div>
          </div>
          <div className="wy-stat-divider" />
          <div className="wy-stat" style={{ '--d': '0.74s' }}>
            <div className="wy-stat-val">24/7</div>
            <div className="wy-stat-label">Support</div>
          </div>
        </div>

      </div>

      {/* ============================================================
          STYLES
          ============================================================ */}
      <style>{`
        /* ============ SECTION ============ */
        .wy {
          position: relative;
          padding: 120px 0;
          background: #ffffff;
          color: #0a0f1e;
          overflow: hidden;
          isolation: isolate;
        }

        /* ============ BACKGROUND ============ */
        .wy-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

        .wy-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.045) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 65% at 50% 40%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 65% at 50% 40%, black 30%, transparent 100%);
        }

        .wy-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
        }
        .wy-bg-glow-1 {
          width: 620px; height: 620px;
          background: radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%);
          top: -12%; left: -10%;
        }
        .wy-bg-glow-2 {
          width: 640px; height: 640px;
          background: radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%);
          bottom: -15%; right: -12%;
        }

        .wy-wrap {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* ============================================================
           HEADER
           ============================================================ */
        .wy-head {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 76px;
          opacity: 0;
          transform: translateY(24px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wy.is-visible .wy-head {
          opacity: 1;
          transform: translateY(0);
        }

        .wy-badge-row {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }
        .wy-badge-line {
          display: inline-block;
          width: 42px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #c4b5fd, transparent);
          border-radius: 999px;
        }
        .wy-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px 6px 12px;
          background: #f5f3ff;
          border: 1px solid #e9d5ff;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
          color: #7c3aed;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .wy-badge-dot {
          width: 6px;
          height: 6px;
          background: #7c3aed;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
          animation: wyPulse 2s ease-in-out infinite;
        }
        @keyframes wyPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
          50%      { box-shadow: 0 0 0 6px rgba(124,58,237,0.07); }
        }

        .wy-title {
          font-size: 56px;
          line-height: 1.06;
          color: #0a0f1e;
          margin: 0 0 18px;
        }
        .wy-title-accent {
          background: linear-gradient(120deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .wy-sub {
          font-size: 16.5px;
          line-height: 1.7;
          color: #64748b;
          margin: 0 auto;
          max-width: 560px;
          font-weight: 500;
        }

        /* ============================================================
           FEATURE GRID
           ============================================================ */
        .wy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 72px;
        }

        /* ============ CARD ============ */
        .wy-card {
          position: relative;
          padding: 32px 28px 28px;
          background: #fafbff;
          border: 1px solid #eef2f7;
          border-radius: 22px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px);
          transition: all 0.65s cubic-bezier(0.22, 1, 0.36, 1);
          isolation: isolate;
        }
        .wy.is-visible .wy-card {
          opacity: 1;
          transform: translateY(0);
          transition-delay: var(--d);
        }
        .wy-card:hover {
          background: #ffffff;
          border-color: #ddd6fe;
          transform: translateY(-5px);
          box-shadow:
            0 24px 60px -24px rgba(124,58,237,0.28),
            0 0 0 1px rgba(124,58,237,0.06);
        }

        /* Top row */
        .wy-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
        }
        .wy-card-num {
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.06em;
          color: #cbd5e1;
          transition: color 0.35s ease;
        }
        .wy-card:hover .wy-card-num {
          color: #7c3aed;
        }

        .wy-card-tag {
          display: inline-flex;
          padding: 4px 10px;
          background: #ffffff;
          border: 1px solid #eef2f7;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.35s ease;
        }
        .wy-card:hover .wy-card-tag {
          background: #f5f3ff;
          border-color: #e9d5ff;
          color: #7c3aed;
        }

        /* Icon */
        .wy-card-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border: 1px solid #e9d5ff;
          color: #7c3aed;
          margin-bottom: 22px;
          transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wy-card:hover .wy-card-icon {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          border-color: transparent;
          color: #ffffff;
          transform: scale(1.08) rotate(-4deg);
          box-shadow:
            0 12px 28px -8px rgba(124,58,237,0.55),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }

        /* Title */
        .wy-card-title {
          font-size: 19px;
          font-weight: 800;
          color: #0a0f1e;
          margin: 0 0 10px;
          letter-spacing: -0.025em;
          line-height: 1.3;
          transition: color 0.3s ease;
        }
        .wy-card:hover .wy-card-title {
          color: #7c3aed;
        }

        /* Desc */
        .wy-card-desc {
          font-size: 14px;
          line-height: 1.65;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        /* Accent bar — bottom */
        .wy-card-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wy-card:hover .wy-card-accent {
          transform: scaleX(1);
        }

        /* Glow */
        .wy-card-glow {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%);
          filter: blur(50px);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: -1;
        }
        .wy-card:hover .wy-card-glow { opacity: 1; }

        /* ============================================================
           STATS STRIP
           ============================================================ */
        .wy-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 40px 44px;
          background: #fafbff;
          border: 1px solid #eef2f7;
          border-radius: 24px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s;
        }
        .wy.is-visible .wy-stats {
          opacity: 1;
          transform: translateY(0);
        }

        .wy-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }
        .wy-stat-val {
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          background: linear-gradient(120deg, #7c3aed 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .wy-stat-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .wy-stat-divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(180deg, transparent, #e2e8f0 50%, transparent);
          flex-shrink: 0;
        }

        /* ============================================================
           TABLET
           ============================================================ */
        @media (max-width: 1024px) {
          .wy { padding: 96px 0; }
          .wy-wrap { padding: 0 32px; }
          .wy-title { font-size: 46px; }
          .wy-sub { font-size: 15.5px; }
          .wy-head { margin-bottom: 60px; }

          .wy-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 56px;
          }
          .wy-card { padding: 28px 24px 24px; }
          .wy-card-icon { width: 52px; height: 52px; border-radius: 14px; }
          .wy-card-title { font-size: 17px; }
          .wy-card-desc { font-size: 13.5px; }

          .wy-stats { padding: 32px 32px; }
          .wy-stat-val { font-size: 28px; }
        }

        /* ============================================================
           MOBILE
           ============================================================ */
        @media (max-width: 640px) {
          .wy { padding: 72px 0 80px; }
          .wy-wrap { padding: 0 20px; }
          .wy-head { margin-bottom: 44px; }

          .wy-badge-row { gap: 10px; margin-bottom: 16px; }
          .wy-badge-line { width: 26px; }
          .wy-badge { font-size: 10.5px; padding: 5px 12px 5px 10px; letter-spacing: 0.12em; }

          .wy-title { font-size: 32px; line-height: 1.12; margin-bottom: 14px; }
          .wy-sub { font-size: 14.5px; line-height: 1.65; }

          .wy-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 40px;
          }

          .wy-card {
            padding: 22px 20px 20px;
            border-radius: 18px;
          }
          .wy-card-top { margin-bottom: 20px; }
          .wy-card-num { font-size: 12px; }
          .wy-card-tag { font-size: 9.5px; padding: 3px 9px; letter-spacing: 0.1em; }
          .wy-card-icon {
            width: 48px;
            height: 48px;
            border-radius: 13px;
            margin-bottom: 16px;
          }
          .wy-card-icon svg { width: 20px; height: 20px; }
          .wy-card-title { font-size: 16px; margin-bottom: 8px; }
          .wy-card-desc { font-size: 13px; line-height: 1.6; }

          /* Stats — 2x2 grid */
          .wy-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 16px;
            padding: 28px 24px;
            border-radius: 20px;
          }
          .wy-stat-divider { display: none; }
          .wy-stat-val { font-size: 24px; }
          .wy-stat-label { font-size: 11px; }
        }

        @media (max-width: 380px) {
          .wy-title { font-size: 28px; }
          .wy-card { padding: 20px 16px 18px; }
          .wy-card-title { font-size: 15px; }
          .wy-card-desc { font-size: 12.5px; }
          .wy-stat-val { font-size: 22px; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .wy-head,
          .wy-card,
          .wy-stats,
          .wy-card-icon,
          .wy-card-accent,
          .wy-card-glow,
          .wy-badge-dot {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}