export default function SiteFooter({ ownerName = 'My Website' }) {
  const year = new Date().getFullYear()

  return (
    <footer className="gen-footer">
      <div className="gen-footer-inner">
        <div className="gen-footer-brand">
          <div className="gen-footer-name">{ownerName}</div>
          <div className="gen-footer-tag">Built with care · All rights reserved</div>
        </div>

        <div className="gen-footer-copy">
          © {year} All Rights Reserved{' '}
          <a
            href="https://qifawtechnologies.com/"
            target="_blank"
            rel="noreferrer"
            className="gen-footer-link"
          >
            Qifaw Technologies
          </a>
        </div>
      </div>
    </footer>
  )
}