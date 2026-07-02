'use client'

import { useState, useCallback, useTransition, lazy, Suspense } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, SlidersHorizontal, MapPin, X, ChevronLeft, ChevronRight, Map, Grid3X3 } from 'lucide-react'
import type { Category, PaginatedResponse, ListingCard } from '@/types'
import ListingCardComponent from '@/components/listings/ListingCard'
import ListingCardSkeleton from '@/components/listings/ListingCardSkeleton'
import { cn } from '@/lib/utils'

const ListingsMap = lazy(() => import('@/components/map/ListingsMap'))

const PRICE_RANGES = ['$', '$$', '$$$', '$$$$']
const SORT_OPTIONS = [
  { value: '-avg_rating', label: 'Top Rated' },
  { value: '-view_count', label: 'Most Viewed' },
  { value: '-created_at', label: 'Newest' },
  { value: '-featured', label: 'Featured First' },
]

interface Props {
  categories: Category[]
  data: PaginatedResponse<ListingCard>
  initialFilters: Record<string, string | undefined>
}

export default function DirectoryClient({ categories, data, initialFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState(initialFilters)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  const updateFilters = useCallback((updates: Record<string, string | undefined>) => {
    const next = { ...filters, ...updates, page: undefined }
    setFilters(next)
    const params = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, v)
    })
    startTransition(() => router.push(`${pathname}?${params}`))
  }, [filters, pathname, router])

  const clearFilter = (key: string) => updateFilters({ [key]: undefined })

  const totalPages = Math.ceil(data.count / 12)
  const currentPage = Number(filters.page ?? 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            defaultValue={filters.q}
            placeholder="Search businesses, services…"
            className="input pl-10"
            onChange={e => updateFilters({ q: e.target.value || undefined })}
          />
        </div>

        <div className="relative sm:w-52">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            defaultValue={filters.city}
            placeholder="City or country"
            className="input pl-10"
            onChange={e => updateFilters({ city: e.target.value || undefined })}
          />
        </div>

        <select
          className="input sm:w-44"
          value={filters.ordering ?? '-avg_rating'}
          onChange={e => updateFilters({ ordering: e.target.value })}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* View toggle */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-2.5 transition-colors', viewMode === 'grid' ? 'bg-primary-50 text-primary-700' : 'text-muted hover:bg-surface-2')}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={cn('p-2.5 transition-colors', viewMode === 'map' ? 'bg-primary-50 text-primary-700' : 'text-muted hover:bg-surface-2')}
            aria-label="Map view"
          >
            <Map className="w-4 h-4" />
          </button>
        </div>

        <button
          className="btn-outline sm:hidden gap-2"
          onClick={() => setSidebarOpen(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Active filter chips */}
      {Object.entries(filters).filter(([k, v]) => v && k !== 'ordering' && k !== 'page').length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(filters).map(([k, v]) =>
            v && k !== 'ordering' && k !== 'page' ? (
              <span key={k} className="badge bg-primary-50 text-primary-700 border border-primary-200 gap-1.5">
                {k}: {v}
                <button onClick={() => clearFilter(k)} aria-label={`Remove ${k} filter`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null,
          )}
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 space-y-6 hidden lg:block">
          <FilterSidebar categories={categories} filters={filters} onUpdate={updateFilters} />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted mb-4">
            {isPending ? 'Searching…' : `${data.count} results`}
          </p>

          {viewMode === 'map' ? (
            <Suspense fallback={<div className="h-[480px] bg-surface-2 rounded-xl animate-pulse" />}>
              <div className="h-[480px] mb-6">
                <ListingsMap listings={data.results} />
              </div>
            </Suspense>
          ) : isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }, (_, i) => <ListingCardSkeleton key={i} />)}
            </div>
          ) : data.results.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {data.results.map(l => <ListingCardComponent key={l.id} listing={l} />)}
            </div>
          )}

          {/* Pagination — only in grid mode */}
          {viewMode === 'grid' && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateFilters({ page: String(currentPage - 1) })}
                className="btn-outline px-3 py-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateFilters({ page: String(currentPage + 1) })}
                className="btn-outline px-3 py-2"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-5 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterSidebar categories={categories} filters={filters} onUpdate={(u) => { updateFilters(u); setSidebarOpen(false) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function FilterSidebar({
  categories,
  filters,
  onUpdate,
}: {
  categories: Category[]
  filters: Record<string, string | undefined>
  onUpdate: (u: Record<string, string | undefined>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-charcoal mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => onUpdate({ category: undefined })}
            className={cn('w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors', !filters.category ? 'bg-primary-50 text-primary-700 font-medium' : 'text-muted hover:text-charcoal hover:bg-gray-50')}
          >
            All Categories
          </button>
          {categories.map(c => (
            <button
              key={c.slug}
              onClick={() => onUpdate({ category: c.slug })}
              className={cn('w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors', filters.category === c.slug ? 'bg-primary-50 text-primary-700 font-medium' : 'text-muted hover:text-charcoal hover:bg-gray-50')}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-charcoal mb-3">Price Range</h3>
        <div className="flex gap-2 flex-wrap">
          {PRICE_RANGES.map(p => (
            <button
              key={p}
              onClick={() => onUpdate({ price_range: filters.price_range === p ? undefined : p })}
              className={cn('px-3 py-1 rounded-lg text-sm border transition-colors', filters.price_range === p ? 'bg-primary-700 text-white border-primary-700' : 'border-gray-200 text-muted hover:border-primary-300')}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-charcoal mb-3">Minimum Rating</h3>
        <div className="flex gap-2">
          {[4, 4.5, 5].map(r => (
            <button
              key={r}
              onClick={() => onUpdate({ min_rating: filters.min_rating === String(r) ? undefined : String(r) })}
              className={cn('px-3 py-1 rounded-lg text-sm border transition-colors', filters.min_rating === String(r) ? 'bg-primary-700 text-white border-primary-700' : 'border-gray-200 text-muted hover:border-primary-300')}
            >
              {r}★+
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🔍</p>
      <h3 className="text-lg font-semibold text-charcoal mb-2">No results found</h3>
      <p className="text-muted text-sm">Try adjusting your search or filters.</p>
    </div>
  )
}
