import AboutSection from '../../components/public/AboutSection'
import WhyChooseUs from '../../components/public/WhyChooseUs'

export default function About() {
  return (
    <>
      <div className="section">
        <div className="container">
          <div className="section-head">
            <h2>About Us</h2>
            <p>We help people launch beautiful websites without writing a single line of code.</p>
          </div>
        </div>
      </div>
      <AboutSection />
      <WhyChooseUs />
    </>
  )
}