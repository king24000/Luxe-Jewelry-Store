import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi, wishlistApi } from '../api'
import { formatPrice, formatDate } from '../utils/format'
import ProductCard from '../components/ProductCard'

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  const tab = params.get('tab') || 'orders'
  const justPlaced = params.get('placed') === '1'

  useEffect(() => {
    if (!user) return
    setLoading(true)
    Promise.all([orderApi.list(), wishlistApi.list()])
      .then(([o, w]) => { setOrders(o); setWishlist(w) })
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    navigate('/login?redirect=/account')
    return null
  }

  const setTab = (t) => setParams({ tab: t })
  const handleLogout = () => { logout(); navigate('/') }

  const tabs = [
    { id: 'orders', label: 'My Orders' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'profile', label: 'Profile' },
  ]

  return (
    <div className="container section">
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 4 }}>
        Hello, {user.name.split(' ')[0]}
      </h1>
      <p className="section-sub" style={{ textAlign: 'left', marginBottom: 28 }}>
        Manage your orders, wishlist and account details
      </p>

      {justPlaced && (
        <div className="alert alert-success">
          🎉 Order placed successfully! We'll email you when it ships.
        </div>
      )}

      <div className="account-layout">
        <aside className="account-nav">
          {tabs.map((t) => (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
          <button onClick={handleLogout}>Logout</button>
          {user.role === 'admin' && (
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', padding: '11px 14px', fontSize: '0.92rem', color: 'var(--gold-dark)', fontWeight: 600 }}
            >
              Admin Panel →
            </a>
          )}
        </aside>

        <div>
          {tab === 'orders' && (
            <div className="account-card">
              <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 20 }}>Order History</h2>
              {loading ? (
                <div className="spinner" />
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <h3>No orders yet</h3>
                  <p>When you place an order it will show up here.</p>
                  <Link to="/shop" className="btn btn-primary mt-2">Start Shopping</Link>
                </div>
              ) : (
                orders.map((o) => (
                  <div className="order-card" key={o.id}>
                    <div className="order-head">
                      <div>
                        <div className="id">Order #{o.id}</div>
                        <div className="date">{formatDate(o.created_at)}</div>
                      </div>
                      <span className={`status-tag status-${o.status}`}>{o.status}</span>
                    </div>
                    {o.items.map((it) => (
                      <div className="order-line" key={it.id}>
                        <span className="name">{it.product_name}</span>
                        <span className="qty">× {it.quantity}</span>
                        <span>{formatPrice(it.price * it.quantity)}</span>
                      </div>
                    ))}
                    <div className="order-line" style={{ borderTop: '1px solid var(--line)', marginTop: 8, paddingTop: 10, fontWeight: 700, color: 'var(--ink)' }}>
                      <span className="name">Total</span>
                      <span>{formatPrice(o.total)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="account-card">
              <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 20 }}>My Wishlist</h2>
              {loading ? (
                <div className="spinner" />
              ) : wishlist.length === 0 ? (
                <div className="empty-state">
                  <h3>Your wishlist is empty</h3>
                  <p>Tap the heart on any product to save it for later.</p>
                  <Link to="/shop" className="btn btn-primary mt-2">Browse Products</Link>
                </div>
              ) : (
                <div className="product-grid">
                  {wishlist.map((w) => (
                    <ProductCard key={w.id} product={w.product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'profile' && (
            <div className="account-card">
              <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 20 }}>Profile Details</h2>
              <div className="summary-row"><span>Name</span><strong>{user.name}</strong></div>
              <div className="summary-row"><span>Email</span><strong>{user.email}</strong></div>
              <div className="summary-row"><span>Role</span><strong style={{ textTransform: 'capitalize' }}>{user.role}</strong></div>
              <div className="summary-row"><span>Member since</span><strong>{formatDate(user.created_at)}</strong></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
