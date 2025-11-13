import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { authService } from '../services/api'

interface User {
  id: number
  email: string
  username: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'))
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authService.login(email, password)
      const { access_token } = response.data
      localStorage.setItem('access_token', access_token)
      setToken(access_token)
      
      try {
        const userResponse = await authService.getMe()
        setUser(userResponse.data)
      } catch (err) {
        console.error('Failed to fetch user profile:', err)
        setUser({ id: 0, email, username: '', created_at: new Date().toISOString() })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, username: string, password: string) => {
    setLoading(true)
    try {
      const response = await authService.signup(email, username, password)
      const { access_token } = response.data
      localStorage.setItem('access_token', access_token)
      setToken(access_token)
      
      try {
        const userResponse = await authService.getMe()
        setUser(userResponse.data)
      } catch (err) {
        console.error('Failed to fetch user profile:', err)
        setUser({ id: 0, email, username, created_at: new Date().toISOString() })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
