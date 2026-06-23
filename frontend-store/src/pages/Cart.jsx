import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'
import '../styles/cart.css'

export default function Cart() {
  const { items, loading, updateQty, removeItem, subtotal, count } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 7.5
  const total = subtotal + shipping

  if (loading) return <div className="spinner" />
  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary mt-2">Start Shopping</Link>
      </div>
    )
  }

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=/checkout'); return }
    navigate('/checkout')
  }

  return (
    <div className="container section">
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 28 }}>
        Shopping Cart ({count})
      </h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <Link to={`/product/${item.product.slug}`} className="cart-item-img">
                <img src={item.product.image_url} alt={item.product.name} />
              </Link>
              <div className="cart-item-info">
                <span className="brand">{item.product.brand?.name}</span>
                <Link to={`/product/${item.product.slug}`}><h4>{item.product.name}</h4></Link>
                <div className="meta">{formatPrice(item.product.price)} each</div>
                <div className="qty-control" style={{ marginTop: 10 }}>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="cart-item-price">{formatPrice(item.product.price * item.quantity)}</div>
                <span className="cart-remove" onClick={() => removeItem(item.id)}>Remove</span>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          {shipping === 0 && subtotal > 0 && (
            <div className="summary-row" style={{ color: 'var(--success)', fontSize: '0.82rem' }}>
              <span>🎉 Free shipping applied</span><span></span>
            </div>
          )}
          <div className="summary-row summary-total">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <button className="btn btn-primary btn-block mt-2" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/shop" className="btn btn-ghost btn-block mt-1">Continue Shopping</Link>
        </aside>
      </div>
    </div>
  )
}
