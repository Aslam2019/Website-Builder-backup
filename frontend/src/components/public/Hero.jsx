import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

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
  const [content, setContent] = useState({
    title: 'Your Website.',
    accent: 'Your Way.',
    subtitle: 'Choose from a beautiful collection of templates, customize it yourself, and get your website live — in just a few clicks.'
  })

  const [text, setText] = useState('')
  const fullText = content.title
  const [showAccent, setShowAccent] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axiosClient.get('/settings/frontend')
        const apiContent = res.data?.data?.content?.hero
        if (apiContent) {
          setContent(apiContent)
        }
      } catch (e) {
        console.warn('Hero: content fetch failed', e?.message)
      }
    }
    fetchContent()
  }, [])

  useEffect(() => {
    let i = 0
    setText('')
    setShowAccent(false)
    const interval = setInterval(() => {
      setText(fullText.slice(0, i))
      i++
      if (i > fullText.length) {
        clearInterval(interval)
        setTimeout(() => setShowAccent(true), 300)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [fullText])

  return (
    <section id="home" className="hero" style={interStyle}>
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-glow hero-bg-glow-1" />
        <div className="hero-bg-glow hero-bg-glow-2" />
        <div className="hero-bg-glow hero-bg-glow-3" />
      </div>

      <div className="hero-container">
        <div className="hero-content">
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

          <h1 className="hero-title" style={heading}>
            {text}
            <span className="cursor" />
            <br />
            <span className={`hero-accent ${showAccent ? 'fade-in' : ''}`}>
              {content.accent}
            </span>
          </h1>

          <p className="hero-desc">
            {content.subtitle}
          </p>

          <div className="hero-actions">
            <Link to="/register" className="hero-btn hero-btn-primary">
              <span>Create Your Website</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#pricing" className="hero-btn hero-btn-ghost">
              
              <span> Click to Check Plans</span>
            </a>
          </div>

          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-icon" style={{ background: '#f5f3ff', color: '#8b5cf6', borderColor: '#ddd6fe' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Easy to Customize</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Make it yours, instantly</div>
              </div>
            </div>

            <div className="hero-feature">
              <span className="hero-feature-icon" style={{ background: '#eff6ff', color: '#3b82f6', borderColor: '#bfdbfe' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2.5" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Mobile Ready</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Looks great on all devices</div>
              </div>
            </div>

            <div className="hero-feature">
              <span className="hero-feature-icon" style={{ background: '#ecfdf5', color: '#10b981', borderColor: '#a7f3d0' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Publish with Ease</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Go live in minutes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img
              src="/images/hero-image.png"
              alt="Website Builder Preview"
              className="hero-image"
            />
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          background-color: #ffffff;
          padding-top: 40px; /* ✅ Konjam mela thookki */
        }

        .hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hero-bg-glow { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.4; }
        .hero-bg-glow-1 { width: 600px; height: 600px; background: radial-gradient(circle, #c7d2fe 0%, transparent 70%); top: -200px; left: -200px; }
        .hero-bg-glow-2 { width: 800px; height: 800px; background: radial-gradient(circle, #f3e8ff 0%, transparent 70%); top: -100px; right: -300px; }
        .hero-bg-glow-3 { width: 500px; height: 500px; background: radial-gradient(circle, #e0f2fe 0%, transparent 70%); bottom: -200px; left: 30%; }

        .hero-container {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-content { max-width: 100%; min-width: 0; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 10px; padding: 8px 18px 8px 14px;
          background: #f8fafc; color: #4f46e5; border: 1px solid #e0e7ff; border-radius: 999px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.05em;
          margin-bottom: 32px;
        }
        .hero-badge-spark { display: inline-flex; align-items: center; justify-content: center; color: #6366f1; flex-shrink: 0; }
        .hero-badge-text { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
        .hero-badge-dot { width: 4px; height: 4px; background: #a5b4fc; border-radius: 50%; display: inline-block; }

        .hero-title {
          font-size: 72px;
          line-height: 1.05;
          color: #0f172a;
          margin: 0 0 24px;
          min-height: 160px;
        }
        .hero-accent {
          background: linear-gradient(120deg, #6366f1 0%, #a855f7 55%, #d946ef 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          display: inline-block;
        }
        .fade-in { opacity: 1; transform: translateY(0); }

        /* ✅ Single Line Cursor */
        .cursor {
          display: inline-block; 
          width: 2px; 
          height: 0.75em; 
          background-color: #6366f1;
          margin-left: 6px; 
          vertical-align: text-bottom;
          animation: blink 1s step-end infinite; 
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .hero-desc {
          font-size: 20px; line-height: 1.6; color: #475569; margin: 0 0 40px; max-width: 90%; font-weight: 400;
        }

        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 56px; }
        .hero-btn {
          display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px;
          font-size: 16px; font-weight: 700; border-radius: 12px; text-decoration: none;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit;
          cursor: pointer; border: none; white-space: nowrap; letter-spacing: -0.01em;
        }
        .hero-btn-primary { background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: #fff; box-shadow: 0 10px 24px -8px rgba(99, 102, 241, 0.6); }
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 32px -10px rgba(99, 102, 241, 0.7); }
        .hero-btn-primary svg { transition: transform 0.2s; }
        .hero-btn-primary:hover svg { transform: translateX(3px); }

        .hero-btn-ghost { background: #ffffff; color: #4f46e5; border: 1.5px solid #e0e7ff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .hero-btn-ghost:hover { background: #f8fafc; border-color: #c7d2fe; transform: translateY(-2px); }

        .hero-features { display: flex; gap: 32px; flex-wrap: wrap; }
        .hero-feature { display: flex; align-items: center; gap: 14px; }
        .hero-feature-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 12px;
          flex-shrink: 0; border: 1px solid transparent;
        }

        .hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
        }

        .hero-image-wrapper {
          width: 100%;
          max-width: 650px;
          position: relative;
        }

        .hero-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          mix-blend-mode: multiply;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        @media (max-width: 1100px) {
          .hero-container { grid-template-columns: 1fr; gap: 50px; text-align: center; }
          .hero-content { max-width: 100%; margin: 0 auto; }
          .hero-badge { margin-left: auto; margin-right: auto; }
          .hero-desc { margin-left: auto; margin-right: auto; }
          .hero-actions { justify-content: center; }
          .hero-features { justify-content: center; }
          .hero-image-wrapper { margin: 0 auto; max-width: 600px; }
          .hero-title { font-size: 60px; min-height: auto; }
        }

        @media (max-width: 640px) {
          .hero { padding: 60px 0; }
          .hero-container { padding: 0 20px; }

          .hero-badge { font-size: 10px; padding: 6px 14px; margin-bottom: 24px; }
          .hero-badge-text { gap: 6px; }
          .hero-badge-dot { width: 3px; height: 3px; }

          .hero-title { font-size: 44px; line-height: 1.1; margin-bottom: 20px; }
          .hero-desc { font-size: 16px; margin-bottom: 32px; }

          .hero-actions { flex-direction: column; width: 100%; margin-bottom: 40px; gap: 12px; }
          .hero-btn { width: 100%; justify-content: center; padding: 16px 24px; }

          .hero-features { gap: 20px; flex-direction: column; align-items: flex-start; }
          .hero-feature { text-align: left; }

          .hero-image-wrapper { max-width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-btn-primary, .hero-btn-ghost { transition: none !important; }
          .hero-image { animation: none !important; }
        }
      `}</style>
    </section>
  )
}