import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = await authApi.register(form)
      login(data)
      navigate('/account')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <h1>Create Account</h1>
      <p className="auth-sub">Join Luxe &amp; Co today</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={submit}>
        <div className="field">
          <label>Full Name</label>
          <input value={form.name} onChange={set('name')} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={set('email')} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={set('password')} minLength="6" required />
          <small style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Minimum 6 characters</small>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creating…' : 'Create Account'}
        </button>
      </form>

      <p className="auth-alt">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}
