import { useState, useEffect, useMemo } from 'react'
import { enquiryApi } from '../../api/enquiryApi'
import { useNotify } from '../../context/NotificationContext'
import { formatDate } from '../../utils/formatDate'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  WebkitFontSmoothing: 'antialiased',
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

export default function ManageEnquiries() {
  const notify = useNotify()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  /* ✅ Pagination state */
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const load = async () => {
    setLoading(true)
    try {
      const res = await enquiryApi.list(filter === 'all' ? {} : { status: filter })
      setEnquiries(res.data?.data?.enquiries || [])
    } catch {
      notify.error('Failed to load enquiries')
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
  const totalItems = enquiries.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginated = useMemo(
    () => enquiries.slice(startIndex, endIndex),
    [enquiries, startIndex, endIndex]
  )

  const updateStatus = async (id, status) => {
    try {
      await enquiryApi.updateStatus(id, status)
      notify.success('Status updated')
      load()
    } catch {
      notify.error('Failed to update')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return
    try {
      await enquiryApi.remove(id)
      notify.success('Deleted')
      load()
    } catch {
      notify.error('Delete failed')
    }
  }

  return (
    <div style={interStyle}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Custom Plan Enquiries</h1>
          <p className="page-sub">Leads from the Custom plan form</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'new', 'contacted', 'closed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid #e2e8f0',
              background: filter === f ? '#4f46e5' : '#fff',
              color: filter === f ? '#fff' : '#475569',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#64748b', padding: 20 }}>Loading...</p>
      ) : enquiries.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
          No enquiries yet
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paginated.map((e) => (
              <div key={e._id || e.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{e.name}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                      📱 {e.mobile} {e.email && `· ✉️ ${e.email}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                      background: e.status === 'new' ? '#fef3c7' : e.status === 'contacted' ? '#dbeafe' : '#d1fae5',
                      color: e.status === 'new' ? '#92400e' : e.status === 'contacted' ? '#1e40af' : '#065f46',
                      textTransform: 'uppercase',
                    }}>
                      {e.status}
                    </span>
                    <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{formatDate(e.created_at)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#475569', marginBottom: 10, flexWrap: 'wrap' }}>
                  {e.business_type && <span><strong>Business:</strong> {e.business_type}</span>}
                  {e.budget && <span><strong>Budget:</strong> {e.budget}</span>}
                </div>

                <p style={{
                  fontSize: 13.5, color: '#334155', lineHeight: 1.6, margin: '0 0 14px',
                  padding: 12, background: '#f8fafc', borderRadius: 10,
                }}>
                  {e.message}
                </p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a href={`tel:${e.mobile}`} className="btn btn-outline btn-sm">📞 Call</a>
                  <a
                    href={`https://wa.me/91${e.mobile.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    💬 WhatsApp
                  </a>
                  {e.status !== 'contacted' && (
                    <button className="btn btn-outline btn-sm" onClick={() => updateStatus(e._id || e.id, 'contacted')}>
                      Mark Contacted
                    </button>
                  )}
                  {e.status !== 'closed' && (
                    <button className="btn btn-outline btn-sm" onClick={() => updateStatus(e._id || e.id, 'closed')}>
                      Mark Closed
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => remove(e._id || e.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ============================================================
              ✅ PAGINATION
              ============================================================ */}
          {totalItems > 0 && (
            <div className="menq-pagination">
              <div className="menq-pag-left">
                <span className="menq-pag-info">
                  Showing <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> of{' '}
                  <strong>{totalItems}</strong> enquir{totalItems !== 1 ? 'ies' : 'y'}
                </span>

                <div className="menq-pag-size">
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

              <div className="menq-pag-right">
                <button
                  className="menq-pag-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <IconChevronLeft size={15} />
                </button>

                <div className="menq-pag-numbers">
                  {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                    p === '...' ? (
                      <span key={`dots-${idx}`} className="menq-pag-dots">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`menq-pag-num ${currentPage === p ? 'is-active' : ''}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="menq-pag-btn"
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

      {/* ---------- Pagination + responsive styles ---------- */}
      <style>{`
        /* ============================================================
           ✅ PAGINATION
           ============================================================ */
        .menq-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          margin-top: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          background: #fafbfc;
          flex-wrap: wrap;
        }
        .menq-pag-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .menq-pag-info {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .menq-pag-info strong {
          color: #0f172a;
          font-weight: 700;
        }
        .menq-pag-size {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .menq-pag-size select {
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
        .menq-pag-size select:hover { border-color: #cbd5e1; }
        .menq-pag-size select:focus { border-color: #6366f1; }

        .menq-pag-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .menq-pag-btn {
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
        .menq-pag-btn:hover:not(:disabled) {
          border-color: #c7d2fe;
          background: #eef2ff;
          color: #4f46e5;
          transform: translateY(-1px);
        }
        .menq-pag-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .menq-pag-numbers {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .menq-pag-num {
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
        .menq-pag-num:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .menq-pag-num.is-active {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 6px 16px -6px rgba(99, 102, 241, 0.6);
        }
        .menq-pag-dots {
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
          .menq-pagination {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 14px;
          }
          .menq-pag-left {
            justify-content: space-between;
            width: 100%;
          }
          .menq-pag-right {
            justify-content: center;
            width: 100%;
          }
          .menq-pag-num { min-width: 32px; height: 32px; font-size: 13px; }
          .menq-pag-btn { width: 32px; height: 32px; }
        }

        @media (max-width: 480px) {
          .menq-pag-info { font-size: 12px; }
          .menq-pag-size { font-size: 12px; }
          .menq-pag-numbers { gap: 2px; }
          .menq-pag-num { min-width: 30px; height: 30px; padding: 0 6px; }
        }
      `}</style>
    </div>
  )
}