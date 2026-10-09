import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { templateApi } from '../../api/templateApi'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'
import TemplateCard from '../../components/templates/TemplateCard'
import TemplatePreview from '../../components/templates/TemplatePreview'

const STORAGE_KEY = 'wb_selected_template'

/* ============================================================
   INTER FONT (scoped)
   ============================================================ */
const interStyle = {
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}
const headingStyle = {
  ...interStyle,
  fontWeight: 700,
  letterSpacing: '-0.02em',
}

export default function Templates() {
  const { user } = useAuth()
  const notify = useNotify()
  const navigate = useNavigate()

  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [selectedId, setSelectedId] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      return saved?.id || null
    } catch { return null }
  })

  const load = async () => {
    setLoading(true); setError('')
    try {
      const categoryId = user?.category?.id
      const res = await templateApi.list(categoryId ? { category_id: categoryId } : {})
      const raw = res.data?.data?.templates || []
      // ✅ Dedupe by _id
      const unique = raw.filter(
        (t, i, arr) => arr.findIndex(x => (x._id || x.id) === (t._id || t.id)) === i
      )
      setTemplates(unique)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load templates')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [user?.category?.id])

  const handleSelect = (tpl) => {
    const payload = {
      id: tpl._id || tpl.id,
      name: tpl.name,
      category: tpl.category,
      preview_image: tpl.preview_image,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setSelectedId(payload.id)
    setPreview(null)
    notify.success(`"${tpl.name}" selected!`)
  }

  const handleContinue = () => {
    if (!selectedId) {
      notify.error('Please select a template first')
      return
    }
    navigate('/dashboard/website-form')
  }

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="tpl-root" style={interStyle}>

      {/* ---------- Page Head ---------- */}
      <div className="tpl-head">
        <div className="tpl-head-left">
          <h1 className="tpl-title" style={headingStyle}>
            Choose a Template
          </h1>
          <p className="tpl-sub" style={{ ...interStyle, fontWeight: 400 }}>
            Showing templates for{' '}
            <strong style={{ fontWeight: 600 }}>
              {user?.category?.name || 'your category'}
            </strong>
          </p>
        </div>

        {selectedId && (
          <button
            className="btn btn-primary tpl-continue"
            onClick={handleContinue}
            style={{ ...interStyle, fontWeight: 500 }}
          >
            Continue to Form →
          </button>
        )}
      </div>

      {/* ---------- Templates Grid ---------- */}
      {templates.length === 0 ? (
        <div className="card tpl-empty">
          <p className="muted" style={{ ...interStyle, fontWeight: 400 }}>
            No templates available for your category yet.
          </p>
        </div>
      ) : (
        <div className="tpl-grid">
          {templates.map((t) => (
            <TemplateCard
              key={t._id || t.id}
              template={t}
              selected={selectedId === (t._id || t.id)}
              onPreview={setPreview}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <TemplatePreview
        open={!!preview}
        onClose={() => setPreview(null)}
        template={preview}
        onSelect={handleSelect}
      />

      {/* ============================================================
          RESPONSIVE STYLES
         ============================================================ */}
      <style>{`
        /* ---------- Page Head ---------- */
        .tpl-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }
        .tpl-head-left { min-width: 0; }
        .tpl-title {
          font-size: 26px;
          color: #111827;
          margin: 0 0 4px;
          line-height: 1.2;
        }
        .tpl-sub {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        .tpl-sub strong { color: #4f46e5; }

        .tpl-continue {
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* ---------- Empty ---------- */
        .tpl-empty {
          padding: 60px 20px;
          text-align: center;
        }

        /* ---------- Grid ---------- */
        .tpl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        /* ============================================
           TABLET (≤1024px)
           ============================================ */
        @media (max-width: 1024px) {
          .tpl-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 16px;
          }
        }

        /* ============================================
           MOBILE (≤768px)
           ============================================ */
        @media (max-width: 768px) {
          /* Page head stacks */
          .tpl-head {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            margin-bottom: 18px;
          }
          .tpl-title { font-size: 20px; }
          .tpl-sub { font-size: 13px; }

          .tpl-continue {
            width: 100%;
            padding: 12px 16px !important;
            font-size: 14px !important;
            justify-content: center;
          }

          /* Grid → 1 column full width */
          .tpl-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .tpl-empty { padding: 40px 16px; }
        }

        /* ============================================
           SMALL MOBILE (≤420px)
           ============================================ */
        @media (max-width: 420px) {
          .tpl-title { font-size: 18px; }
          .tpl-sub { font-size: 12.5px; }
          .tpl-grid { gap: 12px; }
        }
      `}</style>
    </div>
  )
}