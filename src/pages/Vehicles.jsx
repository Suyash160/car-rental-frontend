import { useEffect, useState } from 'react'
import { getAvailableVehicles, getVehiclesByCategory, createBooking } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['ALL', 'SEDAN', 'SUV', 'HATCHBACK', 'LUXURY']

export default function Vehicles() {
  const [vehicles, setVehicles]       = useState([])
  const [category, setCategory]       = useState('ALL')
  const [loading, setLoading]         = useState(true)
  const [booking, setBooking]         = useState(null)
  const [dates, setDates]             = useState({ startDate: '', endDate: '' })
  const [bookMsg, setBookMsg]         = useState({ type: '', text: '' })
  const [bookLoading, setBookLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchVehicles = async (cat) => {
    setLoading(true)
    try {
      const res = cat === 'ALL'
        ? await getAvailableVehicles()
        : await getVehiclesByCategory(cat)
      setVehicles(res.data.data)
    } catch {
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVehicles(category) }, [category])

  const openBooking = (vehicle) => {
    if (!user) { navigate('/login'); return }
    setBooking(vehicle)
    setDates({ startDate: '', endDate: '' })
    setBookMsg({ type: '', text: '' })
  }

  const handleBook = async (e) => {
    e.preventDefault()
    setBookLoading(true)
    setBookMsg({ type: '', text: '' })
    try {
      await createBooking({ vehicleId: booking.id, ...dates })
      setBookMsg({ type: 'success', text: 'Booking confirmed! Check My Bookings.' })
      fetchVehicles(category)
    } catch (err) {
      setBookMsg({ type: 'danger', text: err.response?.data?.message || 'Booking failed.' })
    } finally {
      setBookLoading(false)
    }
  }

  const days = dates.startDate && dates.endDate
    ? Math.max(0, (new Date(dates.endDate) - new Date(dates.startDate)) / 86400000)
    : 0

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-1">Available Cars</h4>
      <p className="text-muted small mb-3">Browse and book your perfect vehicle</p>

      {/* Category Filter */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {CATEGORIES.map(cat => (
          <button key={cat}
            className={`btn btn-sm ${category === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-car-front" style={{ fontSize: '3rem' }}></i>
          <p className="mt-2">No vehicles available in this category.</p>
        </div>
      ) : (
        <div className="row g-3">
          {vehicles.map(v => (
            <div key={v.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-0">{v.brand} {v.model}</h6>
                      <small className="text-muted">{v.registrationNumber}</small>
                    </div>
                    <span className="badge bg-warning text-dark">{v.category}</span>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <i className="bi bi-currency-rupee text-success"></i>
                    <span className="fs-5 fw-bold text-success">{v.pricePerDay?.toLocaleString()}</span>
                    <span className="text-muted small ms-1">/ day</span>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 pt-0">
                  <button className="btn btn-dark w-100 btn-sm" onClick={() => openBooking(v)}>
                    <i className="bi bi-calendar-check me-1"></i>Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {booking && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Book — {booking.brand} {booking.model}
                </h5>
                <button className="btn-close" onClick={() => setBooking(null)}></button>
              </div>
              <form onSubmit={handleBook}>
                <div className="modal-body">
                  <div className="alert alert-light border small mb-3">
                    <i className="bi bi-currency-rupee"></i>
                    <strong>{booking.pricePerDay?.toLocaleString()} / day</strong>
                    {days > 0 && (
                      <span className="ms-2 text-success fw-semibold">
                        → Total: ₹{(days * booking.pricePerDay).toLocaleString()} for {days} day{days > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {bookMsg.text && (
                    <div className={`alert alert-${bookMsg.type} py-2 small`}>{bookMsg.text}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Start Date</label>
                    <input type="date" className="form-control" min={today}
                      value={dates.startDate}
                      onChange={e => setDates({ ...dates, startDate: e.target.value })}
                      required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">End Date</label>
                    <input type="date" className="form-control"
                      min={dates.startDate || today}
                      value={dates.endDate}
                      onChange={e => setDates({ ...dates, endDate: e.target.value })}
                      required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary btn-sm"
                    onClick={() => setBooking(null)}>Cancel</button>
                  <button type="submit" className="btn btn-dark btn-sm"
                    disabled={bookLoading || bookMsg.type === 'success'}>
                    {bookLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
