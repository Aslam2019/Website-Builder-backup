import { useState, useEffect } from 'react'
import EducationTemplate from './EducationTemplate'

export default function App() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('./config.json')
      .then((r) => { if (!r.ok) throw new Error('Config not found'); return r.json() })
      .then((data) => { setConfig(data); setLoading(false) })
      .catch((err) => { console.error(err); setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc', color: '#333' }}>Loading...</div>
  if (error || !config) return <div style={{ padding: 40, textAlign: 'center' }}><h2>Error</h2><p>{error}</p></div>

  return <EducationTemplate data={config} />
}