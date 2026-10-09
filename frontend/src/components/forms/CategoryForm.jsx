import { useState } from 'react'
import { IconPlus, IconTrash, IconUpload } from '../dashboard/Icons'
import DynamicListInput from './DynamicListInput'
import { uploadApi } from '../../api/uploadApi'
import { useNotify } from '../../context/NotificationContext'
import { UPLOADS_BASE } from '../../utils/constants'
import { isEmail, isMobile, isUrl } from '../../utils/validators'

export default function CategoryForm({ config, formData, onChange }) {
  const notify = useNotify()
  const [errors, setErrors] = useState({})

  const setField = (name, value) => {
    onChange({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const validateField = (field, value) => {
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`
    }
    if (value && field.type === 'email' && !isEmail(value)) return 'Enter a valid email'
    if (value && field.type === 'tel' && !isMobile(value)) return 'Enter a valid 10-digit mobile'
    if (value && field.type === 'url' && !isUrl(value)) return 'Enter a valid URL (https://...)'
    return null
  }

  const uploadField = async (field, file) => {
    try {
      const isDoc = field.type === 'file'
      const res = isDoc
        ? await uploadApi.uploadResume(file)
        : await uploadApi.uploadImage(file, field.folder || 'gallery')
      setField(field.name, res.data?.data?.url || '')
      notify.success('Uploaded')
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Upload failed')
    }
  }

  const uploadMultiple = async (field, files) => {
    try {
      const urls = []
      for (const f of files) {
        const res = await uploadApi.uploadImage(f, field.folder || 'gallery')
        urls.push(res.data?.data?.url || '')
      }
      setField(field.name, [...(formData[field.name] || []), ...urls])
      notify.success(`${urls.length} image(s) uploaded`)
    } catch { notify.error('Upload failed') }
  }

  return (
    <div>
      {config.sections.map((section) => (
        <div key={section.title} className="form-section">
          <h3 className="form-section-title">{section.title}</h3>

          {section.fields.map((field) => {
            // --- LIST ---
            if (field.type === 'list') {
              return (
                <DynamicListInput key={field.name}
                  label={field.label}
                  items={formData[field.name] || []}
                  itemFields={field.itemFields}
                  onChange={(v) => setField(field.name, v)}
                />
              )
            }

            // --- IMAGE LIST (multi) ---
            if (field.type === 'image-list') {
              const imgs = formData[field.name] || []
              return (
                <div key={field.name} className="form-group">
                  <label className="form-label">{field.label}</label>
                  <div className="img-list">
                    {imgs.map((url, i) => (
                      <div key={i} className="img-list-item">
                        <img src={`${UPLOADS_BASE}${url}`} alt="" />
                        <button type="button" className="img-list-remove"
                          onClick={() => setField(field.name, imgs.filter((_, x) => x !== i))}>
                          <IconTrash size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="img-list-add" style={{ cursor: 'pointer' }}>
                      <input type="file" accept="image/*" multiple hidden
                        onChange={(e) => e.target.files && uploadMultiple(field, e.target.files)} />
                      <IconPlus size={20} />
                      <span>Add</span>
                    </label>
                  </div>
                </div>
              )
            }

            // --- TAGS ---
            if (field.type === 'tags') {
              const tags = formData[field.name] || []
              return (
                <div key={field.name} className="form-group">
                  <label className="form-label">{field.label}</label>
                  <div className="tags-input">
                    {tags.map((t, i) => (
                      <span key={i} className="tag">
                        {t}
                        <button type="button"
                          onClick={() => setField(field.name, tags.filter((_, x) => x !== i))}>×</button>
                      </span>
                    ))}
                    <input
                      className="tag-input"
                      placeholder={tags.length ? '' : field.placeholder}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          e.preventDefault()
                          setField(field.name, [...tags, e.target.value.trim()])
                          e.target.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              )
            }

            // --- IMAGE (single) ---
            if (field.type === 'image') {
              return (
                <div key={field.name} className="form-group">
                  <label className="form-label">{field.label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {formData[field.name] ? (
                      <img src={`${UPLOADS_BASE}${formData[field.name]}`} alt="" className="thumb-med" />
                    ) : (
                      <div className="thumb-med thumb-empty">No image</div>
                    )}
                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                      <input type="file" accept="image/*" hidden
                        onChange={(e) => e.target.files[0] && uploadField(field, e.target.files[0])} />
                      <IconUpload size={13} /> {formData[field.name] ? 'Change' : 'Upload'}
                    </label>
                  </div>
                </div>
              )
            }

            // --- FILE ---
            if (field.type === 'file') {
              return (
                <div key={field.name} className="form-group">
                  <label className="form-label">{field.label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                      <input type="file" accept=".pdf,.doc,.docx" hidden
                        onChange={(e) => e.target.files[0] && uploadField(field, e.target.files[0])} />
                      <IconUpload size={13} /> {formData[field.name] ? 'Change File' : 'Upload File'}
                    </label>
                    {formData[field.name] && (
                      <a href={`${UPLOADS_BASE}${formData[field.name]}`} target="_blank" rel="noreferrer"
                        className="muted" style={{ fontSize: 13 }}>
                        View uploaded
                      </a>
                    )}
                  </div>
                </div>
              )
            }

            // --- TEXTAREA ---
            if (field.type === 'textarea') {
              return (
                <div key={field.name} className="form-group">
                  <label className="form-label">
                    {field.label} {field.required && <span className="req">*</span>}
                  </label>
                  <textarea className={`form-control ${errors[field.name] ? 'error' : ''}`}
                    rows={field.rows || 3}
                    value={formData[field.name] || ''}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    onChange={(e) => setField(field.name, e.target.value)}
                    onBlur={(e) => {
                      const err = validateField(field, e.target.value)
                      if (err) setErrors({ ...errors, [field.name]: err })
                    }} />
                  {errors[field.name] && <div className="form-error">{errors[field.name]}</div>}
                </div>
              )
            }

            // --- DEFAULT TEXT/EMAIL/TEL/URL ---
            return (
              <div key={field.name} className="form-group">
                <label className="form-label">
                  {field.label} {field.required && <span className="req">*</span>}
                </label>
                <input className={`form-control ${errors[field.name] ? 'error' : ''}`}
                  type={field.type}
                  value={formData[field.name] || ''}
                  placeholder={field.placeholder}
                  onChange={(e) => setField(field.name, e.target.value)}
                  onBlur={(e) => {
                    const err = validateField(field, e.target.value)
                    if (err) setErrors({ ...errors, [field.name]: err })
                  }} />
                {errors[field.name] && <div className="form-error">{errors[field.name]}</div>}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}