import { useEffect } from 'react'
import axiosClient from './api/axiosClient' // ✅ Unga path ah check pannikonga

export default function DynamicFavicon() {
  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const res = await axiosClient.get('/settings/site')
        const data = res.data?.data
        
        if (data?.logo_url) {
          const base = import.meta.env.VITE_UPLOADS_BASE_URL 
            || import.meta.env.VITE_API_URL?.replace('/api', '') 
            || 'https://98.130.23.135'
            
          const logoUrl = data.logo_url.startsWith('http') 
            ? data.logo_url 
            : `${base}${data.logo_url.startsWith('/') ? data.logo_url : `/${data.logo_url}`}`

          let link = document.querySelector("link[rel~='icon']")
          if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.head.appendChild(link)
          }
          link.href = logoUrl
        }
      } catch (e) {
        console.warn('Favicon load failed', e)
      }
    }

    fetchFavicon()
  }, [])

  return null 
}