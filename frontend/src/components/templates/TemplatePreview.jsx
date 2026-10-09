import { useEffect } from 'react'
import { IconCheck } from '../dashboard/Icons'
import PortfolioTemplate from '../generated/templates/PortfolioTemplate'
import RealEstateTemplate from '../generated/templates/RealEstateTemplate'
import SalonTemplate from '../generated/templates/SalonTemplate'
import PhotographyTemplate from '../generated/templates/PhotographyTemplate'
import EducationTemplate from '../generated/templates/EducationTemplate'
import MedicalTemplate from '../generated/templates/MedicalTemplate'
import GymTemplate from '../generated/templates/GymTemplate'

import '../generated/templates/portfolio.css'
import '../generated/templates/realestate.css'
import '../generated/templates/salon.css'
import '../generated/templates/photography.css'
import '../generated/templates/education.css'
import '../generated/templates/medical.css'
import '../generated/templates/gym.css'

import {
  DUMMY_PORTFOLIO,
  DUMMY_REALESTATE,
  DUMMY_SALON,
  DUMMY_PHOTOGRAPHY,
  DUMMY_EDUCATION,
  DUMMY_MEDICAL,
  DUMMY_GYM,
} from './dummyData'

export default function TemplatePreview({ open, onClose, template, onSelect }) {
  /* ---- All hooks FIRST (before any return) ---- */

  useEffect(() => {
    if (open) {
      document.body.classList.add('tpl-modal-open')
    } else {
      document.body.classList.remove('tpl-modal-open')
    }
    return () => document.body.classList.remove('tpl-modal-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  /* ---- Now early return ---- */
  if (!open || !template) return null

  const slug = (template.category?.slug || '').toLowerCase()

  /* Slug helpers */
  const isMedical =
    slug === 'medical' ||
    slug === 'clinic' ||
    slug === 'healthcare' ||
    slug === 'medical-and-clinic' ||
    slug.includes('medical') ||
    slug.includes('clinic')

  // ✅ ADD THIS — isGym define pannunga
  const isGym =
    slug === 'gym' ||
    slug === 'fitness' ||
    slug === 'gym-fitness' ||
    slug.includes('gym') ||
    slug.includes('fitness')

  return (
    <div className="tpl-preview-modal">
      {/* Top bar */}
      <div className="tpl-preview-bar">
        <div className="tpl-preview-bar-left">
          <span className="tpl-preview-dot red" />
          <span className="tpl-preview-dot yellow" />
          <span className="tpl-preview-dot green" />
          <span className="tpl-preview-url">preview — {template.name}</span>
        </div>
        <div className="tpl-preview-bar-right">
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onSelect(template)}
          >
            <IconCheck size={13} /> Select This Template
          </button>
        </div>
      </div>

      {/* Info strip */}
      <div className="tpl-preview-note-strip">
        🎨 Live preview with sample data — your final website will use your own information.
      </div>

      {/* Body */}
      <div className="tpl-preview-body">
        {slug === 'portfolio' ? (
          <div className="tpl-preview-iframe">
            <PortfolioTemplate
              data={DUMMY_PORTFOLIO}
              website={{ name: 'John Doe' }}
            />
          </div>
        ) : slug === 'real-estate' || slug === 'realestate' ? (
          <div className="tpl-preview-iframe">
            <RealEstateTemplate
              data={DUMMY_REALESTATE}
              website={{ name: 'Skyline Realty' }}
            />
          </div>
        ) : slug === 'salon-spa' || slug === 'salon' || slug === 'spa' ? (
          <div className="tpl-preview-iframe">
            <SalonTemplate
              data={DUMMY_SALON}
              website={{ name: 'Glow Studio' }}
            />
          </div>
        ) : slug === 'photography' || slug === 'photo' ? (
          <div className="tpl-preview-iframe">
            <PhotographyTemplate
              data={DUMMY_PHOTOGRAPHY}
              website={{ name: 'Lens & Light Studio' }}
            />
          </div>
        ) : slug === 'education' || slug === 'course' || slug === 'it-courses' ? (
          <div className="tpl-preview-iframe">
            <EducationTemplate
              data={DUMMY_EDUCATION}
              website={{ name: 'CodeCraft Academy' }}
            />
          </div>
        ) : isMedical ? (
          <div className="tpl-preview-iframe">
            <MedicalTemplate
              data={DUMMY_MEDICAL}
              website={{ name: 'Sunrise Clinic' }}
            />
          </div>
        ) : isGym ? (
          <div className="tpl-preview-iframe">
            <GymTemplate data={DUMMY_GYM} website={{ name: 'Iron Empire' }} />
          </div>
        ) : (
          <div className="tpl-preview-fallback">
            <p className="muted">Preview not available for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}