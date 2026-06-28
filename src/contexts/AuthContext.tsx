import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'maintenance_manager' | 'regional_supervisor' | 'technician'
  region?: string
}

interface AuthContextType {
  user: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Demo mode: when Supabase is not configured
const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co'

const DEMO_STORAGE_KEY = 'ipt_demo_user'

function getDemoUser(): Profile | null {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

function saveDemoUser(profile: Profile) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(profile))
}

function clearDemoUser() {
  localStorage.removeItem(DEMO_STORAGE_KEY)
}

async function fetchOrCreateProfile(user: User): Promise<Profile> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (data) return data as Profile

  const newProfile: Profile = {
    id: user.id,
    email: user.email ?? '',
    full_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
    role: 'super_admin',
  }
  await supabase.from('profiles').insert(newProfile)
  return newProfile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (DEMO_MODE) {
      const stored = getDemoUser()
      setUser(stored)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        const profile = await fetchOrCreateProfile(session.user)
        setUser(profile)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        const profile = await fetchOrCreateProfile(session.user)
        setUser(profile)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (DEMO_MODE) {
      const profile: Profile = {
        id: crypto.randomUUID(),
        email,
        full_name: email.split('@')[0],
        role: 'super_admin',
      }
      saveDemoUser(profile)
      setUser(profile)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (DEMO_MODE) {
      const profile: Profile = {
        id: crypto.randomUUID(),
        email,
        full_name: fullName,
        role: 'super_admin',
      }
      saveDemoUser(profile)
      setUser(profile)
      return
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    if (DEMO_MODE) {
      const profile: Profile = {
        id: crypto.randomUUID(),
        email: 'demo@iptpowertech.com',
        full_name: 'Demo User',
        role: 'super_admin',
      }
      saveDemoUser(profile)
      setUser(profile)
      return
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (DEMO_MODE) {
      clearDemoUser()
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
