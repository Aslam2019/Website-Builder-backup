import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { websiteApi } from '../../api/websiteApi'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/formatDate'
import { IconEye, IconEdit, IconWebsite, IconCheck, IconClock } from '../../components/dashboard/Icons'

export default function MyWebsite() {
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await websiteApi.list()
        setWebsite(res.data?.data?.websites?.[0] || null)
      } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <Loader />
  if (!website) {
    return (
      <div className="card" style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🌐</div>
        <h3 style={{ marginBottom: 8 }}>No website yet</h3>
        <p className="muted" style={{ marginBottom: 20 }}>
          Start by choosing a template and filling your form.
        </p>
        <Link to="/dashboard/templates" className="btn btn-primary">Browse Templates</Link>
      </div>
    )
  }

  const isPublished = website.status === 'published'

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Website</h1>
          <p className="page-sub">Your generated website</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/dashboard/website-form" className="btn btn-outline">
            <IconEdit size={15} /> Edit Content
          </Link>
          <Link to={`/site/${website._id || website.id}`} target="_blank" className="btn btn-primary">
            <IconEye size={15} /> Preview
          </Link>
        </div>
      </div>

      <div className="dash-2col">
        <div className="card">
          <h3 className="card-title">Website Details</h3>
          <div className="view-summary">
            <div className="view-row">
              <div className="view-label">Name</div>
              <div className="view-value"><strong>{website.name}</strong></div>
            </div>
            <div className="view-row">
              <div className="view-label">Template</div>
              <div className="view-value">{website.template_name}</div>
            </div>
            <div className="view-row">
              <div className="view-label">Plan</div>
              <div className="view-value">{website.plan_name}</div>
            </div>
            <div className="view-row">
              <div className="view-label">Created</div>
              <div className="view-value">{formatDate(website.created_at)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 18, borderRadius: 12,
              background: isPublished ? '#ecfdf5' : '#fef3c7',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: isPublished ? '#10b981' : '#f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0,
              }}>
                {isPublished ? <IconCheck size={22} /> : <IconClock size={22} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: isPublished ? '#065f46' : '#92400e' }}>
                  {isPublished ? 'Published' : 'Awaiting Payment'}
                </div>
                <div style={{ fontSize: 13, color: isPublished ? '#059669' : '#b45309' }}>
                  {isPublished ? 'Your website is live!' : 'Complete payment to publish'}
                </div>
              </div>
            </div>

            {!isPublished && (
              <Link to="/dashboard/checkout" className="btn btn-primary btn-block">
                Complete Payment →
              </Link>
            )}
            {isPublished && (
              <Link to={`/site/${website._id || website.id}`} target="_blank"
                className="btn btn-primary btn-block">
                <IconWebsite size={16} /> Open Live Site
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}