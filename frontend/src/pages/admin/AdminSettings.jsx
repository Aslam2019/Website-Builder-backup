import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { adminApi } from '../../api/adminApi'
import { pricingApi } from '../../api/pricingApi'
import { uploadApi } from '../../api/uploadApi'
import axiosClient from '../../api/axiosClient'
import Modal from '../../components/common/Modal'
import RichEditor from '../../components/admin/RichEditor'

/* ✅ Build full URL for images (fixes broken image) */
const getFullUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://98.130.23.135'
  return `${base}${url}`
}

/* ============ INTER FONT ============ */
const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}
const headingStyle = {
  ...interStyle,
  fontWeight: 700,
  letterSpacing: '-0.02em',
}

/* ============ AVAILABLE FEATURES SCHEMA ============ */
const AVAILABLE_FEATURES = [
  {
    key: 'qr_code',
    label: 'QR Code Access',
    desc: 'Scannable QR code for website',
    icon: 'qr',
  },
  {
    key: 'whatsapp_button',
    label: 'WhatsApp Button',
    desc: 'Floating WhatsApp chat button',
    icon: 'whatsapp',
  },
]

const PLAN_ACCENTS = ['#4f46e5', '#7c3aed', '#f59e0b', '#06b6d4', '#10b981', '#ef4444']

/* ============ ICONS ============ */
const IconUser = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconLock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconImage = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)
const IconFile = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
)
const IconEye = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const IconEyeOff = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconPlus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IconGrid = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)
const IconLayout = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
)
const IconQR = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3M21 14v3M14 21h3M21 21h-3" />
  </svg>
)
const IconWhatsApp = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const FEATURE_ICON_MAP = {
  qr: <IconQR size={15} />,
  whatsapp: <IconWhatsApp size={15} />,
}

