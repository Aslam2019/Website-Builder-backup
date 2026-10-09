import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/formatDate'

/* ============================================================
   Local Icons — no external dependency
   ============================================================ */
const IconUser = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
  </svg>
)
const IconCheck = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconShield = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const IconClock = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
)
const IconPhone = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconCategory = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)
const IconPricing = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M14 9a3 3 0 1 0 0 6" />
    <path d="M9 12h5" />
  </svg>
)
const IconWebsite = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18" />
    <path d="M12 3a15 15 0 0 0 0 18" />
  </svg>
)

/* ============================================================
   MAIN PROFILE PAGE
   ============================================================ */
export default function Profile() {
  const { user } = useAuth()

  const initials = (user?.username || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const joined = formatDate(user?.created_at)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Your account information and preferences</p>
        </div>
      </div>

      {/* ---- Hero Card ---- */}
      <div className="profile-hero">
        <div className="profile-hero-bg" />
        <div className="profile-hero-content">
          <div className="profile-avatar">
            {initials}
            <span className="profile-avatar-ring" />
          </div>
          <div className="profile-hero-info">
            <h2 className="profile-username">{user?.username}</h2>
            <div className="profile-hero-badges">
              <span className="profile-badge">
                <IconShield size={12} /> {user?.role === 'super_admin' ? 'Super Admin' : 'User'}
              </span>
              {user?.category?.name && (
                <span className="profile-badge">
                  <IconCategory size={12} /> {user.category.name}
                </span>
              )}
              {user?.preferred_plan && (
                <span className="profile-badge">
                  <IconPricing size={12} /> {user.preferred_plan.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Info Cards Grid ---- */}
      <div className="profile-grid">
        <ProfileCard
          icon={<IconUser size={18} />}
          label="Username"
          value={user?.username || '—'}
          color="#4f46e5"
        />
        <ProfileCard
          icon={<IconPhone size={18} />}
          label="Mobile Number"
          value={user?.mobile || 'Not set'}
          color="#06b6d4"
        />
        <ProfileCard
          icon={<IconCategory size={18} />}
          label="Business Category"
          value={user?.category?.name || '—'}
          color="#8b5cf6"
        />
        <ProfileCard
          icon={<IconPricing size={18} />}
          label="Preferred Plan"
          value={
            user?.preferred_plan
              ? `${user.preferred_plan.name} · ₹${Number(user.preferred_plan.price).toLocaleString('en-IN')}`
              : '—'
          }
          color="#f59e0b"
        />
        <ProfileCard
          icon={<IconShield size={18} />}
          label="Account Status"
          value={
            <span className={`badge ${user?.is_active ? 'badge-success' : 'badge-danger'}`}>
              {user?.is_active ? <>Active</> : 'Inactive'}
            </span>
          }
          color="#10b981"
        />
        <ProfileCard
          icon={<IconClock size={18} />}
          label="Member Since"
          value={joined}
          color="#64748b"
        />
      </div>

      {/* ---- Account Actions ---- */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-title">Account Actions</h3>
        <div className="profile-actions">
          <div className="profile-action-item">
            <div className="profile-action-icon">
              <IconWebsite size={20} />
            </div>
            <div className="profile-action-body">
              <div className="profile-action-title">Your Websites</div>
              <div className="profile-action-desc">
                Manage and preview your generated websites
              </div>
            </div>
            <a href="/dashboard/my-website" className="btn btn-outline btn-sm">
              View →
            </a>
          </div>

          <div className="profile-action-item">
            <div className="profile-action-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <IconPricing size={20} />
            </div>
            <div className="profile-action-body">
              <div className="profile-action-title">Billing & Payments</div>
              <div className="profile-action-desc">
                View all your transactions and invoices
              </div>
            </div>
            <a href="/dashboard/payments" className="btn btn-outline btn-sm">
              View →
            </a>
          </div>
        </div>

        <div className="profile-note">
          <IconShield size={14} />
          <span>
            Your password and personal information are securely stored and never shared.
            To update your details, contact support.
          </span>
        </div>
      </div>
    </div>
  )
}

function ProfileCard({ icon, label, value, color = '#4f46e5' }) {
  return (
    <div className="profile-info-card">
      <div className="profile-info-icon" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="profile-info-body">
        <div className="profile-info-label">{label}</div>
        <div className="profile-info-value">{value}</div>
      </div>
    </div>
  )
}