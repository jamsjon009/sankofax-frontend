'use client'

import Cookies from 'js-cookie'
import type { User } from '@/types'

const ACCESS_KEY = 'dd_access'
const REFRESH_KEY = 'dd_refresh'
const USER_KEY = 'dd_user'

export const tokenStore = {
  set(access: string, refresh: string, user: User) {
    Cookies.set(ACCESS_KEY, access, { expires: 1 })
    Cookies.set(REFRESH_KEY, refresh, { expires: 7 })
    localStorage.setItem(USER_KEY, JSON.stringify(user))
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
