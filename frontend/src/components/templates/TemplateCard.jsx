import { useRef, useState, useEffect } from 'react'
import { IconEye, IconCheck } from '../dashboard/Icons'
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

const MINI_WIDTH = 1400
const MINI_RATIO = 16 / 10

export default function TemplateCard({ template, selected, onPreview, onSelect }) {
  const thumbRef = useRef(null)
  const [scale, setScale] = useState(0.25)

  useEffect(() => {
    const update = () => {
      if (thumbRef.current) {
        const w = thumbRef.current.offsetWidth
        setScale(w / MINI_WIDTH)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const slug = (template.category?.slug || '').toLowerCase()

  const renderMiniTemplate = () => {
    if (slug === 'portfolio') {
      return <PortfolioTemplate data={DUMMY_PORTFOLIO} website={{ name: 'John Doe' }} />
    }
    if (slug === 'real-estate' || slug === 'realestate') {
      return <RealEstateTemplate data={DUMMY_REALESTATE} website={{ name: 'Skyline Realty' }} />
    }
    if (slug === 'salon-spa' || slug === 'salon' || slug === 'spa') {
      return <SalonTemplate data={DUMMY_SALON} website={{ name: 'Glow Studio' }} />
    }
    if (slug === 'photography' || slug === 'photo') {
      return <PhotographyTemplate data={DUMMY_PHOTOGRAPHY} website={{ name: 'Lens & Light Studio' }} />
    }
    if (slug === 'education' || slug === 'course' || slug === 'it-courses') {
      return <EducationTemplate data={DUMMY_EDUCATION} website={{ name: 'CodeCraft Academy' }} />
    }
    // ✅ Medical slug — medical-and-clinic support
    if (
      slug === 'medical' ||
      slug === 'clinic' ||
      slug === 'healthcare' ||
      slug === 'medical-and-clinic' ||
      slug.includes('medical') ||
      slug.includes('clinic')
    ) {
      return <MedicalTemplate data={DUMMY_MEDICAL} website={{ name: 'Sunrise Clinic' }} />
    }
    if (slug === 'gym' || slug === 'fitness' || slug.includes('gym')) {
  return <GymTemplate data={DUMMY_GYM} website={{ name: 'Iron Empire' }} />
}
    return null

  }

  return (
    <div className={`tpl-card ${selected ? 'selected' : ''}`}>
      {/* Live mini preview */}
      <div className="tpl-thumb-live" ref={thumbRef}>
        <div
          className="tpl-thumb-live-inner"
          style={{
            transform: `scale(${scale})`,
            width: `${MINI_WIDTH}px`,
            height: `${MINI_WIDTH / MINI_RATIO}px`,
          }}
        >
          {renderMiniTemplate()}
        </div>

        {/* Hover overlay with preview button */}
        <div className="tpl-thumb-live-overlay">
          <button
            className="btn btn-primary btn-sm tpl-thumb-preview-btn"
            onClick={() => onPreview(template)}
          >
            <IconEye size={14} /> View Full Preview
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="tpl-body">
        <h4 className="tpl-name">{template.name}</h4>
        <p className="tpl-cat">{template.category?.name || '—'}</p>
        <div className="tpl-actions">
          <button className="btn btn-outline btn-sm" onClick={() => onPreview(template)}>
            <IconEye size={14} /> Preview
          </button>
          <button
            className={`btn btn-sm ${selected ? 'btn-success' : 'btn-primary'}`}
            onClick={() => onSelect(template)}
          >
            {selected ? <><IconCheck size={14} /> Selected</> : 'Select'}
          </button>
        </div>
      </div>
    </div>
  )
}