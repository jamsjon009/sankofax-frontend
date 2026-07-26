'use client'

import Link from 'next/link'
import { Building2, PlusCircle, Star, Heart, ArrowRight, BadgeCheck } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Manage your listings and account</p>
        </div>

        {/* Verified CTA */}
        {user && user.role === 'business_owner' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <BadgeCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Get your Verified badge</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Earn a verification badge on all your listings — from an instant automated check to full certification.{' '}
                <Link href="/dashboard/verification" className="underline font-medium">Start verification →</Link>
              </p>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/business/new-listing"
            className="card p-5 flex items-center gap-4 group hover:border-primary-200"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <PlusCircle className="w-5 h-5 text-primary-700" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-charcoal text-sm group-hover:text-primary-700">Add New Listing</p>
              <p className="text-xs text-muted mt-0.5">Get your business discovered</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary-700 transition-colors" />
          </Link>

          <Link
            href="/dashboard/business"
            className="card p-5 flex items-center gap-4 group hover:border-primary-200"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-primary-700" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-charcoal text-sm group-hover:text-primary-700">My Listings</p>
              <p className="text-xs text-muted mt-0.5">View and manage all listings</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary-700 transition-colors" />
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Building2, label: 'Active Listings', value: '–' },
            { icon: Star, label: 'Reviews Received', value: '–' },
            { icon: Heart, label: 'Total Saves', value: '–' },
          ].map(stat => (
            <div key={stat.label} className="card p-5 text-center">
              <stat.icon className="w-5 h-5 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
              <p className="text-xs text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Upgrade nudge */}
        <div className="card p-5 bg-gradient-to-br from-primary-950 to-primary-800 text-white">
          <p className="font-semibold">Unlock more with Pro</p>
          <p className="text-sm text-white/60 mt-1 mb-4">Get analytics, featured listing slots, and up to 5 listings.</p>
          <Link href="/pricing" className="btn-primary bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold text-sm px-5 py-2">
            View Plans
          </Link>
        </div>
      </div>
    </DashboardShell>
  )
}
