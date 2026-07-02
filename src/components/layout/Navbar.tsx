'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/directory" className="btn-ghost text-sm">Directory</Link>
            <Link href="/events" className="btn-ghost text-sm">Events</Link>
            <Link href="/marketplace" className="btn-ghost text-sm">Shop</Link>
            <Link href="/pricing" className="btn-ghost text-sm">Pricing</Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="btn-ghost text-sm gap-1.5">
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={logout} className="btn-ghost text-sm text-muted">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link href="/list-your-business" className="btn-primary text-sm">List your business</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link href="/directory" className="block py-2 text-sm font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Directory</Link>
            <Link href="/events" className="block py-2 text-sm font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Events</Link>
            <Link href="/marketplace" className="block py-2 text-sm font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href="/pricing" className="block py-2 text-sm font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-outline w-full justify-center" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="btn-ghost w-full justify-center text-muted">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-outline w-full justify-center" onClick={() => setMobileOpen(false)}>Sign in</Link>
                  <Link href="/list-your-business" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>List your business</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
