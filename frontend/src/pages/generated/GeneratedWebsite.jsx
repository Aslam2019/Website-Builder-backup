import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { websiteApi } from '../../api/websiteApi'
import axiosClient from '../../api/axiosClient'
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

  // Plan feature flags
  const [planFeatures, setPlanFeatures] = useState({
    whatsapp_button: false,
    qr_code: false,
    ads_enabled: false,
  })

  /* Fetch website */
  useEffect(() => {
    (async () => {
      try {
        const res = await websiteApi.get(websiteId)
        setWebsite(res.data?.data?.website)
      } finally {
        setLoading(false)
      }
    })()
  }, [websiteId])

  /* Fetch plan features */
  useEffect(() => {
    if (!website) return

    const planId =
      website.pricing_plan_id ||
      website.plan_id ||
      website.plan?.id ||
      website.plan?._id

    if (!planId) {
      setPlanFeatures({ whatsapp_button: false, qr_code: false, ads_enabled: false })
      return
    }

    let alive = true
    ;(async () => {
      try {
        const res = await axiosClient.get(`/pricing/${planId}`)
        const plan = res?.data?.data?.plan || res?.data?.plan
        const flags = plan?.feature_flags || {}

        if (alive) {
          setPlanFeatures({
            whatsapp_button: !!flags.whatsapp_button,
            qr_code: !!flags.qr_code,
            ads_enabled: !!flags.ads_enabled,
          })
        }
      } catch (e) {
        if (alive) setPlanFeatures({ whatsapp_button: false, qr_code: false, ads_enabled: false })
      }
    })()

    return () => { alive = false }
  }, [website])

  if (loading) return <Loader full />
  if (!website) return <div style={{ padding: 40, textAlign: 'center' }}>Website not found</div>

  const d = website.form_data || {}

  // Show WhatsApp only if plan allows
  const showWhatsapp = planFeatures.whatsapp_button === true && !!d.whatsapp

  // ✅ Show ads only if plan allows
  const showAds = planFeatures.ads_enabled === true

  // ✅ Plan name for banner targeting
  const planName =
    website.plan_name ||
    website.plan?.name ||
    'Basic'

  /* ---- Category detection ---- */
  const tplName = (website.template_name || '').toLowerCase()
  const catSlug = (website.category_slug || '').toLowerCase()

  const isPortfolio = catSlug === 'portfolio' || tplName.includes('portfolio')
  const isRealEstate =
    catSlug === 'real-estate' || catSlug === 'realestate' || tplName.includes('real estate')
  const isSalon =
    catSlug === 'salon-spa' || catSlug === 'salon' || catSlug === 'spa' ||
    tplName.includes('salon') || tplName.includes('spa')
  const isPhotography =
    catSlug === 'photography' || catSlug === 'photo' ||
    tplName.includes('photography') || tplName.includes('photo')
  const isEducation =
    catSlug === 'education' || catSlug === 'course' || catSlug === 'it-courses' ||
    tplName.includes('education') || tplName.includes('course')
  const isMedical =
    catSlug === 'medical' || catSlug === 'clinic' || catSlug === 'healthcare' ||
    catSlug === 'medical-and-clinic' ||
    catSlug.includes('medical') || catSlug.includes('clinic') ||
    tplName.includes('medical') || tplName.includes('clinic') || tplName.includes('health')
  const isGym =
    catSlug === 'gym' || catSlug === 'fitness' || catSlug === 'gym-fitness' ||
    catSlug.includes('gym') || catSlug.includes('fitness') ||
    tplName.includes('gym') || tplName.includes('fitness')

  /* Helper — render all banners for a page */
  const renderBanners = () => {
    if (!showAds) return null
    return (
      <>
        <AdBanner planName={planName} position="top" />
        <AdBanner planName={planName} position="bottom" />
        <AdBanner planName={planName} position="floating" />
      </>
    )
  }

  /* ---- Portfolio ---- */
  if (isPortfolio) {
    return (
      <>
        {renderBanners()}
        <PortfolioTemplate data={d} website={website} />
        {showWhatsapp && (
          <WhatsAppFloat number={d.whatsapp} name={d.full_name || 'me'} />
        )}
      </>
    )
  }

  /* ---- Real Estate ---- */
  if (isRealEstate) {
    return (
      <>
        {renderBanners()}
        <RealEstateTemplate data={d} website={website} />
        {showWhatsapp && (
          <WhatsAppFloat number={d.whatsapp} name={d.company_name || 'us'} />
        )}
      </>
    )
  }

  /* ---- Salon & Spa ---- */
  if (isSalon) {
    return (
      <>
        {renderBanners()}
        <SalonTemplate data={d} website={website} />
        {showWhatsapp && (
          <WhatsAppFloat number={d.whatsapp} name={d.salon_name || 'us'} />
        )}
      </>
    )
  }

  /* ---- Photography ---- */
  if (isPhotography) {
    return (
      <>
        {renderBanners()}
        <PhotographyTemplate data={d} website={website} />
        {showWhatsapp && (
          <WhatsAppFloat
            number={d.whatsapp}
            name={d.studio_name || d.photographer_name || 'us'}
          />
        )}
      </>
    )
  }

  /* ---- Education ---- */
  if (isEducation) {
    return (
      <>
        {renderBanners()}
        <EducationTemplate data={d} website={website} />
        {showWhatsapp && (
          <WhatsAppFloat number={d.whatsapp} name={d.institute_name || 'us'} />
        )}
      </>
    )
  }

  /* ---- Medical ---- */
  if (isMedical) {
    return (
      <>
        {renderBanners()}
        <MedicalTemplate data={d} website={website} />
        {showWhatsapp && (
          <WhatsAppFloat number={d.whatsapp} name={d.clinic_name || 'us'} />
        )}
      </>
    )
  }

  /* ---- Gym ---- */
  if (isGym) {
    return (
      <>
        {renderBanners()}
        <GymTemplate data={d} website={website} />
        {showWhatsapp && (
          <WhatsAppFloat number={d.whatsapp} name={d.gym_name || 'us'} />
        )}
      </>
    )
  }

  /* ---- Fallback ---- */
  const ownerName =
    d.full_name || d.company_name || d.salon_name ||
    d.photographer_name || d.studio_name || d.institute_name ||
    d.clinic_name || website.name || 'My Website'

  return (
    <div className="generated-site">
      {renderBanners()}
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

      {showWhatsapp && <WhatsAppFloat number={d.whatsapp} name={ownerName} />}
      <SiteFooter ownerName={ownerName} />
    </div>
  )
}