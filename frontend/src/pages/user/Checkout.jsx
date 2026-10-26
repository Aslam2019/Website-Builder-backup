import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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

  const [searchParams] = useSearchParams()
  const websiteId = searchParams.get('id') // ✅ URL la irundhu ID ah edukkurom
  const [plan, setPlan] = useState(null)          // ✅ ONLY user's plan
  const [loading, setLoading] = useState(true)
  const [payModal, setPayModal] = useState(false)
  const [payStep, setPayStep] = useState('confirm')
  const [processing, setProcessing] = useState(false)

  /* ============================================================
     ✅ Fetch ONLY the user's preferred plan (locked)
     ============================================================ */
  useEffect(() => {
    (async () => {
      try {
        const preferredId =
          user?.preferred_plan?.id ||
          user?.preferred_plan?._id ||
          user?.preferred_plan_id

        if (!preferredId) {
          notify.error('No plan selected. Please contact support.')
          setLoading(false)
          return
        }

        const res = await pricingApi.list()
        const allPlans = res.data?.data?.plans || []
        const found = allPlans.find((p) => (p._id || p.id) === preferredId)

        if (!found) {
          // Fetch single plan fallback
          try {
            const single = await pricingApi.get(preferredId)
            const p = single.data?.data?.plan
            if (p) setPlan(p)
            else notify.error('Your plan is not available')
          } catch {
            notify.error('Your plan is not available')
          }
        } else {
          setPlan(found)
        }
      } catch {
        notify.error('Failed to load your plan')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const template = (() => {
    try { return JSON.parse(localStorage.getItem(TEMPLATE_KEY) || 'null') } catch { return null }
  })()

  const startPay = () => {
    if (!plan) { notify.error('Plan not available'); return }
    setPayStep('confirm')
    setPayModal(true)
  }

  const confirmPay = async () => {
    setProcessing(true);
    
    // ✅ 1. URL la irundhu ID ah thedum
    let currentWebsiteId = new URLSearchParams(window.location.search).get('id');

    // ✅ 2. URL la ID illana, backend la irundhu edukkum (Fallback)
    if (!currentWebsiteId) {
      try {
        const res = await websiteApi.list();
        const existing = res?.data?.data?.websites?.[0];
        if (existing) {
          currentWebsiteId = existing._id || existing.id;
        }
      } catch (e) {
        console.error("Error fetching website:", e);
      }
    }

    // ✅ 3. Rendumey kidaikala na error
    if (!currentWebsiteId) {
      notify.error('Please complete the website form first');
      setPayModal(false);
      navigate('/dashboard/website-form');
      setProcessing(false);
      return;
    }

    if (!plan) {
      notify.error('Plan missing');
      setProcessing(false);
      return;
    }

    setPayStep('processing');
    try {
      await new Promise((r) => setTimeout(r, 1400));
      
      await paymentApi.dummyPay({
        user_id: user?.id || user?._id,
        website_id: currentWebsiteId, // ✅ Ippo correct ID poagum
        plan_id: plan?.id || plan?._id,
        amount: plan?.price
      });
      
      notify.success('Payment successful!');
      navigate('/dashboard/my-website');
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Payment failed');
      setProcessing(false);
      setPayModal(false);
    }
  };
  const finish = () => {
    setPayModal(false)
    navigate('/dashboard/my-website')
  }

  if (loading) return <Loader />

  if (!plan) {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Checkout</h1>
            <p className="page-sub">No plan found for your account</p>
          </div>
        </div>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p className="muted" style={{ marginBottom: 16 }}>
            We couldn't find a plan assigned to your account.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/website-form')}>
            Go to Website Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Checkout</h1>
          <p className="page-sub">Confirm your plan and complete payment</p>
        </div>
      </div>

      <div className="checkout-grid">
        {/* LEFT: Locked plan display */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="card-title" style={{ margin: 0 }}>Your Plan</h3>
              <span className="lock-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2.5" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Locked
              </span>
            </div>

            <div className="plan-card selected locked">
              <div className="plan-info">
                <div className="plan-name">{plan.name}</div>
                <div className="plan-desc">{plan.description || '—'}</div>
              </div>
              <div className="plan-price">
                ₹{Number(plan.price).toLocaleString('en-IN')}
                <span>one-time</span>
              </div>
              <div className="plan-check">
                <IconCheck size={11} />
              </div>
            </div>

            <p className="lock-note">
              Your plan was selected during registration and cannot be changed here.
              To switch plans, please <strong>contact support</strong>.
            </p>
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
              <strong>{plan.name}</strong>
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
                ₹{Number(plan.price).toLocaleString('en-IN')}
              </span>
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={startPay}>
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
                  ₹{Number(plan.price).toLocaleString('en-IN')}
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
                Pay ₹{Number(plan.price).toLocaleString('en-IN')}
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
                ₹{Number(plan.price).toLocaleString('en-IN')} paid successfully
              </p>
              <div className="gpay-success-details">
                <div className="summary-row">
                  <span>Plan</span>
                  <strong>{plan.name}</strong>
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

      {/* Lock styles */}
      <style>{`
        .lock-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid #fcd34d;
        }
        .plan-card.locked {
          cursor: not-allowed;
          pointer-events: none;
          border-color: #c7d2fe;
          background: linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.03) 100%);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
        }
        .lock-note {
          margin: 14px 0 0;
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.6;
        }
        .lock-note strong {
          color: #4f46e5;
          font-weight: 700;
        }
      `}</style>
    </div>
  )
}
