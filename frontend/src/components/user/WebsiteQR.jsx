import { QRCodeCanvas } from 'qrcode.react'
import { useRef } from 'react'

const interStyle = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  WebkitFontSmoothing: 'antialiased',
}

export default function WebsiteQR({ url, siteName = 'My Website', size = 200 }) {
  const wrapRef = useRef(null)

  // ─── No URL yet ───
  if (!url) {
    return (
      <div className="qr-empty" style={interStyle}>
        <div className="qr-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <path d="M14 14h3v3M21 14v3M14 21h3M21 21h-3" />
          </svg>
        </div>
        <h4>No QR yet</h4>
        <p>Publish your website to generate a QR code</p>
      </div>
    )
  }

  // ─── Download QR as PNG ───
  const handleDownload = () => {
    const canvas = wrapRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${(siteName || 'website').toLowerCase().replace(/\s+/g, '-')}-qr.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="qr-card" style={interStyle}>
      {/* Header */}
      <div className="qr-head">
        <div>
          <div className="qr-label">Live Website QR</div>
          <div className="qr-title">{siteName}</div>
        </div>
        <div className="qr-live-dot" title="Live">
          <span />
        </div>
      </div>

      {/* QR Canvas */}
      <div className="qr-canvas-wrap" ref={wrapRef}>
        <QRCodeCanvas
          value={url}
          size={size}
          level="H"
          includeMargin
          bgColor="#ffffff"
          fgColor="#0b0a1f"
        />
      </div>

      {/* URL */}
      <div className="qr-url" title={url}>{url}</div>

      {/* Actions */}
      <div className="qr-actions">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="qr-btn qr-btn-primary"
        >
          Open
        </a>
        <button type="button" className="qr-btn" onClick={handleDownload}>
          Download
        </button>
      </div>

      {/* Styles */}
      <style>{`
        .qr-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 4px 20px -10px rgba(15,23,42,0.08);
          max-width: 320px;
        }
        .qr-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .qr-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7c3aed;
          margin-bottom: 3px;
        }
        .qr-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
          word-break: break-word;
        }
        .qr-live-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px; height: 26px;
          background: rgba(16,185,129,0.1);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .qr-live-dot span {
          width: 8px; height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(16,185,129,0.8);
          animation: qrPulse 2s ease-in-out infinite;
        }
        @keyframes qrPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }
        .qr-canvas-wrap {
          display: flex;
          justify-content: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px dashed #e2e8f0;
        }
        .qr-canvas-wrap canvas { display: block; border-radius: 6px; }
        .qr-url {
          font-size: 12px;
          font-family: 'SF Mono', Menlo, Consolas, monospace;
          color: #64748b;
          background: #f1f5f9;
          padding: 8px 12px;
          border-radius: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
        .qr-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .qr-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 12px;
          font-size: 12.5px;
          font-weight: 700;
          border-radius: 9px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #334155;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.18s ease;
          font-family: inherit;
        }
        .qr-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .qr-btn-primary {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 8px 20px -8px rgba(124,58,237,0.6);
        }
        .qr-btn-primary:hover {
          background: linear-gradient(135deg, #6d28d9, #9333ea);
        }
        .qr-empty {
          background: #fff;
          border: 1.5px dashed #e2e8f0;
          border-radius: 16px;
          padding: 40px 22px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          max-width: 320px;
        }
        .qr-empty-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: #f1f5f9;
          color: #94a3b8;
          display: flex; align-items: center; justify-content: center;
        }
        .qr-empty h4 {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .qr-empty p {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </div>
  )
}