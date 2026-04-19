import { useEffect, useState } from 'react'
import {
  getAllVehicles, addVehicle, deleteVehicle,
  getAllBookings, completeBooking
} from '../services/api'

const EMPTY = { brand: '', model: '', registrationNumber: '', category: 'SEDAN', pricePerDay: '', imageUrl: '' }
const STATUS_COLORS = { CONFIRMED: 'success', PENDING: 'warning', CANCELLED: 'secondary', COMPLETED: 'primary' }

export default function AdminPanel() {
  const [tab, setTab]           = useState('vehicles')
  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])
  const [form, setForm]         = useState(EMPTY)
  const [msg, setMsg]           = useState({ type: '', text: '' })
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (tab === 'vehicles') getAllVehicles().then(r => setVehicles(r.data.data)).catch(() => {})
    if (tab === 'bookings') getAllBookings().then(r => setBookings(r.data.data)).catch(() => {})
  }, [tab])

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true); setMsg({ type: '', text: '' })
    try {
      await addVehicle({ ...form, pricePerDay: parseFloat(form.pricePerDay) })
      setMsg({ type: 'success', text: 'Vehicle added successfully!' })
      setForm(EMPTY)
      getAllVehicles().then(r => setVehicles(r.data.data))
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to add vehicle.' })
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return
    try {
      await deleteVehicle(id)
      setVehicles(v => v.filter(x => x.id !== id))
    } catch (err) { alert(err.response?.data?.message || 'Cannot delete.') }
  }

  const handleComplete = async (id) => {
    try {
      await completeBooking(id)
      getAllBookings().then(r => setBookings(r.data.data))
    } catch (err) { alert(err.response?.data?.message || 'Failed.') }
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-1">
        <i className="bi bi-shield-lock me-2 text-warning"></i>Admin Panel
      </h4>
      <p className="text-muted small mb-4">Manage vehicles and bookings</p>

      <ul className="nav nav-tabs mb-4">
        {[
          { key: 'vehicles', icon: 'bi-car-front',       label: 'Vehicles' },
          { key: 'bookings', icon: 'bi-calendar-check',  label: 'All Bookings' },
          { key: 'add',      icon: 'bi-plus-circle',     label: 'Add Vehicle' },
        ].map(t => (
          <li className="nav-item" key={t.key}>
            <button className={`nav-link ${tab === t.key ? 'active fw-semibold' : ''}`}
              onClick={() => setTab(t.key)}>
              <i className={`bi ${t.icon} me-1`}></i>{t.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Vehicles Tab */}
      {tab === 'vehicles' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-dark">
              <tr><th>#</th><th>Brand</th><th>Model</th><th>Reg No.</th><th>Category</th><th>Price/Day</th><th>Available</th><th></th></tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td className="fw-semibold">{v.brand}</td>
                  <td>{v.model}</td>
                  <td>{v.registrationNumber}</td>
                  <td><span className="badge bg-warning text-dark">{v.category}</span></td>
                  <td>₹{v.pricePerDay?.toLocaleString()}</td>
                  <td><span className={`badge bg-${v.available ? 'success' : 'danger'}`}>{v.available ? 'Yes' : 'No'}</span></td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(v.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === 'bookings' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-dark">
              <tr><th>#</th><th>User</th><th>Vehicle</th><th>Start</th><th>End</th><th>Amount</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.userEmail}</td>
                  <td className="fw-semibold">{b.vehicleBrand} {b.vehicleModel}</td>
                  <td>{b.startDate}</td>
                  <td>{b.endDate}</td>
                  <td>₹{b.totalAmount?.toLocaleString()}</td>
                  <td><span className={`badge bg-${STATUS_COLORS[b.status] || 'secondary'}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'CONFIRMED' && (
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleComplete(b.id)}>
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Vehicle Tab */}
      {tab === 'add' && (
        <div style={{ maxWidth: '500px' }}>
          {msg.text && <div className={`alert alert-${msg.type} py-2 small`}>{msg.text}</div>}
          <form onSubmit={handleAdd}>
            {[
              { label: 'Brand',               name: 'brand',              placeholder: 'Toyota' },
              { label: 'Model',               name: 'model',              placeholder: 'Innova Crysta' },
              { label: 'Registration Number', name: 'registrationNumber', placeholder: 'KA01AB1234' },
              { label: 'Price Per Day (₹)',   name: 'pricePerDay',        placeholder: '2500', type: 'number' },
              { label: 'Image URL (optional)',name: 'imageUrl',           placeholder: 'https://...' },
            ].map(f => (
              <div className="mb-3" key={f.name}>
                <label className="form-label small fw-semibold">{f.label}</label>
                <input type={f.type || 'text'} className="form-control form-control-sm"
                  placeholder={f.placeholder} value={form[f.name]}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  required={f.name !== 'imageUrl'} />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Category</label>
              <select className="form-select form-select-sm" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {['SEDAN', 'SUV', 'HATCHBACK', 'LUXURY'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-dark btn-sm" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm me-1"></span>}
              Add Vehicle
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
