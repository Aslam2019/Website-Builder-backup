/**
 * Shared form field components used by all category forms.
 */
import { IconUpload, IconPlus, IconTrash } from '../dashboard/Icons'
import { uploadApi } from '../../api/uploadApi'
import { useNotify } from '../../context/NotificationContext'
import { UPLOADS_BASE } from '../../utils/constants'

/* ------------ Text / Email / Tel / URL / Textarea / Select ------------ */
export function Field({
  label, name, value, onChange, type = 'text',
  required = false, placeholder = '', error = '', rows = 3,
  maxLength, help = '', options = [],
}) {
  const common = {
    className: `form-control ${error ? 'error' : ''}`,
    value: value || '',
    placeholder,
    maxLength,
    onChange: (e) => onChange(name, e.target.value),
  }

  return (
    <div className={`ff ${error ? 'ff-error' : ''}`}>
      <label className="ff-label">
        {label}
        {required && <span className="ff-req">*</span>}
        {help && <span className="ff-help" title={help}>ⓘ</span>}
      </label>

      {type === 'textarea' ? (
        <textarea {...common} rows={rows} />
      ) : type === 'select' ? (
        <select {...common} style={{ cursor: 'pointer' }}>
          <option value="">{placeholder || 'Select...'}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input {...common} type={type} inputMode={type === 'tel' ? 'numeric' : undefined} />
      )}

      {error && <div className="ff-err-msg">{error}</div>}
    </div>
  )
}

/* ------------ Tags input (skills) ------------ */
export function TagsInput({ label, name, value = [], onChange, placeholder = 'Type + Enter' }) {
  return (
    <div className="ff">
      <label className="ff-label">{label}</label>
      <div className="ff-tags">
        {value.map((t, i) => (
          <span key={i} className="ff-tag">
            {t}
            <button type="button" onClick={() => onChange(name, value.filter((_, x) => x !== i))}>×</button>
          </span>
        ))}
        <input
          className="ff-tag-input"
          placeholder={value.length ? '' : placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              e.preventDefault()
              onChange(name, [...value, e.target.value.trim()])
              e.target.value = ''
            }
          }}
        />
      </div>
    </div>
  )
}

/* ------------ Single image upload ------------ */
export function ImageUpload({ label, name, value, onChange, folder = 'gallery' }) {
  const notify = useNotify()

  const handle = async (file) => {
    if (!file) return
    try {
      const res = await uploadApi.uploadImage(file, folder)
      onChange(name, res.data?.data?.url || '')
      notify.success('Image uploaded')
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Upload failed')
    }
  }

  return (
    <div className="ff">
      <label className="ff-label">{label}</label>
      <div className="ff-img-upload">
        {value ? (
          <div className="ff-img-preview">
            <img src={`${UPLOADS_BASE}${value}`} alt="" />
          </div>
        ) : (
          <div className="ff-img-empty">No image</div>
        )}
        <label className="ff-img-btn">
          <input type="file" accept="image/*" hidden
            onChange={(e) => handle(e.target.files[0])} />
          <IconUpload size={14} /> {value ? 'Change' : 'Upload Image'}
        </label>
      </div>
    </div>
  )
}

/* ------------ File upload (resume) ------------ */
export function FileUpload({ label, name, value, onChange, accept = '.pdf,.doc,.docx' }) {
  const notify = useNotify()

  const handle = async (file) => {
    if (!file) return
    try {
      const res = await uploadApi.uploadResume(file)
      onChange(name, res.data?.data?.url || '')
      notify.success('File uploaded')
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Upload failed')
    }
  }

  return (
    <div className="ff">
      <label className="ff-label">{label}</label>
      <div className="ff-img-upload">
        <label className="ff-img-btn">
          <input type="file" accept={accept} hidden
            onChange={(e) => handle(e.target.files[0])} />
          <IconUpload size={14} /> {value ? 'Change File' : 'Upload File'}
        </label>
        {value && (
          <a href={`${UPLOADS_BASE}${value}`} target="_blank" rel="noreferrer"
            className="ff-img-view">
            View uploaded
          </a>
        )}
      </div>
    </div>
  )
}

