const steps = [
  ['Register', 'Create your account in seconds.'],
  ['Select Category', 'Choose your business type.'],
  ['Choose Template', 'Pick a design you love.'],
  ['Fill Details', 'Enter your content.'],
  ['Select Plan', 'Basic, Pro or Custom.'],
  ['Complete Payment', 'Secure checkout.'],
  ['Get Website', 'Your site is live!'],
]

export default function HowItWorks() {
  return (
    <section className="section soft">
      <div className="container">
        <div className="section-head">
          <h2>How It Works</h2>
          <p>Seven simple steps from idea to a live website.</p>
        </div>
        <div className="steps">
          {steps.map(([title, desc], i) => (
            <div className="step" key={title}>
              <div className="num">{i + 1}</div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}