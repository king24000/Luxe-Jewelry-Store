import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalogApi } from '../api'
import ProductCard from '../components/ProductCard'
import '../styles/home.css'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      catalogApi.products({ featured: 1, limit: 8 }),
      catalogApi.categories(),
      catalogApi.brands(),
    ])
      .then(([f, c, b]) => {
        setFeatured(f)
        setCategories(c)
        setBrands(b)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <span className="hero-eyebrow">New Season · 2026</span>
          <h1>Everyday Luxury, Beautifully Curated</h1>
          <p>
            Discover fine jewelry, makeup, fragrance and accessories from the world's
            most loved brands — all in one place.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-gold">Shop the Collection</Link>
            <Link to="/shop?category=jewelry" className="btn btn-outline" style={{ color: '#fff', borderColor: '#fff' }}>
              Explore Jewelry
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="container" style={{ marginTop: -50, position: 'relative', zIndex: 5 }}>
        <div className="feature-strip">
          <div className="feature">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon" width="20" height="20">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div><h4>Free Shipping</h4><p>On orders over $75</p></div>
          </div>
          <div className="feature">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon" width="20" height="20">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </div>
            <div><h4>30-Day Returns</h4><p>Hassle-free policy</p></div>
          </div>
          <div className="feature">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon" width="20" height="20">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div><h4>Secure Checkout</h4><p>Encrypted payments</p></div>
          </div>
          <div className="feature">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon" width="20" height="20">
                <path d="M6 3h12l4 6-10 13L2 9z"></path>
                <path d="M11 3 8 9l4 13 4-13-3-6"></path>
                <path d="M2 9h20"></path>
              </svg>
            </div>
            <div><h4>Authentic Only</h4><p>100% genuine brands</p></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-sub">Find exactly what you're looking for</p>
        <div className="cat-grid">
          {loading ? (
            <div className="spinner" />
          ) : (
            categories.map((c) => (
              <Link key={c.id} to={`/shop?category=${c.slug}`} className="cat-tile">
                <img src={c.image_url} alt={c.name} />
                <div className="cat-label">
                  <h3>{c.name}</h3>
                  <span>Shop now →</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="section container" style={{ background: 'var(--bg)' }}>
        <h2 className="section-title">Featured Pieces</h2>
        <p className="section-sub">Handpicked favourites our customers love</p>
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="text-center mt-3">
          <Link to="/shop" className="btn btn-outline">View All Products</Link>
        </div>
      </section>

      {/* Brand strip */}
      <section className="container">
        <p className="section-sub" style={{ marginBottom: 0 }}>Trusted brands we carry</p>
        <div className="brand-strip">
          {brands.map((b) => (
            <Link key={b.id} to={`/shop?brand=${b.slug}`} className="brand-pill">{b.name}</Link>
          ))}
        </div>
      </section>
    </div>
  )
}