/* ------------ Multi-image list (gallery / portfolio) ------------ */
export function ImageListUpload({ label, name, value = [], onChange, folder = 'gallery' }) {
  const notify = useNotify()

  const handle = async (files) => {
    if (!files?.length) return
    try {
      const urls = []
      for (const f of files) {
        const res = await uploadApi.uploadImage(f, folder)
        urls.push(res.data?.data?.url || '')
      }
      onChange(name, [...value, ...urls])
      notify.success(`${urls.length} image(s) uploaded`)
    } catch { notify.error('Upload failed') }
  }

  return (
    <div className="ff">
      <label className="ff-label">{label}</label>
      <div className="ff-imgs">
        {value.map((url, i) => (
          <div key={i} className="ff-img-thumb">
            <img src={`${UPLOADS_BASE}${url}`} alt="" />
            <button type="button"
              onClick={() => onChange(name, value.filter((_, x) => x !== i))}>
              <IconTrash size={11} />
            </button>
          </div>
        ))}
        <label className="ff-img-add">
          <input type="file" accept="image/*" multiple hidden
            onChange={(e) => handle(Array.from(e.target.files))} />
          <IconPlus size={20} />
          <span>Add</span>
        </label>
      </div>
    </div>
  )
}

/* ------------ Dynamic list of objects (projects, properties, services, packages) ------------ */
export function DynamicList({
  label, name, value = [], onChange,
  itemFields = [], addLabel = 'item',
}) {

  const add = () => {
    const blank = {}
    itemFields.forEach((f) => { blank[f.name] = '' })
    onChange(name, [...value, blank])
  }
  const update = (i, key, val) => {
    const copy = [...value]
    copy[i] = { ...copy[i], [key]: val }
    onChange(name, copy)
  }
  const remove = (i) => onChange(name, value.filter((_, x) => x !== i))

  const notify = useNotify()
  const uploadImg = async (i, key, file) => {
    if (!file) return
    try {
      const res = await uploadApi.uploadImage(file, 'gallery')
      update(i, key, res.data?.data?.url || '')
      notify.success('Uploaded')
    } catch { notify.error('Upload failed') }
  }

  return (
    <div className="ff">
      <label className="ff-label">{label}</label>
      <div className="ff-list">
        {value.map((item, i) => (
          <div key={i} className="ff-list-item">
            <div className="ff-list-head">
              <span className="ff-list-num">{i + 1}</span>
              <button type="button" className="ff-list-remove"
                onClick={() => remove(i)} title="Remove">
                <IconTrash size={13} />
              </button>
            </div>
            <div className="ff-list-grid">
              {itemFields.map((f) => (
                <div key={f.name}
                  className={f.type === 'textarea' ? 'ff-list-full' : ''}>
                  <label className="ff-list-label">{f.label}</label>

                  {f.type === 'textarea' ? (
                    <textarea className="form-control" rows={2}
                      value={item[f.name] || ''}
                      placeholder={f.placeholder}
                      onChange={(e) => update(i, f.name, e.target.value)} />

                  ) : f.type === 'select' ? (
                    <select className="form-control"
                      value={item[f.name] || ''}
                      onChange={(e) => update(i, f.name, e.target.value)}
                      style={{ cursor: 'pointer' }}>
                      <option value="">{f.placeholder || 'Select...'}</option>
                      {(f.options || []).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>

                  ) : f.type === 'image' ? (
                    <div className="ff-list-img">
                      {item[f.name] ? (
                        <img src={`${UPLOADS_BASE}${item[f.name]}`} alt="" className="ff-list-thumb" />
                      ) : (
                        <div className="ff-list-thumb ff-list-thumb-empty">No image</div>
                      )}
                      <label className="ff-img-btn ff-img-btn-sm">
                        <input type="file" accept="image/*" hidden
                          onChange={(e) => uploadImg(i, f.name, e.target.files[0])} />
                        <IconUpload size={12} /> {item[f.name] ? 'Change' : 'Upload'}
                      </label>
                    </div>

                  ) : (
                    <input className="form-control" type={f.type || 'text'}
                      value={item[f.name] || ''}
                      placeholder={f.placeholder}
                      onChange={(e) => update(i, f.name, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" className="ff-list-add" onClick={add}>
          <IconPlus size={14} /> Add {addLabel}
        </button>
      </div>
    </div>
  )
}

/* ------------ Section wrapper ------------ */
export function FormSection({ step, title, description, children }) {
  return (
    <section className="fs">
      <div className="fs-head">
        <div className="fs-step">{step}</div>
        <div>
          <h3 className="fs-title">{title}</h3>
          {description && <p className="fs-desc">{description}</p>}
        </div>
      </div>
      <div className="fs-body">{children}</div>
    </section>
  )
}