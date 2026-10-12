import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
}

const heading = {
  ...interStyle,
  fontWeight: 900,
  letterSpacing: '-0.04em',
}

// Use same base URL as your axiosClient
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Terms() {
  const { slug } = useParams()
  const [term, setTerm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    fetch(`${API_BASE}/settings/terms/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (!mounted) return
        const doc = data?.data || data
        if (!doc || !doc.title) {
          setError('Document not found')
          setTerm(null)
        } else {
          setTerm(doc)
        }
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.message || 'Not found')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) return <Loader />

  if (error || !term) {
    return (
      <div className="trm-error" style={interStyle}>
        <div className="trm-error-box">
          <h1 style={heading}>404</h1>
          <p>{error || 'Document not found'}</p>
          <Link to="/" className="trm-error-btn">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <article className="trm" style={interStyle}>
      <div className="trm-wrap">

        {/* Header */}
        <header className="trm-head">
          <Link to="/" className="trm-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>

          <h1 className="trm-title" style={heading}>{term.title}</h1>

          {term.updated_at && (
            <div className="trm-meta">
              Last updated on{' '}
              {new Date(term.updated_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          )}
        </header>

        {/* Content — Rich HTML from admin */}
        <div
          className="trm-content"
          dangerouslySetInnerHTML={{ __html: term.content || '<p>No content</p>' }}
        />

      </div>

      <style>{`
        .trm {
          padding: 80px 0 100px;
          background: #ffffff;
          color: #0a0f1e;
          min-height: 100vh;
        }
        .trm-wrap {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* Header */
        .trm-head {
          padding-bottom: 32px;
          margin-bottom: 40px;
          border-bottom: 1px solid #e5e7eb;
        }
        .trm-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 600;
          color: #7c3aed;
          text-decoration: none;
          margin-bottom: 24px;
          transition: all 0.2s;
        }
        .trm-back:hover {
          gap: 9px;
          color: #6d28d9;
        }

        .trm-title {
          font-size: 44px;
          line-height: 1.15;
          color: #0a0f1e;
          margin: 0 0 12px;
        }
        .trm-meta {
          font-size: 13.5px;
          color: #64748b;
          font-weight: 500;
        }

        /* Content — Word-like */
        .trm-content {
          font-size: 16px;
          line-height: 1.8;
          color: #334155;
          font-weight: 400;
        }
        .trm-content h1 { font-size: 32px; font-weight: 800; color: #0a0f1e; margin: 40px 0 16px; }
        .trm-content h2 { font-size: 26px; font-weight: 800; color: #0a0f1e; margin: 32px 0 14px; }
        .trm-content h3 { font-size: 20px; font-weight: 700; color: #0a0f1e; margin: 24px 0 12px; }
        .trm-content p { margin: 0 0 16px; }
        .trm-content ul, .trm-content ol { margin: 0 0 16px; padding-left: 24px; }
        .trm-content li { margin-bottom: 8px; }
        .trm-content strong { font-weight: 700; color: #0a0f1e; }
        .trm-content em { font-style: italic; }
        .trm-content u { text-decoration: underline; }
        .trm-content a { color: #7c3aed; text-decoration: underline; }
        .trm-content blockquote {
          border-left: 3px solid #7c3aed;
          padding-left: 16px;
          margin: 20px 0;
          color: #64748b;
          font-style: italic;
        }
        .trm-content [style*="text-align: center"] { text-align: center; }
        .trm-content [style*="text-align: right"] { text-align: right; }
        .trm-content [style*="text-align: justify"] { text-align: justify; }

        /* Error page */
        .trm-error {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          padding: 40px 20px;
        }
        .trm-error-box {
          text-align: center;
          max-width: 400px;
        }
        .trm-error-box h1 {
          font-size: 80px;
          margin: 0;
          background: linear-gradient(120deg, #7c3aed, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .trm-error-box p {
          font-size: 16px;
          color: #64748b;
          margin: 8px 0 24px;
        }
        .trm-error-btn {
          display: inline-block;
          padding: 12px 24px;
          background: #7c3aed;
          color: #fff;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .trm { padding: 56px 0 72px; }
          .trm-wrap { padding: 0 20px; }
          .trm-title { font-size: 32px; }
          .trm-content { font-size: 15px; line-height: 1.75; }
          .trm-content h1 { font-size: 26px; }
          .trm-content h2 { font-size: 22px; }
          .trm-content h3 { font-size: 18px; }
        }
      `}</style>
    </article>
  )
}