export default function StatCard({ label, value, Icon, color = '#4f46e5', suffix = '' }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}{suffix}</div>
        </div>
        <div className="stat-icon" style={{ background: `${color}15`, color }}>
          {Icon ? <Icon size={22} /> : null}
        </div>
      </div>
    </div>
  )
}