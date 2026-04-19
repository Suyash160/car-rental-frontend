import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <div className="bg-dark text-white py-5">
        <div className="container text-center py-4">
          <i className="bi bi-car-front-fill text-warning" style={{ fontSize: '4rem' }}></i>
          <h1 className="fw-bold mt-3">Find Your Perfect Ride</h1>
          <p className="text-muted fs-5 mt-2">
            Book premium vehicles at unbeatable prices. Fast, secure, and hassle-free.
          </p>
          <div className="mt-4 d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/vehicles" className="btn btn-warning btn-lg fw-semibold px-4">
              <i className="bi bi-search me-2"></i>Browse Cars
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4 text-center">
          {[
            { icon: 'bi-shield-check', color: 'success', title: 'Secure Booking',      text: 'JWT-secured transactions with role-based access control.' },
            { icon: 'bi-lightning-charge', color: 'warning', title: 'Instant Confirmation', text: 'Real-time availability with instant booking confirmation.' },
            { icon: 'bi-geo-alt',      color: 'danger',  title: 'Wide Selection',      text: 'Sedans, SUVs, Hatchbacks, and Luxury vehicles available.' },
            { icon: 'bi-wallet2',      color: 'primary', title: 'Best Prices',          text: 'Transparent pricing. Pay only for the days you book.' },
          ].map((f, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 p-3">
                <i className={`bi ${f.icon} text-${f.color}`} style={{ fontSize: '2rem' }}></i>
                <h6 className="fw-bold mt-2">{f.title}</h6>
                <p className="text-muted small mb-0">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
