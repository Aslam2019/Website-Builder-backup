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
  fontWeight: 900,
  letterSpacing: '-0.04em',
}

const STEPS = [
  {
    num: '01',
    title: 'Register or Login',
    desc: 'Create your account or log in to get started with N Cube.',
  },
  {
    num: '02',
    title: 'Choose Your Category',
    desc: 'Select your website category, such as Portfolio, Real Estate, or Salon.',
  },
  {
    num: '03',
    title: 'Preview & Select a Template',
    desc: 'Explore professional designs, preview your favorites, and choose the perfect template.',
  },
  {
    num: '04',
    title: 'Add Details & Make Payment',
    desc: 'Enter your website details, customize your content, and complete your payment.',
  },
  {
    num: '05',
    title: 'Publish Your Website',
    desc: 'Your website is ready to go live! Share it with the world and grow your online presence.',
  },
]

export default function HowItWorks() {
  const [activeIdx, setActiveIdx] = useState(2)
  const [visible, setVisible] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState({})
  const sectionRef = useRef(null)
  const stepRefs = useRef([])

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
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 768) return
      let closest = 0
      let closestDist = Infinity
      stepRefs.current.forEach((el, idx) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const dist = Math.abs(centerY - window.innerHeight / 2)
        if (dist < closestDist) {
          closestDist = dist
          closest = idx
        }
      })
      setActiveIdx(closest)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768
    const observers = []
    const setup = () => {
      observers.forEach((io) => io.disconnect())
      observers.length = 0
      if (!isMobile()) return
      stepRefs.current.forEach((el, idx) => {
        if (!el) return
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSteps((prev) => ({ ...prev, [idx]: true }))
              io.unobserve(entry.target)
            }
          },
          { rootMargin: '-25% 0px -25% 0px', threshold: 0 }
        )
        io.observe(el)
        observers.push(io)
      })
    }
    setup()
    let t
    const onResize = () => { clearTimeout(t); t = setTimeout(setup, 150) }
    window.addEventListener('resize', onResize)
    return () => {
      observers.forEach((io) => io.disconnect())
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className={`hiw ${visible ? 'is-visible' : ''}`}
      style={interStyle}
    >
      <div className="hiw-wrap">

        {/* HEADER */}
        <header className="hiw-head">
          <div className="hiw-badge-row">
            <span className="hiw-badge-line" />
            <span className="hiw-badge">How It Works</span>
            <span className="hiw-badge-line" />
          </div>

          <h2 className="hiw-title" style={heading}>
            Live in <span className="hiw-title-accent">5 simple steps</span>
          </h2>

          <p className="hiw-sub">
            We handle the technology, design, and hosting. You focus on running your business.
          </p>
        </header>

        {/* CONTENT */}
        <div className="hiw-content">

          {/* LEFT */}
          <div className="hiw-left">
            {STEPS.map((step, idx) => (
              <article
                key={step.num}
                ref={(el) => { stepRefs.current[idx] = el }}
                className={`hiw-step ${activeIdx === idx ? 'is-active' : ''} ${visibleSteps[idx] ? 'is-visible' : ''} ${idx % 2 === 0 ? 'from-left' : 'from-right'}`}
                onClick={() => setActiveIdx(idx)}
              >
                <div className="hiw-step-marker">
                  <div className="hiw-step-circle">
                    <span>{step.num}</span>
                  </div>
                  {idx < STEPS.length - 1 && <span className="hiw-step-connector" />}
                </div>

                <div className="hiw-step-content">
                  <h3 className="hiw-step-title" style={heading}>
                    {step.title}
                  </h3>
                  <p className="hiw-step-desc">{step.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {/* RIGHT — BIGGER IMAGE */}
          <div className="hiw-right">
            <div className="hiw-image-wrap">
              <img
                src="/images/how-it-works.png"
                alt="How it works illustration"
                className="hiw-image"
              />
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="hiw-foot">
          <span className="hiw-foot-line" />
          <Link to="/register" className="hiw-cta">
            <span>Get Started</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <span className="hiw-foot-line" />
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        /* ============ SECTION ============ */
        .hiw {
          position: relative;
          padding: 100px 0 110px;
          background: #ffffff;
          color: #0a0f1e;
          overflow: hidden;
          isolation: isolate;
        }
        .hiw::before {
          content: '';
          position: absolute;
          top: -15%;
          right: -5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .hiw::after {
          content: '';
          position: absolute;
          bottom: -20%;
          left: -5%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        /* ✅ WIDER max-width for more room */
        .hiw-wrap {
          position: relative;
          z-index: 1;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* ============ HEADER ============ */
        .hiw-head {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 72px;
        }
        .hiw-badge-row {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
        }
        .hiw-badge-line {
          display: inline-block;
          width: 42px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #c4b5fd, transparent);
          border-radius: 999px;
        }
        .hiw-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 18px;
          background: #f5f3ff;
          border: 1px solid #e9d5ff;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #7c3aed;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .hiw-title {
          font-size: 58px;
          line-height: 1.06;
          color: #0a0f1e;
          margin: 0 0 18px;
        }
        .hiw-title-accent {
          background: linear-gradient(120deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hiw-sub {
          font-size: 17px;
          line-height: 1.65;
          color: #64748b;
          margin: 0 auto;
          max-width: 640px;
          font-weight: 500;
        }

        /* ✅ CONTENT — Gives more room to image (1fr : 1.4fr) */
        .hiw-content {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 48px;
          align-items: center;
          margin-bottom: 72px;
        }

        /* ============ LEFT — TIMELINE ============ */
        .hiw-left {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .hiw-step {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 18px;
          padding: 14px 20px 14px 4px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .hiw-step.is-active {
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
        }
        .hiw-step-marker {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 2px;
        }
        .hiw-step-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f3f4f6;
          border: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 2;
        }
        .hiw-step-circle span {
          font-size: 15px;
          font-weight: 800;
          color: #64748b;
          letter-spacing: -0.01em;
          transition: color 0.3s ease;
        }
        .hiw-step.is-active .hiw-step-circle {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          border-color: transparent;
          transform: scale(1.08);
          box-shadow:
            0 10px 24px -8px rgba(124,58,237,0.55),
            0 0 0 6px rgba(139,92,246,0.12);
        }
        .hiw-step.is-active .hiw-step-circle span {
          color: #ffffff;
        }
        .hiw-step-connector {
          flex: 1;
          width: 2px;
          min-height: 30px;
          background: #e5e7eb;
          margin-top: 4px;
          border-radius: 2px;
          transition: background 0.4s ease;
        }
        .hiw-step.is-active .hiw-step-connector {
          background: linear-gradient(180deg, #a855f7 0%, #e5e7eb 100%);
        }
        .hiw-step-content {
          padding-top: 2px;
          min-width: 0;
        }
        .hiw-step-title {
          font-size: 18px;
          font-weight: 800;
          color: #0a0f1e;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
          line-height: 1.3;
          transition: color 0.3s ease;
        }
        .hiw-step.is-active .hiw-step-title {
          color: #7c3aed;
        }
        .hiw-step-desc {
          font-size: 14.5px;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
        }

        /* ============ RIGHT — BIGGER IMAGE ✅ ============ */
        .hiw-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hiw-image-wrap {
          position: relative;
          width: 100%;
          /* ✅ Increased from 620px to 780px */
          max-width: 780px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hiw-image-wrap::before {
          content: '';
          position: absolute;
          inset: 10%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(139,92,246,0.25) 0%,
            rgba(168,85,247,0.15) 45%,
            transparent 70%
          );
          filter: blur(90px);
          z-index: 0;
          animation: hiwGlow 6s ease-in-out infinite;
        }
        @keyframes hiwGlow {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50%      { transform: scale(1.08); opacity: 1; }
        }
        .hiw-image {
          position: relative;
          z-index: 1;
          width: 100%;
          height: auto;
          max-width: 100%;
          display: block;
          animation: hiwFloat 7s ease-in-out infinite;
          mix-blend-mode: multiply;
          /* ✅ Bigger image — scale up if needed */
          transform: scale(1.05);
        }
        @keyframes hiwFloat {
          0%, 100% { transform: translateY(0) scale(1.05); }
          50%      { transform: translateY(-14px) scale(1.05); }
        }

        /* ============ BOTTOM CTA ============ */
        .hiw-foot {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }
        .hiw-foot-line {
          flex: 1;
          max-width: 220px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5e7eb 50%, transparent);
        }
        .hiw-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 44px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: #fff;
          border-radius: 999px;
          font-size: 17px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.01em;
          box-shadow:
            0 14px 36px -10px rgba(124,58,237,0.55),
            inset 0 1px 0 rgba(255,255,255,0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }
        .hiw-cta:hover {
          transform: translateY(-3px);
          box-shadow:
            0 20px 44px -10px rgba(124,58,237,0.7),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .hiw-cta svg { transition: transform 0.25s ease; }
        .hiw-cta:hover svg { transform: translateX(4px); }

        /* ============================================================
           TABLET
           ============================================================ */
        @media (max-width: 1024px) {
          .hiw { padding: 80px 0 90px; }
          .hiw-title { font-size: 46px; }
          .hiw-sub { font-size: 16px; }
          .hiw-head { margin-bottom: 56px; }
          .hiw-content {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hiw-right {
            order: -1;
            max-width: 640px;
            margin: 0 auto;
            width: 100%;
          }
          .hiw-image-wrap { max-width: 640px; }
          .hiw-step { grid-template-columns: 56px 1fr; gap: 16px; }
          .hiw-step-circle { width: 44px; height: 44px; }
          .hiw-step-circle span { font-size: 14px; }
          .hiw-step-title { font-size: 17px; }
        }

        /* ============================================================
           MOBILE
           ============================================================ */
        @media (max-width: 768px) {
          .hiw { padding: 64px 0 72px; overflow: hidden; }
          .hiw-wrap { padding: 0 20px; }
          .hiw-head { margin-bottom: 40px; }
          .hiw-badge-row { gap: 10px; margin-bottom: 16px; }
          .hiw-badge-line { width: 28px; }
          .hiw-badge { font-size: 10.5px; padding: 5px 14px; letter-spacing: 0.1em; }
          .hiw-title { font-size: 32px; line-height: 1.12; margin-bottom: 14px; }
          .hiw-sub { font-size: 14.5px; line-height: 1.6; }
          .hiw-content { gap: 36px; margin-bottom: 48px; }
          .hiw-left { gap: 16px; }
          .hiw-step {
            grid-template-columns: 46px 1fr;
            gap: 14px;
            padding: 18px 16px;
            background: linear-gradient(135deg, #fafbff 0%, #f5f3ff 100%);
            border: 1px solid #eee9ff;
            border-radius: 16px;
            opacity: 0;
            transition: all 0.75s cubic-bezier(0.22, 1, 0.36, 1);
            will-change: opacity, transform;
          }
          .hiw-step.is-active {
            background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          }
          .hiw-step.from-left {
            transform: translate3d(-70px, 0, 0);
          }
          .hiw-step.from-left.is-visible {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
          .hiw-step.from-right {
            transform: translate3d(70px, 0, 0);
          }
          .hiw-step.from-right.is-visible {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
          .hiw-step-circle { width: 42px; height: 42px; }
          .hiw-step-circle span { font-size: 13.5px; }
          .hiw-step-connector { display: none; }
          .hiw-step-title { font-size: 15.5px; }
          .hiw-step-desc { font-size: 13px; line-height: 1.55; }

          /* ✅ Bigger image on mobile too */
          .hiw-image-wrap { max-width: 100%; }
          .hiw-image { transform: scale(1); }
          @keyframes hiwFloat {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-10px); }
          }

          .hiw-foot { gap: 12px; }
          .hiw-foot-line { max-width: 40px; }
          .hiw-cta {
            padding: 15px 32px;
            font-size: 15px;
            flex: 1;
            justify-content: center;
          }
        }

        @media (max-width: 380px) {
          .hiw-title { font-size: 28px; }
          .hiw-step { grid-template-columns: 40px 1fr; padding: 16px 14px; gap: 12px; }
          .hiw-step-circle { width: 38px; height: 38px; }
          .hiw-step-circle span { font-size: 12.5px; }
          .hiw-step-title { font-size: 14.5px; }
          .hiw-step-desc { font-size: 12.5px; }
          .hiw-cta { padding: 13px 24px; font-size: 14px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hiw-image,
          .hiw-image-wrap::before {
            animation: none !important;
          }
          .hiw-step,
          .hiw-step.from-left,
          .hiw-step.from-right {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  )
}