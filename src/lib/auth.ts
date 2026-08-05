'use client'

import Cookies from 'js-cookie'
import type { User } from '@/types'

const ACCESS_KEY = 'dd_access'
const REFRESH_KEY = 'dd_refresh'
const USER_KEY = 'dd_user'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export const tokenStore = {
  set(access: string, refresh: string, user: User) {
    Cookies.set(ACCESS_KEY, access, { expires: 1 })
    Cookies.set(REFRESH_KEY, refresh, { expires: 7 })
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  setAccess(access: string) {
    Cookies.set(ACCESS_KEY, access, { expires: 1 })
  },
  getAccess: () => Cookies.get(ACCESS_KEY),
  getRefresh: () => Cookies.get(REFRESH_KEY),
  getUser: (): User | null => {
    try {
      const s = localStorage.getItem(USER_KEY)
      return s ? JSON.parse(s) : null
    } catch { return null }
  },
  clear() {
    Cookies.remove(ACCESS_KEY)
    Cookies.remove(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
  },
  isLoggedIn: () => !!Cookies.get(ACCESS_KEY),
}

// De-duplicate concurrent refreshes so a burst of 401s triggers only one call.
let refreshInFlight: Promise<string | null> | null = null

/**
 * Exchange the stored refresh token for a fresh access token (SimpleJWT
 * `/auth/refresh/`). Returns the new access token, or null if refreshing
 * failed (e.g. the refresh token itself expired) — in which case the caller
 * should treat the user as logged out.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight
  const refresh = tokenStore.getRefresh()
  if (!refresh) return Promise.resolve(null)

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })
      if (!res.ok) return null
      const data = await res.json()
      if (data.access) tokenStore.setAccess(data.access)
      if (data.refresh) Cookies.set(REFRESH_KEY, data.refresh, { expires: 7 })
      return data.access ?? null
    } catch {
      return null
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}
