import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'maintenance_manager' | 'regional_supervisor' | 'technician'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ipt_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, _password: string) => {
    const mockUser: User = {
      id: '1',
      email,
      full_name: email.split('@')[0],
      role: 'super_admin',
    }
    setUser(mockUser)
    localStorage.setItem('ipt_user', JSON.stringify(mockUser))
  }

  const signUp = async (email: string, _password: string, fullName: string) => {
    const mockUser: User = {
      id: '1',
      email,
      full_name: fullName,
      role: 'super_admin',
    }
    setUser(mockUser)
    localStorage.setItem('ipt_user', JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('ipt_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
