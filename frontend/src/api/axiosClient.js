// import axios from 'axios'

// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//   headers: { 'Content-Type': 'application/json' },
// })

// /* ✅ Attach token to every request */
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// /* ✅ Smart 401 redirect */
// axiosClient.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const status = err.response?.status
//     const url = err.config?.url || ''

//     const PUBLIC_PATHS = [
//       '/settings/terms',
//       '/settings/site',
//       '/pricing',
//       '/categories',
//       '/templates',
//       '/auth/login',
//       '/auth/register',
//     ]
//     const isPublicPath = PUBLIC_PATHS.some((p) => url.includes(p))

//     if (status === 401 && !isPublicPath) {
//       const currentPath = window.location.pathname
//       if (currentPath !== '/login' && currentPath !== '/register') {
//         localStorage.removeItem('token')
//         window.location.href = '/login?expired=1'
//       }
//     }
//     return Promise.reject(err)
//   }
// )

// export default axiosClient



import axios from 'axios'

// ✅ Vite env variable — .env la VITE_API_URL set pannunga
const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
})

// ============================================================
// REQUEST INTERCEPTOR — attach token if exists
// ============================================================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ============================================================
// RESPONSE INTERCEPTOR — handle 401 (token expired)
// ============================================================
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 la mattum logout — login/register endpoints exclude
    const url = error?.config?.url || ''
    const isAuthRoute =
      url.includes('/auth/login') || url.includes('/auth/register')

    if (error?.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login (optional — avoid loop on public pages)
      if (!window.location.pathname.startsWith('/login')) {
        // window.location.href = '/login'   // ← uncomment if needed
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient