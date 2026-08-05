'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Building2, PlusCircle, User, CreditCard, LogOut, MessageSquareQuote, Inbox, BadgeCheck, Ticket, Package, CalendarClock, Megaphone, Store, Rocket, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { isBusinessRole } from '@/types'
import { auth as authApi } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import { apiError } from '@/lib/utils'
import { cn } from '@/lib/utils'

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }

// Shown to everyone (visitors + business owners).
const CONSUMER_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/saved', label: 'Saved', icon: Heart },
  { href: '/dashboard/inbox', label: 'Inbox', icon: Inbox },
  { href: '/dashboard/tickets', label: 'My Tickets', icon: Ticket },
  { href: '/dashboard/orders', label: 'My Orders', icon: Package },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: CalendarClock },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/testimonial', label: 'My Testimonial', icon: MessageSquareQuote },
]

// Routes only business owners may open — visitors get an upgrade prompt.
const BUSINESS_ROUTE_PREFIXES = [
  '/dashboard/business',
  '/dashboard/verification',
  '/dashboard/promotions',
  '/dashboard/billing',
]

// Shown only to business owners (and staff/admins).
const BUSINESS_NAV: NavItem[] = [
  { href: '/dashboard/business', label: 'My Listings', icon: Building2 },
  { href: '/dashboard/business/new-listing', label: 'Add Listing', icon: PlusCircle },
  { href: '/dashboard/verification', label: 'Verification', icon: BadgeCheck },
  { href: '/dashboard/promotions', label: 'Story Promotions', icon: Megaphone },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout, refresh } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  async function becomeBusiness() {
    const token = tokenStore.getAccess()
    if (!token) return
    setUpgrading(true)
    try {
      await authApi.upgradeToBusiness(token)
      await refresh()
      router.push('/dashboard/business/new-listing')
    } catch (e) {
      alert(apiError(e, 'Could not upgrade your account. Please try again.'))
    } finally {
      setUpgrading(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="space-y-3 w-64">
          <div className="skeleton h-6 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>
      </div>
    )
  }

  const isBusiness = isBusinessRole(user)

  const renderNav = (item: NavItem) => {
    const active = item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href) && item.href !== '/dashboard'
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors',
          active
            ? 'bg-primary-50 text-primary-700 font-medium'
            : 'text-muted hover:text-charcoal hover:bg-surface-2',
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {item.label}
      </Link>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 flex-shrink-0">
          {/* User pill */}
          <div className="card p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-700">{user.email[0].toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-charcoal truncate">{user.email}</p>
                <p className="text-[10px] text-muted capitalize mt-0.5 flex items-center gap-1">
                  {isBusiness ? <Store className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-0.5 flex-1">
            {CONSUMER_NAV.map(renderNav)}

            {isBusiness ? (
              <>
                <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted/70">
                  Business
                </p>
                {BUSINESS_NAV.map(renderNav)}
              </>
            ) : (
              // Visitors: prompt to upgrade instead of showing business tools.
              <div className="mt-4 rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-3">
                <div className="flex items-center gap-1.5 text-primary-700">
                  <Rocket className="w-4 h-4" />
                  <span className="text-xs font-semibold">List your business</span>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-muted">
                  Become a business owner to add listings, sell, and get verified.
                </p>
                <button
                  onClick={becomeBusiness}
                  disabled={upgrading}
                  className="btn-primary mt-2.5 w-full !py-1.5 !text-xs disabled:opacity-60"
                >
                  {upgrading ? 'Upgrading…' : 'Get started'}
                </button>
              </div>
            )}
          </nav>

          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted hover:text-red-600 hover:bg-red-50 transition-colors mt-4"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {!isBusiness && BUSINESS_ROUTE_PREFIXES.some(p => pathname.startsWith(p)) ? (
            <div className="card p-8 text-center max-w-lg mx-auto">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-primary-700" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-charcoal">This is a business owner feature</h2>
              <p className="mt-2 text-sm text-muted">
                Upgrade your account to a business owner to list your business, sell products and
                services, get verified, and access billing.
              </p>
              <button
                onClick={becomeBusiness}
                disabled={upgrading}
                className="btn-primary mt-5 disabled:opacity-60"
              >
                {upgrading ? 'Upgrading…' : 'Become a business owner'}
              </button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
