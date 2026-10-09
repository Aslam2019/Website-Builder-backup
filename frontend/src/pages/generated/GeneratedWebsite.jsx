import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { websiteApi } from '../../api/websiteApi'
import Loader from '../../components/common/Loader'
import { UPLOADS_BASE } from '../../utils/constants'
import WhatsAppFloat from '../../components/generated/WhatsAppFloat'
import SiteFooter from '../../components/generated/SiteFooter'
import PortfolioTemplate from '../../components/generated/templates/PortfolioTemplate'
import RealEstateTemplate from '../../components/generated/templates/RealEstateTemplate'
import SalonTemplate from '../../components/generated/templates/SalonTemplate'
import PhotographyTemplate from '../../components/generated/templates/PhotographyTemplate'
import EducationTemplate from '../../components/generated/templates/EducationTemplate'
import MedicalTemplate from '../../components/generated/templates/MedicalTemplate'
import GymTemplate from '../../components/generated/templates/GymTemplate'

import '../../components/generated/templates/portfolio.css'
import '../../components/generated/templates/realestate.css'
import '../../components/generated/templates/salon.css'
import '../../components/generated/templates/photography.css'
import '../../components/generated/templates/education.css'
import '../../components/generated/templates/medical.css'
import '../../components/generated/templates/gym.css'

export default function GeneratedWebsite() {
  const { websiteId } = useParams()
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await websiteApi.get(websiteId)
        setWebsite(res.data?.data?.website)
      } finally { setLoading(false) }
    })()
  }, [websiteId])

  if (loading) return <Loader full />
  if (!website) return <div style={{ padding: 40, textAlign: 'center' }}>Website not found</div>

  const d = website.form_data || {}

  /* ---- Category detection ---- */
  const tplName = (website.template_name || '').toLowerCase()
  const catSlug = (website.category_slug || '').toLowerCase()

  const isPortfolio =
    catSlug === 'portfolio' || tplName.includes('portfolio')
  const isRealEstate =
    catSlug === 'real-estate' ||
    catSlug === 'realestate' ||
    tplName.includes('real estate')
  const isSalon =
    catSlug === 'salon-spa' ||
    catSlug === 'salon' ||
    catSlug === 'spa' ||
    tplName.includes('salon') ||
    tplName.includes('spa')
  const isPhotography =
    catSlug === 'photography' ||
    catSlug === 'photo' ||
    tplName.includes('photography') ||
    tplName.includes('photo')
  const isEducation =
    catSlug === 'education' ||
    catSlug === 'course' ||
    catSlug === 'it-courses' ||
    tplName.includes('education') ||
    tplName.includes('course')
  // ✅ UPDATED — medical-and-clinic slug also supported
  const isMedical =
    catSlug === 'medical' ||
    catSlug === 'clinic' ||
    catSlug === 'healthcare' ||
    catSlug === 'medical-and-clinic' ||
    catSlug.includes('medical') ||
    catSlug.includes('clinic') ||
    tplName.includes('medical') ||
    tplName.includes('clinic') ||
    tplName.includes('health')
  const isGym =
  catSlug === 'gym' || catSlug === 'fitness' || catSlug === 'gym-fitness' ||
  catSlug.includes('gym') || catSlug.includes('fitness') ||
  tplName.includes('gym') || tplName.includes('fitness')

  /* ---- Portfolio → Animated template ---- */
  if (isPortfolio) {
    return (
      <>
        <PortfolioTemplate data={d} website={website} />
        <WhatsAppFloat number={d.whatsapp} name={d.full_name || 'me'} />
      </>
    )
  }

  /* ---- Real Estate → Animated template ---- */
  if (isRealEstate) {
    return (
      <>
        <RealEstateTemplate data={d} website={website} />
        <WhatsAppFloat number={d.whatsapp} name={d.company_name || 'us'} />
      </>
    )
  }

  /* ---- Salon & Spa → Animated template ---- */
  if (isSalon) {
    return (
      <>
        <SalonTemplate data={d} website={website} />
        <WhatsAppFloat number={d.whatsapp} name={d.salon_name || 'us'} />
      </>
    )
  }

  /* ---- Photography → Cinematic dark template ---- */
  if (isPhotography) {
    return (
      <>
        <PhotographyTemplate data={d} website={website} />
        <WhatsAppFloat
          number={d.whatsapp}
          name={d.studio_name || d.photographer_name || 'us'}
        />
      </>
    )
  }

  /* ---- Education → Animated template ---- */
  if (isEducation) {
    return (
      <>
        <EducationTemplate data={d} website={website} />
        <WhatsAppFloat number={d.whatsapp} name={d.institute_name || 'us'} />
      </>
    )
  }

  /* ---- Medical → Clinic template ---- */
  if (isMedical) {
    return (
      <>
        <MedicalTemplate data={d} website={website} />
        <WhatsAppFloat number={d.whatsapp} name={d.clinic_name || 'us'} />
      </>
    )
  }
  if (isGym) {
  return (
    <>
      <GymTemplate data={d} website={website} />
      <WhatsAppFloat number={d.whatsapp} name={d.gym_name || 'us'} />
    </>
  )
}

  /* ---- Other categories → simple fallback layout ---- */
  const ownerName =
    d.full_name || d.company_name || d.salon_name ||
    d.photographer_name || d.studio_name || d.institute_name ||
    d.clinic_name || website.name || 'My Website'

  return (
    <div className="generated-site">
      <div className="gen-container">
        <header className="gen-hero">
          {d.profile_image && (
            <img src={`${UPLOADS_BASE}${d.profile_image}`} alt="" className="gen-avatar" />
          )}
          {d.logo && (
            <img src={`${UPLOADS_BASE}${d.logo}`} alt="" className="gen-logo" />
          )}
          <h1 className="gen-title">{ownerName}</h1>
          {d.title && <p className="gen-subtitle">{d.title}</p>}
          {d.location && <p className="gen-meta">📍 {d.location}</p>}
        </header>

        {d.about && (
          <section className="gen-section">
            <h2>About</h2>
            <p className="gen-para">{d.about}</p>
          </section>
        )}

        {Array.isArray(d.services) && d.services.length > 0 && (
          <section className="gen-section">
            <h2>Services</h2>
            <div className="gen-services">
              {d.services.map((s, i) => (
                <div key={i} className="gen-service-row">
                  <div>
                    <strong>{s.name}</strong>
                    {s.duration && <span className="muted"> · {s.duration}</span>}
                  </div>
                  {s.price && <strong className="gen-price-sm">{s.price}</strong>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <WhatsAppFloat number={d.whatsapp} name={ownerName} />
      <SiteFooter ownerName={ownerName} />
    </div>
  )
}