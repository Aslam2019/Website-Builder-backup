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
  letterSpacing: '-0.045em',
}

export default function Hero() {
  return (
    <section id="home" className="hero" style={interStyle}>
      {/* Background decoration */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-glow hero-bg-glow-1" />
        <div className="hero-bg-glow hero-bg-glow-2" />
        <div className="hero-bg-glow hero-bg-glow-3" />
      </div>

      <div className="hero-container">
        {/* ============================================
            LEFT — CONTENT
            ============================================ */}
        <div className="hero-content">

          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-spark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z" fill="currentColor" />
              </svg>
            </span>
            <span className="hero-badge-text">
              <span>NO CODE</span>
              <span className="hero-badge-dot" />
              <span>NO PROMPT</span>
              <span className="hero-badge-dot" />
              <span>NO DRAG & DROP</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-title" style={heading}>
            Your Website.<br />
            <span className="hero-accent">Your Way.</span>
          </h1>

          {/* Description */}
          <p className="hero-desc">
            Choose a category, personalize a ready-made template, and
            publish your website in a few easy steps.
          </p>

          {/* CTA buttons */}
          <div className="hero-actions">
            <Link to="/register" className="hero-btn hero-btn-primary">
              <span>Create Your Website</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#pricing" className="hero-btn hero-btn-ghost">
              <span>Explore Templates</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Feature row */}
          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
              </span>
              <span>Easy to Customize</span>
            </div>

            <div className="hero-feature">
              <span className="hero-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2.5" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </span>
              <span>Mobile Ready</span>
            </div>

            <div className="hero-feature">
              <span className="hero-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span>Publish with Ease</span>
            </div>
          </div>

        </div>

        {/* ============================================
            RIGHT — IMAGE (blend mode removes white bg)
            ============================================ */}
        <div className="hero-visual">
          <img
            src="/images/hero-image.png"
            alt="Website Builder Preview"
            className="hero-image"
            loading="eager"
          />
        </div>
      </div>

      {/* ============================================
          STYLES
          ============================================ */}
      <style>{`
        /* ============ SECTION ============ */
        .hero {
          position: relative;
          padding: 64px 0 96px;
          background: linear-gradient(180deg, #fafbff 0%, #f5f3ff 100%);
          overflow: hidden;
          isolation: isolate;
        }

        .hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hero-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
        }
        .hero-bg-glow-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #c7d2fe 0%, transparent 70%);
          top: -200px; left: -100px;
        }
        .hero-bg-glow-2 {
          width: 620px; height: 620px;
          background: radial-gradient(circle, #ddd6fe 0%, transparent 70%);
          top: -100px; right: -200px;
        }
        .hero-bg-glow-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #cffafe 0%, transparent 70%);
          bottom: -180px; left: 40%;
        }

        .hero-container {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        /* ============================================
           LEFT — CONTENT
           ============================================ */
        .hero-content { min-width: 0; max-width: 560px; }

        /* Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 18px 8px 14px;
          background: #fff;
          color: #4f46e5;
          border: 1px solid #e0e7ff;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          margin-bottom: 28px;
          box-shadow: 0 4px 12px -4px rgba(99, 102, 241, 0.15);
        }
        .hero-badge-spark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          flex-shrink: 0;
        }
        .hero-badge-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .hero-badge-dot {
          width: 4px; height: 4px;
          background: #c7d2fe;
          border-radius: 50%;
          display: inline-block;
        }

        /* Title */
        .hero-title {
          font-size: 68px;
          line-height: 1.02;
          color: #0a0f1e;
          margin: 0 0 24px;
        }
        .hero-accent {
          background: linear-gradient(120deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Description */
        .hero-desc {
          font-size: 17px;
          line-height: 1.7;
          color: #475569;
          margin: 0 0 32px;
          max-width: 520px;
          font-weight: 400;
        }

        /* Actions */
        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 15px 26px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          cursor: pointer;
          border: none;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .hero-btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          color: #fff;
          box-shadow:
            0 10px 24px -8px rgba(99, 102, 241, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow:
            0 16px 32px -10px rgba(99, 102, 241, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .hero-btn-primary svg { transition: transform 0.2s; }
        .hero-btn-primary:hover svg { transform: translateX(3px); }

        .hero-btn-ghost {
          background: transparent;
          color: #4f46e5;
          border: 1.5px solid #e0e7ff;
        }
        .hero-btn-ghost:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
          transform: translateY(-2px);
        }
        .hero-btn-ghost svg { transition: transform 0.2s; }
        .hero-btn-ghost:hover svg { transform: translateX(3px); }

        /* Feature row */
        .hero-features {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }
        .hero-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
        }
        .hero-feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 11px;
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          color: #6366f1;
          flex-shrink: 0;
          border: 1px solid #e0e7ff;
        }

        /* ============================================
           RIGHT — IMAGE WITH BLEND MODE
           White background in image will blend away
           ============================================ */
        .hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
        }

        .hero-image {
          width: 100%;
          max-width: 580px;
          height: auto;
          display: block;
          object-fit: contain;

          /* ✨ MAGIC: white bg blends with section background */
          mix-blend-mode: multiply;

          /* Optional: subtle darkening for depth */
          filter: contrast(1.02) saturate(1.05);

          /* Smooth transition */
          transition: filter 0.3s ease;
        }

        /* ============================================
           RESPONSIVE — TABLET
           ============================================ */
        @media (max-width: 1100px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 50px;
          }
          .hero-content {
            max-width: 100%;
            text-align: center;
            margin: 0 auto;
          }
          .hero-badge { margin-left: auto; margin-right: auto; }
          .hero-desc { margin-left: auto; margin-right: auto; }
          .hero-actions { justify-content: center; }
          .hero-features { justify-content: center; }
          .hero-visual {
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
          }
          .hero-image { max-width: 580px; }
        }

        /* ============================================
           RESPONSIVE — MOBILE
           ============================================ */
        @media (max-width: 640px) {
          .hero { padding: 40px 0 60px; }
          .hero-container { padding: 0 20px; gap: 36px; }

          .hero-badge {
            font-size: 9.5px;
            padding: 6px 12px 6px 10px;
            margin-bottom: 22px;
            letter-spacing: 0.04em;
          }
          .hero-badge-text { gap: 6px; }
          .hero-badge-dot { width: 3px; height: 3px; }

          .hero-title {
            font-size: 40px;
            line-height: 1.08;
            margin-bottom: 18px;
          }

          .hero-desc {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 26px;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
            margin-bottom: 32px;
            gap: 10px;
          }
          .hero-btn {
            width: 100%;
            justify-content: center;
            padding: 14px 22px;
            font-size: 14.5px;
          }

          .hero-features {
            gap: 16px;
            justify-content: center;
          }
          .hero-feature {
            font-size: 13px;
            gap: 8px;
          }
          .hero-feature-icon {
            width: 34px; height: 34px;
            border-radius: 10px;
          }

          .hero-image {
            max-width: 100%;
          }
        }

        @media (max-width: 400px) {
          .hero-title { font-size: 34px; }
          .hero-badge-text span:nth-child(2n) { display: none; }
          .hero-badge-text { gap: 4px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-btn-primary,
          .hero-btn-ghost { transition: none !important; }
        }
      `}</style>
    </section>
  )
}