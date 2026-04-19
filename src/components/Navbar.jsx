import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logoutUser, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        <i className="bi bi-car-front-fill me-2 text-warning"></i>CarRental
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/vehicles">Browse Cars</Link>
          </li>
          {user && (
            <li className="nav-item">
              <Link className="nav-link" to="/my-bookings">My Bookings</Link>
            </li>
          )}
          {user && isAdmin() && (
            <li className="nav-item">
              <Link className="nav-link text-warning" to="/admin">Admin Panel</Link>
            </li>
          )}
        </ul>
        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <li className="nav-item d-flex align-items-center me-3">
                <span className="text-light small">
                  <i className="bi bi-person-circle me-1"></i>{user.email}
                  {isAdmin() && <span className="badge bg-warning text-dark ms-2">Admin</span>}
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item me-2">
                <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-warning btn-sm" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
