import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

/* ✅ Build full URL for images */
const getFullUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  return `${base}${url}`
}

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const heading = {
  ...interStyle,
  fontWeight: 800,
  letterSpacing: '-0.02em',
}

const COLUMNS = [
  {
    title: 'Product',
    links: [
      ['#how-it-works', 'How It Works'],
      ['#pricing', 'Pricing'],
      ['#why-choose-us', 'Why Choose Us'],
      ['#faq', 'FAQ'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['#about', 'About Us'],
      ['#contact', 'Contact'],
    ],
  },
  {
    title: 'Get Started',
    links: [
      ['/login', 'Login'],
      ['/register', 'Register'],
      ['/dashboard', 'Dashboard'],
    ],
  },
]

export default function Footer() {
  const [site, setSite] = useState({ logo_url: '', site_name: 'WebsiteBuilder' })
  const [terms, setTerms] = useState([])
  const year = new Date().getFullYear()

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      // --- Site settings ---
      try {
        const siteRes = await axiosClient.get('/settings/site')
        const siteData = siteRes?.data?.data
        if (mounted && siteData) setSite(siteData)
      } catch (e) {
        console.warn('Footer: site settings failed', e?.message)
      }

      // --- Public terms ---
      try {
        const termsRes = await axiosClient.get('/settings/terms')
        const raw = termsRes?.data?.data

        // Handle BOTH shapes: array OR { terms: [] }
        let list = []
        if (Array.isArray(raw)) list = raw
        else if (Array.isArray(raw?.terms)) list = raw.terms

        if (mounted) setTerms(list)
      } catch (e) {
        console.warn('Footer: terms failed', e?.message)
        if (mounted) setTerms([])
      }
    }

    fetchData()
    window.addEventListener('focus', fetchData)
    return () => {
      mounted = false
      window.removeEventListener('focus', fetchData)
    }
  }, [])

  /* Brand name split */
  const name = site.site_name || 'WebsiteBuilder'
  const idx = name.lastIndexOf(' ')
  const brandA = idx > 0 ? name.slice(0, idx + 1) : name.slice(0, Math.ceil(name.length / 2))
  const brandB = idx > 0 ? name.slice(idx + 1) : name.slice(Math.ceil(name.length / 2))

  /* Active terms only (safety — backend already filters) */
  const activeTerms = terms.filter((t) => t.is_active !== false)

  return (
    <footer className="ft" style={interStyle}>
      <div className="ft-bg" aria-hidden="true">
        <div className="ft-bg-glow-1" />
        <div className="ft-bg-glow-2" />
      </div>

      <div className="ft-wrap">

        {/* ============ TOP GRID ============ */}
        <div className="ft-grid">

          {/* Brand */}
          <div className="ft-brand-col">
            <Link to="/" className="ft-brand">
              {site.logo_url ? (
                <img src={getFullUrl(site.logo_url)} alt={site.site_name} className="ft-brand-logo" />
              ) : (
                <span className="ft-brand-mark">WB</span>
              )}
              <span className="ft-brand-name">
                {brandA}<span>{brandB}</span>
              </span>
            </Link>
            <p className="ft-brand-desc">
              Create a professional website in minutes — no code, no hassle.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title} className="ft-col">
              <h4 className="ft-col-title" style={heading}>{col.title}</h4>
              <ul className="ft-col-list">
                {col.links.map(([to, label], i) => (
                  <li key={i}>
                    {to.startsWith('#') ? (
                      <a href={to} className="ft-link">{label}</a>
                    ) : (
                      <Link to={to} className="ft-link">{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal — dynamic terms */}
          <div className="ft-col">
            <h4 className="ft-col-title" style={heading}>Legal</h4>
            <ul className="ft-col-list">
              {activeTerms.length > 0 ? (
                activeTerms.map((t) => (
                  <li key={t.slug}>
                    <Link to={`/terms/${t.slug}`} className="ft-link">
                      {t.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <span className="ft-link ft-link-empty">No documents yet</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* ============ BOTTOM BAR — centered copyright ============ */}
        <div className="ft-bottom">
          <p className="ft-copy">
            © {year} <strong>{site.site_name || 'WebsiteBuilder'}</strong>. All rights reserved.
          </p>
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        .ft {
          position: relative;
          padding: 64px 0 28px;
          background: #0a0616;
          color: #cbd5e1;
          overflow: hidden;
          isolation: isolate;
        }

        .ft-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .ft-bg-glow-1 {
          position: absolute; top: -50%; left: -10%;
          width: 560px; height: 560px; border-radius: 50%;
          filter: blur(150px);
          background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
        }
        .ft-bg-glow-2 {
          position: absolute; bottom: -50%; right: -10%;
          width: 560px; height: 560px; border-radius: 50%;
          filter: blur(150px);
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
        }

        .ft-wrap {
          position: relative; z-index: 1;
          max-width: 1240px; margin: 0 auto;
          padding: 0 40px;
        }

        /* GRID */
        .ft-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* BRAND */
        .ft-brand-col { max-width: 340px; }
        .ft-brand {
          display: inline-flex; align-items: center;
          gap: 12px; text-decoration: none; margin-bottom: 16px;
        }
        .ft-brand-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 11px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: #fff; font-weight: 800; font-size: 15px;
          letter-spacing: -0.02em;
          box-shadow: 0 10px 24px -8px rgba(124,58,237,0.6);
          flex-shrink: 0;
        }
        .ft-brand-logo {
          height: 40px; width: auto; max-width: 44px;
          object-fit: contain; display: block; flex-shrink: 0;
        }
        .ft-brand-name {
          font-size: 20px; font-weight: 800;
          color: #fff; letter-spacing: -0.03em;
          white-space: nowrap;
        }
        .ft-brand-name span { color: #a78bfa; }
        .ft-brand-desc {
          font-size: 14px; line-height: 1.65;
          color: #94a3b8; margin: 0;
        }

        /* COLUMNS */
        .ft-col-title {
          font-size: 11.5px; font-weight: 800;
          color: #fff;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0 0 18px;
        }
        .ft-col-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 12px;
        }
        .ft-link {
          display: inline-block;
          font-size: 14px; font-weight: 500;
          color: #94a3b8; text-decoration: none;
          transition: all 0.2s ease;
        }
        .ft-link:hover {
          color: #fff;
          transform: translateX(3px);
        }
        .ft-link-empty {
          color: #475569; font-style: italic;
          cursor: default;
        }
        .ft-link-empty:hover { color: #475569; transform: none; }

        /* BOTTOM BAR — centered */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 24px;
          text-align: center;
        }
        .ft-copy {
          font-size: 13px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }
        .ft-copy strong { color: #94a3b8; font-weight: 600; }

        /* ============================================================
           TABLET
           ============================================================ */
        @media (max-width: 1024px) {
          .ft { padding: 52px 0 24px; }
          .ft-wrap { padding: 0 32px; }
          .ft-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 36px 28px;
            padding-bottom: 32px;
          }
          .ft-brand-col { grid-column: 1 / -1; max-width: 100%; }
        }

        /* ============================================================
           MOBILE
           ============================================================ */
        @media (max-width: 640px) {
          .ft { padding: 44px 0 20px; }
          .ft-wrap { padding: 0 20px; }

          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px 20px;
            padding-bottom: 28px;
          }
          .ft-brand-col { grid-column: 1 / -1; }
          .ft-brand { margin-bottom: 12px; }
          .ft-brand-name { font-size: 17px; }
          .ft-brand-mark { width: 34px; height: 34px; font-size: 12px; }
          .ft-brand-logo { height: 34px; max-width: 38px; }
          .ft-brand-desc { font-size: 13px; line-height: 1.6; }

          .ft-col-title { font-size: 10.5px; margin-bottom: 14px; letter-spacing: 0.14em; }
          .ft-col-list { gap: 10px; }
          .ft-link { font-size: 13px; }

          .ft-bottom { padding-top: 20px; }
          .ft-copy { font-size: 12px; line-height: 1.5; }
        }

        @media (max-width: 380px) {
          .ft-grid { gap: 24px 14px; }
          .ft-brand-name { font-size: 16px; }
          .ft-link { font-size: 12.5px; }
          .ft-copy { font-size: 11.5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ft-link { transition: none !important; }
        }
      `}</style>
    </footer>
  )
}