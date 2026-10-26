import { useEffect, useState } from 'react'
import SalonTemplate from './SalonTemplate'

const getImgUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') return path;
  
  // 1. Already full URL ah irundha (https://...), adha appadiye return pannu
  if (path.startsWith('http')) return path;
  
  const base = (window.__UPLOADS_BASE__ || "https://d24e11dzjriy3b.cloudfront.net").replace(/\/$/, ''); 
  
  // 2. Path la /uploads/ irundha, base kooda sethu return pannu
  if (path.startsWith('/uploads/')) return `${base}${path}`;
  if (path.startsWith('uploads/')) return `${base}/${path}`;
  
  // 3. Vera path irundha, /uploads/ sethu return pannu
  if (path.startsWith('/')) return `${base}/uploads${path}`;
  
  // 4. Filename mattum irundha
  return `${base}/uploads/${path}`;
};








export default function App() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__SITE_DATA__) {
      setConfig(window.__SITE_DATA__)
    } else {
      setConfig({})
    }
  }, [])

  if (!config) return <div style={{ height: '100vh', background: '#111' }}></div>
  
  return <SalonTemplate data={config} />
}
