import { useEffect, useState } from 'react'
import { templateApi } from '../../api/templateApi'
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

export default function ManageTemplates() {
  const notify = useNotify()
  const [list, setList] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', category_id: '', preview_image: '', is_active: true })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [t, c] = await Promise.all([
        templateApi.list({ all: true }),
        categoryApi.list({ all: true }),
      ])
      setList(t.data?.data?.templates || [])
      setCategories(c.data?.data?.categories || [])
    } catch { notify.error('Failed to load templates') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', category_id: '', preview_image: '', is_active: true })
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setForm({
      name: t.name,
      category_id: t.category?.id || t.category_id || '',
      preview_image: t.preview_image || '',
      is_active: t.is_active,
    })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return notify.error('Name required')
    if (!form.category_id) return notify.error('Category required')
    setSaving(true)
    try {
      if (editing) {
        await templateApi.update(editing._id || editing.id, form)
        notify.success('Template updated')
      } else {
        await templateApi.create(form)
        notify.success('Template created')
      }
      setModalOpen(false); load()
    } catch (e) { notify.error(e?.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const toggle = async (t) => {
    try {
      await templateApi.update(t._id || t.id, { is_active: !t.is_active })
      notify.success('Updated'); load()
    } catch { notify.error('Action failed') }
  }

  const remove = async (t) => {
    if (!window.confirm(`Delete template "${t.name}"?`)) return
    try {
      await templateApi.remove(t._id || t.id)
      notify.success('Deleted'); load()
    } catch { notify.error('Delete failed') }
  }

  if (loading) return <Loader />

  return (
    <div style={interStyle} className="mt-root">
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>Templates</h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            {list.length} templates across {categories.length} categories
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openNew}
          style={{ ...interStyle, fontWeight: 500 }}
        >
          <IconPlus size={16} /> Add Template
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* ---------- Desktop: table ---------- */}
        <div className="table-wrap mt-desktop" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Preview</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t._id || t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td>{t.category?.name || '—'}</td>
                  <td className="muted" style={{ fontSize: 12 }}>
                    {t.preview_image ? <code>{t.preview_image.slice(0, 40)}...</code> : '—'}
                  </td>
                  <td>
                    <span className={`badge ${t.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openEdit(t)}
                        style={{ ...interStyle, fontWeight: 500 }}
                      >
                        <IconEdit size={14} /> Edit
                      </button>
                      <button
                        className={`btn btn-sm ${t.is_active ? 'btn-outline' : 'btn-success'}`}
                        onClick={() => toggle(t)}
                        style={{ ...interStyle, fontWeight: 500 }}
                      >
                        {t.is_active ? <><IconX size={14}/> Off</> : <><IconCheck size={14}/> On</>}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(t)}
                        style={{ ...interStyle, fontWeight: 500 }}
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Mobile: cards ---------- */}
        <div className="mt-mobile">
          {list.map((t) => (
            <div key={t._id || t.id} className="mt-card">
              <div className="mt-card-head">
                <div className="mt-card-title">{t.name}</div>
                <span className={`badge ${t.is_active ? 'badge-success' : 'badge-danger'}`}>
                  {t.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-card-row">
                <span className="mt-label">Category</span>
                <span className="mt-value">{t.category?.name || '—'}</span>
              </div>

              {t.preview_image && (
                <div className="mt-card-row">
                  <span className="mt-label">Preview</span>
                  <span className="mt-value mt-preview">
                    <code>{t.preview_image.slice(0, 28)}...</code>
                  </span>
                </div>
              )}

              <div className="mt-card-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => openEdit(t)}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  <IconEdit size={14} /> Edit
                </button>
                <button
                  className={`btn btn-sm ${t.is_active ? 'btn-outline' : 'btn-success'}`}
                  onClick={() => toggle(t)}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  {t.is_active ? <><IconX size={14}/> Off</> : <><IconCheck size={14}/> On</>}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => remove(t)}
                  style={{ ...interStyle, fontWeight: 500 }}
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Template' : 'Add Template'}
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
            Template Name <span className="req">*</span>
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
            Category <span className="req">*</span>
          </label>
          <select
            className="form-control"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            style={interStyle}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>
            Preview Image URL
          </label>
          <input
            className="form-control"
            value={form.preview_image}
            placeholder="/uploads/template_previews/..."
            onChange={(e) => setForm({ ...form, preview_image: e.target.value })}
            style={interStyle}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, ...interStyle, fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Active
        </label>
      </Modal>

      {/* ---------- Responsive styles ---------- */}
      <style>{`
        .mt-mobile { display: none; }

        @media (max-width: 768px) {
          .mt-root .page-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .mt-root .page-title { font-size: 22px; }
          .mt-root .page-sub { font-size: 13px; }

          .mt-desktop { display: none !important; }
          .mt-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px;
          }

          .mt-card {
            background: var(--card-bg, #fff);
            border: 1px solid var(--border, #e5e7eb);
            border-radius: 12px;
            padding: 14px 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          }
          .mt-card-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid var(--border, #eef0f3);
          }
          .mt-card-title {
            font-weight: 700;
            font-size: 15px;
            color: var(--text, #111827);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }
          .mt-card-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding: 5px 0;
            font-size: 13px;
          }
          .mt-label {
            color: var(--muted, #6b7280);
            font-weight: 500;
            flex-shrink: 0;
          }
          .mt-value {
            color: var(--text, #111827);
            font-weight: 500;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 60%;
          }
          .mt-preview code {
            background: var(--bg-soft, #f3f4f6);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
          }
          .mt-card-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px dashed var(--border, #eef0f3);
          }
          .mt-card-actions .btn {
            flex: 1;
            justify-content: center;
          }
        }

        @media (max-width: 380px) {
          .mt-card { padding: 12px; }
          .mt-card-title { font-size: 14px; }
          .mt-card-row { font-size: 12px; }
          .mt-card-actions .btn { font-size: 11px; padding: 6px 8px; }
        }
      `}</style>
    </div>
  )
}