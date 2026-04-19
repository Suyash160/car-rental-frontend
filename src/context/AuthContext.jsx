import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const roles = JSON.parse(localStorage.getItem('roles') || '[]')
    if (token) setUser({ token, email, roles })
  }, [])

  const loginUser = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('email', data.email)
    localStorage.setItem('roles', JSON.stringify(data.roles))
    setUser({ token: data.token, email: data.email, roles: data.roles })
  }

  const logoutUser = () => {
    localStorage.clear()
    setUser(null)
  }

  const isAdmin = () => user?.roles?.includes('ADMIN')

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
