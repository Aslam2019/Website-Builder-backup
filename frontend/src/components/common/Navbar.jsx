import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/how-it-works', 'How It Works'],
  ['/why-choose-us', 'Why Choose Us'],
  ['/pricing', 'Pricing'],
  ['/contact', 'Contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Website<span>Builder</span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >{label}</NavLink>
          ))}
          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? '/admin' : '/dashboard'}
                  className="btn btn-outline btn-sm"
                  onClick={() => setOpen(false)}
                >Dashboard</Link>
                <button className="btn btn-primary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}