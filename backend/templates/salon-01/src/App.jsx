import { useState, useEffect } from 'react'
import SalonTemplate from './SalonTemplate'

export default function App() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('./config.json')
      .then((r) => {
        if (!r.ok) throw new Error('Config not found')
        return r.json()
      })
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Config load failed:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0b0a1f',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div style={{
        padding: 40,
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h2>Configuration error</h2>
        <p>{error}</p>
      </div>
    )
  }

  return <SalonTemplate data={config} />
}