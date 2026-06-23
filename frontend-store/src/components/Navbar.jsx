import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import '../styles/navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(`/shop${query ? `?search=${encodeURIComponent(query)}` : ''}`)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <button className="nav-burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>

        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          Luxe<span>&amp;</span>Co
        </Link>

        <form className="nav-search" onSubmit={submitSearch}>
          <input
            type="text"
            placeholder="Search jewelry, makeup…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg className="icon-svg search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/shop?category=jewelry" onClick={() => setMenuOpen(false)}>Jewelry</NavLink>
          <NavLink to="/shop?category=makeup" onClick={() => setMenuOpen(false)}>Makeup</NavLink>
          <NavLink to="/shop?category=perfume" onClick={() => setMenuOpen(false)}>Perfume</NavLink>

          <Link to="/wishlist" className="nav-icon" onClick={() => setMenuOpen(false)} aria-label="Wishlist">
            <svg className="icon-svg wishlist-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Link>

          <Link to="/cart" className="nav-cart" onClick={() => setMenuOpen(false)} aria-label="Cart">
            <svg className="icon-svg cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>

          {user ? (
            <div className="nav-user">
              <Link to="/account" onClick={() => setMenuOpen(false)}>Account</Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="nav-user">
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-gold btn-sm" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
