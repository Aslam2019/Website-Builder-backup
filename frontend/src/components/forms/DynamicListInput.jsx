import { useState } from 'react'
import { IconPlus, IconTrash, IconUpload } from '../dashboard/Icons'
import { uploadApi } from '../../api/uploadApi'
import { useNotify } from '../../context/NotificationContext'
import { UPLOADS_BASE } from '../../utils/constants'

export default function DynamicListInput({ label, items = [], itemFields = [], onChange }) {
  const notify = useNotify()
  const add = () => {
    const blank = {}
    itemFields.forEach((f) => { blank[f.name] = '' })
    onChange([...(items || []), blank])
  }
  const update = (i, key, val) => {
    const copy = [...items]
    copy[i] = { ...copy[i], [key]: val }
    onChange(copy)
  }
  const remove = (i) => onChange(items.filter((_, x) => x !== i))

  const uploadImage = async (i, key, file) => {
    try {
      const res = await uploadApi.uploadImage(file, 'gallery')
      update(i, key, res.data?.data?.url || '')
      notify.success('Image uploaded')
    } catch { notify.error('Upload failed') }
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(items || []).map((item, i) => (
          <div key={i} className="list-item">
            <div className="list-item-head">
              <strong>#{i + 1}</strong>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => remove(i)}>
                <IconTrash size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {itemFields.map((f) => (
                <div key={f.name} style={{ gridColumn: f.type === 'textarea' ? 'span 2' : 'auto' }}>
                  <label className="form-label" style={{ fontSize: 12 }}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="form-control" rows={f.rows || 2}
                      value={item[f.name] || ''}
                      onChange={(e) => update(i, f.name, e.target.value)} />
                  ) : f.type === 'image' ? (
                    <div>
                      <input type="file" accept="image/*" id={`u-${i}-${f.name}`} hidden
                        onChange={(e) => e.target.files[0] && uploadImage(i, f.name, e.target.files[0])} />
                      <label htmlFor={`u-${i}-${f.name}`} className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                        <IconUpload size={13} /> {item[f.name] ? 'Change' : 'Upload'}
                      </label>
                      {item[f.name] && (
                        <img src={`${UPLOADS_BASE}${item[f.name]}`} alt="" className="thumb-mini" />
                      )}
                    </div>
                  ) : (
                    <input className="form-control" type={f.type} placeholder={f.placeholder}
                      value={item[f.name] || ''}
                      onChange={(e) => update(i, f.name, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={add} style={{ alignSelf: 'flex-start' }}>
          <IconPlus size={14} /> Add {label.replace(/s$/, '')}
        </button>
      </div>
    </div>
  )
}