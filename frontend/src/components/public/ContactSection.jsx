import { useState } from 'react'
import { useNotify } from '../../context/NotificationContext'
import { isEmail } from '../../utils/validators'

export default function ContactSection() {
  const notify = useNotify()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Name is required'
    if (!form.email.trim()) err.email = 'Email is required'
    else if (!isEmail(form.email)) err.email = 'Invalid email'
    if (!form.message.trim() || form.message.trim().length < 10)
      err.message = 'Message must be at least 10 characters'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      notify.success('Message sent! We will get back to you soon.')
      setForm({ name: '', email: '', message: '' })
    }, 600)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Get in Touch</h2>
          <p>Have questions? We'd love to hear from you.</p>
        </div>
        <div className="contact-grid">
          <div>
            <div className="feature" style={{ marginBottom: 16 }}>
              <div className="icon">📧</div>
              <h3>Email</h3>
              <p>support@websitebuilder.com</p>
            </div>
            <div className="feature" style={{ marginBottom: 16 }}>
              <div className="icon">📞</div>
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
            <div className="feature">
              <div className="icon">📍</div>
              <h3>Address</h3>
              <p>Chennai, Tamil Nadu, India</p>
            </div>
          </div>

          <form className="card" onSubmit={submit} noValidate>
            <div className="form-group">
              <label className="form-label">Name <span className="req">*</span></label>
              <input name="name" className={`form-control ${errors.name ? 'error' : ''}`}
                value={form.name} onChange={change} placeholder="Your name" />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email <span className="req">*</span></label>
              <input name="email" type="email" className={`form-control ${errors.email ? 'error' : ''}`}
                value={form.email} onChange={change} placeholder="you@example.com" />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Message <span className="req">*</span></label>
              <textarea name="message" rows={5} className={`form-control ${errors.message ? 'error' : ''}`}
                value={form.message} onChange={change} placeholder="How can we help?" />
              {errors.message && <div className="form-error">{errors.message}</div>}
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}