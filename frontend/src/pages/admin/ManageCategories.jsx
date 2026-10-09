import { useEffect, useState } from 'react'
import { categoryApi } from '../../api/categoryApi'
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

export default function ManageCategories() {
  const notify = useNotify()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await categoryApi.list({ all: true })
      setList(res.data?.data?.categories || [])
    } catch {
      notify.error('Failed to load categories')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', description: '' })
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({ name: c.name, description: c.description || '' })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) { notify.error('Name is required'); return }
    setSaving(true)
    try {
      if (editing) {
        await categoryApi.update(editing._id || editing.id, form)
        notify.success('Category updated')
      } else {
        await categoryApi.create(form)
        notify.success('Category created')
      }
      setModalOpen(false)
      load()
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const toggle = async (c) => {
    try {
      await categoryApi.update(c._id || c.id, { is_active: !c.is_active })
      notify.success(c.is_active ? 'Deactivated' : 'Activated')
      load()
    } catch { notify.error('Action failed') }
  }

  if (loading) return <Loader />

  return (
    <div style={interStyle} className="mc-root">
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>Categories</h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            {list.length} categories
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openNew}
          style={{ ...interStyle, fontWeight: 500 }}
        >
          <IconPlus size={16} /> Add Category
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* ---------- Desktop: table ---------- */}
        <div className="table-wrap mc-desktop" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c._id || c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td className="muted"><code>{c.slug}</code></td>
                  <td className="muted">{c.description || '—'}</td>
                  <td>
                    <span className={`badge ${c.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openEdit(c)}
                        style={{ ...interStyle, fontWeight: 500 }}
                      >
                        <IconEdit size={14} /> Edit
                      </button>
                      <button
                        className={`btn btn-sm ${c.is_active ? 'btn-outline' : 'btn-success'}`}
                        onClick={() => toggle(c)}
                        style={{ ...interStyle, fontWeight: 500 }}
                      >
                        {c.is_active ? <><IconX size={14}/> Off</> : <><IconCheck size={14}/> On</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Mobile: cards ---------- */}
        <div className="mc-mobile">
          {list.map((c) => (
            <div key={c._id || c.id} className="mc-card">
              <div className="mc-card-head">
                <div className="mc-card-title">{c.name}</div>
                <span className={`badge ${c.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {c.slug && (
                <div className="mc-card-row">
                  <span className="mc-label">Slug</span>
                  <span className="mc-value">
                    <code className="mc-code">{c.slug}</code>
                  </span>
                </div>
              )}

              {c.description && (
                <div className="mc-desc">{c.description}</div>
              )}

              <div className="mc-card-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => openEdit(c)}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  <IconEdit size={14} /> Edit
                </button>
                <button
                  className={`btn btn-sm ${c.is_active ? 'btn-outline' : 'btn-success'}`}
                  onClick={() => toggle(c)}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  {c.is_active ? <><IconX size={14}/> Off</> : <><IconCheck size={14}/> On</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
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
        <div className="form-group">
          <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
            Name <span className="req">*</span>
          </label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Restaurant"
            style={interStyle}
          />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
            Description
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={interStyle}
          />
        </div>
      </Modal>

      {/* ---------- Responsive styles ---------- */}
      <style>{`
        .mc-mobile { display: none; }

        @media (max-width: 768px) {
          .mc-root .page-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .mc-root .page-title { font-size: 22px; }
          .mc-root .page-sub { font-size: 13px; }

          .mc-desktop { display: none !important; }
          .mc-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }

          .mc-card {
            background: var(--card-bg, #fff);
            border: 1px solid var(--border, #e5e7eb);
            border-radius: 12px;
            padding: 14px 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          }
          .mc-card-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid var(--border, #eef0f3);
          }
          .mc-card-title {
            font-weight: 700;
            font-size: 15px;
            color: var(--text, #111827);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }
          .mc-card-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding: 5px 0;
            font-size: 13px;
          }
          .mc-label {
            color: var(--muted, #6b7280);
            font-weight: 500;
            flex-shrink: 0;
          }
          .mc-value {
            color: var(--text, #111827);
            font-weight: 500;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 60%;
          }
          .mc-code {
            background: var(--bg-soft, #f3f4f6);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
          }
          .mc-desc {
            font-size: 12.5px;
            color: var(--muted, #6b7280);
            line-height: 1.5;
            padding: 8px 0 0;
            margin-top: 6px;
            border-top: 1px dashed var(--border, #eef0f3);
          }
          .mc-card-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px dashed var(--border, #eef0f3);
          }
          .mc-card-actions .btn {
            flex: 1;
            justify-content: center;
          }
        }

        @media (max-width: 380px) {
          .mc-card { padding: 12px; }
          .mc-card-title { font-size: 14px; }
          .mc-card-row { font-size: 12px; }
          .mc-desc { font-size: 12px; }
          .mc-card-actions .btn { font-size: 11px; padding: 6px 8px; }
        }
      `}</style>
    </div>
  )
}