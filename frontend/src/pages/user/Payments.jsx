import { useEffect, useState } from 'react'
import { paymentApi } from '../../api/paymentApi'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/formatDate'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await paymentApi.list()
        setPayments(res.data?.data?.payments || [])
      } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-sub">{payments.length} transaction{payments.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {payments.length === 0 ? (
          <p className="muted" style={{ padding: 40, textAlign: 'center' }}>
            No payments yet
          </p>
        ) : (
          <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Plan</th>
                  <th>Website</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id || p.id}>
                    <td><code style={{ fontSize: 12 }}>{p.payment_id}</code></td>
                    <td>{p.plan_name}</td>
                    <td>{p.website_name}</td>
                    <td style={{ fontWeight: 600 }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${
                        p.status === 'successful' ? 'badge-success'
                        : p.status === 'pending' ? 'badge-warning' : 'badge-danger'
                      }`}>{p.status}</span>
                    </td>
                    <td className="muted" style={{ fontSize: 13 }}>
                      {formatDate(p.payment_date || p.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}