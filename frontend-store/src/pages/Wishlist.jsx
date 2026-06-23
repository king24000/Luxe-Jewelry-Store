import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { wishlistApi } from '../api'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!user) { setLoading(false); return }
    wishlistApi.list().then(setItems).finally(() => setLoading(false))
  }

  useEffect(load, [user])

  if (!user) {
    navigate('/login?redirect=/wishlist')
    return null
  }

  if (loading) return <div className="spinner" />
  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <h3>Your wishlist is empty</h3>
        <p>Save your favourite pieces by tapping the heart.</p>
        <Link to="/shop" className="btn btn-primary mt-2">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="container section">
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 28 }}>
        My Wishlist ({items.length})
      </h1>
      <div className="product-grid">
        {items.map((w) => (
          <ProductCard key={w.id} product={w.product} />
        ))}
      </div>
    </div>
  )
}
