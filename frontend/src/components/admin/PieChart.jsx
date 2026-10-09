/* ============================================================
   PIE CHART — Animated Donut Chart (SVG, no deps)
   ============================================================ */
import { useEffect, useRef, useState } from 'react'

const PALETTE = [
  '#6366f1', // indigo
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#84cc16', // lime
]

export default function PieChart({
  title,
  subtitle,
  data = [],
  size = 200,
  thickness = 30,
  centerLabel = 'Total',
  emptyText = 'No data yet',
}) {
  const [hovered, setHovered] = useState(null)
  const [progress, setProgress] = useState(0)
  const [animatedTotal, setAnimatedTotal] = useState(0)
  const wrapRef = useRef(null)
  const [visible, setVisible] = useState(false)

  // Filter zero values + compute totals
  const items = data.filter((d) => d.value > 0)
  const sum = items.reduce((s, d) => s + d.value, 0)
  const hasData = sum > 0

  // ---------- Trigger animations when in view ----------
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // ---------- Animate chart draw-in ----------
  useEffect(() => {
    if (!visible || !hasData) return
    let raf
    const start = performance.now()
    const duration = 1100
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setProgress(eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, hasData])

  // ---------- Animate center number count-up ----------
  useEffect(() => {
    if (!visible || !hasData) return
    let raf
    const start = performance.now()
    const duration = 900
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setAnimatedTotal(Math.floor(eased * sum))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setAnimatedTotal(sum)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, hasData, sum])

  // ---------- Geometry ----------
  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness - 8) / 2
  const circumference = 2 * Math.PI * r

  let offset = 0
  const segments = items.map((d) => {
    const pct = d.value / sum
    const length = pct * circumference
    const seg = { ...d, length, offset, pct }
    offset += length
    return seg
  })

  return (
    <div className="pie-chart-card" ref={wrapRef}>
      <div className="pie-chart-head">
        <div>
          <h3 className="pie-chart-title">{title}</h3>
          {subtitle && <p className="pie-chart-sub">{subtitle}</p>}
        </div>
      </div>

      {!hasData ? (
        <div className="pie-chart-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 0 0 18" />
          </svg>
          <span>{emptyText}</span>
        </div>
      ) : (
        <div className="pie-chart-body">
          {/* ---- Donut visual ---- */}
          <div className="pie-chart-visual" style={{ width: size, height: size }}>
            {/* Soft rotating glow ring behind */}
            <div className="pie-chart-glow" aria-hidden="true" />

            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <defs>
                <filter id="pieGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Track */}
              <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke="#eef2f7"
                strokeWidth={thickness}
              />

              {/* Animated segments */}
              {segments.map((s, i) => {
                const color = s.color || PALETTE[i % PALETTE.length]
                const isHovered = hovered === i
                const drawnLength = s.length * progress
                const segThickness = isHovered ? thickness + 6 : thickness
                return (
                  <circle
                    key={i}
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={segThickness}
                    strokeLinecap="butt"
                    strokeDasharray={`${drawnLength} ${circumference - drawnLength}`}
                    strokeDashoffset={-s.offset * progress}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    className="pie-chart-segment"
                    style={{
                      opacity: hovered === null || isHovered ? 1 : 0.35,
                      transition: 'stroke-width 0.3s ease, opacity 0.3s ease',
                    }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <title>{`${s.label}: ${s.value} (${Math.round(s.pct * 100)}%)`}</title>
                  </circle>
                )
              })}
            </svg>

            {/* Center content */}
            <div className="pie-chart-center">
              <div className="pie-chart-total">
                {hovered !== null ? items[hovered].value : animatedTotal}
              </div>
              <div className="pie-chart-total-label">
                {hovered !== null
                  ? items[hovered].label.toUpperCase().slice(0, 12)
                  : centerLabel}
              </div>
            </div>
          </div>

          {/* ---- Legend ---- */}
          <ul className="pie-chart-legend">
            {items.map((d, i) => {
              const color = d.color || PALETTE[i % PALETTE.length]
              const pct = Math.round((d.value / sum) * 100)
              const isHovered = hovered === i
              return (
                <li
                  key={i}
                  className={`pie-legend-item ${isHovered ? 'is-hovered' : ''}`}
                  style={{ animationDelay: `${200 + i * 70}ms` }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span
                    className="pie-legend-dot"
                    style={{
                      background: color,
                      boxShadow: isHovered ? `0 0 12px ${color}` : 'none',
                    }}
                  />
                  <span className="pie-legend-label" title={d.label}>
                    {d.label}
                  </span>
                  <span className="pie-legend-value">{d.value}</span>
                  <span
                    className="pie-legend-pct"
                    style={{
                      background: isHovered ? color : undefined,
                      color: isHovered ? '#ffffff' : undefined,
                    }}
                  >
                    {pct}%
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}