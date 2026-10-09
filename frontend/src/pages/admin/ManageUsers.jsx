import { useEffect, useState, useMemo } from 'react'
import { adminApi } from '../../api/adminApi'
import { useNotify } from '../../context/NotificationContext'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/formatDate'
import './manage-users.css'

/* ============================================================
   INTER FONT (scoped)
   ============================================================ */
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

/* ============================================================
   ICONS
   ============================================================ */
const IconSearch = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
  </svg>
)
const IconFilter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)
const IconUsers = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconEye = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const IconEdit = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const IconTrash = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)
const IconCalendar = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconGlobe = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><line x1="3" y1="12" x2="21" y2="12" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
  </svg>
)
const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IconChevronDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const IconSort = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 6 12 2 16 6" /><polyline points="16 18 12 22 8 18" />
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
)

/* ============================================================
   HELPERS
   ============================================================ */
const CATEGORY_STYLES = {
  'gym': { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', icon: '💪' },
  'fitness': { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', icon: '💪' },
  'medical': { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', icon: '🏥' },
  'medical and clinic': { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', icon: '🏥' },
  'education': { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', icon: '🎓' },
  'photography': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '📷' },
  'salon': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: '✂️' },
  'salon & spa': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: '✂️' },
  'real estate': { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', icon: '🏠' },
  'portfolio': { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', icon: '💼' },
}
function getCategoryStyle(name) {
  const key = (name || '').toLowerCase().trim()
  return CATEGORY_STYLES[key] || {
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.1)',
    icon: '📁',
  }
}

const AVATAR_COLORS = [
  { bg: '#6366f1', text: '#ffffff' },
  { bg: '#8b5cf6', text: '#ffffff' },
  { bg: '#06b6d4', text: '#ffffff' },
  { bg: '#10b981', text: '#ffffff' },
  { bg: '#f59e0b', text: '#ffffff' },
  { bg: '#ec4899', text: '#ffffff' },
  { bg: '#f97316', text: '#ffffff' },
  { bg: '#3b82f6', text: '#ffffff' },
]
function getAvatarColor(name) {
  const str = String(name || 'A')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getWebsiteName(u) {
  const candidates = [
    u?.website_name, u?.website?.name, u?.website?.title,
    u?.websites?.[0]?.name, u?.form_data?.website_name,
    u?.form_data?.gym_name, u?.form_data?.salon_name,
    u?.form_data?.business_name, u?.form_data?.clinic_name,
    u?.form_data?.school_name, u?.form_data?.full_name,
    u?.form_data?.name,
  ]
  for (const c of candidates) {
    if (c && String(c).trim()) return String(c).trim()
  }
  return null
}

/* ============================================================
   MAIN
   ============================================================ */
export default function ManageUsers() {
  const notify = useNotify()
  const [users, setUsers] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  /* -------- Modal state -------- */
  const [viewUser, setViewUser] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({ username: '', mobile: '', is_active: true })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true); setError('')
    try {
      const [usersRes, paymentsRes] = await Promise.all([
        adminApi.users(),
        adminApi.payments?.().catch(() => null) || Promise.resolve(null),
      ])

      const usersList = usersRes?.data?.data?.users || []
      setUsers(usersList)

      const extractArray = (res) => {
        if (!res) return []
        const d = res.data?.data
        if (!d) return []
        if (Array.isArray(d)) return d
        if (Array.isArray(d.payments)) return d.payments
        if (Array.isArray(d.transactions)) return d.transactions
        if (Array.isArray(d.items)) return d.items
        if (Array.isArray(d.docs)) return d.docs
        for (const v of Object.values(d)) {
          if (Array.isArray(v)) return v
        }
        return []
      }
      setPayments(extractArray(paymentsRes))
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load users'
      setError(msg)
      notify.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  /* ---------- Payment map ---------- */
  const paymentMap = useMemo(() => {
    const map = {}
    payments.forEach((p) => {
      const uid = p.user_id || p.user?.id || p.user?._id || p.userId
      if (!uid) return
      const key = String(uid)
      const existing = map[key]
      const status = String(p.status || '').toLowerCase()
      if (!existing || status === 'successful' || status === 'success') {
        map[key] = p
      }
    })
    return map
  }, [payments])

  const getPaymentForUser = (u) => {
    const uid = u.id || u._id
    if (!uid) return null
    return paymentMap[String(uid)] || payments.find((p) => {
      const pid = p.user_id || p.user?.id || p.user?._id || p.userId
      return pid && String(pid) === String(uid)
    }) || null
  }

  /* ---------- Toggle active ---------- */
  const toggleUser = async (user) => {
    setActionLoadingId(user.id)
    try {
      if (user.is_active) {
        await adminApi.deactivateUser(user.id)
      } else {
        await adminApi.activateUser(user.id)
      }
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, is_active: !u.is_active } : u)
      )
      notify.success(`${user.username} ${user.is_active ? 'deactivated' : 'activated'}`)
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Action failed')
    } finally {
      setActionLoadingId(null)
    }
  }

  /* ---------- View ---------- */
  const openView = (u) => setViewUser(u)

  /* ---------- Edit ---------- */
  const openEdit = (u) => {
    setEditUser(u)
    setEditForm({
      username: u.username || '',
      mobile: u.mobile || '',
      is_active: !!u.is_active,
    })
  }

  const saveEdit = async () => {
    if (!editForm.username.trim()) {
      notify.error('Username required')
      return
    }
    setSaving(true)
    try {
      const id = editUser.id || editUser._id
      await adminApi.updateUser(id, editForm)
      notify.success('User updated')
      setUsers((prev) =>
        prev.map((u) => (u.id || u._id) === id ? { ...u, ...editForm } : u)
      )
      setEditUser(null)
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.is_active).length
    const inactive = total - active
    return { total, active, inactive }
  }, [users])

  /* ---------- Filters ---------- */
  const categories = useMemo(() => {
    const set = new Set()
    users.forEach((u) => {
      if (u.category?.name) set.add(u.category.name)
    })
    return Array.from(set).sort()
  }, [users])

  const plans = useMemo(() => {
    const set = new Set()
    users.forEach((u) => {
      if (u.preferred_plan?.name) set.add(u.preferred_plan.name)
    })
    return Array.from(set).sort()
  }, [users])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      if (statusFilter === 'active' && !u.is_active) return false
      if (statusFilter === 'inactive' && u.is_active) return false
      if (categoryFilter !== 'all' && (u.category?.name || '') !== categoryFilter) return false
      if (planFilter !== 'all' && (u.preferred_plan?.name || '') !== planFilter) return false
      if (!q) return true
      return (
        (u.username || '').toLowerCase().includes(q) ||
        (u.mobile || '').toLowerCase().includes(q) ||
        (u.category?.name || '').toLowerCase().includes(q)
      )
    })
  }, [users, query, statusFilter, categoryFilter, planFilter])

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="um-root" style={interStyle}>

      {/* ---------- Page Head ---------- */}
      <div className="um-head">
        <div>
          <h1 className="um-title" style={headingStyle}>Users</h1>
          <p className="um-sub" style={{ ...interStyle, fontWeight: 400 }}>
            Manage your website builder users and their details
          </p>
        </div>
        <div className="um-head-right">
          <div className="um-tabs">
            <button
              className={`um-tab ${statusFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
              <span className="um-tab-count">{stats.total}</span>
            </button>
            <button
              className={`um-tab ${statusFilter === 'active' ? 'is-active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              <span className="um-tab-dot um-tab-dot-green" />
              Active
              <span className="um-tab-count">{stats.active}</span>
            </button>
            <button
              className={`um-tab ${statusFilter === 'inactive' ? 'is-active' : ''}`}
              onClick={() => setStatusFilter('inactive')}
            >
              <span className="um-tab-dot um-tab-dot-red" />
              Inactive
              <span className="um-tab-count">{stats.inactive}</span>
            </button>
          </div>
          <button className="um-btn-primary">
            <IconPlus size={15} /> Add User
          </button>
        </div>
      </div>

      {/* ---------- Filter Bar ---------- */}
      <div className="um-filter-bar">
        <div className="um-filter-search">
          <IconSearch size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="um-filter-select">
          <span className="um-filter-label">Category</span>
          <div className="um-select-wrap">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <IconChevronDown size={13} />
          </div>
        </div>

        <div className="um-filter-select">
          <span className="um-filter-label">Plan</span>
          <div className="um-select-wrap">
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <option value="all">All Plans</option>
              {plans.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <IconChevronDown size={13} />
          </div>
        </div>

        <div className="um-filter-select">
          <span className="um-filter-label">Status</span>
          <div className="um-select-wrap">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <IconChevronDown size={13} />
          </div>
        </div>

        <button className="um-filter-icon" title="More filters">
          <IconFilter size={16} />
        </button>
      </div>

      {/* ---------- Table ---------- */}
      <div className="um-table-card">
        {filtered.length === 0 ? (
          <div className="um-empty">
            <div className="um-empty-icon"><IconSearch size={28} /></div>
            <div className="um-empty-title">No users found</div>
            <div className="um-empty-sub">
              {query || statusFilter !== 'all' || categoryFilter !== 'all' || planFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Users will appear here once they register'}
            </div>
          </div>
        ) : (
          <>
            {/* ==================== DESKTOP TABLE ==================== */}
            <div className="um-table-wrap um-desktop">
              <table className="um-table">
                <thead>
                  <tr>
                    <th><span className="um-th-inner"><IconUsers size={13} /> USER <IconSort size={11} /></span></th>
                    <th><span className="um-th-inner">CATEGORY <IconSort size={11} /></span></th>
                    <th><span className="um-th-inner">PLAN <IconSort size={11} /></span></th>
                    <th><span className="um-th-inner"><IconGlobe size={13} /> WEBSITE <IconSort size={11} /></span></th>
                    <th><span className="um-th-inner">PAYMENT <IconSort size={11} /></span></th>
                    <th><span className="um-th-inner">STATUS <IconSort size={11} /></span></th>
                    <th><span className="um-th-inner"><IconCalendar size={13} /> JOINED <IconSort size={11} /></span></th>
                    <th className="um-th-actions">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const initial = (u.username || '?').charAt(0).toUpperCase()
                    const avatarColor = getAvatarColor(u.username)
                    const catName = u.category?.name || '—'
                    const catStyle = getCategoryStyle(catName)
                    const planName = u.preferred_plan?.name
                    const planPrice = u.preferred_plan?.price
                    const websiteName = getWebsiteName(u)
                    const payment = getPaymentForUser(u)
                    const payStatus = String(payment?.status || '').toLowerCase()
                    const isPaid = payStatus === 'successful' || payStatus === 'success'
                    const isPending = payStatus === 'pending'
                    const isActionLoading = actionLoadingId === u.id
                    const uid = u.id || u._id

                    return (
                      <tr key={uid} className="um-tr">
                        <td>
                          <div className="um-user-cell">
                            <div className="um-avatar" style={{ background: avatarColor.bg, color: avatarColor.text }}>
                              {initial}
                            </div>
                            <div className="um-user-info">
                              <div className="um-user-name">{u.username}</div>
                              <div className="um-user-mobile">{u.mobile || '—'}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          {catName !== '—' ? (
                            <span className="um-cat-pill" style={{ background: catStyle.bg, color: catStyle.color }}>
                              <span className="um-cat-icon">{catStyle.icon}</span>
                              {catName}
                            </span>
                          ) : (
                            <span className="um-muted">—</span>
                          )}
                        </td>

                        <td>
                          {planName ? (
                            <span className="um-plan-pill">
                              <span className="um-plan-name">{planName}</span>
                              {planPrice && <span className="um-plan-price">· {planPrice}</span>}
                            </span>
                          ) : (
                            <span className="um-muted">—</span>
                          )}
                        </td>

                        <td>
                          {websiteName ? (
                            <div className="um-website">
                              <IconGlobe size={13} />
                              <span className="um-website-name" title={websiteName}>{websiteName}</span>
                            </div>
                          ) : (
                            <span className="um-muted">—</span>
                          )}
                        </td>

                        <td>
                          {isPaid ? (
                            <span className="um-pay-badge is-paid">
                              Paid
                              {payment?.amount && (
                                <span className="um-pay-amt">₹{Number(payment.amount).toLocaleString('en-IN')}</span>
                              )}
                            </span>
                          ) : isPending ? (
                            <span className="um-pay-badge is-pending">
                              <span className="um-dot um-dot-amber" />
                              Pending
                            </span>
                          ) : (
                            <span className="um-muted">—</span>
                          )}
                        </td>

                        <td>
                          <span className={`um-status ${u.is_active ? 'is-active' : 'is-inactive'}`}>
                            <span className={`um-dot ${u.is_active ? 'um-dot-green' : 'um-dot-red'}`} />
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td>
                          <span className="um-date">
                            <IconCalendar size={12} />
                            {formatDate(u.created_at)}
                          </span>
                        </td>

                        {/* -------- ACTIONS (3 buttons only) -------- */}
                        <td className="um-td-actions">
                          <div className="um-actions">
                            <button
                              className="um-icon-btn"
                              title="View"
                              onClick={() => openView(u)}
                            >
                              <IconEye size={15} />
                            </button>

                            <button
                              className="um-icon-btn"
                              title="Edit"
                              onClick={() => openEdit(u)}
                            >
                              <IconEdit size={15} />
                            </button>

                            <button
                              className="um-icon-btn um-icon-danger"
                              title={u.is_active ? 'Deactivate' : 'Activate'}
                              onClick={() => toggleUser(u)}
                              disabled={isActionLoading}
                            >
                              {isActionLoading ? <span className="um-spinner" /> : <IconTrash size={15} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ==================== MOBILE CARDS ==================== */}
            <div className="um-mobile">
              {filtered.map((u) => {
                const initial = (u.username || '?').charAt(0).toUpperCase()
                const avatarColor = getAvatarColor(u.username)
                const catName = u.category?.name || '—'
                const catStyle = getCategoryStyle(catName)
                const planName = u.preferred_plan?.name
                const planPrice = u.preferred_plan?.price
                const websiteName = getWebsiteName(u)
                const payment = getPaymentForUser(u)
                const payStatus = String(payment?.status || '').toLowerCase()
                const isPaid = payStatus === 'successful' || payStatus === 'success'
                const isPending = payStatus === 'pending'
                const isActionLoading = actionLoadingId === u.id
                const uid = u.id || u._id

                return (
                  <div key={uid} className="um-card">
                    <div className="um-card-head">
                      <div className="um-avatar" style={{ background: avatarColor.bg, color: avatarColor.text }}>
                        {initial}
                      </div>
                      <div className="um-card-head-info">
                        <div className="um-card-name">{u.username}</div>
                        <div className="um-card-mobile">{u.mobile || '—'}</div>
                      </div>
                      <span className={`um-status ${u.is_active ? 'is-active' : 'is-inactive'}`}>
                        <span className={`um-dot ${u.is_active ? 'um-dot-green' : 'um-dot-red'}`} />
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="um-card-body">
                      <div className="um-card-row">
                        <span className="um-card-label">Category</span>
                        <span className="um-card-value">
                          {catName !== '—' ? (
                            <span className="um-cat-pill" style={{ background: catStyle.bg, color: catStyle.color }}>
                              <span className="um-cat-icon">{catStyle.icon}</span>
                              {catName}
                            </span>
                          ) : '—'}
                        </span>
                      </div>

                      <div className="um-card-row">
                        <span className="um-card-label">Plan</span>
                        <span className="um-card-value">
                          {planName ? (
                            <span className="um-plan-pill">
                              <span className="um-plan-name">{planName}</span>
                              {planPrice && <span className="um-plan-price">· {planPrice}</span>}
                            </span>
                          ) : '—'}
                        </span>
                      </div>

                      <div className="um-card-row">
                        <span className="um-card-label">Website</span>
                        <span className="um-card-value">
                          {websiteName ? (
                            <span className="um-website">
                              <IconGlobe size={12} />
                              <span className="um-website-name" title={websiteName}>{websiteName}</span>
                            </span>
                          ) : '—'}
                        </span>
                      </div>

                      <div className="um-card-row">
                        <span className="um-card-label">Payment</span>
                        <span className="um-card-value">
                          {isPaid ? (
                            <span className="um-pay-badge is-paid">
                              Paid
                              {payment?.amount && (
                                <span className="um-pay-amt">₹{Number(payment.amount).toLocaleString('en-IN')}</span>
                              )}
                            </span>
                          ) : isPending ? (
                            <span className="um-pay-badge is-pending">
                              <span className="um-dot um-dot-amber" />
                              Pending
                            </span>
                          ) : '—'}
                        </span>
                      </div>

                      <div className="um-card-row">
                        <span className="um-card-label">Joined</span>
                        <span className="um-card-value um-muted">
                          <IconCalendar size={12} /> {formatDate(u.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* 3 buttons only */}
                    <div className="um-card-actions">
                      <button
                        className="um-icon-btn"
                        title="View"
                        onClick={() => openView(u)}
                      >
                        <IconEye size={16} />
                      </button>
                      <button
                        className="um-icon-btn"
                        title="Edit"
                        onClick={() => openEdit(u)}
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        className="um-icon-btn um-icon-danger"
                        title={u.is_active ? 'Deactivate' : 'Activate'}
                        onClick={() => toggleUser(u)}
                        disabled={isActionLoading}
                      >
                        {isActionLoading ? <span className="um-spinner" /> : <IconTrash size={16} />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ==================== VIEW MODAL ==================== */}
      <Modal
        open={!!viewUser}
        onClose={() => setViewUser(null)}
        title="User Details"
        footer={
          <button className="btn btn-primary" onClick={() => setViewUser(null)}>
            Close
          </button>
        }
      >
        {viewUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="um-modal-row">
              <span className="um-modal-label">Username</span>
              <span className="um-modal-value">{viewUser.username}</span>
            </div>
            <div className="um-modal-row">
              <span className="um-modal-label">Mobile</span>
              <span className="um-modal-value">{viewUser.mobile || '—'}</span>
            </div>
            <div className="um-modal-row">
              <span className="um-modal-label">Category</span>
              <span className="um-modal-value">{viewUser.category?.name || '—'}</span>
            </div>
            <div className="um-modal-row">
              <span className="um-modal-label">Plan</span>
              <span className="um-modal-value">{viewUser.preferred_plan?.name || '—'}</span>
            </div>
            <div className="um-modal-row">
              <span className="um-modal-label">Website</span>
              <span className="um-modal-value">{getWebsiteName(viewUser) || '—'}</span>
            </div>
            <div className="um-modal-row">
              <span className="um-modal-label">Status</span>
              <span className="um-modal-value">
                <span className={`um-status ${viewUser.is_active ? 'is-active' : 'is-inactive'}`}>
                  <span className={`um-dot ${viewUser.is_active ? 'um-dot-green' : 'um-dot-red'}`} />
                  {viewUser.is_active ? 'Active' : 'Inactive'}
                </span>
              </span>
            </div>
            <div className="um-modal-row">
              <span className="um-modal-label">Joined</span>
              <span className="um-modal-value">{formatDate(viewUser.created_at)}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== EDIT MODAL ==================== */}
      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setEditUser(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Username <span className="req">*</span></label>
          <input
            className="form-control"
            value={editForm.username}
            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Mobile</label>
          <input
            className="form-control"
            value={editForm.mobile}
            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
            placeholder="+91 ..."
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={editForm.is_active}
            onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
          />
          Active
        </label>
      </Modal>
    </div>
  )
}