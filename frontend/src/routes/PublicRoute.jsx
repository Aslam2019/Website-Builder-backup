import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Redirects already-logged-in users away from /login, /register
 * based on their role.
 */
export default function PublicRoute() {
  const { isAuthenticated, isAdmin } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
  }
  return <Outlet />
}