import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { websiteApi } from '../../api/websiteApi'
import { paymentApi } from '../../api/paymentApi'
import StatCard from '../../components/dashboard/StatCard'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/formatDate'
import {
  IconTemplate, IconForm, IconWebsite, IconPayment,
  IconCheck, IconClock, IconRocket,
} from '../../components/dashboard/Icons'

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
   STEP ICONS
   ============================================================ */
const StepIconUser = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const StepIconTemplate = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)
const StepIconForm = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
)
const StepIconPay = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)
const IconCheckSmall = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [websites, setWebsites] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const [w, p] = await Promise.all([
          websiteApi.list().catch(() => ({ data: { data: { websites: [] } } })),
          paymentApi.list().catch(() => ({ data: { data: { payments: [] } } })),
        ])
        setWebsites(w.data?.data?.websites || [])
        setPayments(p.data?.data?.payments || [])
      } finally { setLoading(false) }
    })()
  }, [])

  /* -------- Trigger animation after mount -------- */
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setAnimate(true), 100)
      return () => clearTimeout(t)
    }
  }, [loading])

  if (loading) return <Loader />

  const website = websites[0]
  const hasWebsite = !!website
  const isPublished = website?.status === 'published'

  let progress = 20
  if (website) progress = 50
  if (isPublished) progress = 100

  /* -------- Steps data -------- */
  const steps = [
    { key: 'register', label: 'Registered', desc: 'Account created', done: true,                    Icon: StepIconUser },
    { key: 'template', label: 'Template',   desc: 'Template chosen', done: !!website,                Icon: StepIconTemplate },
    { key: 'form',     label: 'Form',       desc: 'Details filled',  done: !!website,                Icon: StepIconForm },
    { key: 'payment',  label: 'Payment',    desc: 'Website live',    done: isPublished,              Icon: StepIconPay },
  ]

  // Which step is currently active (first not done)
  const currentIdx = steps.findIndex((s) => !s.done)
  const completedCount = steps.filter((s) => s.done).length
  const percent = Math.round((completedCount / steps.length) * 100)

  return (
    <div style={interStyle} className="dash-user-root">
      <div className="page-head">
        <div>
          <h1 className="page-title" style={headingStyle}>
            Welcome back, {user?.username} 👋
          </h1>
          <p className="page-sub" style={{ ...interStyle, fontWeight: 400 }}>
            {user?.category?.name ? `Category: ${user.category.name}` : "Let's build your first website"}
          </p>
        </div>
      </div>

      {/* ---------- Stat Grid ---------- */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard label="Templates" value={hasWebsite ? 1 : 0} Icon={IconTemplate} color="#8b5cf6" />
        <StatCard label="Form Progress" value={progress} suffix="%" Icon={IconForm} color="#f59e0b" />
        <StatCard label="Website" value={hasWebsite ? 1 : 0} Icon={IconWebsite} color="#06b6d4" />
        <StatCard label="Payments" value={payments.length} Icon={IconPayment} color="#10b981" />
      </div>

      {/* ============================================================
          PROGRESS STEPPER — ANIMATED
         ============================================================ */}
      <div className="prog-card">
        <div className="prog-head">
          <div>
            <h3 className="prog-title" style={headingStyle}>Your Progress</h3>
            <p className="prog-sub" style={{ ...interStyle, fontWeight: 400 }}>
              Track your journey to a live website
            </p>
          </div>
          <div className={`prog-percent ${percent === 100 ? 'is-done' : ''}`}>
            <span className="prog-percent-num">{percent}</span>
            <span className="prog-percent-sign">%</span>
          </div>
        </div>

        {/* Stepper (desktop) */}
        <div className={`prog-stepper ${animate ? 'is-animated' : ''}`}>
          {steps.map((s, i) => {
            const isDone = s.done
            const isCurrent = i === currentIdx
            const isLast = i === steps.length - 1
            const Icon = s.Icon

            return (
              <div
                key={s.key}
                className={`prog-step ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}
                style={{ '--step-delay': `${i * 0.18}s` }}
              >
                {/* Connector line to next step */}
                {!isLast && (
                  <div className="prog-connector">
                    <div
                      className="prog-connector-fill"
                      style={{ '--fill-delay': `${i * 0.18 + 0.1}s` }}
                    />
                  </div>
                )}

                {/* Circle */}
                <div className="prog-circle-wrap">
                  {isCurrent && <span className="prog-pulse" />}
                  <div className="prog-circle">
                    {isDone ? (
                      <span className="prog-check">
                        <IconCheckSmall size={16} />
                      </span>
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>
                </div>

                {/* Label + description */}
                <div className="prog-label-wrap">
                  <div className="prog-step-num">STEP {i + 1}</div>
                  <div className="prog-label">{s.label}</div>
                  <div className="prog-desc">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress summary bar (mobile + desktop) */}
        <div className="prog-bar-wrap">
          <div className="prog-bar-track">
            <div
              className="prog-bar-fill"
              style={{ '--target-width': `${percent}%` }}
            />
          </div>
          <div className="prog-bar-meta">
            <span>{completedCount} of {steps.length} completed</span>
            <span className="prog-bar-percent">{percent}%</span>
          </div>
        </div>
      </div>

      {/* ---------- Quick Actions + Website Status ---------- */}
      <div className="dash-2col">
        <div className="card">
          <h3 className="card-title" style={headingStyle}>Quick Actions</h3>
          <div className="qa-list">
            <Link to="/dashboard/templates" className="btn btn-primary qa-btn">
              <IconTemplate size={16} /> Browse Templates
            </Link>
            <Link to="/dashboard/website-form" className="btn btn-outline qa-btn">
              <IconForm size={16} /> Fill Website Form
            </Link>
            {hasWebsite && (
              <Link to="/dashboard/my-website" className="btn btn-outline qa-btn">
                <IconWebsite size={16} /> View My Website
              </Link>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={headingStyle}>Website Status</h3>
          {!hasWebsite ? (
            <p className="muted" style={{ fontSize: 14, padding: '20px 0', textAlign: 'center' }}>
              No website yet. Start by choosing a template.
            </p>
          ) : (
            <>
              <div className="ws-info">
                <div className="ws-row">
                  <span className="ws-label">Website Name</span>
                  <strong className="ws-value">{website.name}</strong>
                </div>
                <div className="ws-row">
                  <span className="ws-label">Template</span>
                  <strong className="ws-value">{website.template_name}</strong>
                </div>
                <div className="ws-row">
                  <span className="ws-label">Plan</span>
                  <strong className="ws-value">{website.plan_name}</strong>
                </div>
                <div className="ws-row">
                  <span className="ws-label">Status</span>
                  <span className={`badge ${isPublished ? 'badge-success' : 'badge-warning'}`}>
                    {isPublished
                      ? <><IconCheck size={11} /> Published</>
                      : <><IconClock size={11} /> Draft</>}
                  </span>
                </div>
              </div>
              {!isPublished && (
                <Link
                  to="/dashboard/checkout"
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 16 }}
                >
                  <IconRocket size={16} /> Complete Payment
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* ============================================================
          RESPONSIVE STYLES
         ============================================================ */}
      <style>{`
        /* ---------- Progress Card ---------- */
        .prog-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px 24px 20px;
          margin-bottom: 24px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .prog-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 28px;
        }
        .prog-title {
          font-size: 17px;
          margin: 0 0 4px;
          color: #111827;
        }
        .prog-sub {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        /* Percent badge */
        .prog-percent {
          display: flex;
          align-items: baseline;
          gap: 1px;
          font-weight: 800;
          font-size: 26px;
          letter-spacing: -0.03em;
          color: #4f46e5;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border: 1px solid #c7d2fe;
          padding: 6px 14px;
          border-radius: 12px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .prog-percent.is-done {
          color: #059669;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border-color: #6ee7b7;
        }
        .prog-percent-sign {
          font-size: 14px;
          opacity: 0.7;
        }

        /* ---------- Stepper ---------- */
        .prog-stepper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          position: relative;
          margin-bottom: 24px;
        }

        .prog-step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Circle wrap */
        .prog-circle-wrap {
          position: relative;
          margin-bottom: 12px;
          z-index: 2;
        }
        .prog-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          color: #9ca3af;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 2;
        }
        .prog-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* Done state */
        .prog-step.is-done .prog-circle {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-color: #4f46e5;
          color: #fff;
          box-shadow:
            0 6px 14px -4px rgba(79, 70, 229, 0.5),
            0 0 0 4px rgba(79, 70, 229, 0.08);
        }

        /* Current state */
        .prog-step.is-current .prog-circle {
          background: #fff;
          border-color: #4f46e5;
          color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        /* Pulse ring for current */
        .prog-pulse {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid #4f46e5;
          animation: progPulse 2s ease-out infinite;
          pointer-events: none;
        }
        @keyframes progPulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        /* Connector */
        .prog-connector {
          position: absolute;
          top: 26px;
          left: calc(50% + 26px);
          right: calc(-50% + 26px);
          height: 2px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          z-index: 1;
        }
        .prog-connector-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 0.5s ease;
        }

        /* Label */
        .prog-label-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .prog-step-num {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 2px;
        }
        .prog-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.01em;
        }
        .prog-desc {
          font-size: 11.5px;
          color: #9ca3af;
          font-weight: 400;
        }

        .prog-step.is-done .prog-step-num { color: #4f46e5; }
        .prog-step.is-current .prog-step-num { color: #4f46e5; }

        /* ---------- Animated state ---------- */
        .prog-stepper.is-animated .prog-step {
          animation: progStepIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          animation-delay: var(--step-delay);
        }
        @keyframes progStepIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .prog-stepper.is-animated .prog-step.is-done .prog-connector-fill {
          transform: scaleX(1);
          transition-delay: var(--fill-delay);
        }

        /* ---------- Progress Summary Bar ---------- */
        .prog-bar-wrap {
          padding-top: 20px;
          border-top: 1px dashed #eef0f3;
        }
        .prog-bar-track {
          height: 8px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }
        .prog-bar-fill {
          height: 100%;
          width: 0;
          background: linear-gradient(90deg, #4f46e5, #06b6d4, #7c3aed);
          border-radius: 999px;
          background-size: 200% 100%;
          animation: progBarShine 3s linear infinite;
          transition: width 1.2s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .prog-stepper.is-animated ~ .prog-bar-wrap .prog-bar-fill,
        .prog-card .prog-bar-fill {
          /* fill applied via animation when component mounts */
        }
        @keyframes progBarShine {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        /* Trigger bar fill via class on parent */
        .prog-card .prog-stepper.is-animated + .prog-bar-wrap .prog-bar-fill {
          width: var(--target-width, 0%);
        }
        .prog-bar-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-size: 12.5px;
          color: #6b7280;
          font-weight: 500;
        }
        .prog-bar-percent {
          font-weight: 700;
          color: #4f46e5;
          font-size: 13px;
        }

        /* ---------- Quick Actions & Website Status ---------- */
        .qa-list { display: flex; flex-direction: column; gap: 10px; }
        .qa-btn { justify-content: flex-start; }

        .ws-info { display: flex; flex-direction: column; gap: 12px; }
        .ws-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .ws-label { font-size: 13px; color: #6b7280; font-weight: 500; }
        .ws-value {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 60%;
        }

        /* ============================================
           MOBILE (≤768px)
           ============================================ */
        @media (max-width: 768px) {
          .dash-user-root .page-title { font-size: 22px; }
          .dash-user-root .page-sub { font-size: 13px; }

          .dash-user-root .stat-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          .prog-card {
            padding: 18px 16px 16px;
            border-radius: 14px;
            margin-bottom: 18px;
          }
          .prog-head {
            margin-bottom: 22px;
            gap: 12px;
          }
          .prog-title { font-size: 15.5px; }
          .prog-sub { font-size: 12.5px; }
          .prog-percent {
            font-size: 20px;
            padding: 5px 11px;
            border-radius: 10px;
          }
          .prog-percent-sign { font-size: 12px; }

          /* Stepper → compact */
          .prog-stepper {
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
          }
          .prog-circle {
            width: 42px;
            height: 42px;
          }
          .prog-circle svg { width: 15px; height: 15px; }
          .prog-connector {
            top: 21px;
            left: calc(50% + 21px);
            right: calc(-50% + 21px);
          }
          .prog-label {
            font-size: 11.5px;
            line-height: 1.2;
          }
          .prog-desc { display: none; }
          .prog-step-num { font-size: 8.5px; letter-spacing: 0.08em; }

          .prog-bar-meta { font-size: 11.5px; }
          .prog-bar-percent { font-size: 12px; }

          .dash-user-root .dash-2col {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }

          .qa-btn { font-size: 13.5px; padding: 11px 14px; }
        }

        @media (max-width: 420px) {
          .prog-circle {
            width: 38px;
            height: 38px;
          }
          .prog-circle svg { width: 14px; height: 14px; }
          .prog-connector {
            top: 19px;
            left: calc(50% + 19px);
            right: calc(-50% + 19px);
          }
          .prog-label { font-size: 10.5px; }
          .prog-step-num { font-size: 7.5px; }
          .prog-percent { font-size: 18px; padding: 4px 10px; }
          .prog-bar-track { height: 6px; }
        }
      `}</style>
    </div>
  )
}