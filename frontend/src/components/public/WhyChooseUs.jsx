const items = [
  ['🚀', 'No Coding Required', 'Everything is drag-fill. No developer needed.'],
  ['💎', 'Professional Templates', 'Designs crafted by UI/UX experts.'],
  ['⚡', 'Fast Website Creation', 'Live within minutes of signup.'],
  ['📱', 'Mobile Responsive', 'Looks great on phone, tablet and desktop.'],
  ['🧰', 'Easy Management', 'Edit content anytime from your dashboard.'],
  ['💰', 'Affordable Pricing', 'Plans for every budget — no hidden fees.'],
]

export default function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Why Choose Us</h2>
          <p>Everything you need to launch and grow your online presence.</p>
        </div>
        <div className="feature-grid">
          {items.map(([icon, title, desc]) => (
            <div className="feature" key={title}>
              <div className="icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}