import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { websiteApi } from '../../api/websiteApi'
import axiosClient from '../../api/axiosClient'
import Loader from '../../components/common/Loader'
import { IconEdit, IconRocket, IconForm } from '../../components/dashboard/Icons'

import PortfolioForm from '../../components/forms/PortfolioForm'
import RealEstateForm from '../../components/forms/RealEstateForm'
import SalonForm from '../../components/forms/SalonForm'
import PhotographyForm from '../../components/forms/PhotographyForm'
import EducationForm from '../../components/forms/EducationForm'
import MedicalForm from '../../components/forms/MedicalForm'
import GymForm from '../../components/forms/GymForm'

const TEMPLATE_KEY = 'wb_selected_template'
const WEBSITE_ID_KEY = 'wb_website_id'

const FORM_MAP = {
  'portfolio':            { Component: PortfolioForm,   title: 'Portfolio Website Details' },
  'real-estate':          { Component: RealEstateForm,  title: 'Real Estate Website Details' },
  'salon-spa':            { Component: SalonForm,       title: 'Salon & Spa Website Details' },
  'photography':          { Component: PhotographyForm, title: 'Photography Website Details' },
  'education':            { Component: EducationForm,   title: 'Education Website Details' },
  'medical':              { Component: MedicalForm,     title: 'Medical Website Details' },
  'medical-and-clinic':   { Component: MedicalForm,     title: 'Medical Website Details' },
  'gym':                  { Component: GymForm,         title: 'Gym / Fitness Website Details' },
  'gym-and-fitness':      { Component: GymForm,         title: 'Gym / Fitness Website Details' },
}

