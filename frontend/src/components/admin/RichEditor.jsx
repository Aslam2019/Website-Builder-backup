import { useRef, useEffect } from 'react'

export default function RichEditor({ value, onChange, placeholder }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || ''
    }
  }, [value])

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val)
    ref.current?.focus()
    onChange(ref.current.innerHTML)
  }

  const handleInput = () => onChange(ref.current.innerHTML)

  return (
    <div className="rte">
      {/* Toolbar */}
      <div className="rte-toolbar">
        {/* Text styles */}
        <button type="button" className="rte-btn" onClick={() => exec('bold')} title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('italic')} title="Italic">
          <em>I</em>
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('underline')} title="Underline">
          <u>U</u>
        </button>
        <button
          type="button"
          className="rte-btn"
          onClick={() => exec('strikeThrough')}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        <span className="rte-sep" />

        {/* Headings */}
        <button type="button" className="rte-btn" onClick={() => exec('formatBlock', 'H1')} title="Heading 1">
          H1
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('formatBlock', 'H2')} title="Heading 2">
          H2
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('formatBlock', 'H3')} title="Heading 3">
          H3
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('formatBlock', 'P')} title="Paragraph">
          P
        </button>

        <span className="rte-sep" />

        {/* Alignment */}
        <button type="button" className="rte-btn" onClick={() => exec('justifyLeft')} title="Align Left">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('justifyCenter')} title="Align Center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('justifyRight')} title="Align Right">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="6" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('justifyFull')} title="Justify">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <span className="rte-sep" />

        {/* Lists */}
        <button type="button" className="rte-btn" onClick={() => exec('insertUnorderedList')} title="Bullet List">
          •
        </button>
        <button type="button" className="rte-btn" onClick={() => exec('insertOrderedList')} title="Numbered List">
          1.
        </button>

        <span className="rte-sep" />

        {/* Link */}
        <button
          type="button"
          className="rte-btn"
          onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) exec('createLink', url)
          }}
          title="Insert Link"
        >
          🔗
        </button>

        {/* Clear formatting */}
        <button type="button" className="rte-btn" onClick={() => exec('removeFormat')} title="Clear Formatting">
          ✕
        </button>
      </div>

      {/* Editor */}
      <div
        ref={ref}
        className="rte-body"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder || 'Start typing...'}
      />

      <style>{`
        .rte {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
        }

        /* Toolbar */
        .rte-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          padding: 8px;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
        }
        .rte-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 8px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .rte-btn:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
          color: #4f46e5;
        }
        .rte-btn:active {
          transform: scale(0.96);
        }
        .rte-sep {
          width: 1px;
          height: 22px;
          background: #e5e7eb;
          margin: 0 4px;
        }

        /* Body */
        .rte-body {
          min-height: 320px;
          max-height: 520px;
          overflow-y: auto;
          padding: 20px;
          font-size: 15px;
          line-height: 1.75;
          color: #1f2937;
          outline: none;
          font-family: inherit;
        }
        .rte-body:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }

        /* Content styles (matches Terms page) */
        .rte-body h1 {
          font-size: 28px;
          font-weight: 800;
          margin: 20px 0 12px;
          color: #0f172a;
          line-height: 1.3;
        }
        .rte-body h2 {
          font-size: 22px;
          font-weight: 700;
          margin: 18px 0 10px;
          color: #0f172a;
          line-height: 1.3;
        }
        .rte-body h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 14px 0 8px;
          color: #0f172a;
        }
        .rte-body p {
          margin: 0 0 12px;
        }
        .rte-body ul,
        .rte-body ol {
          padding-left: 24px;
          margin: 0 0 12px;
        }
        .rte-body li {
          margin-bottom: 6px;
        }
        .rte-body a {
          color: #4f46e5;
          text-decoration: underline;
        }
        .rte-body strong { font-weight: 700; }
        .rte-body em { font-style: italic; }
        .rte-body u { text-decoration: underline; }
        .rte-body s { text-decoration: line-through; }
        .rte-body blockquote {
          border-left: 3px solid #4f46e5;
          padding-left: 14px;
          margin: 14px 0;
          color: #64748b;
          font-style: italic;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .rte-toolbar { padding: 6px; gap: 2px; }
          .rte-btn {
            min-width: 30px;
            height: 30px;
            padding: 0 6px;
            font-size: 12px;
          }
          .rte-sep { margin: 0 2px; }
          .rte-body {
            padding: 14px;
            font-size: 14px;
            min-height: 220px;
          }
          .rte-body h1 { font-size: 22px; }
          .rte-body h2 { font-size: 18px; }
          .rte-body h3 { font-size: 16px; }
        }
      `}</style>
    </div>
  )
}