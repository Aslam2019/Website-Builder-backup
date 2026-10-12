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
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const headingStyle = {
  ...interStyle,
  fontWeight: 700,
  letterSpacing: '-0.02em',
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

  /* Chart 1: Websites by Category */
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

  /* Chart 2: Payments by Plan */
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
      {/* ---------- Head ---------- */}
      <div className="dash-head">
        <div>
          <h1 className="dash-title" style={headingStyle}>Dashboard</h1>
          <p className="dash-sub">Overview of your platform activity</p>
        </div>
        <button
          className="dash-refresh"
          onClick={load}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
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
        <div className="dash-card">
          <div className="dash-card-head">
            <h3 className="dash-card-title" style={headingStyle}>Recent Users</h3>
            <Link to="/admin/users" className="dash-view-all">
              View all →
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="dash-empty">No users yet</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
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
                      <td className="dash-td-strong">{u.username}</td>
                      <td>{u.category?.name || u.category_name || '—'}</td>
                      <td>
                        <span className={`dash-badge ${u.is_active ? 'is-success' : 'is-danger'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="dash-td-muted">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <h3 className="dash-card-title" style={headingStyle}>Recent Payments</h3>
            <Link to="/admin/payments" className="dash-view-all">
              View all →
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="dash-empty">No payments yet</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
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
                      <td className="dash-td-strong">{p.username}</td>
                      <td>{p.plan_name}</td>
                      <td className="dash-td-strong">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`dash-badge ${
                          p.status === 'successful' ? 'is-success'
                          : p.status === 'pending' ? 'is-warning'
                          : 'is-danger'
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

      {/* ============ RESPONSIVE STYLES ============ */}
      <style>{`
        .dash-root {
          max-width: 1400px;
          padding: 0;
        }

        /* ---------- Head ---------- */
        .dash-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .dash-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin: 0 0 4px;
          line-height: 1.2;
        }
        .dash-sub {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }
        .dash-refresh {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: inherit;
          flex-shrink: 0;
        }
        .dash-refresh:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .dash-refresh svg { color: #64748b; }

        /* ---------- Stat grid ---------- */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        /* ---------- Charts row ---------- */
        .dash-charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        /* ---------- Recent sections ---------- */
        .dash-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .dash-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .dash-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
        }
        .dash-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .dash-view-all {
          font-size: 12.5px;
          font-weight: 600;
          color: #4f46e5;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 8px;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .dash-view-all:hover {
          background: #eef2ff;
        }
        .dash-empty {
          padding: 30px 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
          margin: 0;
        }

        /* ---------- Table ---------- */
        .dash-table-wrap {
          overflow-x: auto;
          margin: 0 -8px;
          padding: 0 8px;
          -webkit-overflow-scrolling: touch;
        }
        .dash-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .dash-table thead th {
          text-align: left;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 8px 10px;
          border-bottom: 1px solid #f1f5f9;
          white-space: nowrap;
        }
        .dash-table tbody td {
          padding: 10px;
          border-bottom: 1px solid #f8fafc;
          color: #475569;
          white-space: nowrap;
        }
        .dash-table tbody tr:last-child td {
          border-bottom: none;
        }
        .dash-td-strong {
          color: #0f172a;
          font-weight: 600;
        }
        .dash-td-muted {
          color: #94a3b8;
          font-size: 12px;
        }

        /* ---------- Badge ---------- */
        .dash-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          letter-spacing: 0.02em;
          text-transform: capitalize;
        }
        .dash-badge.is-success {
          background: #d1fae5;
          color: #059669;
        }
        .dash-badge.is-warning {
          background: #fef3c7;
          color: #b45309;
        }
        .dash-badge.is-danger {
          background: #fee2e2;
          color: #dc2626;
        }

        /* ============================================================
           TABLET (≤1100px)
           ============================================================ */
        @media (max-width: 1100px) {
          .stat-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
          .dash-charts-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .dash-2col {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        /* ============================================================
           MOBILE (≤768px)
           ============================================================ */
        @media (max-width: 768px) {
          .dash-root { padding: 0; }

          .dash-head {
            margin-bottom: 18px;
            gap: 12px;
          }
          .dash-title {
            font-size: 22px;
            letter-spacing: -0.03em;
          }
          .dash-sub {
            font-size: 12.5px;
          }
          .dash-refresh {
            padding: 8px 12px;
            font-size: 12px;
          }

          /* Stats — 2 columns on mobile */
          .stat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 18px;
          }

          .dash-charts-row {
            gap: 14px;
            margin-bottom: 18px;
          }

          .dash-card {
            padding: 16px;
            border-radius: 12px;
          }
          .dash-card-title {
            font-size: 14px;
          }
          .dash-view-all {
            font-size: 12px;
            padding: 5px 8px;
          }
        }

        /* ============================================================
           SMALL MOBILE (≤480px)
           ============================================================ */
        @media (max-width: 480px) {
          .dash-title {
            font-size: 20px;
          }
          .dash-sub {
            font-size: 12px;
          }

          .stat-grid {
            gap: 8px;
            margin-bottom: 16px;
          }

          .dash-charts-row {
            gap: 12px;
            margin-bottom: 16px;
          }

          .dash-card {
            padding: 14px;
            border-radius: 12px;
          }
          .dash-card-head {
            margin-bottom: 12px;
          }
          .dash-card-title {
            font-size: 13.5px;
          }

          .dash-table {
            font-size: 12px;
          }
          .dash-table thead th {
            font-size: 9.5px;
            padding: 7px 8px;
          }
          .dash-table tbody td {
            padding: 9px 8px;
          }
          .dash-badge {
            font-size: 10px;
            padding: 2px 7px;
          }
        }

        @media (max-width: 380px) {
          .dash-refresh span { display: none; }
          .dash-refresh { padding: 8px 10px; }
          .stat-grid { gap: 6px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .dash-refresh, .dash-view-all {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}