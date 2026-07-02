import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-cyan-400">
            Feledo
          </Link>
          <div className="flex space-x-6 items-center">
            <Link to="/" className="hover:text-cyan-400 transition">
              Dashboard
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/portfolio" className="hover:text-cyan-400 transition">
                  Portfolio
                </Link>
                <Link to="/crypto" className="hover:text-cyan-400 transition">
                  Crypto
                </Link>
                <Link to="/news" className="hover:text-cyan-400 transition">
                  News
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
