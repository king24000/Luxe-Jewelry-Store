import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { catalogApi } from '../api'
import ProductCard from '../components/ProductCard'
import '../styles/shop.css'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Active filters, synced with URL query params
  const activeCategory = searchParams.get('category') || ''
  const activeBrand = searchParams.get('brand') || ''
  const search = searchParams.get('search') || ''
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''
  const sort = searchParams.get('sort') || 'new'

  useEffect(() => {
    catalogApi.categories().then(setCategories).catch(() => {})
    catalogApi.brands().then(setBrands).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeCategory) params.category = activeCategory
    if (activeBrand) params.brand = activeBrand
    if (search) params.search = search
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice
    if (sort) params.sort = sort
    catalogApi
      .products(params)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [activeCategory, activeBrand, search, minPrice, maxPrice, sort])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const clearAll = () => setSearchParams({})

  const title = useMemo(() => {
    if (search) return `Results for "${search}"`
    if (activeCategory) {
      const c = categories.find((x) => x.slug === activeCategory)
      return c ? c.name : 'Shop'
    }
    if (activeBrand) {
      const b = brands.find((x) => x.slug === activeBrand)
      return b ? b.name : 'Shop'
    }
    return 'All Products'
  }, [search, activeCategory, activeBrand, categories, brands])

  return (
    <div className="container section">
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 4 }}>{title}</h1>
      <p className="section-sub" style={{ textAlign: 'left', marginBottom: 28 }}>
        {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
      </p>

      <button className="btn btn-outline btn-sm filter-toggle" onClick={() => setFiltersOpen((o) => !o)}>
        ⚙ Filters
      </button>

      <div className="shop-layout">
        {/* Filters */}
        <aside className={`filters ${filtersOpen ? 'open' : ''}`}>
          <h3>
            Filters
            <span className="clear-btn" onClick={clearAll}>Clear all</span>
          </h3>

          <div className="filter-group">
            <h4>Category</h4>
            {categories.map((c) => (
              <label key={c.id} className="filter-opt">
                <input
                  type="radio"
                  name="category"
                  checked={activeCategory === c.slug}
                  onChange={() => updateParam('category', c.slug)}
                />
                {c.name}
              </label>
            ))}
            {activeCategory && (
              <label className="filter-opt">
                <input type="radio" name="category" checked={!activeCategory} onChange={() => updateParam('category', '')} />
                All categories
              </label>
            )}
          </div>

          <div className="filter-group">
            <h4>Brand</h4>
            {brands.map((b) => (
              <label key={b.id} className="filter-opt">
                <input
                  type="radio"
                  name="brand"
                  checked={activeBrand === b.slug}
                  onChange={() => updateParam('brand', b.slug)}
                />
                {b.name}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-row">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParam('min_price', e.target.value)} />
              <span>—</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParam('max_price', e.target.value)} />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="shop-toolbar">
            <span className="count">Sort by</span>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
              <option value="new">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters.</p>
              <button className="btn btn-outline mt-2" onClick={clearAll}>Clear filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