/* ============ MAIN ============ */
export default function AdminSettings() {
  const { user } = useAuth()
  const notify = useNotify()

  /* Default tab ah 'security' ah maathiten */
  const [tab, setTab] = useState('security')

  /* Username */
  const [newUsername, setNewUsername] = useState(user?.username || '')
  const [savingUsername, setSavingUsername] = useState(false)
  const [showUsernameForm, setShowUsernameForm] = useState(false)

  /* Password */
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })
  const [savingPwd, setSavingPwd] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)

  /* Site / Branding */
  const [site, setSite] = useState({ logo_url: '', site_name: 'WebsiteBuilder' })
  const [uploadingLogo, setUploadingLogo] = useState(false)

  /* Terms & Conditions */
  const [terms, setTerms] = useState([])
  const [termsLoading, setTermsLoading] = useState(false)
  const [termModalOpen, setTermModalOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState(null)
  const [termForm, setTermForm] = useState({ title: '', slug: '', content: '' })
  const [termSaving, setTermSaving] = useState(false)

  /* Plans & Features */
  const [plans, setPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [planSaving, setPlanSaving] = useState({})

  /* ✅ Frontend Content */ 
  const [frontendContent, setFrontendContent] = useState({
    hero: { title: '', accent: '', subtitle: '' },
    about: { title: '', accent: '', description: '' },
    footer: { description: '' },
    contact: { email: '', address: '', phone: '', working_hours: '' },
    social: { instagram: '', twitter: '', facebook: '', linkedin: '' }
  })
  const [savingFrontend, setSavingFrontend] = useState(false)

  const initials = (user?.username || 'A').charAt(0).toUpperCase()

  useEffect(() => {
    adminApi
      .getSiteSettings()
      .then((res) => setSite(res.data?.data || site))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (tab === 'terms') loadTerms()
  }, [tab])

  useEffect(() => {
    if (tab === 'plans') loadPlans()
  }, [tab])

  useEffect(() => {
    if (tab === 'frontend') loadFrontendContent()
  }, [tab])

  const loadFrontendContent = async () => {
    try {
      const res = await axiosClient.get('/settings/frontend')
      if (res.data?.data?.content) {
        setFrontendContent(res.data.data.content)
      }
    } catch (e) {
      console.warn('Failed to load frontend content:', e)
    }
  }

  const saveFrontendContent = async () => {
    setSavingFrontend(true)
    try {
      await axiosClient.put('/settings/frontend', { content: frontendContent })
      notify.success('Frontend content saved!')
    } catch (e) {
      notify.error('Failed to save frontend content')
    } finally {
      setSavingFrontend(false)
    }
  }

  const loadTerms = async () => {
    setTermsLoading(true)
    try {
      const res = await adminApi.getTerms()
      setTerms(res.data?.data?.terms || [])
    } catch {
      notify.error('Failed to load terms')
    } finally {
      setTermsLoading(false)
    }
  }

  const loadPlans = async () => {
    setPlansLoading(true)
    try {
      const res = await pricingApi.list()
      const list = res.data?.data?.plans || []
      const normalized = list.map((p) => ({
        ...p,
        feature_flags: {
          qr_code: false,
          whatsapp_button: false,
          custom_domain: false,
          priority_support: false,
          unlimited_pages: false,
          ...(p.feature_flags || {}),
        },
      }))
      setPlans(normalized)
    } catch {
      notify.error('Failed to load plans')
    } finally {
      setPlansLoading(false)
    }
  }

  const toggleFeature = (planId, featureKey) => {
    setPlans((prev) =>
      prev.map((p) => {
        const id = p._id || p.id
        if (id !== planId) return p
        return {
          ...p,
          feature_flags: {
            ...p.feature_flags,
            [featureKey]: !p.feature_flags[featureKey],
          },
        }
      })
    )
  }

  const savePlanFeatures = async (plan) => {
    const id = plan._id || plan.id
    if (!id) return

    setPlanSaving((s) => ({ ...s, [id]: true }))
    try {
      await adminApi.updatePlanFeatures(id, plan.feature_flags)
      notify.success(`${plan.name} features saved`)
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Save failed')
    } finally {
      setPlanSaving((s) => ({ ...s, [id]: false }))
    }
  }

  const saveUsername = async () => {
    const u = newUsername.trim()
    if (!u) return notify.error('Username cannot be empty')
    if (u === user?.username) return notify.error('No changes made')
    if (u.length < 3) return notify.error('Username must be at least 3 characters')

    setSavingUsername(true)
    try {
      await adminApi.updateProfile({ username: u })
      notify.success('Username updated')
      setShowUsernameForm(false)
      setTimeout(() => window.location.reload(), 700)
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Update failed')
    } finally {
      setSavingUsername(false)
    }
  }

  const savePassword = async () => {
    const { current, next, confirm } = pwdForm
    if (!current) return notify.error('Enter current password')
    if (!next) return notify.error('Enter new password')
    if (next.length < 6) return notify.error('Password must be at least 6 characters')
    if (next !== confirm) return notify.error('Passwords do not match')
    if (current === next) return notify.error('New password must be different')

    setSavingPwd(true)
    try {
      await adminApi.changePassword({ current_password: current, new_password: next })
      notify.success('Password changed')
      setPwdForm({ current: '', next: '', confirm: '' })
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Password change failed')
    } finally {
      setSavingPwd(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      return notify.error('Logo must be less than 5MB')
    }

    setUploadingLogo(true)
    try {
      const uploadRes = await uploadApi.uploadImage(file)
      const data = uploadRes.data?.data || uploadRes.data || {}
      const logoUrl = data.url || data.path || data.file_url || data.image_url

      if (!logoUrl) throw new Error('Upload failed — no URL returned')

      await adminApi.updateSiteSettings({ logo_url: logoUrl })
      setSite((s) => ({ ...s, logo_url: logoUrl }))
      notify.success('Logo updated! Refresh navbar to see it.')
    } catch (err) {
      notify.error(err?.response?.data?.message || err?.message || 'Upload failed')
    } finally {
      setUploadingLogo(false)
      e.target.value = ''
    }
  }

  const removeLogo = async () => {
    if (!window.confirm('Remove logo?')) return
    try {
      await adminApi.updateSiteSettings({ logo_url: '' })
      setSite((s) => ({ ...s, logo_url: '' }))
      notify.success('Logo removed')
    } catch {
      notify.error('Failed to remove')
    }
  }

  const openNewTerm = () => {
    setEditingTerm(null)
    setTermForm({ title: '', slug: '', content: '' })
    setTermModalOpen(true)
  }

  const openEditTerm = (t) => {
    setEditingTerm(t)
    setTermForm({ title: t.title || '', slug: t.slug || '', content: t.content || '' })
    setTermModalOpen(true)
  }

  const saveTerm = async () => {
    if (!termForm.title.trim()) return notify.error('Title required')
    if (!termForm.slug.trim()) return notify.error('Slug required')

    setTermSaving(true)
    try {
      if (editingTerm) {
        await adminApi.updateTerm(editingTerm.id, termForm)
        notify.success('Document updated')
      } else {
        await adminApi.createTerm(termForm)
        notify.success('Document created')
      }
      setTermModalOpen(false)
      loadTerms()
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Save failed')
    } finally {
      setTermSaving(false)
    }
  }

  const deleteTerm = async (t) => {
    if (!window.confirm(`Delete "${t.title}"?`)) return
    try {
      await adminApi.deleteTerm(t.id)
      notify.success('Deleted')
      loadTerms()
    } catch {
      notify.error('Delete failed')
    }
  }

  const strength = (() => {
    const p = pwdForm.next
    if (!p) return { level: 0, label: '', color: '#e5e7eb' }
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 2) return { level: 1, label: 'Weak', color: '#ef4444' }
    if (score <= 3) return { level: 2, label: 'Fair', color: '#f59e0b' }
    if (score <= 4) return { level: 3, label: 'Good', color: '#3b82f6' }
    return { level: 4, label: 'Strong', color: '#10b981' }
  })()

  const totalEnabled = plans.reduce(
    (sum, p) => sum + Object.values(p.feature_flags || {}).filter(Boolean).length,
    0
  )

  return (
    <div className="as-root" style={interStyle}>
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>Settings</h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            Manage your admin account and site configuration
          </p>
        </div>
      </div>

      <div className="as-profile-banner">
        <div className="as-avatar">{initials}</div>
        <div className="as-profile-info">
          <div className="as-profile-name">{user?.username || 'Admin'}</div>
          <div className="as-profile-role">
            <span className="as-role-badge">
              <IconUser size={11} /> {user?.role || 'admin'}
            </span>
            {user?.mobile && <span className="as-profile-mobile">{user.mobile}</span>}
          </div>
        </div>
      </div>

      <div className="as-tabs">
        {/* ❌ Account tab removed */}
        <button className={`as-tab ${tab === 'security' ? 'is-active' : ''}`} onClick={() => setTab('security')}><IconLock size={15} /> Security</button>
        <button className={`as-tab ${tab === 'branding' ? 'is-active' : ''}`} onClick={() => setTab('branding')}><IconImage size={15} /> Branding</button>
        {/* ✅ Frontend Content Tab */}
        <button className={`as-tab ${tab === 'frontend' ? 'is-active' : ''}`} onClick={() => setTab('frontend')}><IconLayout size={15} /> Frontend</button>
        <button className={`as-tab ${tab === 'terms' ? 'is-active' : ''}`} onClick={() => setTab('terms')}><IconFile size={15} /> Terms</button>
        <button className={`as-tab ${tab === 'plans' ? 'is-active' : ''}`} onClick={() => setTab('plans')}><IconGrid size={15} /> Plans</button>
      </div>

      {/* ================= SECURITY (Account details + Password merged) ================= */}
      {tab === 'security' && (
        <div className="as-panel">
          
          {/* 1. Username Card (from Account) */}
          <div className="as-card">
            <div className="as-card-head">
              <div><div className="as-card-title">Username</div><div className="as-card-sub">Your admin display name</div></div>
              {!showUsernameForm && (<button className="btn btn-outline btn-sm" onClick={() => { setNewUsername(user?.username || ''); setShowUsernameForm(true) }} style={{ ...interStyle, fontWeight: 500 }}>Change</button>)}
            </div>
            {!showUsernameForm ? (
              <div className="as-value-display"><span className="as-value-text">{user?.username || '—'}</span></div>
            ) : (
              <div className="as-inline-form">
                <input className="form-control" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="New username" style={interStyle} autoFocus />
                <div className="as-inline-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setShowUsernameForm(false)} disabled={savingUsername} style={{ ...interStyle, fontWeight: 500 }}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={saveUsername} disabled={savingUsername} style={{ ...interStyle, fontWeight: 500 }}>{savingUsername ? 'Saving...' : 'Save'}</button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Role & Mobile Card (from Account)
          <div className="as-card">
            <div className="as-card-head"><div><div className="as-card-title">Role</div><div className="as-card-sub">Account permission level</div></div></div>
            <div className="as-value-display"><span className="as-value-text">{user?.role || 'admin'}</span></div>
          </div> */}
          
          {/* <div className="as-card">
            <div className="as-card-head"><div><div className="as-card-title">Mobile</div><div className="as-card-sub">Contact number</div></div></div>
            <div className="as-value-display"><span className="as-value-text">{user?.mobile || 'Not set'}</span></div>
          </div> */}

          {/* 3. Change Password Card (already existing) */}
          <div className="as-card">
            <div className="as-card-head"><div><div className="as-card-title">Change Password</div><div className="as-card-sub">Use a strong password that you don't use elsewhere</div></div></div>
            <div className="as-form">
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Current Password</label>
                <div className="as-pwd-wrap">
                  <input className="form-control" type={showCurrent ? 'text' : 'password'} value={pwdForm.current} onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })} placeholder="Enter current password" style={interStyle} />
                  <button type="button" className="as-pwd-toggle" onClick={() => setShowCurrent((v) => !v)} tabIndex={-1}>{showCurrent ? <IconEyeOff size={16} /> : <IconEye size={16} />}</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>New Password</label>
                <div className="as-pwd-wrap">
                  <input className="form-control" type={showNext ? 'text' : 'password'} value={pwdForm.next} onChange={(e) => setPwdForm({ ...pwdForm, next: e.target.value })} placeholder="At least 6 characters" style={interStyle} />
                  <button type="button" className="as-pwd-toggle" onClick={() => setShowNext((v) => !v)} tabIndex={-1}>{showNext ? <IconEyeOff size={16} /> : <IconEye size={16} />}</button>
                </div>
                {pwdForm.next && (
                  <div className="as-strength">
                    <div className="as-strength-bars">
                      {[1, 2, 3, 4].map((i) => (<span key={i} className="as-strength-bar" style={{ background: i <= strength.level ? strength.color : '#e5e7eb' }} />))}
                    </div>
                    <span className="as-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Confirm New Password</label>
                <input className="form-control" type={showNext ? 'text' : 'password'} value={pwdForm.confirm} onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })} placeholder="Re-enter new password" style={interStyle} />
                {pwdForm.confirm && pwdForm.next === pwdForm.confirm && (<div className="as-match"><IconCheck size={12} /> Passwords match</div>)}
                {pwdForm.confirm && pwdForm.next !== pwdForm.confirm && (<div className="as-mismatch">Passwords do not match</div>)}
              </div>
              <div className="as-form-actions">
                <button className="btn btn-outline" onClick={() => setPwdForm({ current: '', next: '', confirm: '' })} disabled={savingPwd} style={{ ...interStyle, fontWeight: 500 }}>Clear</button>
                <button className="btn btn-primary" onClick={savePassword} disabled={savingPwd} style={{ ...interStyle, fontWeight: 500 }}>{savingPwd ? 'Updating...' : 'Update Password'}</button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= BRANDING ================= */}
      {tab === 'branding' && (
        <div className="as-panel">
          <div className="as-card">
            <div className="as-card-head"><div><div className="as-card-title">Site Logo</div><div className="as-card-sub">Upload your brand logo. It will appear in the navbar.</div></div></div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="as-logo-preview">
                {site.logo_url ? (<img src={getFullUrl(site.logo_url)} alt="Logo" />) : (<span className="as-logo-placeholder">🖼️</span>)}
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp" onChange={handleLogoUpload} disabled={uploadingLogo} style={{ fontSize: 14, ...interStyle }} />
                <p className="as-hint">PNG, JPG, SVG, or WebP. Recommended 200×60px, max 5MB.</p>
                {uploadingLogo && <p className="as-hint">Uploading...</p>}
                {site.logo_url && !uploadingLogo && (
                  <button className="btn btn-outline btn-sm" onClick={removeLogo} style={{ marginTop: 10, ...interStyle, fontWeight: 500 }}>Remove Logo</button>
                )}
              </div>
            </div>
          </div>
          <div className="as-card">
            <div className="as-card-head"><div><div className="as-card-title">Site Name</div><div className="as-card-sub">Shown in the navbar next to the logo</div></div></div>
            <input className="form-control" value={site.site_name} onChange={(e) => setSite({ ...site, site_name: e.target.value })} onBlur={async () => { try { await adminApi.updateSiteSettings({ site_name: site.site_name }); notify.success('Site name saved') } catch { notify.error('Failed to save') } }} style={interStyle} placeholder="WebsiteBuilder" />
          </div>
        </div>
      )}

      {/* ================= FRONTEND CONTENT ================= */}
      {tab === 'frontend' && (
        <div className="as-panel">
          <div className="as-card">
            <div className="as-card-head">
              <div><div className="as-card-title">Hero Section</div><div className="as-card-sub">Edit the main banner text on the homepage.</div></div>
            </div>
            <div className="as-form">
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Title</label>
                <input className="form-control" value={frontendContent.hero.title} onChange={(e) => setFrontendContent({ ...frontendContent, hero: { ...frontendContent.hero, title: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Accent Text (Colored)</label>
                <input className="form-control" value={frontendContent.hero.accent} onChange={(e) => setFrontendContent({ ...frontendContent, hero: { ...frontendContent.hero, accent: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Subtitle</label>
                <textarea className="form-control" rows={3} value={frontendContent.hero.subtitle} onChange={(e) => setFrontendContent({ ...frontendContent, hero: { ...frontendContent.hero, subtitle: e.target.value } })} style={interStyle} />
              </div>
            </div>
          </div>

          <div className="as-card">
            <div className="as-card-head">
              <div><div className="as-card-title">About Section</div><div className="as-card-sub">Edit the text shown in the about section.</div></div>
            </div>
            <div className="as-form">
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Title</label>
                <input className="form-control" value={frontendContent.about.title} onChange={(e) => setFrontendContent({ ...frontendContent, about: { ...frontendContent.about, title: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Accent Text (Colored)</label>
                <input className="form-control" value={frontendContent.about.accent} onChange={(e) => setFrontendContent({ ...frontendContent, about: { ...frontendContent.about, accent: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Description</label>
                <textarea className="form-control" rows={4} value={frontendContent.about.description} onChange={(e) => setFrontendContent({ ...frontendContent, about: { ...frontendContent.about, description: e.target.value } })} style={interStyle} />
              </div>
            </div>
          </div>

          <div className="as-card">
            <div className="as-card-head">
              <div><div className="as-card-title">Footer Section</div><div className="as-card-sub">Edit the text shown in the footer.</div></div>
            </div>
            <div className="as-form">
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Description</label>
                <textarea className="form-control" rows={2} value={frontendContent.footer.description} onChange={(e) => setFrontendContent({ ...frontendContent, footer: { ...frontendContent.footer, description: e.target.value } })} style={interStyle} />
              </div>
            </div>
          </div>

          {/* ✅ Contact Section */}
          <div className="as-card">
            <div className="as-card-head">
              <div><div className="as-card-title">Contact Section</div><div className="as-card-sub">Edit the contact details shown on the website.</div></div>
            </div>
            <div className="as-form">
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Email</label>
                <input className="form-control" value={frontendContent.contact.email} onChange={(e) => setFrontendContent({ ...frontendContent, contact: { ...frontendContent.contact, email: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Phone</label>
                <input className="form-control" value={frontendContent.contact.phone} onChange={(e) => setFrontendContent({ ...frontendContent, contact: { ...frontendContent.contact, phone: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Address</label>
                <input className="form-control" value={frontendContent.contact.address} onChange={(e) => setFrontendContent({ ...frontendContent, contact: { ...frontendContent.contact, address: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Working Hours</label>
                <input className="form-control" value={frontendContent.contact.working_hours} onChange={(e) => setFrontendContent({ ...frontendContent, contact: { ...frontendContent.contact, working_hours: e.target.value } })} style={interStyle} />
              </div>
            </div>
          </div>

          {/* ✅ Social Media Links */}
          <div className="as-card">
            <div className="as-card-head">
              <div><div className="as-card-title">Social Media Links</div><div className="as-card-sub">Edit the social media links shown on the website.</div></div>
            </div>
            <div className="as-form">
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Instagram URL</label>
                <input className="form-control" value={frontendContent.social.instagram} onChange={(e) => setFrontendContent({ ...frontendContent, social: { ...frontendContent.social, instagram: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Twitter (X) URL</label>
                <input className="form-control" value={frontendContent.social.twitter} onChange={(e) => setFrontendContent({ ...frontendContent, social: { ...frontendContent.social, twitter: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Facebook URL</label>
                <input className="form-control" value={frontendContent.social.facebook} onChange={(e) => setFrontendContent({ ...frontendContent, social: { ...frontendContent.social, facebook: e.target.value } })} style={interStyle} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>LinkedIn URL</label>
                <input className="form-control" value={frontendContent.social.linkedin} onChange={(e) => setFrontendContent({ ...frontendContent, social: { ...frontendContent.social, linkedin: e.target.value } })} style={interStyle} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn-primary" onClick={saveFrontendContent} disabled={savingFrontend} style={{ ...interStyle, fontWeight: 500 }}>
              <IconCheck size={14} /> {savingFrontend ? 'Saving...' : 'Save Frontend Content'}
            </button>
          </div>
        </div>
      )}

      {/* ================= TERMS ================= */}
      {tab === 'terms' && (
        <div className="as-panel">
          <div className="as-card">
            <div className="as-card-head">
              <div><div className="as-card-title">Terms & Conditions</div><div className="as-card-sub">Manage legal documents shown in the footer</div></div>
              <button className="btn btn-primary btn-sm" onClick={openNewTerm} style={{ ...interStyle, fontWeight: 500 }}><IconPlus size={14} /> Add Document</button>
            </div>
            {termsLoading ? (
              <p className="as-terms-loading">Loading...</p>
            ) : terms.length === 0 ? (
              <div className="as-terms-empty"><IconFile size={32} /><p>No documents yet</p><span>Click "Add Document" to create one.</span></div>
            ) : (
              <div className="as-terms-list">
                {terms.map((t) => (
                  <div key={t.id} className="as-term-item">
                    <div className="as-term-icon"><IconFile size={18} /></div>
                    <div className="as-term-body">
                      <div className="as-term-title">{t.title}</div>
                      <div className="as-term-slug">/terms/<code>{t.slug}</code></div>
                    </div>
                    <div className="as-term-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEditTerm(t)} style={{ ...interStyle, fontWeight: 500 }}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTerm(t)} style={{ ...interStyle, fontWeight: 500 }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Modal open={termModalOpen} onClose={() => setTermModalOpen(false)} title={editingTerm ? 'Edit Document' : 'New Document'} footer={<><button className="btn btn-outline" onClick={() => setTermModalOpen(false)} style={{ ...interStyle, fontWeight: 500 }}>Cancel</button><button className="btn btn-primary" onClick={saveTerm} disabled={termSaving} style={{ ...interStyle, fontWeight: 500 }}>{termSaving ? 'Saving...' : 'Save Document'}</button></>}>
            <div className="form-group">
              <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Title <span className="req">*</span></label>
              <input className="form-control" value={termForm.title} onChange={(e) => { const title = e.target.value; const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); setTermForm({ ...termForm, title, slug: editingTerm ? termForm.slug : autoSlug }) }} placeholder="e.g. Terms and Conditions" style={interStyle} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Slug (URL) <span className="req">*</span></label>
              <input className="form-control" value={termForm.slug} onChange={(e) => setTermForm({ ...termForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="terms-and-conditions" style={interStyle} />
              <div className="as-slug-preview">URL: <code>/terms/{termForm.slug || 'slug'}</code></div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ ...interStyle, fontWeight: 500 }}>Content</label>
              <RichEditor value={termForm.content} onChange={(html) => setTermForm({ ...termForm, content: html })} placeholder="Start writing your document..." />
            </div>
          </Modal>
        </div>
      )}

      {/* ================= PLANS ================= */}
      {tab === 'plans' && (
        <div className="as-panel">
          <div className="as-card ps-head-card">
            <div className="as-card-head" style={{ paddingBottom: 0, marginBottom: 0, borderBottom: 'none' }}>
              <div><div className="as-card-title">Plan Feature Control</div><div className="as-card-sub">Enable or disable features for each plan. Changes apply immediately.</div></div>
            </div>
            <div className="ps-stats">
              <div className="ps-stat"><div className="ps-stat-value">{plans.length}</div><div className="ps-stat-label">Plans</div></div>
              <div className="ps-stat"><div className="ps-stat-value">{AVAILABLE_FEATURES.length}</div><div className="ps-stat-label">Features</div></div>
              <div className="ps-stat ps-stat-accent"><div className="ps-stat-value">{totalEnabled}</div><div className="ps-stat-label">Enabled</div></div>
            </div>
          </div>

          {plansLoading ? (
            <p className="as-terms-loading">Loading plans...</p>
          ) : plans.length === 0 ? (
            <div className="as-terms-empty"><IconGrid size={32} /><p>No plans found</p><span>Create plans in Pricing section first.</span></div>
          ) : (
            <div className="ps-grid">
              {plans.map((plan, index) => {
                const planId = plan._id || plan.id
                const isSaving = planSaving[planId]
                const flags = plan.feature_flags || {}
                const enabledCount = Object.values(flags).filter(Boolean).length
                const totalCount = AVAILABLE_FEATURES.length
                const percent = Math.round((enabledCount / totalCount) * 100)
                const accent = PLAN_ACCENTS[index % PLAN_ACCENTS.length]

                return (
                  <div key={planId} className="ps-card">
                    <div className="ps-card-head">
                      <div className="ps-plan-badge" style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, boxShadow: `0 8px 20px -10px ${accent}cc` }}>{String(plan.name || 'P').charAt(0).toUpperCase()}</div>
                      <div className="ps-plan-info">
                        <div className="ps-plan-name">{plan.name}</div>
                        <div className="ps-plan-price">₹{Number(plan.price).toLocaleString('en-IN')}</div>
                      </div>
                      <div className="ps-plan-count" style={{ color: accent, background: `${accent}15`, borderColor: `${accent}33` }}>{enabledCount}/{totalCount}</div>
                    </div>

                    <div className="ps-progress"><div className="ps-progress-fill" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${accent} 0%, ${accent}cc 100%)` }} /></div>

                    <div className="ps-features">
                      {AVAILABLE_FEATURES.map((feat) => {
                        const enabled = !!flags[feat.key]
                        return (
                          <button key={feat.key} type="button" className={`ps-feature ${enabled ? 'on' : ''}`} onClick={() => toggleFeature(planId, feat.key)} style={enabled ? { borderColor: `${accent}55`, background: `${accent}0a` } : {}}>
                            <div className={`ps-feature-icon ${enabled ? 'on' : 'off'}`} style={enabled ? { background: `${accent}18`, color: accent } : {}}>{FEATURE_ICON_MAP[feat.icon] || <IconCheck />}</div>
                            <div className="ps-feature-body">
                              <div className="ps-feature-label">{feat.label}</div>
                              <div className="ps-feature-desc">{feat.desc}</div>
                            </div>
                            <div className={`ps-checkbox ${enabled ? 'on' : ''}`} style={enabled ? { background: accent, borderColor: accent } : {}}>{enabled && <IconCheck size={11} />}</div>
                          </button>
                        )
                      })}
                    </div>

                    <button type="button" className="ps-save" onClick={() => savePlanFeatures(plan)} disabled={isSaving} style={{ background: isSaving ? '#94a3b8' : `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, boxShadow: isSaving ? 'none' : `0 10px 24px -10px ${accent}cc` }}>
                      {isSaving ? ('Saving...') : (<><IconCheck size={14} /> Save Changes</>)}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        /* (Unga existing styles ellam adhe maari irukku, naan intha edathula repeat pannala) */
        .as-root { max-width: 860px; }
        .as-profile-banner { display: flex; align-items: center; gap: 16px; padding: 18px 20px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 14px; color: #fff; margin-bottom: 20px; box-shadow: 0 10px 24px -12px rgba(79, 70, 229, 0.5); }
        .as-avatar { width: 56px; height: 56px; border-radius: 14px; background: rgba(255,255,255,0.18); backdrop-filter: blur(6px); border: 1.5px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; flex-shrink: 0; }
        .as-profile-info { flex: 1; min-width: 0; }
        .as-profile-name { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .as-profile-role { display: flex; align-items: center; gap: 10px; margin-top: 4px; flex-wrap: wrap; }
        .as-role-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.2); padding: 3px 9px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
        .as-profile-mobile { font-size: 12px; opacity: 0.85; }
        .as-tabs { display: flex; gap: 6px; margin-bottom: 20px; padding: 5px; background: #f3f4f6; border-radius: 12px; width: fit-content; overflow-x: auto; max-width: 100%; }
        .as-tab { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; font-size: 13.5px; font-weight: 600; color: #6b7280; background: transparent; border: none; border-radius: 9px; cursor: pointer; transition: all 0.15s ease; font-family: inherit; white-space: nowrap; flex-shrink: 0; }
        .as-tab:hover { color: #111827; }
        .as-tab.is-active { background: #fff; color: #4f46e5; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
        .as-panel { display: flex; flex-direction: column; gap: 16px; }
        .as-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; }
        .as-card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding-bottom: 14px; margin-bottom: 16px; border-bottom: 1px solid #f3f4f6; }
        .as-card-title { font-size: 15px; font-weight: 700; color: #111827; letter-spacing: -0.01em; }
        .as-card-sub { font-size: 12.5px; color: #6b7280; margin-top: 3px; font-weight: 400; }
        .as-value-display { padding: 11px 14px; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; }
        .as-value-text { font-size: 14px; font-weight: 600; color: #111827; }
        .as-inline-form { display: flex; flex-direction: column; gap: 12px; }
        .as-inline-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .as-pwd-wrap { position: relative; }
        .as-pwd-wrap .form-control { padding-right: 44px; }
        .as-pwd-toggle { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: #9ca3af; cursor: pointer; border-radius: 8px; transition: all 0.12s; }
        .as-pwd-toggle:hover { color: #4f46e5; background: #eef2ff; }
        .as-strength { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
        .as-strength-bars { display: flex; gap: 4px; flex: 1; }
        .as-strength-bar { flex: 1; height: 4px; border-radius: 999px; transition: background 0.2s ease; }
        .as-strength-label { font-size: 11.5px; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; flex-shrink: 0; }
        .as-match, .as-mismatch { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; margin-top: 6px; }
        .as-match { color: #10b981; }
        .as-mismatch { color: #ef4444; }
        .as-form { display: flex; flex-direction: column; gap: 16px; }
        .as-form-actions { display: flex; gap: 10px; justify-content: flex-end; padding-top: 8px; border-top: 1px solid #f3f4f6; margin-top: 4px; }
        .as-logo-preview { width: 120px; height: 120px; border-radius: 14px; background: #f8fafc; border: 2px dashed #e5e7eb; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
        .as-logo-preview img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
        .as-logo-placeholder { font-size: 40px; color: #cbd5e1; }
        .as-hint { font-size: 12px; color: #64748b; margin-top: 8px; line-height: 1.5; }
        .as-terms-loading { padding: 30px 20px; text-align: center; color: #64748b; font-size: 13.5px; }
        .as-terms-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 48px 20px; text-align: center; color: #94a3b8; }
        .as-terms-empty svg { color: #cbd5e1; }
        .as-terms-empty p { margin: 0; font-size: 15px; font-weight: 700; color: #475569; }
        .as-terms-empty span { font-size: 13px; color: #94a3b8; }
        .as-terms-list { display: flex; flex-direction: column; gap: 10px; }
        .as-term-item { display: flex; align-items: center; gap: 14px; padding: 14px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fafbff; transition: all 0.2s ease; }
        .as-term-item:hover { border-color: #c7d2fe; background: #fff; box-shadow: 0 4px 12px -4px rgba(79,70,229,0.1); }
        .as-term-icon { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); display: flex; align-items: center; justify-content: center; color: #4f46e5; flex-shrink: 0; }
        .as-term-body { flex: 1; min-width: 0; }
        .as-term-title { font-size: 14px; font-weight: 700; color: #111827; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .as-term-slug { font-size: 12px; color: #64748b; margin-top: 3px; font-weight: 500; }
        .as-term-slug code { background: #f3f4f6; padding: 2px 6px; border-radius: 5px; font-family: 'SF Mono', Consolas, monospace; font-size: 11px; color: #4f46e5; }
        .as-term-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .as-slug-preview { margin-top: 8px; font-size: 12px; color: #64748b; font-weight: 500; }
        .as-slug-preview code { background: #eef2ff; color: #4f46e5; padding: 2px 8px; border-radius: 5px; font-family: 'SF Mono', Consolas, monospace; font-size: 12px; font-weight: 600; }
        .ps-head-card { margin-bottom: 0; }
        .ps-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; padding-top: 18px; border-top: 1px solid #f3f4f6; }
        .ps-stat { background: linear-gradient(135deg, #fafbff 0%, #f5f7ff 100%); border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 12px; text-align: center; transition: all 0.2s ease; }
        .ps-stat:hover { border-color: #c7d2fe; transform: translateY(-1px); box-shadow: 0 6px 16px -10px rgba(79,70,229,0.25); }
        .ps-stat-accent { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-color: transparent; }
        .ps-stat-accent .ps-stat-value, .ps-stat-accent .ps-stat-label { color: #fff; }
        .ps-stat-accent:hover { box-shadow: 0 8px 22px -10px rgba(124,58,237,0.7); }
        .ps-stat-value { font-size: 26px; font-weight: 800; color: #111827; letter-spacing: -0.03em; line-height: 1; margin-bottom: 6px; }
        .ps-stat-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280; }
        .ps-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .ps-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 14px; transition: all 0.22s ease; }
        .ps-card:hover { border-color: #c7d2fe; box-shadow: 0 14px 32px -18px rgba(79,70,229,0.3); transform: translateY(-2px); }
        .ps-card-head { display: flex; align-items: center; gap: 12px; }
        .ps-plan-badge { width: 44px; height: 44px; border-radius: 13px; color: #fff; font-weight: 800; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ps-plan-info { flex: 1; min-width: 0; }
        .ps-plan-name { font-size: 15px; font-weight: 800; color: #111827; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ps-plan-price { font-size: 12.5px; color: #64748b; font-weight: 600; margin-top: 2px; }
        .ps-plan-count { font-size: 11px; font-weight: 800; padding: 5px 10px; border-radius: 999px; border: 1px solid; flex-shrink: 0; letter-spacing: 0.02em; }
        .ps-progress { height: 5px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
        .ps-progress-fill { height: 100%; border-radius: 999px; transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
        .ps-features { display: flex; flex-direction: column; gap: 7px; flex: 1; }
        .ps-feature { display: flex; align-items: center; gap: 11px; padding: 10px 11px; border: 1.5px solid #e5e7eb; border-radius: 11px; background: #fafbfc; cursor: pointer; transition: all 0.18s ease; font-family: inherit; text-align: left; width: 100%; }
        .ps-feature:hover { background: #f8fafc; border-color: #cbd5e1; }
        .ps-feature.on { background: #fff; }
        .ps-feature-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s ease; }
        .ps-feature-icon.off { background: #f1f5f9; color: #94a3b8; }
        .ps-feature-body { flex: 1; min-width: 0; }
        .ps-feature-label { font-size: 12.5px; font-weight: 700; color: #111827; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ps-feature-desc { font-size: 11px; color: #6b7280; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ps-checkbox { width: 22px; height: 22px; border-radius: 6px; border: 2px solid #cbd5e1; background: #fff; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; transition: all 0.18s ease; }
        .ps-save { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; color: #fff; font-size: 13px; font-weight: 700; border: none; border-radius: 11px; cursor: pointer; transition: all 0.2s ease; font-family: inherit; margin-top: auto; letter-spacing: -0.01em; }
        .ps-save:hover:not(:disabled) { transform: translateY(-1px); }
        .ps-save:active:not(:disabled) { transform: translateY(0); }
        .ps-save:disabled { cursor: not-allowed; }
        @media (max-width: 1024px) { .ps-grid { grid-template-columns: 1fr 1fr; gap: 14px; } }
        @media (max-width: 768px) { .ps-grid { grid-template-columns: 1fr; gap: 14px; } .ps-feature-desc { white-space: normal; } }
        @media (max-width: 640px) {
          .as-profile-banner { padding: 16px; gap: 14px; }
          .as-avatar { width: 48px; height: 48px; font-size: 19px; border-radius: 12px; }
          .as-profile-name { font-size: 16px; }
          .as-tabs { width: 100%; justify-content: flex-start; }
          .as-tab { padding: 9px 12px; font-size: 13px; }
          .as-card { padding: 16px; }
          .as-inline-actions { flex-direction: column-reverse; }
          .as-inline-actions .btn { width: 100%; }
          .as-form-actions { flex-direction: column-reverse; }
          .as-form-actions .btn { width: 100%; }
          .as-logo-preview { width: 100px; height: 100px; }
          .as-term-item { flex-wrap: wrap; gap: 12px; padding: 14px 12px; }
          .as-term-icon { width: 36px; height: 36px; border-radius: 9px; }
          .as-term-icon svg { width: 16px; height: 16px; }
          .as-term-title { font-size: 13.5px; }
          .as-term-slug { font-size: 11.5px; }
          .as-term-actions { width: 100%; justify-content: stretch; }
          .as-term-actions .btn { flex: 1; justify-content: center; }
          .ps-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; padding-top: 14px; }
          .ps-stat { padding: 12px 8px; border-radius: 10px; }
          .ps-stat-value { font-size: 20px; margin-bottom: 4px; }
          .ps-stat-label { font-size: 9.5px; letter-spacing: 0.08em; }
          .ps-card { padding: 14px; border-radius: 14px; }
          .ps-card-head { gap: 10px; }
          .ps-plan-badge { width: 38px; height: 38px; font-size: 15px; border-radius: 11px; }
          .ps-plan-name { font-size: 14px; }
          .ps-plan-price { font-size: 12px; }
          .ps-plan-count { font-size: 10.5px; padding: 4px 8px; }
          .ps-feature { padding: 9px 10px; gap: 10px; }
          .ps-feature-icon { width: 28px; height: 28px; border-radius: 7px; }
          .ps-feature-label { font-size: 12px; }
          .ps-feature-desc { font-size: 10.5px; }
          .ps-checkbox { width: 20px; height: 20px; border-radius: 5px; }
          .ps-save { padding: 11px; font-size: 12.5px; }
        }
        @media (max-width: 380px) {
          .as-card { padding: 14px; }
          .as-profile-name { font-size: 15px; }
          .ps-stats { gap: 6px; }
          .ps-stat-value { font-size: 18px; }
          .ps-stat-label { font-size: 9px; }
          .ps-feature-desc { display: none; }
          .ps-plan-badge { width: 34px; height: 34px; font-size: 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ps-card, .ps-stat, .ps-feature, .ps-save, .ps-progress-fill { transition: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  )
}