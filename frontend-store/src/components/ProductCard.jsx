import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { wishlistApi } from '../api'
import { formatPrice } from '../utils/format'
import '../styles/product.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [added, setAdded] = useState(false)
  const [wished, setWished] = useState(false)
  const [busy, setBusy] = useState(false)

  const outOfStock = product.stock <= 0

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!user) {
      window.location.href = '/login'
      return
    }
    setBusy(true)
    try {
      await addToCart(product.id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch {
      alert('Could not add to cart')
    } finally {
      setBusy(false)
    }
  }

  const toggleWish = async (e) => {
    e.preventDefault()
    if (!user) {
      window.location.href = '/login'
      return
    }
    try {
      if (wished) {
        await wishlistApi.remove(product.id)
        setWished(false)
      } else {
        await wishlistApi.add(product.id)
        setWished(true)
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-img-wrap">
        <img src={product.image_url} alt={product.name} loading="lazy" />
        {product.featured === 1 && <span className="badge badge-gold product-flag">Featured</span>}
        {outOfStock && <span className="badge badge-out product-flag">Sold out</span>}
        <button
          className={`wish-btn ${wished ? 'active' : ''}`}
          onClick={toggleWish}
          aria-label="Toggle wishlist"
        >
          <svg className="icon-svg heart-icon" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand?.name}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">{formatPrice(product.price)}</div>
        <button
          className={`btn btn-sm ${added ? 'btn-outline' : 'btn-primary'} btn-block mt-1`}
          onClick={handleAdd}
          disabled={outOfStock || busy}
        >
          {outOfStock ? 'Sold Out' : added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  )
}
