import { useEffect, useRef, useState } from 'react'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFeatureSettings: "'cv02','cv03','cv04','cv11'",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const heading = {
  ...interStyle,
  fontWeight: 800,
  letterSpacing: '-0.03em',
}

const FAQS = [
  {
    num: '01',
    q: 'Do I need coding knowledge to build a website?',
    a: 'Not at all. NQube is a 100% no-code platform. Fill out a simple form, choose a template, and we handle the entire technical side for you — from design to hosting.',
  },
  {
    num: '02',
    q: 'How long does it take to launch my website?',
    a: 'Most websites go live within minutes. Choose your category, pick a template, add your details, complete the payment, and your site is published instantly on our global CDN.',
  },
  {
    num: '03',
    q: 'What categories of websites can I build?',
    a: 'We currently support Salon & Spa, Real Estate, Photography, Education, Medical, Gym & Fitness, and Portfolio. New categories are added regularly based on user demand.',
  },
  {
    num: '04',
    q: 'Can I update my website content later?',
    a: 'Yes. Every NQube website comes with a simple admin dashboard where you can edit supported fields like business description, phone number, services, images, and more — anytime.',
  },
  {
    num: '05',
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods — credit/debit cards, UPI, netbanking, and popular wallets. All payments are processed through secure encrypted gateways.',
  },
  {
    num: '06',
    q: 'Is my website mobile-friendly?',
    a: 'Every template is fully responsive and optimized for smartphones, tablets, and desktop computers. Your visitors get a smooth experience on any device.',
  },
  {
    num: '07',
    q: 'How much does it cost to build a website?',
    a: 'Our plans start at just ₹99. Choose from Basic, Pro, or Custom plans depending on your needs. All plans include lifetime hosting access with no hidden fees.',
  },
  {
    num: '08',
    q: 'Do you offer support if I get stuck?',
    a: "Yes. Our support team is available 24/7 to help you with any questions. Reach out via email or WhatsApp and we'll respond within hours.",
  },
]

