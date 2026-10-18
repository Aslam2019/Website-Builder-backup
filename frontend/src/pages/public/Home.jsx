import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../../components/public/Hero'
import AboutSection from '../../components/public/AboutSection'
import HowItWorks from '../../components/public/HowItWorks'
import WhyChooseUs from '../../components/public/WhyChooseUs'
import PricingSection from '../../components/public/PricingSection'
import FAQSection from '../../components/public/FAQSection'
import ContactSection from '../../components/public/ContactSection'
import CategoriesSection from '../../components/public/CategoriesSection'

export default function Home() {
  const location = useLocation()

  /* ✅ Handle scroll when coming from another page */
  useEffect(() => {
    const scrollToId = location.state?.scrollTo
    if (!scrollToId) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    setTimeout(() => {
      const el = document.getElementById(scrollToId)
      if (el) {
        const NAVBAR_HEIGHT = 70
        const top = el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 100)
  }, [location.state])

  return (
    <div style={{ background: '#07051a', minHeight: '100vh', overflowX: 'hidden' }}>
      <Hero />
      <AboutSection />
      <HowItWorks />
      <WhyChooseUs />

      {/* ✅ Categories Section */}
      <CategoriesSection />

      <PricingSection />
      <FAQSection />
      <ContactSection />
      <div style={{ height: '80px' }} aria-hidden="true" />
    </div>
  )
}