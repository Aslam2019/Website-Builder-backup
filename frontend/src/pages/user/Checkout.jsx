import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { pricingApi } from '../../api/pricingApi'
import { paymentApi } from '../../api/paymentApi'
import { websiteApi } from '../../api/websiteApi'
import Loader from '../../components/common/Loader'
import Modal from '../../components/common/Modal'
import { IconCheck, IconShield, IconRocket } from '../../components/dashboard/Icons'

const WEBSITE_ID_KEY = 'wb_website_id'
const TEMPLATE_KEY = 'wb_selected_template'

export default function Checkout() {
  const { user } = useAuth()
  const notify = useNotify()
  const navigate = useNavigate()

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(user?.preferred_plan?.id || null)
  const [payModal, setPayModal] = useState(false)
  const [payStep, setPayStep] = useState('confirm') // confirm | processing | success
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await pricingApi.list()
        setPlans(res.data?.data?.plans || [])
      } catch { notify.error('Failed to load plans') }
      finally { setLoading(false) }
    })()
  }, [])

  const selectedPlan = plans.find((p) => (p._id || p.id) === selected)
  const template = (() => {
    try { return JSON.parse(localStorage.getItem(TEMPLATE_KEY) || 'null') } catch { return null }
  })()

  const startPay = () => {
    if (!selected) { notify.error('Please select a plan first'); return }
    setPayStep('confirm')
    setPayModal(true)
  }

  const confirmPay = async () => {
    const websiteId = localStorage.getItem(WEBSITE_ID_KEY)
    if (!websiteId) {
      notify.error('Please complete the website form first')
      setPayModal(false)
      navigate('/dashboard/website-form')
      return
    }
    setPayStep('processing')
    setProcessing(true)
    try {
      // Simulate 1.5s for UX
      await new Promise((r) => setTimeout(r, 1400))
      
      // ✅ FIX: Intha object la user_id add panniten
      await paymentApi.dummyPay({
        user_id: user?.id || user?._id, // <--- Intha line dhaan miss aagiruku
        website_id: websiteId,
        plan_id: selected,
      })
      
      setPayStep('success')
      notify.success('Payment successful! Website published.')
    } catch (e) {
      setPayStep('confirm')
      notify.error(e?.response?.data?.message || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  const finish = () => {
    setPayModal(false)
    navigate('/dashboard/my-website')
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Checkout</h1>
          <p className="page-sub">Select a plan to publish your website</p>
        </div>
      </div>

      <div className="checkout-grid">
        {/* LEFT: Plan selection */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="card-title">Choose Your Plan</h3>
            <div className="plan-list">
              {plans.map((p) => {
                const id = p._id || p.id
                const isSelected = selected === id
                return (
                  <div key={id}
                    className={`plan-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelected(id)}
                  >
                    <div className="plan-info">
                      <div className="plan-name">{p.name}</div>
                      <div className="plan-desc">{p.description || '—'}</div>
                    </div>
                    <div className="plan-price">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                      <span>one-time</span>
                    </div>
                    <div className="plan-check">
                      {isSelected && <IconCheck size={11} />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ color: '#16a34a', flexShrink: 0 }}>
                <IconShield size={22} />
              </div>
              <div>
                <strong style={{ color: '#15803d', display: 'block', marginBottom: 4 }}>
                  Test Payment Mode
                </strong>
                <p style={{ fontSize: 13, color: '#166534', margin: 0 }}>
                  No real money will be charged. This is a demo payment for development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 20 }}>
            <h3 className="card-title">Order Summary</h3>
            <div className="summary-row">
              <span>Plan</span>
              <strong>{selectedPlan?.name || '—'}</strong>
            </div>
            <div className="summary-row">
              <span>Template</span>
              <strong>{template?.name || '—'}</strong>
            </div>
            <div className="summary-row">
              <span>Category</span>
              <strong>{user?.category?.name || '—'}</strong>
            </div>
            <div style={{
              borderTop: '2px dashed #e2e8f0', margin: '16px 0', paddingTop: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 15 }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>
                ₹{selectedPlan ? Number(selectedPlan.price).toLocaleString('en-IN') : 0}
              </span>
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={startPay}
              disabled={!selected}>
              <IconRocket size={16} /> Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* ---- GPay-style Payment Modal ---- */}
      <Modal open={payModal} onClose={() => !processing && payStep !== 'success' && setPayModal(false)}
        title={null} footer={null}>
        <div className="gpay-modal">
          {payStep === 'confirm' && (
            <>
              <div className="gpay-header">
                <div className="gpay-logo">
                  <span style={{ color: '#4285f4' }}>G</span>
                  <span style={{ color: '#ea4335' }}>P</span>
                  <span style={{ color: '#fbbc04' }}>a</span>
                  <span style={{ color: '#34a853' }}>y</span>
                </div>
                <div className="gpay-label">UPI Payment</div>
              </div>

              <div className="gpay-amount">
                <div className="gpay-to">Paying</div>
                <div className="gpay-merchant">Website Builder</div>
                <div className="gpay-value">
                  ₹{selectedPlan ? Number(selectedPlan.price).toLocaleString('en-IN') : 0}
                </div>
              </div>

              <div className="gpay-upi">
                <div className="gpay-upi-label">Pay using UPI</div>
                <div className="gpay-apps">
                  <div className="gpay-app" style={{ background: '#e3f2fd' }}>
                    <span style={{ color: '#1a73e8', fontWeight: 700 }}>GPay</span>
                  </div>
                  <div className="gpay-app" style={{ background: '#f3e5f5' }}>
                    <span style={{ color: '#7b1fa2', fontWeight: 700 }}>PhonePe</span>
                  </div>
                  <div className="gpay-app" style={{ background: '#e8f5e9' }}>
                    <span style={{ color: '#388e3c', fontWeight: 700 }}>Paytm</span>
                  </div>
                </div>
              </div>

              <div className="gpay-test-note">
                ⚠️ Test mode — no real transaction
              </div>

              <button className="btn btn-primary btn-block btn-lg" onClick={confirmPay}>
                Pay ₹{selectedPlan ? Number(selectedPlan.price).toLocaleString('en-IN') : 0}
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setPayModal(false)}>
                Cancel
              </button>
            </>
          )}

          {payStep === 'processing' && (
            <div className="gpay-processing">
              <div className="gpay-spinner" />
              <h3>Processing payment...</h3>
              <p className="muted">Please don't close this window</p>
            </div>
          )}

          {payStep === 'success' && (
            <div className="gpay-success">
              <div className="gpay-check">
                <IconCheck size={40} />
              </div>
              <h3>Payment Successful!</h3>
              <p className="muted">
                ₹{selectedPlan ? Number(selectedPlan.price).toLocaleString('en-IN') : 0} paid successfully
              </p>
              <div className="gpay-success-details">
                <div className="summary-row">
                  <span>Plan</span>
                  <strong>{selectedPlan?.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Status</span>
                  <span className="badge badge-success">Successful</span>
                </div>
              </div>
              <button className="btn btn-primary btn-block btn-lg" onClick={finish}>
                View My Website →
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}