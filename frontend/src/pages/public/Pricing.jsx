import PricingSection from '../../components/public/PricingSection'

export default function PricingPage() {
  return (
    <>
      <div className="section">
        <div className="container">
          <div className="section-head">
            <h2>Pricing Plans</h2>
            <p>Transparent pricing. No hidden fees. Cancel anytime.</p>
          </div>
        </div>
      </div>
      <PricingSection />
    </>
  )
}