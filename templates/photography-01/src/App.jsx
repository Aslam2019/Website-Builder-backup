import { useEffect, useState } from 'react'
import PhotographyTemplate from './PhotographyTemplate'

export default function App() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    // ✅ 1. Jinja2 la irundhu vara data ah direct ah use pandrom
    if (typeof window !== 'undefined' && window.__SITE_DATA__) {
      setConfig(window.__SITE_DATA__)
    } else {
      // ✅ 2. Local development ku mattum config.json fetch pandrom
      fetch('/config.json')
        .then(res => res.json())
        .then(data => setConfig(data))
        .catch(err => console.error("Config load failed:", err))
    }
  }, [])

  if (!config) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', background: '#111' }}>
        Loading...
      </div>
    )
  }

  return <PhotographyTemplate data={config} />
}
