import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">Website<span>Builder</span></div>
          <p className="muted" style={{ marginTop: 12, fontSize: 14 }}>
            Create a professional website in minutes — no code, no hassle.
          </p>
        </div>

        <div>
          <h4 className="footer-h">Product</h4>
          <ul className="footer-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/why-choose-us">Why Choose Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-h">Company</h4>
          <ul className="footer-list">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-h">Account</h4>
          <ul className="footer-list">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container" style={{ textAlign: 'center', fontSize: 13 }}>
          © {new Date().getFullYear()} Website Builder. All rights reserved.
        </div>
      </div>
    </footer>
  )
}