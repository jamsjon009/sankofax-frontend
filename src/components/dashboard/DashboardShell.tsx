'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Building2, PlusCircle, User, CreditCard, LogOut, MessageSquareQuote, Inbox, BadgeCheck, Ticket } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/inbox', label: 'Inbox', icon: Inbox },
  { href: '/dashboard/tickets', label: 'My Tickets', icon: Ticket },
  { href: '/dashboard/business', label: 'My Listings', icon: Building2 },
  { href: '/dashboard/business/new-listing', label: 'Add Listing', icon: PlusCircle },
  { href: '/dashboard/verification', label: 'Verification', icon: BadgeCheck },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/testimonial', label: 'My Testimonial', icon: MessageSquareQuote },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

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
                <p className="text-[10px] text-muted capitalize mt-0.5">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-0.5 flex-1">
            {NAV.map(item => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== '/dashboard'
              const exactActive = item.exact && pathname === item.href
              const isActive = item.exact ? exactActive : active
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-muted hover:text-charcoal hover:bg-surface-2',
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
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
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
