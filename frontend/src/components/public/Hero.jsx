import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <h1>Build your <span>professional website</span> in minutes</h1>
          <p className="lead">
            No code, no designers, no waiting. Choose a template, fill your details,
            pick a plan — and your website is live.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">Start Building</Link>
            <Link to="/pricing" className="btn btn-outline btn-lg">View Pricing</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="bar primary" />
          <div className="bar" />
          <div className="bar short" />
          <div className="mock">YOUR WEBSITE</div>
        </div>
      </div>
    </section>
  )
}