'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/directory', label: 'Directory' },
  { href: '/community', label: 'Community' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex-shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive(link.href)
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-charcoal hover:bg-surface-2',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  pathname.startsWith('/dashboard')
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-charcoal hover:bg-surface-2',
                )}>
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

          {/* Mobile toggle */}
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
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block py-2 px-3 rounded-xl text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-charcoal hover:text-primary-700',
                )}
              >
                {link.label}
              </Link>
            ))}
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