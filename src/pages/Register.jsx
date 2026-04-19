import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm]     = useState({ name: '', email: '', password: '', phone: '' })
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
      const res = await register(form)
      loginUser(res.data.data)
      navigate('/vehicles')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-car-front-fill text-warning" style={{ fontSize: '2.5rem' }}></i>
          <h4 className="mt-2 fw-bold">Create Account</h4>
          <p className="text-muted small">Join CarRental today</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name',  name: 'name',     type: 'text',     placeholder: 'John Doe' },
            { label: 'Email',      name: 'email',    type: 'email',    placeholder: 'you@example.com' },
            { label: 'Phone',      name: 'phone',    type: 'tel',      placeholder: '9876543210' },
            { label: 'Password',   name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
          ].map(f => (
            <div className="mb-3" key={f.name}>
              <label className="form-label small fw-semibold">{f.label}</label>
              <input type={f.type} name={f.name} className="form-control"
                placeholder={f.placeholder} value={form[f.name]}
                onChange={handleChange} required minLength={f.name === 'password' ? 6 : undefined} />
            </div>
          ))}
          <button type="submit" className="btn btn-dark w-100 mt-1" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