export default function FAQSection() {
  const [visible, setVisible] = useState(false)
  const [openIdx, setOpenIdx] = useState(0)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = (idx) => {
    setOpenIdx((prev) => (prev === idx ? -1 : idx))
  }

  return (
    <section
      id="faq"
      ref={sectionRef}
      className={`faq ${visible ? 'is-visible' : ''}`}
      style={interStyle}
    >
      <div className="faq-wrap">

        {/* ============================================================
            HEADER — Editorial
            ============================================================ */}
        <header className="faq-head">
          <div className="faq-head-left">
            <span className="faq-eyebrow">FAQ</span>
            <h2 className="faq-title" style={heading}>
              Frequently asked<br />
              questions.
            </h2>
          </div>
          <div className="faq-head-right">
            <p className="faq-lead">
              Everything you need to know about NQube. Can't find what you're
              looking for? Our team is here to help.
            </p>
          </div>
        </header>

        {/* ============================================================
            FAQ LIST — Clean rows with dividers
            ============================================================ */}
        <div className="faq-list">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <article
                key={idx}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                style={{ '--d': `${0.03 + idx * 0.04}s` }}
              >
                <button
                  className="faq-question"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-num">{item.num}</span>

                  <span className="faq-q-text" style={heading}>
                    {item.q}
                  </span>

                  <span className="faq-q-toggle" aria-hidden="true">
                    <span className="faq-q-toggle-bar" />
                    <span className="faq-q-toggle-bar" />
                  </span>
                </button>

                <div className="faq-answer">
                  <div className="faq-answer-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* ============================================================
            FOOT NOTE
            ============================================================ */}
        <div className="faq-foot">
          <p className="faq-foot-text">
            Still have questions? <a href="#contact" className="faq-foot-link">Talk to our team →</a>
          </p>
        </div>

      </div>

      {/* ============================================================
          STYLES
          ============================================================ */}
      <style>{`
        /* ============ SECTION ============ */
        .faq {
          position: relative;
          padding: 120px 0;
          background: #ffffff;
          color: #0a0f1e;
        }

        .faq-wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* ============================================================
           HEADER — Editorial two-column
           ============================================================ */
        .faq-head {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: flex-end;
          padding-bottom: 56px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .faq.is-visible .faq-head {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-head-left { min-width: 0; }

        .faq-eyebrow {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.24em;
          color: #7c3aed;
          text-transform: uppercase;
          margin-bottom: 18px;
          position: relative;
          padding-left: 40px;
        }
        .faq-eyebrow::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 28px;
          height: 1.5px;
          background: #7c3aed;
          transform: translateY(-50%);
        }

        .faq-title {
          font-size: 54px;
          line-height: 1.05;
          color: #0a0f1e;
          margin: 0;
        }

        .faq-head-right {
          padding-bottom: 8px;
        }
        .faq-lead {
          font-size: 16px;
          line-height: 1.7;
          color: #64748b;
          margin: 0;
          font-weight: 500;
          max-width: 420px;
        }

        /* ============================================================
           FAQ LIST — Borderless rows
           ============================================================ */
        .faq-list {
          display: flex;
          flex-direction: column;
        }

        .faq-item {
          border-bottom: 1px solid #f1f5f9;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .faq.is-visible .faq-item {
          opacity: 1;
          transform: translateY(0);
          transition-delay: var(--d);
        }
        .faq-item:last-child {
          border-bottom: none;
        }

        /* Question row */
        .faq-question {
          display: grid;
          grid-template-columns: 60px 1fr 44px;
          gap: 24px;
          align-items: center;
          width: 100%;
          padding: 28px 0;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: all 0.25s ease;
        }
        .faq-question:hover {
          padding-left: 12px;
        }

        /* Number */
        .faq-q-num {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #cbd5e1;
          transition: color 0.3s ease;
        }
        .faq-item.is-open .faq-q-num {
          color: #7c3aed;
        }
        .faq-question:hover .faq-q-num {
          color: #7c3aed;
        }

        /* Question text */
        .faq-q-text {
          font-size: 19px;
          font-weight: 700;
          color: #0a0f1e;
          letter-spacing: -0.02em;
          line-height: 1.35;
          transition: color 0.3s ease;
        }
        .faq-item.is-open .faq-q-text {
          color: #7c3aed;
        }

        /* Toggle icon — plus/minus */
        .faq-q-toggle {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-q-toggle-bar {
          position: absolute;
          background: #64748b;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-q-toggle-bar:nth-child(1) {
          width: 12px;
          height: 2px;
        }
        .faq-q-toggle-bar:nth-child(2) {
          width: 2px;
          height: 12px;
        }

        .faq-item.is-open .faq-q-toggle {
          background: #7c3aed;
          border-color: #7c3aed;
          transform: rotate(180deg);
        }
        .faq-item.is-open .faq-q-toggle-bar {
          background: #ffffff;
        }
        .faq-item.is-open .faq-q-toggle-bar:nth-child(2) {
          transform: scaleY(0);
        }

        .faq-question:hover .faq-q-toggle {
          border-color: #c4b5fd;
          background: #f5f3ff;
        }
        .faq-question:hover .faq-q-toggle-bar {
          background: #7c3aed;
        }

        /* Answer */
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-item.is-open .faq-answer {
          max-height: 400px;
        }

        .faq-answer-inner {
          padding: 0 100px 32px 84px;
        }
        .faq-answer-inner p {
          margin: 0;
          font-size: 15px;
          line-height: 1.75;
          color: #64748b;
          font-weight: 500;
          max-width: 720px;
        }

        /* ============================================================
           FOOT NOTE
           ============================================================ */
        .faq-foot {
          text-align: center;
          padding-top: 64px;
          opacity: 0;
          transform: translateY(16px);
          transition: all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s;
        }
        .faq.is-visible .faq-foot {
          opacity: 1;
          transform: translateY(0);
        }

        .faq-foot-text {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }
        .faq-foot-link {
          color: #7c3aed;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease;
          margin-left: 4px;
        }
        .faq-foot-link:hover {
          color: #6d28d9;
          text-decoration: underline;
        }

        /* ============================================================
           TABLET
           ============================================================ */
        @media (max-width: 1024px) {
          .faq { padding: 96px 0; }
          .faq-wrap { padding: 0 32px; }
          .faq-title { font-size: 44px; }
          .faq-head {
            grid-template-columns: 1fr;
            gap: 24px;
            align-items: flex-start;
          }
          .faq-head-right { padding-bottom: 0; }
          .faq-lead { max-width: 100%; }

          .faq-question {
            grid-template-columns: 48px 1fr 40px;
            gap: 20px;
            padding: 24px 0;
          }
          .faq-q-text { font-size: 17px; }
          .faq-answer-inner { padding: 0 80px 28px 68px; }
        }

        /* ============================================================
           MOBILE
           ============================================================ */
        @media (max-width: 640px) {
          .faq { padding: 72px 0 80px; }
          .faq-wrap { padding: 0 20px; }

          .faq-head {
            padding-bottom: 40px;
            margin-bottom: 16px;
            gap: 20px;
          }
          .faq-eyebrow {
            font-size: 10.5px;
            letter-spacing: 0.2em;
            padding-left: 32px;
            margin-bottom: 14px;
          }
          .faq-eyebrow::before { width: 22px; }
          .faq-title { font-size: 30px; line-height: 1.12; }
          .faq-lead { font-size: 14.5px; line-height: 1.65; }

          /* Question row */
          .faq-question {
            grid-template-columns: 32px 1fr 32px;
            gap: 12px;
            padding: 20px 0;
          }
          .faq-question:hover { padding-left: 0; }
          .faq-q-num {
            font-size: 12px;
            letter-spacing: 0.06em;
          }
          .faq-q-text {
            font-size: 14.5px;
            line-height: 1.35;
          }
          .faq-q-toggle {
            width: 28px;
            height: 28px;
          }
          .faq-q-toggle-bar:nth-child(1) { width: 10px; }
          .faq-q-toggle-bar:nth-child(2) { height: 10px; }

          /* Answer */
          .faq-answer-inner {
            padding: 0 16px 24px 44px;
          }
          .faq-answer-inner p {
            font-size: 13.5px;
            line-height: 1.7;
          }

          /* Foot */
          .faq-foot { padding-top: 44px; }
          .faq-foot-text { font-size: 14px; }
        }

        @media (max-width: 380px) {
          .faq-title { font-size: 26px; }
          .faq-q-text { font-size: 13.5px; }
          .faq-answer-inner { padding-left: 40px; }
          .faq-answer-inner p { font-size: 13px; }
          .faq-foot-text { font-size: 13px; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .faq-head,
          .faq-item,
          .faq-answer,
          .faq-q-toggle,
          .faq-foot {
            transition: none !important;
          }
          .faq-head,
          .faq-item,
          .faq-foot {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}