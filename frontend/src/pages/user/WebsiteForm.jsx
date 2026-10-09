import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotify } from '../../context/NotificationContext'
import { websiteApi } from '../../api/websiteApi'
import Loader from '../../components/common/Loader'
import { IconEdit, IconRocket, IconForm } from '../../components/dashboard/Icons'

import PortfolioForm from '../../components/forms/PortfolioForm'
import RealEstateForm from '../../components/forms/RealEstateForm'
import SalonForm from '../../components/forms/SalonForm'
import PhotographyForm from '../../components/forms/PhotographyForm'
import EducationForm from '../../components/forms/EducationForm'
import MedicalForm from '../../components/forms/MedicalForm'
import GymForm from '../../components/forms/GymForm'   // ✅ ADDED

const TEMPLATE_KEY = 'wb_selected_template'
const WEBSITE_ID_KEY = 'wb_website_id'

// Category-specific form mapping
const FORM_MAP = {
  'portfolio':            { Component: PortfolioForm,   title: 'Portfolio Website Details' },
  'real-estate':          { Component: RealEstateForm,  title: 'Real Estate Website Details' },
  'salon-spa':            { Component: SalonForm,       title: 'Salon & Spa Website Details' },
  'photography':          { Component: PhotographyForm, title: 'Photography Website Details' },
  'education':            { Component: EducationForm,   title: 'Education Website Details' },
  'medical':              { Component: MedicalForm,     title: 'Medical Website Details' },
  'medical-and-clinic':   { Component: MedicalForm,     title: 'Medical Website Details' },
  'gym':                  { Component: GymForm,         title: 'Gym / Fitness Website Details' },   // ✅ ADDED
  'gym-and-fitness':      { Component: GymForm,         title: 'Gym / Fitness Website Details' },   // ✅ ADDED (safety)
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

  const slug = user?.category?.slug
  const entry = FORM_MAP[slug]

  const DRAFT_KEY = slug ? `wb_form_draft_${slug}` : 'wb_form_draft'

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
    setSaving(true)
    try {
      if (existingWebsiteId) {
        await websiteApi.update(existingWebsiteId, { form_data: formData })
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
          form_data: formData,
        })
        const newId = res.data?.data?.website?.id
        if (newId) localStorage.setItem(WEBSITE_ID_KEY, newId)
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
        notify.success('Form saved! Proceed to payment.')
        navigate('/dashboard/checkout')
      }
    } catch (e) {
      notify.error(e?.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader />

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