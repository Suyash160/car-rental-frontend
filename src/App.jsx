import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute'
import Navbar     from './components/Navbar'
import Home       from './pages/Home'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Vehicles   from './pages/Vehicles'
import MyBookings from './pages/MyBookings'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/vehicles"    element={<Vehicles />} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/admin"       element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="*"            element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
