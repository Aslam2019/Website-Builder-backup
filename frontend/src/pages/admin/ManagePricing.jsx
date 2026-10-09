import { useEffect, useState } from 'react'
import { pricingApi } from '../../api/pricingApi'
import { useNotify } from '../../context/NotificationContext'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import { IconPlus, IconEdit, IconCheck, IconX } from '../../components/admin/Icons'

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

export default function ManagePricing() {
  const notify = useNotify()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', description: '', features: [''], is_active: true })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await pricingApi.list({ all: true })
      setPlans(res.data?.data?.plans || [])
    } catch { notify.error('Failed to load pricing') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', price: '', description: '', features: [''], is_active: true })
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name, price: p.price, description: p.description || '',
      features: p.features?.length ? p.features : [''],
      is_active: p.is_active,
    })
    setModalOpen(true)
  }

  const updateFeature = (i, v) => {
    const f = [...form.features]; f[i] = v; setForm({ ...form, features: f })
  }
  const addFeature = () => setForm({ ...form, features: [...form.features, ''] })
  const removeFeature = (i) => setForm({ ...form, features: form.features.filter((_, x) => x !== i) })

  const save = async () => {
    if (!form.name.trim()) return notify.error('Name is required')
    if (!form.price || isNaN(form.price)) return notify.error('Valid price is required')
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        features: form.features.filter((f) => f.trim()),
        is_active: form.is_active,
      }
      if (editing) {
        await pricingApi.update(editing._id || editing.id, payload)
        notify.success('Plan updated')
      } else {
        await pricingApi.create(payload)
        notify.success('Plan created')
      }
      setModalOpen(false); load()
    } catch (e) { notify.error(e?.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const toggle = async (p) => {
    try {
      await pricingApi.update(p._id || p.id, { is_active: !p.is_active })
      notify.success(p.is_active ? 'Deactivated' : 'Activated')
      load()
    } catch { notify.error('Action failed') }
  }

  if (loading) return <Loader />

  return (
    <div style={interStyle} className="mp-root">
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
        {/* ---------- Desktop: table ---------- */}
        <div className="table-wrap mp-desktop" style={{ border: 'none', borderRadius: 0 }}>
          <table>
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
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ fontWeight: 600 }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td className="muted" style={{ maxWidth: 260 }}>{p.description || '—'}</td>
                  <td className="muted" style={{ fontSize: 13 }}>{p.features?.length || 0} features</td>
                  <td>
                    <span className={`badge ${p.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openEdit(p)}
                        style={{ ...interStyle, fontWeight: 500 }}
                      >
                        <IconEdit size={14} /> Edit
                      </button>
                      <button
                        className={`btn btn-sm ${p.is_active ? 'btn-outline' : 'btn-success'}`}
                        onClick={() => toggle(p)}
                        style={{ ...interStyle, fontWeight: 500 }}
                      >
                        {p.is_active ? <><IconX size={14}/> Off</> : <><IconCheck size={14}/> On</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Mobile: cards ---------- */}
        <div className="mp-mobile">
          {plans.map((p) => (
            <div key={p._id || p.id} className="mp-card">
              <div className="mp-card-head">
                <div className="mp-card-title">{p.name}</div>
                <span className={`badge ${p.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mp-price">₹{Number(p.price).toLocaleString('en-IN')}</div>

              {p.description && (
                <div className="mp-desc">{p.description}</div>
              )}

              <div className="mp-features">
                <span className="mp-features-count">
                  {p.features?.length || 0} feature{(p.features?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="mp-card-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => openEdit(p)}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  <IconEdit size={14} /> Edit
                </button>
                <button
                  className={`btn btn-sm ${p.is_active ? 'btn-outline' : 'btn-success'}`}
                  onClick={() => toggle(p)}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  {p.is_active ? <><IconX size={14}/> Off</> : <><IconCheck size={14}/> On</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
        <div className="form-group">
          <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
            Features
          </label>
          {form.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="form-control"
                value={f}
                placeholder={`Feature ${i + 1}`}
                onChange={(e) => updateFeature(i, e.target.value)}
                style={interStyle}
              />
              <button
                className="btn btn-outline btn-sm"
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
            style={{ ...interStyle, fontWeight: 500 }}
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

      {/* ---------- Responsive styles ---------- */}
      <style>{`
        .mp-mobile { display: none; }

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

          .mp-card {
            background: var(--card-bg, #fff);
            border: 1px solid var(--border, #e5e7eb);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
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
            color: var(--text, #111827);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }
          .mp-price {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: var(--primary, #4f46e5);
            margin-bottom: 6px;
          }
          .mp-desc {
            font-size: 13px;
            color: var(--muted, #6b7280);
            line-height: 1.5;
            margin-bottom: 10px;
          }
          .mp-features {
            padding: 8px 0;
            border-top: 1px dashed var(--border, #eef0f3);
            border-bottom: 1px dashed var(--border, #eef0f3);
            margin-bottom: 12px;
          }
          .mp-features-count {
            font-size: 12px;
            font-weight: 600;
            color: var(--muted, #6b7280);
            background: var(--bg-soft, #f3f4f6);
            padding: 3px 10px;
            border-radius: 999px;
          }
          .mp-card-actions {
            display: flex;
            gap: 8px;
          }
          .mp-card-actions .btn {
            flex: 1;
            justify-content: center;
          }

          /* Modal grid stack on mobile */
          .mp-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 380px) {
          .mp-card { padding: 12px; }
          .mp-card-title { font-size: 15px; }
          .mp-price { font-size: 20px; }
        }
      `}</style>
    </div>
  )
}