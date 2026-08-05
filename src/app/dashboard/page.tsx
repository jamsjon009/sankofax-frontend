'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Building2, PlusCircle, Star, Heart, ArrowRight, BadgeCheck, Search, Ticket, Inbox, Rocket,
  Eye, Package, CalendarClock, Megaphone, TrendingUp, AlertCircle, CreditCard, Loader2,
} from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { useAuth } from '@/hooks/useAuth'
import { isBusinessRole } from '@/types'
import { myListings, myCompanies, marketplace } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import type { ListingCard, CompanyProfile, Order, ServiceBooking } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const isBusiness = isBusinessRole(user)

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-muted text-sm mt-1">
            {isBusiness ? 'Your business at a glance' : 'Your saved businesses, tickets, and messages'}
          </p>
        </div>

        {isBusiness ? <BusinessOverview role={user?.role} /> : <VisitorOverview />}
      </div>
    </DashboardShell>
  )
}

/* ------------------------------- Business ------------------------------- */

function BusinessOverview({ role }: { role?: string }) {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<ListingCard[]>([])
  const [companies, setCompanies] = useState<CompanyProfile[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [bookings, setBookings] = useState<ServiceBooking[]>([])

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) { setLoading(false); return }
    Promise.allSettled([
      myListings.list(token).then(r => r.results),
      myCompanies.list(token),
      marketplace.orders(token, 'seller'),
      marketplace.bookings(token, 'seller'),
    ]).then(([l, c, o, b]) => {
      if (l.status === 'fulfilled') setListings(l.value)
      if (c.status === 'fulfilled') setCompanies(c.value)
      if (o.status === 'fulfilled') setOrders(o.value)
      if (b.status === 'fulfilled') setBookings(b.value)
    }).finally(() => setLoading(false))
  }, [])

  const published = listings.filter(l => l.listing_status === 'published').length
  const pending = listings.filter(l => l.listing_status === 'pending_review').length
  const totalViews = listings.reduce((s, l) => s + (l.view_count ?? 0), 0)
  const totalReviews = listings.reduce((s, l) => s + (l.review_count ?? 0), 0)
  const rated = listings.filter(l => l.review_count > 0)
  const avgRating = rated.length ? (rated.reduce((s, l) => s + l.avg_rating, 0) / rated.length) : 0

  const pendingOrders = orders.filter(o => o.status === 'paid').length
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const actionItems = pendingOrders + pendingBookings

  const primary = companies[0]

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-sm py-10 justify-center">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading your business…
      </div>
    )
  }

  // No business yet → guide them to create their first listing.
  if (listings.length === 0 && companies.length === 0) {
    return (
      <div className="card p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center">
          <Building2 className="w-7 h-7 text-primary-500" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-charcoal">Let&apos;s get your business online</h2>
        <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
          Create your first listing so the diaspora community can discover, review, and connect with you.
        </p>
        <Link href="/dashboard/business/new-listing" className="btn-primary mt-5 gap-2 inline-flex">
          <PlusCircle className="w-4 h-4" /> Create your first listing
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Things that need attention */}
      {actionItems > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800">You have {actionItems} thing{actionItems > 1 ? 's' : ''} to action</p>
            <p className="text-amber-700 mt-0.5">
              {pendingOrders > 0 && <Link href="/dashboard/orders" className="underline font-medium">{pendingOrders} paid order{pendingOrders > 1 ? 's' : ''} to fulfil</Link>}
              {pendingOrders > 0 && pendingBookings > 0 && ' · '}
              {pendingBookings > 0 && <Link href="/dashboard/bookings" className="underline font-medium">{pendingBookings} booking request{pendingBookings > 1 ? 's' : ''} to confirm</Link>}
            </p>
          </div>
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Building2} label="Published" value={published} sub={pending > 0 ? `${pending} in review` : `${listings.length} total`} />
        <Stat icon={Eye} label="Total Views" value={totalViews.toLocaleString()} />
        <Stat icon={Star} label="Avg Rating" value={avgRating ? avgRating.toFixed(1) : '—'} sub={`${totalReviews} review${totalReviews !== 1 ? 's' : ''}`} />
        <Stat icon={Package} label="To Fulfil" value={actionItems} sub="orders + bookings" />
      </div>

      {/* Verification status */}
      {primary && <VerificationCard company={primary} />}

      {/* Quick actions */}
      <div>
        <p className="text-sm font-semibold text-charcoal mb-3">Quick actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard href="/dashboard/business/new-listing" icon={PlusCircle} title="Add New Listing" subtitle="Get discovered by more people" />
          <ActionCard href="/dashboard/business" icon={Building2} title="Manage Listings" subtitle={`${listings.length} listing${listings.length !== 1 ? 's' : ''}`} />
          <ActionCard href="/dashboard/promotions" icon={Megaphone} title="Promote a Story" subtitle="Feature your founder story" />
          <ActionCard href="/dashboard/billing" icon={CreditCard} title="Billing & Plan" subtitle="Manage your subscription" />
        </div>
      </div>

      {/* Top listings by views */}
      {listings.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary-600" /> Top listings
            </p>
            <Link href="/dashboard/business" className="text-xs text-primary-700 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {[...listings].sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0)).slice(0, 4).map(l => (
              <div key={l.id} className="flex items-center gap-3 py-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-2 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {l.cover_image ? <img src={l.cover_image} alt="" className="w-full h-full object-cover" /> : <span>🌍</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-charcoal truncate">{l.title}</p>
                  <p className="text-[11px] text-muted">{l.category_name}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted flex-shrink-0">
                  <Eye className="w-3.5 h-3.5" /> {(l.view_count ?? 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === 'business_owner' && (
        <div className="card p-5 bg-gradient-to-br from-primary-950 to-primary-800 text-white">
          <p className="font-semibold">Unlock more with a higher plan</p>
          <p className="text-sm text-white/60 mt-1 mb-4">Get analytics, featured slots, and more listings.</p>
          <Link href="/pricing" className="btn-primary bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold text-sm px-5 py-2">
            View Plans
          </Link>
        </div>
      )}
    </>
  )
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Building2; label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-5">
      <Icon className="w-5 h-5 text-primary-600 mb-2" />
      <p className="text-2xl font-bold text-charcoal leading-none">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
      {sub && <p className="text-[11px] text-muted/70 mt-0.5">{sub}</p>}
    </div>
  )
}

