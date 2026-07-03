'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Logo size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="btn-ghost text-sm">Home</Link>
            <Link href="/about" className="btn-ghost text-sm">About</Link>
            <Link href="/directory" className="btn-ghost text-sm">Directory</Link>
            <Link href="/pricing" className="btn-ghost text-sm">Pricing</Link>
            <Link href="/blog" className="btn-ghost text-sm">Blog</Link>
          </nav>

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

          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/about" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/directory" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Directory</Link>
            <Link href="/pricing" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link href="/blog" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Blog</Link>
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