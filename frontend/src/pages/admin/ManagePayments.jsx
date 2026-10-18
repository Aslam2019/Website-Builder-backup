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

const FILTERS = [
  { v: '',           l: 'All' },
  { v: 'successful', l: 'Successful' },
  { v: 'pending',    l: 'Pending' },
  { v: 'failed',     l: 'Failed' },
]

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
   ✅ PAGINATION HELPER
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

export default function ManagePayments() {
  const notify = useNotify()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  /* ✅ Pagination state */
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminApi.payments(filter ? { status: filter } : {})
      setList(res.data?.data?.payments || [])
    } catch {
      notify.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter])

  /* ✅ Reset to page 1 when filter or rows-per-page change */
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, itemsPerPage])

  /* ✅ Pagination math */
  const totalItems = list.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginated = useMemo(
    () => list.slice(startIndex, endIndex),
    [list, startIndex, endIndex]
  )

  const total = list.reduce(
    (s, p) => s + (p.status === 'successful' ? Number(p.amount) : 0),
    0
  )

  if (loading) return <Loader />

  return (
    <div className="mpay-root" style={interStyle}>
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>Payments</h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            {list.length} payment{list.length !== 1 ? 's' : ''} · Total (successful): ₹{total.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* ---------- Filters ---------- */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div className="mpay-filters">
          {FILTERS.map((f) => (
            <button
              key={f.v}
              className={`btn btn-sm ${filter === f.v ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f.v)}
              style={{ ...interStyle, fontWeight: 500 }}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {list.length === 0 ? (
          <p className="muted" style={{ padding: 40, textAlign: 'center' }}>
            No payments found
          </p>
        ) : (
          <>
            {/* ==================== DESKTOP TABLE ==================== */}
            <div className="table-wrap mpay-desktop" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>User</th>
                    <th>Website</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <tr key={p._id || p.id}>
                      <td><code style={{ fontSize: 12 }}>{p.payment_id}</code></td>
                      <td style={{ fontWeight: 600 }}>{p.username}</td>
                      <td className="muted">{p.website_name || '—'}</td>
                      <td>{p.plan_name}</td>
                      <td style={{ fontWeight: 600 }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${
                          p.status === 'successful' ? 'badge-success'
                          : p.status === 'pending' ? 'badge-warning' : 'badge-danger'
                        }`}>{p.status}</span>
                      </td>
                      <td className="muted" style={{ fontSize: 13 }}>
                        {formatDate(p.payment_date || p.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ==================== MOBILE CARDS ==================== */}
            <div className="mpay-mobile">
              {paginated.map((p) => (
                <div key={p._id || p.id} className="mpay-card">
                  <div className="mpay-card-head">
                    <code className="mpay-card-id" title={p.payment_id}>
                      {p.payment_id}
                    </code>
                    <span className={`badge ${
                      p.status === 'successful' ? 'badge-success'
                      : p.status === 'pending' ? 'badge-warning' : 'badge-danger'
                    }`}>{p.status}</span>
                  </div>

                  <div className="mpay-card-amount">
                    ₹{Number(p.amount).toLocaleString('en-IN')}
                  </div>

                  <div className="mpay-card-body">
                    <div className="mpay-card-row">
                      <span className="mpay-label">User</span>
                      <span className="mpay-value">{p.username || '—'}</span>
                    </div>
                    <div className="mpay-card-row">
                      <span className="mpay-label">Website</span>
                      <span className="mpay-value">{p.website_name || '—'}</span>
                    </div>
                    <div className="mpay-card-row">
                      <span className="mpay-label">Plan</span>
                      <span className="mpay-value">{p.plan_name || '—'}</span>
                    </div>
                    <div className="mpay-card-row">
                      <span className="mpay-label">Date</span>
                      <span className="mpay-value mpay-muted">
                        {formatDate(p.payment_date || p.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ============================================================
                ✅ PAGINATION
                ============================================================ */}
            {totalItems > 0 && (
              <div className="mpay-pagination">
                <div className="mpay-pag-left">
                  <span className="mpay-pag-info">
                    Showing <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> of{' '}
                    <strong>{totalItems}</strong> payments
                  </span>

                  <div className="mpay-pag-size">
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

                <div className="mpay-pag-right">
                  <button
                    className="mpay-pag-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <IconChevronLeft size={15} />
                  </button>

                  <div className="mpay-pag-numbers">
                    {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                      p === '...' ? (
                        <span key={`dots-${idx}`} className="mpay-pag-dots">…</span>
                      ) : (
                        <button
                          key={p}
                          className={`mpay-pag-num ${currentPage === p ? 'is-active' : ''}`}
                          onClick={() => setCurrentPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="mpay-pag-btn"
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
        .mpay-mobile { display: none; }

        /* ============================================================
           ✅ PAGINATION
           ============================================================ */
        .mpay-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          border-top: 1px solid #f1f5f9;
          background: #fafbfc;
          flex-wrap: wrap;
        }
        .mpay-pag-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .mpay-pag-info {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .mpay-pag-info strong {
          color: #0f172a;
          font-weight: 700;
        }
        .mpay-pag-size {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .mpay-pag-size select {
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
        .mpay-pag-size select:hover { border-color: #cbd5e1; }
        .mpay-pag-size select:focus { border-color: #6366f1; }

        .mpay-pag-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mpay-pag-btn {
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
        .mpay-pag-btn:hover:not(:disabled) {
          border-color: #c7d2fe;
          background: #eef2ff;
          color: #4f46e5;
          transform: translateY(-1px);
        }
        .mpay-pag-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .mpay-pag-numbers {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .mpay-pag-num {
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
        .mpay-pag-num:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .mpay-pag-num.is-active {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 6px 16px -6px rgba(99, 102, 241, 0.6);
        }
        .mpay-pag-dots {
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
          .mpay-root .page-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .mpay-root .page-title { font-size: 22px; }
          .mpay-root .page-sub { font-size: 13px; }

          .mpay-filters {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }
          .mpay-filters::-webkit-scrollbar { display: none; }
          .mpay-filters .btn {
            flex-shrink: 0;
            white-space: nowrap;
          }

          .mpay-desktop { display: none !important; }
          .mpay-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }

          .mpay-card {
            background: var(--card-bg, #fff);
            border: 1px solid var(--border, #e5e7eb);
            border-radius: 12px;
            padding: 14px 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          }
          .mpay-card-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid var(--border, #eef0f3);
          }
          .mpay-card-id {
            font-size: 11px;
            background: var(--bg-soft, #f3f4f6);
            padding: 3px 8px;
            border-radius: 6px;
            color: var(--muted, #6b7280);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 60%;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
          }
          .mpay-card-amount {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: var(--primary, #4f46e5);
            margin-bottom: 12px;
          }
          .mpay-card-body {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding-top: 10px;
            border-top: 1px dashed var(--border, #eef0f3);
          }
          .mpay-card-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            font-size: 13px;
          }
          .mpay-label {
            color: var(--muted, #6b7280);
            font-weight: 500;
            flex-shrink: 0;
          }
          .mpay-value {
            color: var(--text, #111827);
            font-weight: 500;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 65%;
          }
          .mpay-muted {
            color: var(--muted, #6b7280);
            font-weight: 400;
            font-size: 12.5px;
          }

          /* ✅ Pagination — mobile */
          .mpay-pagination {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 14px;
          }
          .mpay-pag-left {
            justify-content: space-between;
            width: 100%;
          }
          .mpay-pag-right {
            justify-content: center;
            width: 100%;
          }
          .mpay-pag-num { min-width: 32px; height: 32px; font-size: 13px; }
          .mpay-pag-btn { width: 32px; height: 32px; }
        }

        @media (max-width: 420px) {
          .mpay-card { padding: 12px; }
          .mpay-card-amount { font-size: 20px; }
          .mpay-card-row { font-size: 12.5px; }
          .mpay-card-id { font-size: 10px; }

          .mpay-pag-info { font-size: 12px; }
          .mpay-pag-size { font-size: 12px; }
          .mpay-pag-numbers { gap: 2px; }
          .mpay-pag-num { min-width: 30px; height: 30px; padding: 0 6px; }
        }
      `}</style>
    </div>
  )
}