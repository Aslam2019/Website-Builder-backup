import { useState, useEffect } from 'react'
import { enquiryApi } from '../../api/enquiryApi'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
}

const BUSINESS_TYPES = [
  'Restaurant / Cafe',
  'Salon / Spa',
  'Gym / Fitness',
  'Medical / Clinic',
  'Real Estate',
  'Photography',
  'Education',
  'E-commerce',
  'Consulting',
  'Other',
]

const BUDGETS = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000+',
]

export default function CustomPlanModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    business_type: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  /* Lock body scroll when modal open */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  /* ESC key closes modal */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, submitting])

  if (!open) return null

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '', submit: '' })
  }

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (!form.mobile.trim()) err.mobile = 'Mobile is required'
    else if (!/^\d{10}$/.test(form.mobile.trim()))
      err.mobile = 'Enter a valid 10-digit number'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = 'Enter a valid email'
    if (!form.message.trim()) err.message = 'Please describe your requirement'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await enquiryApi.submitCustomPlan(form)
      setSuccess(true)
      setTimeout(() => {
        setForm({ name: '', email: '', mobile: '', business_type: '', budget: '', message: '' })
        setSuccess(false)
        onClose?.()
      }, 2800)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Submission failed. Please try again.'
      setErrors({ submit: msg })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (submitting) return
    setErrors({})
    setSuccess(false)
    onClose?.()
  }

  return (
    <div className="cpm-backdrop" style={interStyle} onClick={handleClose}>
      <div className="cpm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cpm-close" onClick={handleClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {success ? (
          <div className="cpm-success">
            <div className="cpm-success-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Thank you!</h2>
            <p>Our team will contact you within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className="cpm-head">
              <div className="cpm-badge">
                <span className="cpm-badge-dot" />
                CUSTOM PLAN
              </div>
              <h2>Let's build something custom</h2>
              <p>Tell us about your business and requirements. We'll get back to you with a tailored solution within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="cpm-form" noValidate>
              <div className="cpm-row">
                <div className="cpm-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={change}
                    placeholder="Your name"
                    className={errors.name ? 'err' : ''}
                    autoFocus
                  />
                  {errors.name && <span className="cpm-err">{errors.name}</span>}
                </div>

                <div className="cpm-field">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={change}
                    placeholder="10-digit number"
                    maxLength={10}
                    inputMode="numeric"
                    className={errors.mobile ? 'err' : ''}
                  />
                  {errors.mobile && <span className="cpm-err">{errors.mobile}</span>}
                </div>
              </div>

              <div className="cpm-field">
                <label>Email <span className="cpm-opt">(optional)</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  placeholder="you@example.com"
                  className={errors.email ? 'err' : ''}
                />
                {errors.email && <span className="cpm-err">{errors.email}</span>}
              </div>

              <div className="cpm-row">
                <div className="cpm-field">
                  <label>Business Type</label>
                  <select name="business_type" value={form.business_type} onChange={change}>
                    <option value="">Select…</option>
                    {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="cpm-field">
                  <label>Budget Range</label>
                  <select name="budget" value={form.budget} onChange={change}>
                    <option value="">Select…</option>
                    {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="cpm-field">
                <label>What do you need? *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={change}
                  rows={4}
                  placeholder="Describe your website requirements — features, pages, integrations, etc."
                  className={errors.message ? 'err' : ''}
                />
                {errors.message && <span className="cpm-err">{errors.message}</span>}
              </div>

              {errors.submit && (
                <div className="cpm-submit-err">{errors.submit}</div>
              )}

              <button type="submit" className="cpm-submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="cpm-spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    Submit Enquiry
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>

              <p className="cpm-privacy">
                We'll never share your details. Response within 24 hours.
              </p>
            </form>
          </>
        )}
      </div>

      <style>{`
        .cpm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 6, 22, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          animation: cpmFade 0.22s ease;
        }
        @keyframes cpmFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .cpm-modal {
          position: relative;
          background: #ffffff;
          border-radius: 22px;
          width: 100%;
          max-width: 580px;
          padding: 34px 30px 28px;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05);
          max-height: 92vh;
          overflow-y: auto;
          animation: cpmIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes cpmIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cpm-close {
          position: absolute;
          top: 16px; right: 16px;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: none;
          background: #f1f5f9;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          z-index: 10;
        }
        .cpm-close:hover { background: #e2e8f0; color: #0f172a; }

        .cpm-head { margin-bottom: 24px; padding-right: 30px; }
        .cpm-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          padding: 5px 12px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .cpm-badge-dot {
          width: 5px; height: 5px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255,255,255,0.9);
        }
        .cpm-head h2 {
          font-size: 23px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin: 0 0 8px;
          line-height: 1.2;
        }
        .cpm-head p {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        .cpm-form { display: flex; flex-direction: column; gap: 15px; }
        .cpm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .cpm-field { display: flex; flex-direction: column; gap: 6px; }
        .cpm-field label {
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
          letter-spacing: -0.01em;
        }
        .cpm-opt {
          font-weight: 500;
          color: #94a3b8;
          font-size: 11.5px;
        }
        .cpm-field input,
        .cpm-field select,
        .cpm-field textarea {
          padding: 11px 13px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0f172a;
          font-family: inherit;
          transition: all 0.15s ease;
          background: #fff;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        .cpm-field input:focus,
        .cpm-field select:focus,
        .cpm-field textarea:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.13);
        }
        .cpm-field input.err,
        .cpm-field textarea.err {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        .cpm-field textarea { resize: vertical; min-height: 92px; line-height: 1.55; }
        .cpm-err {
          font-size: 11.5px;
          color: #ef4444;
          font-weight: 500;
        }
        .cpm-submit-err {
          font-size: 12.5px;
          color: #ef4444;
          padding: 10px 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
        }

        .cpm-submit {
          margin-top: 6px;
          padding: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 12px 28px -10px rgba(124,58,237,0.7);
          transition: all 0.2s ease;
          letter-spacing: -0.01em;
        }
        .cpm-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 16px 34px -10px rgba(124,58,237,0.85);
        }
        .cpm-submit:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .cpm-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cpmSpin 0.7s linear infinite;
        }
        @keyframes cpmSpin { to { transform: rotate(360deg); } }

        .cpm-privacy {
          font-size: 11.5px;
          color: #94a3b8;
          text-align: center;
          margin: 4px 0 0;
        }

        /* Success */
        .cpm-success {
          text-align: center;
          padding: 32px 8px;
        }
        .cpm-success-icon {
          width: 72px; height: 72px;
          margin: 0 auto 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 32px -12px rgba(16,185,129,0.5);
        }
        .cpm-success h2 {
          font-size: 23px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
          letter-spacing: -0.025em;
        }
        .cpm-success p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 560px) {
          .cpm-backdrop { padding: 12px; align-items: flex-start; }
          .cpm-modal {
            padding: 28px 20px 22px;
            border-radius: 18px;
            margin-top: 8px;
            max-height: calc(100vh - 24px);
          }
          .cpm-head h2 { font-size: 20px; }
          .cpm-head p { font-size: 13px; }
          .cpm-row { grid-template-columns: 1fr; gap: 14px; }
          .cpm-close { top: 12px; right: 12px; width: 34px; height: 34px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cpm-backdrop, .cpm-modal, .cpm-submit, .cpm-spinner { animation: none !important; }
          .cpm-submit:hover { transform: none !important; }
        }
      `}</style>
    </div>
  )
}