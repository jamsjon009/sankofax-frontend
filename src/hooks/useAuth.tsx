'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@/types'
import { tokenStore } from '@/lib/auth'
import { auth } from '@/lib/api'

interface AuthCtx {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = tokenStore.getUser()
    setUser(stored)
    setIsLoading(false)
  }, [])

  async function login(email: string, password: string) {
    const data = await auth.login(email, password)
    tokenStore.set(data.access, data.refresh, data.user)
    setUser(data.user)
  }

  function logout() {
    tokenStore.clear()
    setUser(null)
  }

  async function refresh() {
    const token = tokenStore.getAccess()
    if (!token) return
    try {
      const u = await auth.me(token)
      setUser(u)
      localStorage.setItem('dd_user', JSON.stringify(u))
    } catch {
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
