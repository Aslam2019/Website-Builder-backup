import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

export default function CategoriesSection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get('/categories')
        const list =
          res.data?.data?.categories ||
          res.data?.categories ||
          res.data?.data ||
          res.data ||
          []
        if (Array.isArray(list)) setCategories(list)
        else setCategories([])
      } catch (err) {
        console.error('Category fetch failed:', err?.message || err)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  /* ============================================================
     ✅ Category click → REGISTER page ku povum
     ============================================================ */
  const handleClick = (cat) => {
    navigate('/register', {
      state: {
        category: cat,
        categorySlug: cat.slug,
        categoryName: cat.name,
      },
    })
  }

  const getPreviewImage = (cat) => {
    const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'default'
    return `/category-previews/${slug}.jpg`
  }

  return (
    <section id="categories" className="cs-section">
      {/* Background decorations */}
      <div className="cs-bg" aria-hidden="true">
        <div className="cs-bg-glow cs-bg-glow-1" />
        <div className="cs-bg-glow cs-bg-glow-2" />
        <div className="cs-bg-grid" />
      </div>

      <div className="cs-container">
        {/* ============ HEADER ============ */}
        <div className="cs-head">
          <span className="cs-badge">
            <span className="cs-badge-dot" />
            Browse
          </span>
          <h2 className="cs-title">
            Choose Your <span className="cs-title-accent">Category</span>
          </h2>
          <p className="cs-subtitle">
            Pick a category to explore ready-made website templates built for your business.
          </p>
        </div>

        {/* ============ CONTENT ============ */}
        {loading ? (
          <div className="cs-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="cs-skeleton">
                <div className="cs-skeleton-img" />
                <div className="cs-skeleton-body">
                  <div className="cs-skeleton-line cs-skeleton-line-lg" />
                  <div className="cs-skeleton-line cs-skeleton-line-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="cs-empty">
            <div className="cs-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="cs-empty-title">No categories yet</h3>
            <p className="cs-empty-hint">Admin panel la categories add pannunga</p>
          </div>
        ) : (
          <div className="cs-grid">
            {categories.map((cat, i) => (
              <button
                key={cat._id || cat.slug || i}
                type="button"
                className="cs-card"
                onClick={() => handleClick(cat)}
                style={{ '--delay': `${i * 60}ms` }}
                aria-label={`Choose ${cat.name} and register`}
              >
                {/* Image */}
                <div className="cs-card-media">
                  <img
                    src={getPreviewImage(cat)}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/category-previews/default.jpg'
                    }}
                  />
                  <div className="cs-card-media-overlay" />

                  {/* Arrow */}
                  <span className="cs-card-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>

                  {/* Category label overlay */}
                  <div className="cs-card-media-label">
                    <span>{cat.name}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="cs-card-body">
                  <h3 className="cs-card-name">{cat.name}</h3>
                  <p className="cs-card-desc">
                    {cat.description || 'Explore ready-made templates'}
                  </p>
                  <span className="cs-card-cta">
                    Get Started
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>

                {/* Border shine */}
                <span className="cs-card-border" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* ============================================================
           SECTION
           ============================================================ */
        .cs-section {
          position: relative;
          padding: 120px 24px 130px;
          background: #07051a;
          overflow: hidden;
          isolation: isolate;
        }

        /* ============================================================
           BACKGROUND
           ============================================================ */
        .cs-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .cs-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
        }
        .cs-bg-glow-1 {
          width: 620px;
          height: 620px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%);
          top: -15%;
          left: -10%;
        }
        .cs-bg-glow-2 {
          width: 680px;
          height: 680px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 70%);
          bottom: -20%;
          right: -12%;
        }
        .cs-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 80%);
          opacity: 0.6;
        }

        .cs-container {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
        }

        /* ============================================================
           HEADER
           ============================================================ */
        .cs-head {
          text-align: center;
          margin-bottom: 72px;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }

        .cs-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px 7px 12px;
          border-radius: 999px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          color: #a5b4fc;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .cs-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.25);
          animation: csPulse 2s ease-in-out infinite;
        }
        @keyframes csPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.25); }
          50%      { box-shadow: 0 0 0 6px rgba(129, 140, 248, 0.08); }
        }

        .cs-title {
          font-size: 54px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.04em;
          margin: 0 0 20px;
          line-height: 1.08;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cs-title-accent {
          background: linear-gradient(120deg, #818cf8 0%, #a855f7 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cs-subtitle {
          font-size: 16.5px;
          color: #94a3b8;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 400;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ============================================================
           GRID
           ============================================================ */
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        /* ============================================================
           CARD
           ============================================================ */
        .cs-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 0;
          background: rgba(255, 255, 255, 0.028);
          border: 1.5px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          cursor: pointer;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: left;
          overflow: hidden;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition:
            transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.35s ease,
            box-shadow 0.5s ease;
          animation: csCardIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) backwards;
          animation-delay: var(--delay, 0ms);
        }
        @keyframes csCardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cs-card:hover {
          transform: translateY(-6px);
          border-color: rgba(129, 140, 248, 0.4);
          box-shadow:
            0 32px 64px -28px rgba(99, 102, 241, 0.5),
            0 16px 32px -16px rgba(168, 85, 247, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .cs-card-border {
          position: absolute;
          inset: 0;
          border-radius: 22px;
          padding: 1.5px;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(129, 140, 248, 0.6) 30%,
            rgba(168, 85, 247, 0.6) 50%,
            rgba(129, 140, 248, 0.6) 70%,
            transparent 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .cs-card:hover .cs-card-border { opacity: 1; }

        /* ============================================================
           MEDIA
           ============================================================ */
        .cs-card-media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1834 0%, #0f0d24 100%);
        }
        .cs-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .cs-card:hover .cs-card-media img {
          transform: scale(1.08);
        }

        .cs-card-media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(11, 10, 31, 0) 30%,
            rgba(11, 10, 31, 0.3) 65%,
            rgba(11, 10, 31, 0.95) 100%
          );
          pointer-events: none;
        }

        .cs-card-media-label {
          position: absolute;
          bottom: 14px;
          left: 16px;
          display: inline-flex;
          align-items: center;
          padding: 5px 11px;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          z-index: 2;
        }

        .cs-card-arrow {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 11px;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          opacity: 0;
          transform: translate(4px, -4px) scale(0.9);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cs-card:hover .cs-card-arrow {
          opacity: 1;
          transform: translate(0, 0) scale(1);
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-color: transparent;
          box-shadow:
            0 8px 20px -6px rgba(99, 102, 241, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        /* ============================================================
           BODY
           ============================================================ */
        .cs-card-body {
          position: relative;
          padding: 22px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 1;
          flex: 1;
        }

        .cs-card-name {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.025em;
          margin: 0;
          line-height: 1.25;
        }

        .cs-card-desc {
          font-size: 13.5px;
          color: #94a3b8;
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .cs-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: #a5b4fc;
          letter-spacing: 0.01em;
          transition: gap 0.3s ease, color 0.3s ease;
        }
        .cs-card:hover .cs-card-cta {
          gap: 10px;
          color: #c4b5fd;
        }
        .cs-card-cta svg {
          transition: transform 0.3s ease;
        }
        .cs-card:hover .cs-card-cta svg {
          transform: translateX(2px);
        }

        /* ============================================================
           SKELETON
           ============================================================ */
        .cs-skeleton {
          background: rgba(255, 255, 255, 0.025);
          border: 1.5px solid rgba(255, 255, 255, 0.06);
          border-radius: 22px;
          overflow: hidden;
        }
        .cs-skeleton-img {
          width: 100%;
          aspect-ratio: 16 / 11;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 25%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 75%
          );
          background-size: 200% 100%;
          animation: csShimmer 1.6s infinite;
        }
        .cs-skeleton-body {
          padding: 22px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cs-skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 25%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 75%
          );
          background-size: 200% 100%;
          animation: csShimmer 1.6s infinite;
        }
        .cs-skeleton-line-lg { width: 55%; height: 14px; }
        .cs-skeleton-line-sm { width: 85%; }
        @keyframes csShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ============================================================
           EMPTY
           ============================================================ */
        .cs-empty {
          text-align: center;
          padding: 90px 20px;
        }
        .cs-empty-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 88px;
          height: 88px;
          border-radius: 24px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #818cf8;
          margin-bottom: 22px;
        }
        .cs-empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }
        .cs-empty-hint {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */
        @media (max-width: 1100px) {
          .cs-section { padding: 100px 20px 110px; }
          .cs-title { font-size: 46px; }
          .cs-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 22px;
          }
        }

        @media (max-width: 900px) {
          .cs-section { padding: 90px 18px 100px; }
          .cs-head { margin-bottom: 56px; }
          .cs-title { font-size: 38px; }
          .cs-subtitle { font-size: 15.5px; }
          .cs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
        }

        @media (max-width: 640px) {
          .cs-section { padding: 70px 14px 80px; }
          .cs-head { margin-bottom: 40px; }
          .cs-badge {
            font-size: 10.5px;
            padding: 6px 13px 6px 10px;
            letter-spacing: 0.08em;
          }
          .cs-title {
            font-size: 28px;
            line-height: 1.15;
            margin-bottom: 14px;
          }
          .cs-subtitle {
            font-size: 13.5px;
            padding: 0 6px;
            line-height: 1.6;
          }
          .cs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .cs-card { border-radius: 16px; }
          .cs-card:hover { transform: translateY(-4px); }
          .cs-card-media { aspect-ratio: 16 / 11; }
          .cs-card-media-label {
            font-size: 9.5px;
            padding: 4px 8px;
            bottom: 10px;
            left: 10px;
          }
          .cs-card-body {
            padding: 14px 14px 16px;
            gap: 5px;
          }
          .cs-card-name {
            font-size: 14px;
            line-height: 1.3;
          }
          .cs-card-desc {
            font-size: 11.5px;
            line-height: 1.45;
            -webkit-line-clamp: 2;
          }
          .cs-card-cta {
            font-size: 11px;
            margin-top: 4px;
          }
          .cs-card-cta svg { width: 10px; height: 10px; }
          .cs-card-arrow {
            opacity: 1;
            transform: translate(0, 0) scale(1);
            width: 30px;
            height: 30px;
            top: 10px;
            right: 10px;
            border-radius: 9px;
          }
          .cs-card-arrow svg { width: 12px; height: 12px; }
          .cs-skeleton-body { padding: 14px 14px 16px; }
          .cs-empty { padding: 60px 16px; }
          .cs-empty-icon { width: 70px; height: 70px; }
          .cs-empty-title { font-size: 16px; }
        }

        @media (max-width: 420px) {
          .cs-section { padding: 60px 12px 70px; }
          .cs-title { font-size: 24px; }
          .cs-subtitle { font-size: 12.5px; }
          .cs-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .cs-card-media { aspect-ratio: 16 / 10; }
          .cs-card-body { padding: 16px 18px 18px; }
          .cs-card-name { font-size: 16px; }
          .cs-card-desc { font-size: 13px; }
          .cs-card-cta { font-size: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-card,
          .cs-card-media img,
          .cs-card-arrow,
          .cs-badge-dot,
          .cs-skeleton-img,
          .cs-skeleton-line {
            animation: none !important;
            transition: none !important;
          }
          .cs-card:hover { transform: none !important; }
          .cs-card:hover .cs-card-media img { transform: none !important; }
        }
      `}</style>
    </section>
  )
}