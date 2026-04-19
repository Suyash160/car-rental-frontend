import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const register = (data) => API.post('/auth/register', data)
export const login    = (data) => API.post('/auth/login', data)

// Vehicles
export const getAvailableVehicles  = ()          => API.get('/vehicles/available')
export const getVehiclesByCategory = (cat)       => API.get(`/vehicles/available/category/${cat}`)
export const getVehicleById        = (id)        => API.get(`/vehicles/${id}`)
export const getAllVehicles         = ()          => API.get('/vehicles')
export const addVehicle            = (data)      => API.post('/vehicles', data)
export const updateVehicle         = (id, data)  => API.put(`/vehicles/${id}`, data)
export const deleteVehicle         = (id)        => API.delete(`/vehicles/${id}`)

// Bookings
export const createBooking   = (data) => API.post('/bookings', data)
export const getMyBookings   = ()     => API.get('/bookings/my')
export const cancelBooking   = (id)   => API.put(`/bookings/${id}/cancel`)
export const getAllBookings   = ()     => API.get('/bookings')
export const completeBooking = (id)   => API.put(`/bookings/${id}/complete`)
