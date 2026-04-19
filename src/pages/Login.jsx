import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data.data)
      navigate('/vehicles')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-car-front-fill text-warning" style={{ fontSize: '2.5rem' }}></i>
          <h4 className="mt-2 fw-bold">Welcome Back</h4>
          <p className="text-muted small">Sign in to your CarRental account</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <input type="email" name="email" className="form-control"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Password</label>
            <input type="password" name="password" className="form-control"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-dark w-100 mt-1" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Don't have an account? <Link to="/register" className="text-decoration-none fw-semibold">Register</Link>
        </p>
      </div>
    </div>
  )
}
