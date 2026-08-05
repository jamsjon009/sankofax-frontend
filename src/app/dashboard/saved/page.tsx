'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, HeartOff, Search, Loader2 } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import ListingCardComponent from '@/components/listings/ListingCard'
import ListingCardSkeleton from '@/components/listings/ListingCardSkeleton'
import { savedListings } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import type { ListingCard } from '@/types'

export default function SavedPage() {
  const [items, setItems] = useState<ListingCard[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    const token = tokenStore.getAccess()
    if (!token) { setLoading(false); return }
    savedListings.list(token)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  async function remove(slug: string) {
    const token = tokenStore.getAccess()
    if (!token) return
    setRemoving(slug)
    try {
      await savedListings.toggle(token, slug)
      setItems(prev => prev.filter(l => l.slug !== slug))
    } catch {
      // leave it in place on failure
    } finally {
      setRemoving(null)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary-600" /> Saved Businesses
            </h1>
            <p className="text-muted text-sm mt-1">
              {loading ? 'Loading your saved listings…' : `${items.length} saved ${items.length === 1 ? 'business' : 'businesses'}`}
            </p>
          </div>
          <Link href="/directory" className="btn-outline gap-2 hidden sm:inline-flex">
            <Search className="w-4 h-4" /> Browse Directory
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center">
              <Heart className="w-7 h-7 text-primary-400" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-charcoal">No saved businesses yet</h2>
            <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
              Tap the heart on any business in the directory to save it here for quick access.
            </p>
            <Link href="/directory" className="btn-primary mt-5 gap-2 inline-flex">
              <Search className="w-4 h-4" /> Explore the Directory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(listing => (
              <div key={listing.id} className="relative group/saved">
                <button
                  onClick={() => remove(listing.slug)}
                  disabled={removing === listing.slug}
                  className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-60"
                  aria-label="Remove from saved"
                  title="Remove from saved"
                >
                  {removing === listing.slug
                    ? <Loader2 className="w-4 h-4 animate-spin text-charcoal" />
                    : <HeartOff className="w-4 h-4 text-red-500" />}
                </button>
                <ListingCardComponent listing={listing} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
