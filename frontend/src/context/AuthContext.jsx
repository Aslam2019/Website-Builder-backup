import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  /* ============================================================
     REGISTER — creates account, returns user
     ============================================================ */
  const register = async (payload) => {
    // payload = { username, password, confirm_password, mobile, category_id, preferred_plan_id }
    const res = await authApi.register(payload)
    const data = res.data?.data || res.data || {}
    // Backend: success({"user": ...}, "Registration successful.", 201)
    // => { success: true, data: { user: {...} }, message: "..." }
    return data.user || data
  }

  /* ============================================================
     LOGIN — saves token + user
     ============================================================ */
  const login = async (username, password) => {
    const res = await authApi.login({ username, password })
    const data = res.data?.data || {}

    const t = data.token
    const u = data.user

    // ✅ CRITICAL: Save token to localStorage
    if (t) {
      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u || {}))
      setToken(t)
    } else {
      throw new Error('No token returned from server')
    }

    if (u) {
      setUser(u)
    }

    return u   // return user object
  }

  /* ============================================================
     LOGOUT
     ============================================================ */
  const logout = async () => {
    try {
      await authApi.logout?.()
    } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  /* ============================================================
     LOAD USER ON MOUNT (if token exists)
     ============================================================ */
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token')
      if (!savedToken) {
        setLoading(false)
        return
      }
      try {
        const res = await authApi.me()
        const userData = res.data?.data?.user || res.data?.data
        setUser(userData)
        setToken(savedToken)
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData))
        }
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user || !!token,
        isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
        login,
        register,       // ← ✅ ADDED
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}