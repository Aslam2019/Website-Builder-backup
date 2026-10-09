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

export default function ManageWebsites() {
  const notify = useNotify()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.websites()
        setList(res.data?.data?.websites || [])
      } catch { notify.error('Failed to load websites') }
      finally { setLoading(false) }
    })()
  }, [])

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
                  {list.map((w) => (
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
              {list.map((w) => (
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
          </>
        )}
      </div>

      {/* ---------- Responsive styles ---------- */}
      <style>{`
        .mw-mobile { display: none; }

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
        }

        @media (max-width: 380px) {
          .mw-card { padding: 12px; }
          .mw-card-title { font-size: 14px; }
          .mw-card-row { font-size: 12px; }
        }
      `}</style>
    </div>
  )
}