export default function WebsiteForm() {
  const { user } = useAuth()
  const notify = useNotify()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({})
  const [existingWebsiteId, setExistingWebsiteId] = useState(null)
  const [mode, setMode] = useState('edit')
  const [saving, setSaving] = useState(false)

  // ✅ Fresh plan flags from backend
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)
  const [planFlagsLoading, setPlanFlagsLoading] = useState(true)

  const slug = user?.category?.slug
  const entry = FORM_MAP[slug]

  const DRAFT_KEY = slug ? `wb_form_draft_${slug}` : 'wb_form_draft'

  /* Load existing website / draft */
  useEffect(() => {
    (async () => {
      try {
        const res = await websiteApi.list().catch(() => null)
        const existing = res?.data?.data?.websites?.[0]
        if (existing) {
          setExistingWebsiteId(existing._id || existing.id)
          localStorage.setItem(WEBSITE_ID_KEY, existing._id || existing.id)
          setFormData(existing.form_data || {})
          setMode('view')
          return
        }

        const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
        if (draft && typeof draft === 'object') {
          setFormData(draft)
        }
        setMode('edit')
      } finally {
        setLoading(false)
      }
    })()
  }, [DRAFT_KEY])

  /* ✅ Fetch FRESH plan flags from backend on mount */
  useEffect(() => {
    const loadPlanFlags = async () => {
      // Admin — full access
      if (user?.role === 'super_admin' || user?.role === 'admin') {
        setWhatsappEnabled(true)
        setPlanFlagsLoading(false)
        return
      }

      const planId =
        user?.preferred_plan?.id ||
        user?.preferred_plan?._id ||
        user?.preferred_plan_id

      if (!planId) {
        setWhatsappEnabled(false)
        setPlanFlagsLoading(false)
        return
      }

      try {
        // 🔥 Fetch fresh plan from backend
        const res = await axiosClient.get(`/pricing/${planId}`)
        const plan = res?.data?.data?.plan || res?.data?.plan
        const flags = plan?.feature_flags || {}

        setWhatsappEnabled(!!flags.whatsapp_button)
        console.log('[Form Plan Flags] fresh:', flags)
      } catch (e) {
        console.warn('[Form Plan Flags] fetch failed:', e?.response?.status)
        // Fallback to cached
        const cached = user?.preferred_plan?.feature_flags || {}
        setWhatsappEnabled(!!cached.whatsapp_button)
      } finally {
        setPlanFlagsLoading(false)
      }
    }

    loadPlanFlags()
  }, [user])

  const selectedTemplate = (() => {
    try {
      return JSON.parse(localStorage.getItem(TEMPLATE_KEY) || 'null')
    } catch { return null }
  })()

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
    notify.success('Draft saved')
  }

  const handleSave = async () => {
    if (!entry) {
      notify.error('Form not available for your category')
      return
    }

    // 🔒 Strip WhatsApp field if plan doesn't allow it
    let dataToSave = { ...formData }
    if (!whatsappEnabled) {
      delete dataToSave.whatsapp
      delete dataToSave.whatsapp_number
      delete dataToSave.whatsappNumber
      delete dataToSave.phone_whatsapp
    }

    setSaving(true)
    try {
      if (existingWebsiteId) {
        await websiteApi.update(existingWebsiteId, { form_data: dataToSave })
        notify.success('Website updated')
        setMode('view')
      } else {
        if (!selectedTemplate) {
          notify.error('Please select a template first')
          navigate('/dashboard/templates')
          return
        }
        const res = await websiteApi.create({
          template_id: selectedTemplate.id,
          pricing_plan_id: user?.preferred_plan?.id || null,
          form_data: dataToSave,
        })
        const newId = res.data?.data?.website?.id
        if (newId) localStorage.setItem(WEBSITE_ID_KEY, newId)
        localStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave))
        notify.success('Form saved! Proceed to payment.')
        navigate('/dashboard/checkout')
      }
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading || planFlagsLoading) return <Loader />

  if (!entry) {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1 className="page-title">Website Form</h1>
            <p className="page-sub">No form available for your category</p>
          </div>
        </div>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p className="muted">
            We don't have a form for <strong>{slug || 'your category'}</strong> yet.
          </p>
        </div>
      </div>
    )
  }

  const { Component, title } = entry

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">
            {mode === 'view'
              ? 'Your saved information. Click Edit to update.'
              : 'Fill in your details — everything saves to your website.'}
          </p>
        </div>
        {mode === 'view' && (
          <button className="btn btn-primary" onClick={() => setMode('edit')}>
            <IconEdit size={15} /> Edit Form
          </button>
        )}
      </div>

      {/* 🔒 WhatsApp Lock Notice */}
      {mode === 'edit' && !whatsappEnabled && (
        <div className="plan-lock-notice">
          <div className="plan-lock-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="plan-lock-body">
            <div className="plan-lock-title">
              WhatsApp Button is a Pro feature
              <span className="plan-lock-tag">PRO</span>
            </div>
            <div className="plan-lock-desc">
              Upgrade to Pro to enable a floating WhatsApp button on your
              website. Let customers reach you instantly.
            </div>
          </div>
          <button
            type="button"
            className="plan-lock-btn"
            onClick={() => navigate('/#pricing')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Upgrade
          </button>
        </div>
      )}

      {mode === 'view' ? (
        <div className="card">
          <div className="view-note">
            <div className="view-note-icon">✓</div>
            <div>
              <strong>Form submitted successfully</strong>
              <p className="muted" style={{ fontSize: 13, margin: '2px 0 0' }}>
                Your website is using the information you provided.
              </p>
            </div>
          </div>
          <ViewSummary data={formData} />
        </div>
      ) : (
        <>
          <Component data={formData} onChange={setFormData} />

          <div className="form-sticky-actions">
            <div className="form-actions-inner">
              <button className="btn btn-outline" onClick={saveDraft} disabled={saving}>
                Save Draft
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
                {saving ? (
                  'Saving...'
                ) : existingWebsiteId ? (
                  <>Save Changes</>
                ) : (
                  <>
                    Save & Continue to Payment
                    <IconRocket size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Plan lock styles */}
      <style>{`
        .plan-lock-notice {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #fcd34d;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .plan-lock-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.7);
          color: #b45309;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .plan-lock-body { flex: 1; min-width: 0; }
        .plan-lock-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #78350f;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }
        .plan-lock-tag {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          padding: 2px 7px;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .plan-lock-desc {
          font-size: 12.5px;
          color: #92400e;
          line-height: 1.5;
        }
        .plan-lock-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          font-size: 12.5px;
          font-weight: 700;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 8px 20px -8px rgba(124,58,237,0.6);
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .plan-lock-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 26px -8px rgba(124,58,237,0.8);
        }
        @media (max-width: 640px) {
          .plan-lock-notice { flex-wrap: wrap; }
          .plan-lock-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  )
}

function ViewSummary({ data }) {
  return (
    <div className="view-summary">
      {Object.entries(data).map(([k, v]) => {
        if (Array.isArray(v) && v.length === 0) return null
        if (v === '' || v === null || v === undefined) return null

        let display = v
        if (Array.isArray(v)) {
          display = v.map((item, i) => {
            if (typeof item === 'object') {
              return (
                <div key={i} className="view-item-obj">
                  • {item.name || item.title || JSON.stringify(item).slice(0, 60)}
                </div>
              )
            }
            return <span key={i} className="view-chip">{item}</span>
          })
        }

        return (
          <div key={k} className="view-row">
            <div className="view-label">{k.replace(/_/g, ' ')}</div>
            <div className="view-value">
              {display || <span className="muted">—</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}