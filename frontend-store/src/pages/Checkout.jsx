import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../api'
import { formatPrice } from '../utils/format'
import '../styles/cart.css'
import '../styles/auth.css'

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: user?.name || '',
    phone: '',
    line1: '',
    city: '',
    postal_code: '',
  })

  const shipping = subtotal > 75 ? 0 : 7.5
  const total = subtotal + shipping

  if (!user) {
    navigate('/login?redirect=/checkout')
    return null
  }
  if (items.length === 0 && !placing) {
    return (
      <div className="container section empty-state">
        <h3>Your cart is empty</h3>
        <Link to="/shop" className="btn btn-primary mt-2">Browse Products</Link>
      </div>
    )
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const placeOrder = async (e) => {
    e.preventDefault()
    setError('')
    const address = `${form.full_name}\n${form.line1}\n${form.city} ${form.postal_code}\nPhone: ${form.phone}`
    setPlacing(true)
    try {
      await orderApi.create(address)
      await clear()
      navigate('/account?tab=orders&placed=1')
    } catch (err) {
      setError(err.response?.data?.detail || 'Order failed. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="container section">
      <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 28 }}>Checkout</h1>

      <form className="checkout-layout" onSubmit={placeOrder}>
        <div>
          <div className="checkout-card">
            <h2>Shipping Address</h2>
            <div className="form-row">
              <div className="field">
                <label>Full Name</label>
                <input value={form.full_name} onChange={set('full_name')} required />
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={form.phone} onChange={set('phone')} required />
              </div>
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.line1} onChange={set('line1')} placeholder="Street address" required />
            </div>
            <div className="form-row">
              <div className="field">
                <label>City</label>
                <input value={form.city} onChange={set('city')} required />
              </div>
              <div className="field">
                <label>Postal Code</label>
                <input value={form.postal_code} onChange={set('postal_code')} required />
              </div>
            </div>
          </div>

          <div className="checkout-card mt-2">
            <h2>Payment</h2>
            <div className="pay-placeholder">
              🔒 This is a demo store — no real payment will be charged.<br />
              Your order will be created with status <strong>"pending"</strong>.
            </div>
          </div>
        </div>

        <aside className="summary">
          <h3>Your Order</h3>
          {items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.product.name} × {item.quantity}</span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row" style={{ marginTop: 12 }}>
            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>

          {error && <div className="alert alert-error mt-2">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block mt-2" disabled={placing}>
            {placing ? 'Placing Order…' : 'Place Order'}
          </button>
        </aside>
      </form>
    </div>
  )
}
