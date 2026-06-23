import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/account'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = await authApi.login(form)
      login(data)
      navigate(redirect)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const fillDemo = () => setForm({ email: 'demo@user.com', password: 'demo123' })

  return (
    <div className="auth-wrap">
      <h1>Welcome Back</h1>
      <p className="auth-sub">Sign in to your account</p>

      <div className="demo-creds">
        <strong>Demo customer:</strong> demo@user.com / demo123<br />
        <strong>Demo admin:</strong> admin@store.com / admin123
        <div style={{ marginTop: 8 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={fillDemo}>Fill demo customer</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={submit}>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={set('email')} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={set('password')} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="auth-alt">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  )
}
