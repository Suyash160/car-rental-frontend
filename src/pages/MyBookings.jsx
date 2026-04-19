import { useEffect, useState } from 'react'
import { getMyBookings, cancelBooking } from '../services/api'

const STATUS_COLORS = {
  CONFIRMED: 'success',
  PENDING:   'warning',
  CANCELLED: 'secondary',
  COMPLETED: 'primary',
}

export default function MyBookings() {
  const [bookings, setBookings]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [cancelling, setCancelling] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await getMyBookings()
      setBookings(res.data.data)
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    setCancelling(id)
    try {
      await cancelBooking(id)
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-warning"></div>
    </div>
  )

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-1">My Bookings</h4>
      <p className="text-muted small mb-4">Track and manage your reservations</p>

      {bookings.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-calendar-x" style={{ fontSize: '3rem' }}></i>
          <p className="mt-2">No bookings yet. <a href="/vehicles">Browse cars</a> to get started.</p>
        </div>
      ) : (
        <div className="row g-3">
          {bookings.map(b => (
            <div key={b.id} className="col-12 col-md-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-bold mb-0">{b.vehicleBrand} {b.vehicleModel}</h6>
                      <small className="text-muted">Booking #{b.id}</small>
                    </div>
                    <span className={`badge bg-${STATUS_COLORS[b.status] || 'secondary'}`}>
                      {b.status}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="row small text-muted g-1">
                    <div className="col-6">
                      <i className="bi bi-calendar me-1"></i><strong>From:</strong> {b.startDate}
                    </div>
                    <div className="col-6">
                      <i className="bi bi-calendar-check me-1"></i><strong>To:</strong> {b.endDate}
                    </div>
                    <div className="col-12 mt-1">
                      <i className="bi bi-currency-rupee me-1 text-success"></i>
                      <strong className="text-success">₹{b.totalAmount?.toLocaleString()}</strong>
                      <span className="ms-1">total</span>
                    </div>
                  </div>
                </div>
                {b.status === 'CONFIRMED' && (
                  <div className="card-footer bg-white border-0 pt-0">
                    <button className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => handleCancel(b.id)}
                      disabled={cancelling === b.id}>
                      {cancelling === b.id
                        ? <span className="spinner-border spinner-border-sm me-1"></span>
                        : <i className="bi bi-x-circle me-1"></i>}
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
