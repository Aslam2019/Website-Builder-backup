import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import { formatDate } from '../../utils/formatDate'
import Loader from '../../components/common/Loader'
import { useNotify } from '../../context/NotificationContext'

// 👇 Inter font (scoped)
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

export default function ManagePayments() {
  const notify = useNotify()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminApi.payments(filter ? { status: filter } : {})
      setList(res.data?.data?.payments || [])
    } catch { notify.error('Failed to load payments') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filter])

  const total = list.reduce((s, p) => s + (p.status === 'successful' ? Number(p.amount) : 0), 0)

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
                  {list.map((p) => (
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
              {list.map((p) => (
                <div key={p._id || p.id} className="mpay-card">
                  {/* Head: Payment ID + Status */}
                  <div className="mpay-card-head">
                    <code className="mpay-card-id" title={p.payment_id}>
                      {p.payment_id}
                    </code>
                    <span className={`badge ${
                      p.status === 'successful' ? 'badge-success'
                      : p.status === 'pending' ? 'badge-warning' : 'badge-danger'
                    }`}>{p.status}</span>
                  </div>

                  {/* Amount — big & bold */}
                  <div className="mpay-card-amount">
                    ₹{Number(p.amount).toLocaleString('en-IN')}
                  </div>

                  {/* Details rows */}
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
          </>
        )}
      </div>

      {/* ---------- Responsive styles ---------- */}
      <style>{`
        .mpay-mobile { display: none; }

        @media (max-width: 768px) {
          /* Page head */
          .mpay-root .page-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .mpay-root .page-title { font-size: 22px; }
          .mpay-root .page-sub { font-size: 13px; }

          /* Filters — horizontal scroll */
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

          /* Hide desktop table, show cards */
          .mpay-desktop { display: none !important; }
          .mpay-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }

          /* Card */
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
        }

        @media (max-width: 420px) {
          .mpay-card { padding: 12px; }
          .mpay-card-amount { font-size: 20px; }
          .mpay-card-row { font-size: 12.5px; }
          .mpay-card-id { font-size: 10px; }
        }
      `}</style>
    </div>
  )
}