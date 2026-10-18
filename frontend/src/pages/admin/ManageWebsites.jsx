import { useEffect, useState, useMemo } from 'react'
import { adminApi } from '../../api/adminApi'
import { formatDate } from '../../utils/formatDate'
import Loader from '../../components/common/Loader'
import { useNotify } from '../../context/NotificationContext'

/* ============ INTER FONT ============ */
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

/* ============ ✅ PAGINATION ICONS ============ */
const IconChevronLeft = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const IconChevronRight = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

/* ============================================================
   ✅ PAGINATION HELPER — page numbers with ellipsis
   ============================================================ */
const getPageNumbers = (current, total) => {
  const delta = 1
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

export default function ManageWebsites() {
  const notify = useNotify()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  /* ✅ Pagination state */
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.websites()
        setList(res.data?.data?.websites || [])
      } catch {
        notify.error('Failed to load websites')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* ✅ Pagination math */
  const totalItems = list.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginated = useMemo(
    () => list.slice(startIndex, endIndex),
    [list, startIndex, endIndex]
  )

  /* ✅ Reset to page 1 when rows-per-page change */
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  if (loading) return <Loader />

  return (
    <div style={interStyle} className="mw-root">
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>Websites</h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            {list.length} website{list.length !== 1 ? 's' : ''} created
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {list.length === 0 ? (
          <p className="muted" style={{ padding: 40, textAlign: 'center' }}>No websites yet</p>
        ) : (
          <>
            {/* ---------- Desktop: table ---------- */}
            <div className="table-wrap mw-desktop" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Website</th>
                    <th>User</th>
                    <th>Template</th>
                    <th>Plan</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'right' }}>Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((w) => (
                    <tr key={w.id}>
                      <td style={{ fontWeight: 600 }}>{w.name}</td>
                      <td>{w.username}</td>
                      <td>{w.template_name || '—'}</td>
                      <td>{w.plan_name || '—'}</td>
                      <td>
                        <span className={`badge ${
                          w.payment_status === 'successful' ? 'badge-success'
                          : w.payment_status === 'pending' ? 'badge-warning' : 'badge-muted'
                        }`}>{w.payment_status || 'pending'}</span>
                      </td>
                      <td>
                        <span className={`badge ${w.status === 'published' ? 'badge-success' : 'badge-info'}`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="muted" style={{ fontSize: 13 }}>{formatDate(w.created_at)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <a className="btn btn-outline btn-sm" href={`/site/${w.id}`} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ---------- Mobile: cards ---------- */}
            <div className="mw-mobile">
              {paginated.map((w) => (
                <div key={w.id} className="mw-card">
                  <div className="mw-card-head">
                    <div className="mw-card-title">{w.name}</div>
                    <span className={`badge ${w.status === 'published' ? 'badge-success' : 'badge-info'}`}>
                      {w.status}
                    </span>
                  </div>

                  <div className="mw-card-row">
                    <span className="mw-label">User</span>
                    <span className="mw-value">{w.username || '—'}</span>
                  </div>
                  <div className="mw-card-row">
                    <span className="mw-label">Template</span>
                    <span className="mw-value">{w.template_name || '—'}</span>
                  </div>
                  <div className="mw-card-row">
                    <span className="mw-label">Plan</span>
                    <span className="mw-value">{w.plan_name || '—'}</span>
                  </div>
                  <div className="mw-card-row">
                    <span className="mw-label">Payment</span>
                    <span className="mw-value">
                      <span className={`badge ${
                        w.payment_status === 'successful' ? 'badge-success'
                        : w.payment_status === 'pending' ? 'badge-warning' : 'badge-muted'
                      }`}>{w.payment_status || 'pending'}</span>
                    </span>
                  </div>
                  <div className="mw-card-row">
                    <span className="mw-label">Created</span>
                    <span className="mw-value muted">{formatDate(w.created_at)}</span>
                  </div>

                  <a
                    className="btn btn-primary btn-sm mw-card-btn"
                    href={`/site/${w.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Website →
                  </a>
                </div>
              ))}
            </div>

            {/* ============================================================
                ✅ PAGINATION
                ============================================================ */}
            {totalItems > 0 && (
              <div className="mw-pagination">
                <div className="mw-pag-left">
                  <span className="mw-pag-info">
                    Showing <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> of{' '}
                    <strong>{totalItems}</strong> websites
                  </span>

                  <div className="mw-pag-size">
                    <label>Rows:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      style={interStyle}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="mw-pag-right">
                  <button
                    className="mw-pag-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <IconChevronLeft size={15} />
                  </button>

                  <div className="mw-pag-numbers">
                    {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                      p === '...' ? (
                        <span key={`dots-${idx}`} className="mw-pag-dots">…</span>
                      ) : (
                        <button
                          key={p}
                          className={`mw-pag-num ${currentPage === p ? 'is-active' : ''}`}
                          onClick={() => setCurrentPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="mw-pag-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <IconChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---------- Responsive + Pagination styles ---------- */}
      <style>{`
        .mw-mobile { display: none; }

        /* ============================================================
           ✅ PAGINATION
           ============================================================ */
        .mw-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          border-top: 1px solid #f1f5f9;
          background: #fafbfc;
          flex-wrap: wrap;
        }
        .mw-pag-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .mw-pag-info {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .mw-pag-info strong {
          color: #0f172a;
          font-weight: 700;
        }
        .mw-pag-size {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .mw-pag-size select {
          padding: 6px 10px;
          font-size: 13px;
          font-family: inherit;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
          color: #0f172a;
          cursor: pointer;
          outline: none;
          font-weight: 600;
          transition: border-color 0.15s ease;
        }
        .mw-pag-size select:hover { border-color: #cbd5e1; }
        .mw-pag-size select:focus { border-color: #6366f1; }

        .mw-pag-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mw-pag-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
          font-family: inherit;
        }
        .mw-pag-btn:hover:not(:disabled) {
          border-color: #c7d2fe;
          background: #eef2ff;
          color: #4f46e5;
          transform: translateY(-1px);
        }
        .mw-pag-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .mw-pag-numbers {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .mw-pag-num {
          min-width: 36px;
          height: 36px;
          padding: 0 8px;
          border-radius: 10px;
          border: 1.5px solid transparent;
          background: transparent;
          color: #475569;
          font-size: 13.5px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .mw-pag-num:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .mw-pag-num.is-active {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 6px 16px -6px rgba(99, 102, 241, 0.6);
        }
        .mw-pag-dots {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 36px;
          color: #94a3b8;
          font-weight: 700;
          user-select: none;
        }

        /* ============ MOBILE ============ */
        @media (max-width: 768px) {
          .mw-root .page-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .mw-root .page-title { font-size: 22px; }
          .mw-root .page-sub { font-size: 13px; }

          .mw-desktop { display: none !important; }
          .mw-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }

          .mw-card {
            background: var(--card-bg, #fff);
            border: 1px solid var(--border, #e5e7eb);
            border-radius: 12px;
            padding: 14px 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          }
          .mw-card-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid var(--border, #eef0f3);
          }
          .mw-card-title {
            font-weight: 700;
            font-size: 15px;
            color: var(--text, #111827);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }
          .mw-card-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding: 5px 0;
            font-size: 13px;
          }
          .mw-label {
            color: var(--muted, #6b7280);
            font-weight: 500;
            flex-shrink: 0;
          }
          .mw-value {
            color: var(--text, #111827);
            font-weight: 500;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 60%;
          }
          .mw-card-btn {
            display: block;
            width: 100%;
            margin-top: 12px;
            text-align: center;
            font-weight: 600;
          }

          /* ✅ Pagination — mobile */
          .mw-pagination {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 14px;
          }
          .mw-pag-left {
            justify-content: space-between;
            width: 100%;
          }
          .mw-pag-right {
            justify-content: center;
            width: 100%;
          }
          .mw-pag-num { min-width: 32px; height: 32px; font-size: 13px; }
          .mw-pag-btn { width: 32px; height: 32px; }
        }

        @media (max-width: 380px) {
          .mw-card { padding: 12px; }
          .mw-card-title { font-size: 14px; }
          .mw-card-row { font-size: 12px; }

          .mw-pag-info { font-size: 12px; }
          .mw-pag-size { font-size: 12px; }
          .mw-pag-numbers { gap: 2px; }
          .mw-pag-num { min-width: 30px; height: 30px; padding: 0 6px; }
        }
      `}</style>
    </div>
  )
}