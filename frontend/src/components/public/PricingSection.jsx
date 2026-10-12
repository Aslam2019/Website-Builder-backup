import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { pricingApi } from '../../api/pricingApi'
import CustomPlanModal from './CustomPlanModal'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const heading = {
  ...interStyle,
  fontWeight: 900,
  letterSpacing: '-0.045em',
}

/* Card icons — SVG per plan index */
const PlanIcons = [
  <svg key="0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>,
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L14 9l7 2-7 2-2 7-2-7-7-2 7-2 2-7z" />
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
    <line x1="9" y1="9" x2="9" y2="9" />
    <line x1="9" y1="13" x2="9" y2="13" />
    <line x1="9" y1="17" x2="9" y2="17" />
  </svg>,
]

const isCustomPlan = (plan) => {
  const name = String(plan?.name || '').toLowerCase()
  return name.includes('custom') || name.includes('enterprise')
}

export default function PricingSection() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    pricingApi
      .list()
      .then((res) => setPlans(res.data?.data?.plans || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const handleMove = (e, cardEl) => {
    if (!cardEl || window.innerWidth < 768) return
    const rect = cardEl.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotY = ((x - cx) / cx) * 4
    const rotX = ((cy - y) / cy) * 4
    cardEl.style.setProperty('--rx', `${rotX}deg`)
    cardEl.style.setProperty('--ry', `${rotY}deg`)
    cardEl.style.setProperty('--mx', `${(x / rect.width) * 100}%`)
    cardEl.style.setProperty('--my', `${(y / rect.height) * 100}%`)
  }
  const handleLeave = (cardEl) => {
    if (!cardEl) return
    cardEl.style.setProperty('--rx', '0deg')
    cardEl.style.setProperty('--ry', '0deg')
  }

  const activePlans = plans.filter((p) => p.is_active !== false)
  const popularIndex = activePlans.length === 3 ? 1 : -1

  return (
    <section
      id="pricing"
      ref={ref}
      className={`pr ${visible ? 'is-visible' : ''}`}
      style={interStyle}
    >
      {/* BACKGROUND */}
      <div className="pr-bg" aria-hidden="true">
        <div className="pr-bg-spotlight" />
        <div className="pr-bg-glow pr-bg-glow-1" />
        <div className="pr-bg-glow pr-bg-glow-2" />
        <div className="pr-bg-dots" />
      </div>

      <div className="pr-wrap">
        {/* HEADER */}
        <header className="pr-head">
          <span className="pr-eyebrow">
            <span className="pr-eyebrow-dot" />
            Pricing Plans
          </span>
          <h2 className="pr-title" style={heading}>
            Simple pricing <br />
            <span className="pr-title-accent">built for everyone</span>
          </h2>
          <p className="pr-sub">
            Choose the plan that fits your needs. No hidden fees. Cancel anytime.
          </p>
        </header>

        {/* PLANS */}
        {loading ? (
          <div className="pr-loading">Loading plans...</div>
        ) : activePlans.length === 0 ? (
          <div className="pr-loading">No plans available</div>
        ) : (
          <div className="pr-grid">
            {activePlans.map((plan, i) => {
              const isPopular = i === popularIndex
              const planIsCustom = isCustomPlan(plan)

              return (
                <div
                  key={plan._id || i}
                  className={`pr-wrap-card ${isPopular ? 'is-popular' : ''}`}
                  style={{ '--d': `${0.1 + i * 0.12}s` }}
                >
                  {isPopular && (
                    <div className="pr-popular-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.5 6.5L21 10l-5 4.5L17.5 21 12 17.5 6.5 21 8 14.5 3 10l6.5-1.5L12 2z" />
                      </svg>
                      <span>Popular</span>
                    </div>
                  )}

                  <article
                    className="pr-card"
                    onMouseMove={(e) => handleMove(e, e.currentTarget)}
                    onMouseLeave={(e) => handleLeave(e.currentTarget)}
                  >
                    <span className="pr-card-shine" aria-hidden="true" />

                    {/* HEAD */}
                    <div className="pr-card-head">
                      <div className="pr-card-name-row">
                        <h3 className="pr-card-name">{plan.name}</h3>
                        <span className="pr-card-icon">
                          {PlanIcons[i] || PlanIcons[0]}
                        </span>
                      </div>
                      <p className="pr-card-desc">
                        {plan.description || 'Perfect for getting started'}
                      </p>
                    </div>

                    {/* FEATURES */}
                    <ul className="pr-card-features">
                      {(plan.features || []).map((f, j) => (
                        <li key={j}>
                          <span className="pr-check" aria-hidden="true">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className="pr-feature-text">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {planIsCustom ? (
                      <button
                        type="button"
                        className={`pr-card-cta ${isPopular ? 'is-primary' : ''}`}
                        onClick={() => setCustomModalOpen(true)}
                      >
                        <span>Talk to Sales</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        to="/register"
                        className={`pr-card-cta ${isPopular ? 'is-primary' : ''}`}
                      >
                        {isPopular ? (
                          <>
                            <span>Upgrade Now</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </>
                        ) : (
                          `Choose ${plan.name}`
                        )}
                      </Link>
                    )}

                    {/* ✅ PRICE — Custom plan hides price */}
                    {planIsCustom ? (
                      <div className="pr-card-price-wrap pr-card-price-wrap-custom">
                        <div className="pr-custom-price-text">
                          Custom Quote
                        </div>
                        <div className="pr-custom-price-sub">
                          Based on your requirements
                        </div>
                      </div>
                    ) : (
                      <div className="pr-card-price-wrap">
                        <div className="pr-card-price">
                          <span className="pr-card-currency">₹</span>
                          <span className="pr-card-amount">
                            {Number(plan.price || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="pr-card-unit">/one-time</span>
                        </div>
                        <div className="pr-card-billed">Lifetime access</div>
                      </div>
                    )}
                  </article>
                </div>
              )
            })}
          </div>
        )}

        {/* FOOT */}
        <div className="pr-foot">
          <p className="pr-foot-text">
            Start with a <strong>14-day free trial</strong>. No credit card required.
          </p>
        </div>
      </div>

      <CustomPlanModal
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
      />

      {/* ============================================================
          STYLES
          ============================================================ */}
      <style>{`
        /* ============ SECTION ============ */
        .pr {
          position: relative;
          padding: 120px 0;
          background: #07051a;
          overflow: hidden;
          isolation: isolate;
        }

        /* ============ BACKGROUND ============ */
        .pr-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

        .pr-bg-spotlight {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,85,247,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 50% 100%, rgba(59,130,246,0.12) 0%, transparent 70%);
        }

        .pr-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
        }
        .pr-bg-glow-1 {
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%);
          top: -10%; left: -5%;
        }
        .pr-bg-glow-2 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 70%);
          bottom: -15%; right: -8%;
        }

        .pr-bg-dots {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%);
          opacity: 0.4;
        }

        .pr-wrap {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ============ HEADER ============ */
        .pr-head {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 88px;
        }
        .pr-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 10px;
          background: rgba(168,85,247,0.08);
          border: 1px solid rgba(168,85,247,0.25);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }
        .pr-eyebrow-dot {
          width: 6px; height: 6px;
          background: #a855f7;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(168,85,247,0.9);
          animation: prDot 2s ease-in-out infinite;
        }
        @keyframes prDot {
          0%, 100% { box-shadow: 0 0 8px rgba(168,85,247,0.9); }
          50%      { box-shadow: 0 0 18px rgba(168,85,247,0.4); }
        }

        .pr-title {
          font-size: 62px;
          line-height: 1.05;
          color: #fff;
          margin: 0 0 20px;
        }
        .pr-title-accent {
          background: linear-gradient(120deg, #a855f7 0%, #818cf8 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pr-sub {
          font-size: 16.5px;
          line-height: 1.7;
          color: #94a3b8;
          margin: 0 auto;
          max-width: 540px;
        }

        /* ============================================================
           GRID — All cards SAME HEIGHT
           ============================================================ */
        .pr-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
          max-width: 1160px;
          margin: 0 auto;
          perspective: 1400px;
        }

        .pr-wrap-card {
          position: relative;
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transition-delay: var(--d);
          display: flex;
          flex-direction: column;
        }
        .pr.is-visible .pr-wrap-card {
          opacity: 1;
          transform: translateY(0);
        }

        .pr-wrap-card.is-popular {
          transform: translateY(-16px);
          z-index: 3;
        }
        .pr.is-visible .pr-wrap-card.is-popular {
          transform: translateY(-16px);
        }

        /* ============ POPULAR PILL ============ */
        .pr-popular-pill {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
          color: #fff;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          box-shadow:
            0 8px 24px -4px rgba(168,85,247,0.6),
            inset 0 1px 0 rgba(255,255,255,0.2);
          z-index: 5;
          white-space: nowrap;
          animation: popularFloat 3s ease-in-out infinite;
        }
        @keyframes popularFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-4px); }
        }

        /* ============ CARD ============ */
        .pr-card {
          position: relative;
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 36px 28px 32px;
          background: linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 30px 60px -30px rgba(0,0,0,0.5);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          transform:
            rotateX(var(--rx, 0deg))
            rotateY(var(--ry, 0deg))
            translateZ(0);
          transform-style: preserve-3d;
          will-change: transform;
          overflow: hidden;
        }

        .pr-wrap-card.is-popular .pr-card {
          padding: 44px 32px 36px;
          border-radius: 26px;
        }

        .pr-card-shine {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle 250px at var(--mx, 50%) var(--my, 0%),
            rgba(168,85,247,0.15) 0%,
            transparent 60%
          );
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        .pr-card:hover .pr-card-shine { opacity: 1; }

        .pr-card:hover {
          border-color: rgba(168,85,247,0.35);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.1) inset,
            0 40px 80px -30px rgba(168,85,247,0.35),
            0 0 0 1px rgba(168,85,247,0.15);
        }

        .pr-wrap-card.is-popular .pr-card {
          background: linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.05) 100%);
          border: 1px solid rgba(168,85,247,0.45);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.15) inset,
            0 40px 90px -30px rgba(168,85,247,0.5),
            0 0 60px -20px rgba(168,85,247,0.4);
        }
        .pr-wrap-card.is-popular .pr-card:hover {
          border-color: rgba(168,85,247,0.7);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.2) inset,
            0 50px 110px -30px rgba(168,85,247,0.6),
            0 0 80px -20px rgba(168,85,247,0.5);
        }

        .pr-wrap-card.is-popular .pr-card::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 15%;
          right: 15%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #a855f7, transparent);
          filter: blur(1px);
        }

        /* ============ CARD HEAD ============ */
        .pr-card-head {
          position: relative;
          z-index: 2;
          margin-bottom: 24px;
        }
        .pr-card-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }
        .pr-card-name {
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }
        .pr-wrap-card.is-popular .pr-card-name {
          font-size: 30px;
        }
        .pr-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #a5b4fc;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .pr-wrap-card.is-popular .pr-card-icon {
          background: rgba(168,85,247,0.2);
          border-color: rgba(168,85,247,0.4);
          color: #c4b5fd;
          width: 44px;
          height: 44px;
          border-radius: 13px;
        }
        .pr-card:hover .pr-card-icon {
          transform: scale(1.06) rotate(-3deg);
        }

        .pr-card-desc {
          font-size: 13.5px;
          line-height: 1.55;
          color: #94a3b8;
          margin: 0;
          min-height: 40px;
        }
        .pr-wrap-card.is-popular .pr-card-desc {
          font-size: 14.5px;
          min-height: 46px;
        }

        /* ============ FEATURES ============ */
        .pr-card-features {
          position: relative;
          z-index: 2;
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .pr-card-features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.5;
          color: #cbd5e1;
        }
        .pr-wrap-card.is-popular .pr-card-features li {
          font-size: 14.5px;
        }
        .pr-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.25s ease;
        }
        .pr-wrap-card.is-popular .pr-check {
          background: rgba(168,85,247,0.22);
          color: #c4b5fd;
        }
        .pr-card:hover .pr-check {
          transform: scale(1.1);
        }
        .pr-feature-text {
          flex: 1;
          min-width: 0;
        }

        /* ============ CTA ============ */
        .pr-card-cta {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px 20px;
          font-size: 14px;
          font-weight: 700;
          color: #e2e8f0;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.01em;
          margin-top: auto;
          margin-bottom: 24px;
          font-family: inherit;
          cursor: pointer;
        }
        .pr-wrap-card.is-popular .pr-card-cta {
          padding: 15px 22px;
          font-size: 14.5px;
          border-radius: 15px;
        }
        .pr-card-cta:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.25);
          color: #fff;
          transform: translateY(-1px);
        }

        .pr-card-cta.is-primary {
          background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
          color: #fff;
          border-color: transparent;
          box-shadow:
            0 10px 30px -8px rgba(168,85,247,0.6),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .pr-card-cta.is-primary:hover {
          background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%);
          transform: translateY(-2px);
          box-shadow:
            0 16px 40px -10px rgba(168,85,247,0.8),
            inset 0 1px 0 rgba(255,255,255,0.25);
        }
        .pr-card-cta.is-primary svg { transition: transform 0.2s; }
        .pr-card-cta.is-primary:hover svg { transform: translateX(3px); }

        /* ============ PRICE ============ */
        .pr-card-price-wrap {
          position: relative;
          z-index: 2;
          padding-top: 22px;
          border-top: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }
        .pr-card-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
        }
        .pr-card-currency {
          font-size: 22px;
          font-weight: 700;
          color: #818cf8;
        }
        .pr-wrap-card.is-popular .pr-card-currency {
          color: #c4b5fd;
          font-size: 24px;
        }
        .pr-card-amount {
          font-size: 44px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.045em;
          line-height: 1;
          text-shadow: 0 2px 20px rgba(168,85,247,0.3);
        }
        .pr-wrap-card.is-popular .pr-card-amount {
          font-size: 50px;
        }
        .pr-card-unit {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          margin-left: 2px;
        }
        .pr-card-billed {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        /* ============================================================
           ✅ CUSTOM PLAN — Custom Quote instead of price
           ============================================================ */
        .pr-card-price-wrap-custom {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 90px;
        }
        .pr-custom-price-text {
          font-size: 26px;
          font-weight: 900;
          background: linear-gradient(120deg, #a855f7 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .pr-custom-price-sub {
          font-size: 12.5px;
          color: #94a3b8;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .pr-wrap-card.is-popular .pr-custom-price-text {
          font-size: 30px;
        }

        /* ============ FOOT ============ */
        .pr-foot {
          text-align: center;
          margin-top: 96px;
        }
        .pr-foot-text {
          font-size: 14.5px;
          font-weight: 500;
          color: #94a3b8;
          margin: 0;
        }
        .pr-foot-text strong {
          color: #c4b5fd;
          font-weight: 700;
        }

        .pr-loading {
          text-align: center;
          padding: 60px 0;
          color: #94a3b8;
          font-size: 15px;
        }

        /* ============================================================
           TABLET (≤1024px)
           ============================================================ */
        @media (max-width: 1024px) {
          .pr { padding: 96px 0; }
          .pr-title { font-size: 48px; }
          .pr-sub { font-size: 15.5px; }
          .pr-grid { gap: 18px; }
          .pr-card { padding: 30px 22px 26px; }
          .pr-wrap-card.is-popular .pr-card { padding: 34px 24px 30px; }
          .pr-card-name { font-size: 22px; }
          .pr-wrap-card.is-popular .pr-card-name { font-size: 24px; }
          .pr-card-amount { font-size: 36px; }
          .pr-wrap-card.is-popular .pr-card-amount { font-size: 40px; }
        }

        /* ============================================================
           MOBILE (≤768px)
           ============================================================ */
        @media (max-width: 768px) {
          .pr { padding: 72px 0 80px; }
          .pr-wrap { padding: 0 20px; }
          .pr-head { margin-bottom: 56px; }
          .pr-title { font-size: 34px; line-height: 1.1; }
          .pr-sub { font-size: 14.5px; }

          .pr-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            max-width: 420px;
            perspective: none;
          }

          .pr-wrap-card.is-popular,
          .pr.is-visible .pr-wrap-card.is-popular {
            transform: translateY(0);
            margin-top: 8px;
            margin-bottom: 8px;
          }

          .pr-wrap-card.is-popular .pr-card,
          .pr-card {
            padding: 30px 22px 26px;
            border-radius: 20px;
            transform: none !important;
          }

          .pr-wrap-card.is-popular .pr-card {
            padding: 32px 22px 28px;
          }

          .pr-popular-pill {
            top: -14px;
            padding: 7px 16px;
            font-size: 11px;
          }

          .pr-card-name,
          .pr-wrap-card.is-popular .pr-card-name {
            font-size: 21px;
          }
          .pr-card-icon,
          .pr-wrap-card.is-popular .pr-card-icon {
            width: 34px;
            height: 34px;
            border-radius: 10px;
          }
          .pr-card-desc,
          .pr-wrap-card.is-popular .pr-card-desc {
            font-size: 13px;
            min-height: auto;
            margin-bottom: 6px;
          }

          .pr-card-features { gap: 11px; margin-bottom: 22px; }
          .pr-card-features li,
          .pr-wrap-card.is-popular .pr-card-features li {
            font-size: 13.5px;
          }

          .pr-card-cta,
          .pr-wrap-card.is-popular .pr-card-cta {
            padding: 12px 18px;
            font-size: 13.5px;
            margin-bottom: 22px;
            border-radius: 13px;
          }

          .pr-card-amount,
          .pr-wrap-card.is-popular .pr-card-amount {
            font-size: 36px;
          }
          .pr-card-currency,
          .pr-wrap-card.is-popular .pr-card-currency {
            font-size: 19px;
          }
          .pr-card-unit { font-size: 12px; }
          .pr-card-billed { font-size: 11.5px; }

          .pr-custom-price-text { font-size: 22px; }
          .pr-wrap-card.is-popular .pr-custom-price-text { font-size: 24px; }
          .pr-card-price-wrap-custom { min-height: 76px; }

          .pr-foot { margin-top: 48px; }
          .pr-foot-text { font-size: 13.5px; }
        }

        @media (max-width: 380px) {
          .pr-title { font-size: 28px; }
          .pr-card,
          .pr-wrap-card.is-popular .pr-card {
            padding: 26px 18px 22px;
          }
          .pr-card-name,
          .pr-wrap-card.is-popular .pr-card-name {
            font-size: 19px;
          }
          .pr-card-amount,
          .pr-wrap-card.is-popular .pr-card-amount {
            font-size: 32px;
          }
          .pr-card-features li,
          .pr-wrap-card.is-popular .pr-card-features li {
            font-size: 13px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .pr-card,
          .pr-card-shine,
          .pr-popular-pill,
          .pr-eyebrow-dot {
            animation: none !important;
            transition: none !important;
          }
          .pr-wrap-card,
          .pr-wrap-card.is-popular {
            opacity: 1 !important;
            transform: none !important;
          }
          .pr-card,
          .pr-wrap-card.is-popular .pr-card {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}