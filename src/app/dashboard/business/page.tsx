'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Building2, Edit, Trash2, Eye, Star, MapPin } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { useAuth } from '@/hooks/useAuth'
import { myListings } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import type { ListingCard } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-50 text-green-700 border-green-200',
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-gray-50 text-gray-600 border-gray-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  suspended: 'bg-orange-50 text-orange-700 border-orange-200',
}

const STATUS_LABELS: Record<string, string> = {
  published: 'Published',
  pending_review: 'In Review',
  draft: 'Draft',
  rejected: 'Rejected',
  suspended: 'Suspended',
}

export default function MyListingsPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<ListingCard[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) return
    myListings.list(token)
      .then(d => setListings(d.results))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(slug: string) {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    const token = tokenStore.getAccess()
    if (!token) return
    setDeleting(slug)
    try {
      await myListings.delete(token, slug)
      setListings(ls => ls.filter(l => l.slug !== slug))
    } catch {
      alert('Failed to delete listing. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">My Listings</h1>
            <p className="text-muted text-sm mt-1">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/dashboard/business/new-listing" className="btn-primary gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Listing
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-5">
                <div className="flex gap-4">
                  <div className="skeleton w-20 h-16 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-5 w-48" />
                    <div className="skeleton h-4 w-32" />
                    <div className="skeleton h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="card p-12 text-center">
            <Building2 className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-charcoal mb-2">No listings yet</h2>
            <p className="text-muted text-sm mb-6">Add your first listing and start connecting with the diaspora community.</p>
            <Link href="/dashboard/business/new-listing" className="btn-primary gap-2 inline-flex">
              <PlusCircle className="w-4 h-4" />
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(listing => (
              <ListingRow
                key={listing.id}
                listing={listing}
                onDelete={handleDelete}
                isDeleting={deleting === listing.slug}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

function ListingRow({
  listing,
  onDelete,
  isDeleting,
}: {
  listing: ListingCard & { listing_status?: string }
  onDelete: (slug: string) => void
  isDeleting: boolean
}) {
  const status = (listing as ListingCard & { listing_status?: string }).listing_status ?? 'published'

  return (
    <div className="card p-5 flex items-start gap-4">
      {/* Thumbnail */}
      <div className="w-20 h-16 rounded-xl bg-surface-2 overflow-hidden flex-shrink-0">
        {listing.cover_image ? (
          <img src={listing.cover_image} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🌍</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-semibold text-charcoal text-sm line-clamp-1">{listing.title}</h3>
          <span className={cn('badge border text-[10px] font-semibold', STATUS_COLORS[status] ?? 'bg-gray-50 text-gray-600 border-gray-200')}>
            {STATUS_LABELS[status] ?? status}
          </span>
          {listing.featured && (
            <span className="badge bg-accent-50 text-accent-700 border border-accent-200 text-[10px] font-semibold">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {listing.city}, {listing.country}
          </span>
          {listing.review_count > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent-400 text-accent-400" />
              {listing.avg_rating.toFixed(1)} ({listing.review_count})
            </span>
          )}
          <span className="badge bg-primary-50 text-primary-700 text-[10px]">{listing.category_name}</span>
        </div>

        {status === 'rejected' && (
          <p className="text-xs text-red-600 mt-1.5">
            This listing was rejected. Edit and resubmit for review.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {status === 'published' && (
          <Link
            href={`/listing/${listing.slug}`}
            className="btn-ghost p-2 rounded-xl text-muted hover:text-primary-700"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
        <Link
          href={`/dashboard/business/listings/${listing.slug}/edit`}
          className="btn-ghost p-2 rounded-xl text-muted hover:text-charcoal"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </Link>
        <button
          onClick={() => onDelete(listing.slug)}
          disabled={isDeleting}
          className="btn-ghost p-2 rounded-xl text-muted hover:text-red-600 disabled:opacity-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

