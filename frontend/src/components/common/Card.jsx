export default function Card({ title, children, className = '', actions = null }) {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="flex-between" style={{ marginBottom: 16 }}>
          {title && <h3 className="card-title" style={{ margin: 0 }}>{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}