function VerificationCard({ company }: { company: CompanyProfile }) {
  const level = company.verification_level ?? 0
  const label = company.verification_label ?? 'Unverified'
  const verified = level >= 1
  return (
    <div className={`rounded-2xl px-5 py-4 flex items-start gap-3 border ${verified ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
      <BadgeCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${verified ? 'text-green-600' : 'text-amber-600'}`} />
      <div className="text-sm flex-1">
        <p className={`font-semibold ${verified ? 'text-green-800' : 'text-amber-800'}`}>
          {verified ? `${company.company_name} is ${label}` : 'Get your Verified badge'}
        </p>
        <p className={`mt-0.5 ${verified ? 'text-green-700' : 'text-amber-700'}`}>
          {verified
            ? 'Your verification badge shows on all your listings.'
            : 'Earn a trust badge — from an instant automated check to full certification.'}
          {' '}
          <Link href="/dashboard/verification" className="underline font-medium">
            {verified ? 'Manage verification →' : 'Start verification →'}
          </Link>
        </p>
      </div>
    </div>
  )
}

/* ------------------------------- Visitor -------------------------------- */

function VisitorOverview() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard href="/directory" icon={Search} title="Browse the Directory" subtitle="Discover diaspora-owned businesses" />
        <ActionCard href="/dashboard/tickets" icon={Ticket} title="My Tickets" subtitle="Events you've registered for" />
        <ActionCard href="/dashboard/inbox" icon={Inbox} title="Inbox" subtitle="Your connection requests" />
        <ActionCard href="/dashboard/saved" icon={Heart} title="Saved Businesses" subtitle="Listings you've bookmarked" />
      </div>

      <div className="card p-6 bg-gradient-to-br from-primary-950 to-primary-800 text-white">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-accent-400" />
          <p className="font-semibold">Have a business? List it on SankofaX</p>
        </div>
        <p className="text-sm text-white/60 mt-1 mb-4">
          Upgrade to a business owner account to add listings, sell products and services, and get a verified badge.
        </p>
        <Link
          href="/dashboard/business/new-listing"
          className="btn-primary bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold text-sm px-5 py-2 inline-flex items-center gap-1.5"
        >
          Become a business owner <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  )
}

/* -------------------------------- Shared -------------------------------- */

function ActionCard({ href, icon: Icon, title, subtitle }: { href: string; icon: typeof Building2; title: string; subtitle: string }) {
  return (
    <Link href={href} className="card p-5 flex items-center gap-4 group hover:border-primary-200">
      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary-700" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-charcoal text-sm group-hover:text-primary-700">{title}</p>
        <p className="text-xs text-muted mt-0.5">{subtitle}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary-700 transition-colors" />
    </Link>
  )
}
