import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer = null }) {
  useEffect(() => {
    if (!open) return
    const onEsc = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={(e) => {
      if (e.target.classList.contains('modal-backdrop')) onClose?.()
    }}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}