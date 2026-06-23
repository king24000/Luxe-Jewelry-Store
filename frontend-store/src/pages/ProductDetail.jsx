import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { catalogApi, wishlistApi } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'
import ProductCard from '../components/ProductCard'
import StarRating from '../components/StarRating'
import '../styles/detail.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [added, setAdded] = useState(false)
  const [wished, setWished] = useState(false)

  useEffect(() => {
    setLoading(true)
    setQty(1)
    catalogApi
      .product(slug)
      .then((p) => {
        setProduct(p)
        // load related from same category
        return catalogApi.products({ category: p.category.slug, limit: 5 })
      })
      .then((items) => setRelated(items.filter((i) => i.id !== product?.id).slice(0, 4)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="spinner" />
  if (!product) {
    return (
      <div className="empty-state">
        <h3>Product not found</h3>
        <Link to="/shop" className="btn btn-outline mt-2">Back to Shop</Link>
      </div>
    )
  }

  const outOfStock = product.stock <= 0

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return }
    setBusy(true)
    try {
      await addToCart(product.id, qty)
      setAdded(true)
      setTimeout(() => setAdded(false), 1800)
    } catch {
      alert('Could not add to cart')
    } finally {
      setBusy(false)
    }
  }

  const toggleWish = async () => {
    if (!user) { navigate('/login'); return }
    if (wished) {
      await wishlistApi.remove(product.id); setWished(false)
    } else {
      await wishlistApi.add(product.id); setWished(true)
    }
  }

  return (
    <div className="container section">
      <nav className="breadcrumb" style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 24 }}>
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{' '}
        <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link> /{' '}
        <span style={{ color: 'var(--ink)' }}>{product.name}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-gallery">
          <img src={product.image_url} alt={product.name} />
        </div>

        <div className="detail-info">
          <span className="brand">{product.brand.name}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <div className="detail-meta">
            <StarRating value={4} />
            <span>·</span>
            <span>{outOfStock ? 'Out of stock' : `${product.stock} in stock`}</span>
            <span>·</span>
            <Link to={`/shop?brand=${product.brand.slug}`}>More from {product.brand.name}</Link>
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="qty-row">
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}>+</button>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary" onClick={handleAdd} disabled={outOfStock || busy}>
              {added ? '✓ Added to Cart' : outOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
            <button className="btn btn-outline" onClick={toggleWish} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg className="icon-svg heart-icon" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ color: wished ? 'var(--danger)' : 'inherit' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {wished ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="detail-section">
          <h2>You may also like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
