import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/adminApi'
import { useNotify } from '../../context/NotificationContext'
import StatCard from '../../components/dashboard/StatCard'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'
import PieChart from '../../components/admin/PieChart'
import { formatDate } from '../../utils/formatDate'
import {
  IconUsers, IconWebsite, IconPayment, IconCurrency,
  IconTrend, IconClock, IconCheck, IconGlobe,
} from '../../components/admin/Icons'
import '../../components/admin/pie-chart.css'

// 👇 Inter font (scoped)
const interStyle = {
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'", // nicer Inter alternates
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const headingStyle = {
  ...interStyle,
  fontWeight: 700,
  letterSpacing: '-0.02em', // Inter la bold headings ku perfect
}

export default function AdminDashboard() {
  const notify = useNotify()
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [allWebsites, setAllWebsites] = useState([])
  const [allPayments, setAllPayments] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const [
        dashRes,
        usersRes,
        paymentsSuccessRes,
        websitesRes,
        allPaymentsRes,
        categoriesRes,
      ] = await Promise.all([
        adminApi.dashboard(),
        adminApi.users(),
        adminApi.payments({ status: 'successful' }),
        adminApi.websites?.().catch(() => null) || Promise.resolve(null),
        adminApi.payments?.().catch(() => null) || Promise.resolve(null),
        adminApi.categories?.().catch(() => null) || Promise.resolve(null),
      ])

      setStats(dashRes.data?.data?.stats || {})

      const usersList = usersRes.data?.data?.users || []
      setRecentUsers(usersList.slice(0, 5))
      setAllUsers(usersList)

      const successPayments = paymentsSuccessRes.data?.data?.payments || []
      setRecentPayments(successPayments.slice(0, 5))

      const extractArray = (res, ...keys) => {
        if (!res) return []
        const d = res.data?.data
        if (!d) return []
        for (const k of keys) {
          if (Array.isArray(d[k])) return d[k]
          if (Array.isArray(d?.[k]?.docs)) return d[k].docs
        }
        for (const v of Object.values(d)) {
          if (Array.isArray(v)) return v
        }
        return []
      }

      setAllWebsites(extractArray(websitesRes, 'websites', 'sites', 'items'))
      setAllPayments(extractArray(allPaymentsRes, 'payments', 'transactions', 'items'))
      setAllCategories(extractArray(categoriesRes, 'categories', 'items'))
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to load dashboard'
      setError(msg); notify.push(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  /* ============================================================
     Chart 1: Websites by Category
     ============================================================ */
  const categoryChartData = useMemo(() => {
    const groups = {}

    const resolveCategoryName = (w) => {
      if (w?.category?.name) return w.category.name
      if (w?.category_name) return w.category_name
      if (w?.form_data?.category?.name) return w.form_data.category.name
      if (w?.form_data?.category_name) return w.form_data.category_name

      const catId =
        w?.category_id ||
        w?.category?.id ||
        w?.category?._id ||
        w?.form_data?.category_id
      if (catId && allCategories.length) {
        const found = allCategories.find(
          (c) => (c.id || c._id) === catId
        )
        if (found) return found.name
      }
      return null
    }

    allWebsites.forEach((w) => {
      const name = resolveCategoryName(w)
      if (name) {
        groups[name] = (groups[name] || 0) + 1
      }
    })

    if (Object.keys(groups).length === 0 && allUsers.length) {
      allUsers.forEach((u) => {
        const name =
          u?.category?.name ||
          u?.category_name ||
          (u?.category_id && allCategories.find(
            (c) => (c.id || c._id) === u.category_id
          )?.name)
        if (name) groups[name] = (groups[name] || 0) + 1
      })
    }

    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }))
  }, [allWebsites, allUsers, allCategories])

  /* ============================================================
     Chart 2: Payments by Plan
     ============================================================ */
  const planChartData = useMemo(() => {
    const groups = {}
    const source = allPayments.length ? allPayments : recentPayments
    source
      .filter((p) => p.status === 'successful' || p.status === 'success')
      .forEach((p) => {
        const plan = p.plan_name || p.plan || p.pricing_plan_name || 'Unknown'
        groups[plan] = (groups[plan] || 0) + 1
      })
    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }))
  }, [allPayments, recentPayments])

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="dash-root" style={interStyle}>
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>Dashboard</h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            Overview of your platform activity
          </p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={load}
          style={{ ...interStyle, fontWeight: 500 }}
        >
          Refresh
        </button>
      </div>

      {/* ---------- Stat grid ---------- */}
      <div className="stat-grid">
        <StatCard label="Total Users"       value={stats.total_users ?? 0}      Icon={IconUsers}    color="#4f46e5" />
        <StatCard label="Active Users"      value={stats.active_users ?? 0}     Icon={IconCheck}    color="#10b981" />
        <StatCard label="Total Websites"    value={stats.total_websites ?? 0}   Icon={IconWebsite}  color="#06b6d4" />
        <StatCard label="Published Sites"   value={stats.published_websites ?? 0} Icon={IconGlobe}  color="#8b5cf6" />
        <StatCard label="Total Payments"    value={stats.total_payments ?? 0}   Icon={IconPayment}  color="#f59e0b" />
        <StatCard label="Pending Payments"  value={stats.pending_payments ?? 0} Icon={IconClock}    color="#ef4444" />
        <StatCard label="Revenue"
          value={`₹${Number(stats.revenue ?? 0).toLocaleString('en-IN')}`}
          Icon={IconCurrency} color="#16a34a" />
        <StatCard label="Payment Rate"
          value={stats.total_payments
            ? `${Math.round((stats.total_payments - (stats.pending_payments||0)) / stats.total_payments * 100)}`
            : '0'}
          suffix="%"
          Icon={IconTrend} color="#0ea5e9" />
      </div>

      {/* ---------- Pie Charts ---------- */}
      <div className="dash-charts-row">
        <PieChart
          title="Websites by Category"
          subtitle="Which categories users are building for"
          data={categoryChartData}
          centerLabel="Websites"
          emptyText="No websites created yet"
        />
        <PieChart
          title="Payments by Plan"
          subtitle="Distribution of successful purchases"
          data={planChartData}
          centerLabel="Payments"
          emptyText="No successful payments yet"
        />
      </div>

      {/* ---------- Recent sections ---------- */}
      <div className="dash-2col">
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h3 className="card-title" style={{ margin: 0, ...headingStyle }}>Recent Users</h3>
            <Link
              to="/admin/users"
              className="btn btn-ghost btn-sm"
              style={{ ...interStyle, fontWeight: 500 }}
            >
              View all →
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="muted" style={{ padding: 20, textAlign: 'center', fontSize: 13 }}>
              No users yet
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id || u._id}>
                      <td style={{ fontWeight: 600 }}>{u.username}</td>
                      <td>{u.category?.name || u.category_name || '—'}</td>
                      <td>
                        <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="muted">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h3 className="card-title" style={{ margin: 0, ...headingStyle }}>Recent Payments</h3>
            <Link
              to="/admin/payments"
              className="btn btn-ghost btn-sm"
              style={{ ...interStyle, fontWeight: 500 }}
            >
              View all →
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="muted" style={{ padding: 20, textAlign: 'center', fontSize: 13 }}>
              No payments yet
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => (
                    <tr key={p._id || p.id}>
                      <td style={{ fontWeight: 600 }}>{p.username}</td>
                      <td>{p.plan_name}</td>
                      <td style={{ fontWeight: 600 }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${
                          p.status === 'successful' ? 'badge-success'
                          : p.status === 'pending' ? 'badge-warning'
                          : 'badge-danger'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}