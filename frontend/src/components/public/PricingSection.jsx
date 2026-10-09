import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pricingApi } from '../../api/pricingApi'
import Loader from '../common/Loader'
import ErrorState from '../common/ErrorState'

export default function PricingSection() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const res = await pricingApi.list()
      setPlans(res.data?.data?.plans || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load pricing')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <Loader />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <section className="section soft" id="pricing">
      <div className="container">
        <div className="section-head">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your needs — cancel anytime.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div className={`plan ${i === 1 ? 'popular' : ''}`} key={plan._id}>
              <h3>{plan.name}</h3>
              <div className="desc">{plan.description}</div>
              <div className="price">
                ₹{Number(plan.price).toLocaleString('en-IN')}
                <span> / one-time</span>
              </div>
              <ul>
                {(plan.features || []).map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link to="/register" className={`btn ${i === 1 ? 'btn-primary' : 'btn-outline'} btn-block`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}