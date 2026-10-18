import { useEffect, useState } from 'react'
import { pricingApi } from '../../api/pricingApi'
import { useNotify } from '../../context/NotificationContext'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'

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

/* ============ SVG ICONS ============ */
const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconEdit = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconX = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconTrash = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
)

/* ✅ Feature normalize */
const normalizeFeature = (f) => {
  if (typeof f === 'string') return { text: f, type: 'positive' }
  return {
    text: f?.text || '',
    type: f?.type === 'negative' ? 'negative' : 'positive',
  }
}

export default function ManagePricing() {
  const notify = useNotify()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    terms: '',
    features: [{ text: '', type: 'positive' }],
    is_active: true,
  })
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await pricingApi.list({ all: true })
      setPlans(res.data?.data?.plans || [])
    } catch {
      notify.error('Failed to load pricing')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  /* ✅ openNew — terms add panniten */
  const openNew = () => {
    setEditing(null)
    setForm({
      name: '',
      price: '',
      description: '',
      terms: '',
      features: [{ text: '', type: 'positive' }],
      is_active: true,
    })
    setModalOpen(true)
  }

  /* ✅ openEdit — terms add panniten */
  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name,
      price: p.price,
      description: p.description || '',
      terms: p.terms || '',
      features:
        p.features?.length
          ? p.features.map(normalizeFeature)
          : [{ text: '', type: 'positive' }],
      is_active: p.is_active,
    })
    setModalOpen(true)
  }

  /* ✅ Feature handlers */
  const updateFeatureText = (i, v) => {
    const next = [...form.features]
    next[i] = { ...next[i], text: v }
    setForm({ ...form, features: next })
  }

  const toggleFeatureType = (i) => {
    const next = [...form.features]
    next[i] = {
      ...next[i],
      type: next[i].type === 'positive' ? 'negative' : 'positive',
    }
    setForm({ ...form, features: next })
  }

  const addFeature = () =>
    setForm({
      ...form,
      features: [...form.features, { text: '', type: 'positive' }],
    })

  const removeFeature = (i) => {
    const next = form.features.filter((_, x) => x !== i)
    setForm({
      ...form,
      features: next.length ? next : [{ text: '', type: 'positive' }],
    })
  }

  /* ✅ Save — terms add panniten */
  const save = async () => {
    if (!form.name.trim()) return notify.error('Name is required')
    if (!form.price || isNaN(form.price)) return notify.error('Valid price is required')
    setSaving(true)
    try {
      const cleanFeatures = form.features
        .filter((f) => f.text && f.text.trim().length > 0)
        .map((f) => ({
          text: f.text.trim(),
          type: f.type === 'negative' ? 'negative' : 'positive',
        }))

      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        terms: form.terms,
        features: cleanFeatures,
        is_active: form.is_active,
      }
      if (editing) {
        await pricingApi.update(editing._id || editing.id, payload)
        notify.success('Plan updated')
      } else {
        await pricingApi.create(payload)
        notify.success('Plan created')
      }
      setModalOpen(false)
      load()
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (p) => {
    try {
      await pricingApi.update(p._id || p.id, { is_active: !p.is_active })
      notify.success(p.is_active ? 'Deactivated' : 'Activated')
      load()
    } catch {
      notify.error('Action failed')
    }
  }

  const askDelete = (plan) => setDeleteTarget(plan)
  const cancelDelete = () => {
    if (deleting) return
    setDeleteTarget(null)
  }
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const id = deleteTarget._id || deleteTarget.id
      await pricingApi.remove(id)
      notify.success(`"${deleteTarget.name}" deleted`)
      setDeleteTarget(null)
      load()
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div style={interStyle} className="mp-root">
      {/* HEAD */}
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>Pricing Plans</h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            {plans.length} plans — changes reflect live on public site
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openNew}
          style={{ ...interStyle, fontWeight: 500 }}
        >
          <IconPlus size={16} /> Add Plan
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Desktop Table */}
        <div className="table-wrap mp-desktop" style={{ border: 'none', borderRadius: 0 }}>
          <table className="mp-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Description</th>
                <th>Features</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p._id || p.id}>
                  <td className="mp-td-name">{p.name}</td>
                  <td className="mp-td-price">
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </td>
                  <td className="mp-td-desc">{p.description || '—'}</td>
                  <td className="mp-td-features">
                    {p.features?.length || 0} features
                  </td>
                  <td>
                    <span className={`mp-badge ${p.is_active ? 'is-active' : 'is-inactive'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="mp-actions">
                      <button
                        className="mp-icon-btn mp-icon-edit"
                        onClick={() => openEdit(p)}
                        aria-label="Edit plan"
                      >
                        <IconEdit size={15} />
                        <span className="mp-tip">Edit</span>
                      </button>
                      <button
                        className={`mp-icon-btn ${p.is_active ? 'mp-icon-off' : 'mp-icon-on'}`}
                        onClick={() => toggle(p)}
                        aria-label={p.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {p.is_active ? <IconX size={15} /> : <IconCheck size={15} />}
                        <span className="mp-tip">{p.is_active ? 'Deactivate' : 'Activate'}</span>
                      </button>
                      <button
                        className="mp-icon-btn mp-icon-delete"
                        onClick={() => askDelete(p)}
                        aria-label="Delete plan"
                      >
                        <IconTrash size={15} />
                        <span className="mp-tip">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mp-mobile">
          {plans.map((p) => (
            <div key={p._id || p.id} className="mp-card">
              <div className="mp-card-head">
                <div className="mp-card-title">{p.name}</div>
                <span className={`mp-badge ${p.is_active ? 'is-active' : 'is-inactive'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="mp-price">
                ₹{Number(p.price).toLocaleString('en-IN')}
              </div>
              {p.description && <div className="mp-desc">{p.description}</div>}
              <div className="mp-features">
                <span className="mp-features-count">
                  {p.features?.length || 0} feature{(p.features?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="mp-card-actions">
                <button
                  className="mp-icon-btn mp-icon-edit mp-icon-btn-flex"
                  onClick={() => openEdit(p)}
                  aria-label="Edit plan"
                >
                  <IconEdit size={16} />
                </button>
                <button
                  className={`mp-icon-btn mp-icon-btn-flex ${p.is_active ? 'mp-icon-off' : 'mp-icon-on'}`}
                  onClick={() => toggle(p)}
                  aria-label={p.is_active ? 'Deactivate' : 'Activate'}
                >
                  {p.is_active ? <IconX size={16} /> : <IconCheck size={16} />}
                </button>
                <button
                  className="mp-icon-btn mp-icon-delete mp-icon-btn-flex"
                  onClick={() => askDelete(p)}
                  aria-label="Delete plan"
                >
                  <IconTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Plan' : 'Add Plan'}
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setModalOpen(false)}
              style={{ ...interStyle, fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={saving}
              style={{ ...interStyle, fontWeight: 500 }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        }>
        <div className="mp-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
              Plan Name <span className="req">*</span>
            </label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={interStyle}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
              Price (₹) <span className="req">*</span>
            </label>
            <input
              className="form-control"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={interStyle}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
            Description
          </label>
          <textarea
            className="form-control"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={interStyle}
          />
        </div>

        {/* ✅ TERMS & CONDITIONS */}
        <div className="form-group">
          <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
            Terms &amp; Conditions{' '}
            <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 12.5 }}>
              (optional)
            </span>
          </label>
          <textarea
            className="form-control"
            rows={5}
            placeholder={
              'Enter each point on a new line. Example:\n' +
              '• Refund policy applies within 7 days\n' +
              '• No hidden charges\n' +
              '• Free support for 1 year'
            }
            value={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.value })}
            style={{ ...interStyle, lineHeight: 1.6, resize: 'vertical' }}
          />
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 }}>
            Ithu frontend la "Terms &amp; Conditions" link-ah show aagum. Empty-a vிட்டா link kanudha aagadhu.
          </p>
        </div>

        {/* FEATURES */}
        <div className="form-group">
          <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
            Features
          </label>
          <p className="mp-feat-hint">
            Click the icon to switch between <strong>included</strong> (green ✓) and <strong>not included</strong> (red ✕).
          </p>

          {form.features.map((feature, i) => (
            <div key={i} className="feature-row">
              <button
                type="button"
                className={`feat-toggle ${feature.type === 'negative' ? 'is-negative' : 'is-positive'}`}
                onClick={() => toggleFeatureType(i)}
                title={
                  feature.type === 'positive'
                    ? 'Included — click to mark as NOT included'
                    : 'Not included — click to mark as included'
                }
              >
                {feature.type === 'positive' ? (
                  <IconCheck size={13} />
                ) : (
                  <IconX size={13} />
                )}
              </button>

              <input
                className="form-control feat-input"
                value={feature.text}
                placeholder={`Feature ${i + 1}`}
                onChange={(e) => updateFeatureText(i, e.target.value)}
                style={interStyle}
              />

              <button
                className="btn btn-outline btn-sm feat-remove"
                onClick={() => removeFeature(i)}
                type="button"
                style={{ ...interStyle, fontWeight: 500 }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            className="btn btn-ghost btn-sm"
            onClick={addFeature}
            type="button"
            style={{ ...interStyle, fontWeight: 500, marginTop: 4 }}
          >
            <IconPlus size={14} /> Add feature
          </button>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, ...interStyle, fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Active (visible to users)
        </label>
      </Modal>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="mp-del-backdrop" onClick={cancelDelete}>
          <div className="mp-del-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mp-del-icon">
              <IconTrash size={24} />
            </div>

            <h2 className="mp-del-title">Delete Plan?</h2>

            <p className="mp-del-desc">
              You're about to permanently delete{' '}
              <strong>"{deleteTarget.name}"</strong>. This action cannot be undone.
            </p>

            <div className="mp-del-info">
              <div className="mp-del-info-row">
                <span>Price</span>
                <strong>₹{Number(deleteTarget.price).toLocaleString('en-IN')}</strong>
              </div>
              <div className="mp-del-info-row">
                <span>Features</span>
                <strong>{deleteTarget.features?.length || 0}</strong>
              </div>
              <div className="mp-del-info-row">
                <span>Status</span>
                <strong style={{ color: deleteTarget.is_active ? '#059669' : '#dc2626' }}>
                  {deleteTarget.is_active ? 'Active' : 'Inactive'}
                </strong>
              </div>
            </div>

            {deleteTarget.is_active && (
              <div className="mp-del-warn">
                ⚠️ This plan is currently active and visible on the public site.
              </div>
            )}

            <div className="mp-del-actions">
              <button
                className="btn btn-outline"
                onClick={cancelDelete}
                disabled={deleting}
                style={{ ...interStyle, fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
                style={{ ...interStyle, fontWeight: 600 }}
              >
                {deleting ? 'Deleting...' : 'Delete Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          STYLES
          ============================================================ */}
      <style>{`
        .mp-table { width: 100%; border-collapse: collapse; }
        .mp-table thead th {
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
          padding: 14px 16px;
          background: #f9fafb;
          border-bottom: 1px solid #f3f4f6;
          white-space: nowrap;
        }
        .mp-table tbody td {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #0f172a;
          vertical-align: middle;
        }
        .mp-table tbody tr:hover td { background: #fafbff; }
        .mp-table tbody tr:last-child td { border-bottom: none; }

        .mp-td-name { font-weight: 700; color: #0f172a; letter-spacing: -0.01em; }
        .mp-td-price { font-weight: 700; color: #0f172a; }
        .mp-td-desc { color: #475569; max-width: 260px; line-height: 1.5; }
        .mp-td-features { color: #64748b; font-size: 13px; }

        .mp-badge {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          letter-spacing: 0.02em;
          text-transform: capitalize;
        }
        .mp-badge.is-active { background: #d1fae5; color: #059669; }
        .mp-badge.is-inactive { background: #fee2e2; color: #dc2626; }

        .mp-actions {
          display: inline-flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .mp-icon-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1.5px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          font-family: inherit;
        }
        .mp-icon-edit { background: #f1f5f9; border-color: #e2e8f0; color: #475569; }
        .mp-icon-edit:hover {
          background: #e0e7ff;
          border-color: #c7d2fe;
          color: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px -6px rgba(79, 70, 229, 0.4);
        }
        .mp-icon-on { background: #d1fae5; border-color: #a7f3d0; color: #059669; }
        .mp-icon-on:hover {
          background: #a7f3d0;
          border-color: #6ee7b7;
          color: #065f46;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px -6px rgba(16, 185, 129, 0.5);
        }
        .mp-icon-off { background: #fef3c7; border-color: #fde68a; color: #b45309; }
        .mp-icon-off:hover {
          background: #fde68a;
          border-color: #fcd34d;
          color: #92400e;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px -6px rgba(245, 158, 11, 0.5);
        }
        .mp-icon-delete { background: #fee2e2; border-color: #fecaca; color: #dc2626; }
        .mp-icon-delete:hover {
          background: #fecaca;
          border-color: #fca5a5;
          color: #b91c1c;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px -6px rgba(220, 38, 38, 0.5);
        }
        .mp-icon-btn svg { flex-shrink: 0; }

        .mp-tip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: #0f172a;
          color: #fff;
          font-size: 11.5px;
          font-weight: 600;
          padding: 5px 9px;
          border-radius: 6px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
          box-shadow: 0 8px 20px -8px rgba(0,0,0,0.4);
          z-index: 10;
        }
        .mp-tip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: #0f172a;
        }
        .mp-icon-btn:hover .mp-tip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .mp-feat-hint {
          font-size: 12.5px;
          color: #64748b;
          margin: -4px 0 10px;
          line-height: 1.5;
          font-weight: 400;
        }
        .mp-feat-hint strong { color: #0f172a; font-weight: 600; }

        .feature-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .feat-toggle {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          padding: 0;
        }
        .feat-toggle.is-positive {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.35);
          color: #059669;
        }
        .feat-toggle.is-positive:hover {
          background: rgba(16, 185, 129, 0.18);
          border-color: rgba(16, 185, 129, 0.55);
          transform: scale(1.05);
        }
        .feat-toggle.is-negative {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.35);
          color: #dc2626;
        }
        .feat-toggle.is-negative:hover {
          background: rgba(239, 68, 68, 0.18);
          border-color: rgba(239, 68, 68, 0.55);
          transform: scale(1.05);
        }
        .feat-input { flex: 1; min-width: 0; }
        .feat-remove {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          padding: 0 !important;
        }

        .mp-mobile { display: none; }
        .mp-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .mp-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .mp-card-title {
          font-weight: 700;
          font-size: 16px;
          color: #0f172a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          letter-spacing: -0.01em;
        }
        .mp-price {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #4f46e5;
          margin-bottom: 6px;
        }
        .mp-desc {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .mp-features {
          padding: 8px 0;
          border-top: 1px dashed #eef0f3;
          border-bottom: 1px dashed #eef0f3;
          margin-bottom: 12px;
        }
        .mp-features-count {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          background: #f3f4f6;
          padding: 3px 10px;
          border-radius: 999px;
        }
        .mp-card-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .mp-icon-btn-flex {
          flex: 1 1 auto;
          min-width: 0;
          width: auto;
          height: 40px;
        }

        .mp-del-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 6, 22, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: mpFade 0.2s ease;
        }
        @keyframes mpFade { from { opacity: 0; } to { opacity: 1; } }
        .mp-del-modal {
          background: #fff;
          border-radius: 18px;
          width: 100%;
          max-width: 420px;
          padding: 28px 26px 22px;
          text-align: center;
          box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.5);
          animation: mpIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes mpIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .mp-del-icon {
          width: 56px; height: 56px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px -10px rgba(220, 38, 38, 0.5);
        }
        .mp-del-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .mp-del-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
          margin: 0 0 18px;
        }
        .mp-del-desc strong { color: #0f172a; font-weight: 700; }
        .mp-del-info {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 16px;
          text-align: left;
        }
        .mp-del-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 6px 0;
        }
        .mp-del-info-row + .mp-del-info-row { border-top: 1px dashed #e2e8f0; }
        .mp-del-info-row span { color: #64748b; font-weight: 500; }
        .mp-del-info-row strong { color: #0f172a; font-weight: 700; }
        .mp-del-warn {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          color: #78350f;
          font-size: 12.5px;
          line-height: 1.5;
          padding: 10px 12px;
          border-radius: 10px;
          margin-bottom: 16px;
          text-align: left;
        }
        .mp-del-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .mp-del-actions .btn { justify-content: center; }

        @media (max-width: 768px) {
          .mp-root .page-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .mp-root .page-title { font-size: 22px; }
          .mp-root .page-sub { font-size: 13px; }
          .mp-desktop { display: none !important; }
          .mp-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }
          .mp-modal-grid { grid-template-columns: 1fr !important; }
          .mp-del-modal { padding: 24px 20px 18px; border-radius: 16px; }
          .mp-del-actions { grid-template-columns: 1fr; gap: 8px; }
          .mp-del-actions .btn { width: 100%; }
        }

        @media (max-width: 480px) {
          .mp-card { padding: 14px; }
          .mp-card-title { font-size: 15px; }
          .mp-price { font-size: 20px; }
          .mp-icon-btn-flex { height: 38px; }
          .feat-toggle { width: 36px; height: 36px; }
          .feat-remove { width: 36px; height: 36px; }
        }
      `}</style>
    </div>
  )
}