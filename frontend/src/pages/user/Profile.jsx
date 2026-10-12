import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/formatDate'
import axiosClient from '../../api/axiosClient'
import WebsiteQR from '../../components/user/WebsiteQR'

/* ============================================================
   Local Icons
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
const IconQR = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3M21 14v3M14 21h3M21 21h-3" />
  </svg>
)
const IconLock = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2.5" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconZap = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

/* ============================================================
   MAIN PROFILE PAGE
   ============================================================ */
export default function Profile() {
  const { user } = useAuth()

  const [website, setWebsite] = useState(null)
  const [qrLoading, setQrLoading] = useState(true)

  // ✅ Fresh plan flags fetched from backend (bypasses localStorage)
  const [planFlags, setPlanFlags] = useState({
    qr_code: false,
    whatsapp_button: false,
  })

  /* Fetch user's website */
  useEffect(() => {
    let alive = true
    ;(async () => {
      let found = null

      try {
        const res = await axiosClient.get('/websites/my-website')
        const data = res?.data?.data
        if (data && (data.id || data._id)) found = data
      } catch (e) {
        console.warn('[QR] /my-website failed:', e?.response?.status)
      }

      if (!found) {
        try {
          const listRes = await axiosClient.get('/websites')
          const list = listRes?.data?.data?.websites || listRes?.data?.websites || []
          if (Array.isArray(list) && list.length > 0) found = list[0]
        } catch (e) {
          console.warn('[QR] /websites failed:', e?.response?.status)
        }
      }

      if (alive) {
        setWebsite(found)
        setQrLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  /* ✅ Fetch FRESH plan flags from backend on mount */
  useEffect(() => {
    const loadPlanFlags = async () => {
      // Admin — always full access
      if (user?.role === 'super_admin' || user?.role === 'admin') {
        setPlanFlags({ qr_code: true, whatsapp_button: true })
        return
      }

      const planId =
        user?.preferred_plan?.id ||
        user?.preferred_plan?._id ||
        user?.preferred_plan_id

      if (!planId) {
        setPlanFlags({ qr_code: false, whatsapp_button: false })
        return
      }

      try {
        // 🔥 Fetch fresh plan from backend
        const res = await axiosClient.get(`/pricing/${planId}`)
        const plan = res?.data?.data?.plan || res?.data?.plan
        const flags = plan?.feature_flags || {}

        setPlanFlags({
          qr_code: !!flags.qr_code,
          whatsapp_button: !!flags.whatsapp_button,
        })
        console.log('[Plan Flags] fresh:', flags)
      } catch (e) {
        console.warn('[Plan Flags] fetch failed:', e?.response?.status)
        // Fallback to cached user data
        const cached = user?.preferred_plan?.feature_flags || {}
        setPlanFlags({
          qr_code: !!cached.qr_code,
          whatsapp_button: !!cached.whatsapp_button,
        })
      }
    }

    loadPlanFlags()
  }, [user])

  /* Build QR URL */
  const buildQrUrl = () => {
    if (!website) return ''
    if (website.live_url) return website.live_url
    const id = website.id || website._id
    if (!id) return ''
    return `${window.location.origin}/site/${id}`
  }

  /* Plan-based access — from FRESH backend data */
  const qrEnabled = planFlags.qr_code

  const initials = (user?.username || 'U')
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const joined = formatDate(user?.created_at)

  const currentPlanName =
    user?.preferred_plan?.name ||
    user?.plan?.name ||
    website?.plan_name ||
    'Basic'

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Your account information and preferences</p>
        </div>
      </div>

      {/* Hero */}
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

      {/* Info cards */}
      <div className="profile-grid">
        <ProfileCard icon={<IconUser size={18} />} label="Username"
          value={user?.username || '—'} color="#4f46e5" />
        <ProfileCard icon={<IconPhone size={18} />} label="Mobile Number"
          value={user?.mobile || 'Not set'} color="#06b6d4" />
        <ProfileCard icon={<IconCategory size={18} />} label="Business Category"
          value={user?.category?.name || '—'} color="#8b5cf6" />
        <ProfileCard icon={<IconPricing size={18} />} label="Preferred Plan"
          value={user?.preferred_plan
            ? `${user.preferred_plan.name} · ₹${Number(user.preferred_plan.price).toLocaleString('en-IN')}`
            : '—'} color="#f59e0b" />
        <ProfileCard icon={<IconShield size={18} />} label="Account Status"
          value={
            <span className={`badge ${user?.is_active ? 'badge-success' : 'badge-danger'}`}>
              {user?.is_active ? <>Active</> : 'Inactive'}
            </span>
          } color="#10b981" />
        <ProfileCard icon={<IconClock size={18} />} label="Member Since"
          value={joined} color="#64748b" />
      </div>

      {/* QR SECTION */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="qr-section-head">
          <div className="qr-section-title-wrap">
            <div className={`qr-section-icon ${qrEnabled ? '' : 'locked'}`}>
              {qrEnabled ? <IconQR size={20} /> : <IconLock size={18} />}
            </div>
            <div>
              <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                Your Website QR Code
                {!qrEnabled && (
                  <span className="pro-tag"><IconZap size={10} /> PRO</span>
                )}
              </h3>
              <p className="qr-section-sub">
                {qrEnabled
                  ? (website?.live_url
                      ? 'Share this QR — scan panna unga live website open aagum'
                      : 'Preview QR — local la mattum work aagum (publish panna worldwide work aagum)')
                  : `QR Code is available only on Pro plan · You're on ${currentPlanName}`}
              </p>
            </div>
          </div>
        </div>

        <div className="qr-section-body">
          {qrLoading ? (
            <div className="qr-loading">
              <span className="qr-spinner" />
              <span>Loading QR code...</span>
            </div>
          ) : qrEnabled ? (
            <WebsiteQR
              url={buildQrUrl()}
              siteName={website?.name || user?.username || 'My Website'}
              size={200}
            />
          ) : (
            <LockedQR planName={currentPlanName} />
          )}
        </div>
      </div>

      {/* Account actions */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-title">Account Actions</h3>
        <div className="profile-actions">
          <div className="profile-action-item">
            <div className="profile-action-icon"><IconWebsite size={20} /></div>
            <div className="profile-action-body">
              <div className="profile-action-title">Your Websites</div>
              <div className="profile-action-desc">Manage and preview your generated websites</div>
            </div>
            <a href="/dashboard/my-website" className="btn btn-outline btn-sm">View →</a>
          </div>
          <div className="profile-action-item">
            <div className="profile-action-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <IconPricing size={20} />
            </div>
            <div className="profile-action-body">
              <div className="profile-action-title">Billing & Payments</div>
              <div className="profile-action-desc">View all your transactions and invoices</div>
            </div>
            <a href="/dashboard/payments" className="btn btn-outline btn-sm">View →</a>
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

      {/* Styles */}
      <style>{`
        .qr-section-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 20px; padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .qr-section-title-wrap { display: flex; align-items: center; gap: 12px; }
        .qr-section-icon {
          width: 42px; height: 42px; border-radius: 11px;
          background: linear-gradient(135deg, #ede9fe, #f3e8ff);
          color: #7c3aed; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .qr-section-icon.locked {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #b45309;
        }
        .qr-section-sub { font-size: 13px; color: #64748b; margin: 3px 0 0; }
        .qr-section-body { display: flex; justify-content: flex-start; }
        .qr-loading {
          display: flex; align-items: center; gap: 10px;
          padding: 40px 0; color: #64748b; font-size: 13.5px;
        }
        .qr-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid #e2e8f0; border-top-color: #7c3aed;
          border-radius: 50%; animation: qrSpin 0.7s linear infinite;
        }
        @keyframes qrSpin { to { transform: rotate(360deg); } }
        .pro-tag {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff; padding: 3px 8px; border-radius: 999px;
          text-transform: uppercase;
        }
        @media (max-width: 640px) {
          .qr-section-body { justify-content: center; }
          .qr-section-title-wrap { align-items: flex-start; }
        }
      `}</style>
    </div>
  )
}

/* ============================================================
   LOCKED QR COMPONENT
   ============================================================ */
function LockedQR({ planName = 'Basic' }) {
  const handleUpgrade = () => { window.location.href = '/#pricing' }
  const dots = Array.from({ length: 144 })

  return (
    <div className="locked-qr-wrap">
      <div className="locked-qr">
        <div className="locked-qr-blur">
          <div className="locked-qr-dots">
            {dots.map((_, i) => {
              const on = (i * 7 + 3) % 5 < 2 || (i % 11 === 0)
              return <span key={i} style={{ opacity: on ? 0.95 : 0.1 }} />
            })}
          </div>
        </div>
        <div className="locked-qr-overlay">
          <div className="locked-qr-lock"><IconLock size={26} /></div>
          <div className="locked-qr-label">PRO FEATURE</div>
        </div>
      </div>

      <div className="locked-qr-info">
        <h4 className="locked-qr-title">Unlock QR Code with Pro</h4>
        <p className="locked-qr-desc">
          Get a scannable QR code for your website — perfect for menus, business
          cards, and print materials. Upgrade to Pro to enable it instantly.
        </p>
        <ul className="locked-qr-features">
          <li><IconCheck size={14} /> Scannable QR code</li>
          <li><IconCheck size={14} /> High-resolution PNG download</li>
          <li><IconCheck size={14} /> Works on any phone camera</li>
        </ul>
        <button type="button" className="locked-qr-btn" onClick={handleUpgrade}>
          <IconZap size={14} /> Upgrade to Pro
        </button>
        <div className="locked-qr-note">₹2,999 · One-time payment · Lifetime access</div>
      </div>

      <style>{`
        .locked-qr-wrap { display: flex; gap: 28px; align-items: center; padding: 8px 0; flex-wrap: wrap; }
        .locked-qr {
          position: relative; width: 200px; height: 200px;
          background: #fff; border: 1px solid #e5e7eb;
          border-radius: 16px; overflow: hidden; flex-shrink: 0;
          box-shadow: 0 4px 20px -10px rgba(15,23,42,0.08);
        }
        .locked-qr-blur {
          width: 100%; height: 100%; filter: blur(3.5px);
          opacity: 0.55; padding: 18px;
        }
        .locked-qr-dots {
          display: grid; grid-template-columns: repeat(12, 1fr);
          gap: 2.5px; width: 100%; height: 100%;
        }
        .locked-qr-dots span {
          background: #0b0a1f; border-radius: 1.5px; aspect-ratio: 1;
        }
        .locked-qr-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px; background: rgba(255,255,255,0.55);
          backdrop-filter: blur(2px);
        }
        .locked-qr-lock {
          width: 54px; height: 54px; border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff; display: flex; align-items: center;
          justify-content: center;
          box-shadow: 0 12px 28px -10px rgba(124,58,237,0.75);
        }
        .locked-qr-label {
          font-size: 10.5px; font-weight: 800; letter-spacing: 0.14em;
          color: #7c3aed; background: #fff; padding: 4px 11px;
          border-radius: 999px; border: 1px solid #e9d5ff;
        }
        .locked-qr-info { flex: 1; min-width: 220px; }
        .locked-qr-title {
          font-size: 18px; font-weight: 800; color: #0f172a;
          margin: 0 0 8px; letter-spacing: -0.01em;
        }
        .locked-qr-desc {
          font-size: 13.5px; line-height: 1.65; color: #64748b;
          margin: 0 0 14px; max-width: 420px;
        }
        .locked-qr-features {
          list-style: none; padding: 0; margin: 0 0 18px;
          display: flex; flex-direction: column; gap: 7px;
        }
        .locked-qr-features li {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #475569; font-weight: 500;
        }
        .locked-qr-features li svg { color: #10b981; flex-shrink: 0; }
        .locked-qr-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff; font-size: 13.5px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          box-shadow: 0 10px 24px -10px rgba(124,58,237,0.7);
          transition: all 0.2s ease; font-family: inherit;
        }
        .locked-qr-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px -10px rgba(124,58,237,0.9);
        }
        .locked-qr-note { font-size: 12px; color: #94a3b8; margin-top: 10px; }
        @media (max-width: 640px) {
          .locked-qr-wrap { flex-direction: column; align-items: center; text-align: center; }
          .locked-qr-desc { margin-left: auto; margin-right: auto; }
          .locked-qr-features { align-items: center; }
        }
      `}</style>
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