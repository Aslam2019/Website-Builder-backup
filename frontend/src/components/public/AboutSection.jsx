export default function AboutSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>What is Website Builder?</h2>
          <p>
            Website Builder is a no-code SaaS platform that helps individuals and businesses
            launch a professional website without writing a single line of code.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature">
            <div className="icon">🎨</div>
            <h3>Pick a Category</h3>
            <p>Portfolio, Real Estate, Salon, Photography — and more categories added regularly.</p>
          </div>
          <div className="feature">
            <div className="icon">🖼️</div>
            <h3>Choose a Template</h3>
            <p>Curated templates designed for your industry — fully responsive and modern.</p>
          </div>
          <div className="feature">
            <div className="icon">⚡</div>
            <h3>Get It Live</h3>
            <p>Fill a short form, select your plan, complete payment and your website is live instantly.</p>
          </div>
        </div>
      </div>
    </section>
  )
}