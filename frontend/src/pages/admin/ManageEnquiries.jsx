import { useState, useEffect } from 'react'
import { enquiryApi } from '../../api/enquiryApi'
import { useNotify } from '../../context/NotificationContext'
import { formatDate } from '../../utils/formatDate'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  WebkitFontSmoothing: 'antialiased',
}

export default function ManageEnquiries() {
  const notify = useNotify()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {enquiries.map((e) => (
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
      )}
    </div>
  )
}