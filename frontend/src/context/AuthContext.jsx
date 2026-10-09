import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

const TOKEN_KEY = 'wb_token'
const USER_KEY = 'wb_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    async function verify() {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (!stored) {
        setLoading(false)
        return
      }
      try {
        const res = await authApi.me()
        if (!alive) return
        const u = res.data?.data?.user || null
        setUser(u)
        if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
      } catch {
        if (!alive) return
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
        setToken(null)
      } finally {
        if (alive) setLoading(false)
      }
    }
    verify()
    return () => { alive = false }
  }, [])

  const login = useCallback(async (username, password) => {
    const res = await authApi.login({ username, password })
    const { token: t, user: u } = res.data.data
    localStorage.setItem(TOKEN_KEY, t)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setToken(t)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload)
    return res.data
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'super_admin',
    isUser: user?.role === 'user',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}