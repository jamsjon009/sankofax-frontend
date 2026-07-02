'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Search, ShoppingBag, ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { PaginatedResponse } from '@/types'
import { cn } from '@/lib/utils'

interface ProductImage {
  id: number
  image: string
  order: number
}

interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: string
  currency: string
  stock_status: 'in_stock' | 'out_of_stock' | 'made_to_order'
  external_purchase_url: string
  company_name: string
  images: ProductImage[]
}

interface Props {
  data: PaginatedResponse<Product>
  initialFilters: Record<string, string>
}

const STOCK_STYLES: Record<string, string> = {
  in_stock: 'bg-green-50 text-green-700',
  out_of_stock: 'bg-gray-50 text-gray-500',
  made_to_order: 'bg-amber-50 text-amber-700',
}
const STOCK_LABELS: Record<string, string> = {
  in_stock: 'In Stock',
  out_of_stock: 'Out of Stock',
  made_to_order: 'Made to Order',
}

export default function MarketplaceClient({ data, initialFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [filters, setFilters] = useState<Record<string, string | undefined>>(initialFilters)

  const updateFilters = useCallback((updates: Record<string, string | undefined>) => {
    const next = { ...filters, ...updates, page: undefined }
    setFilters(next)
    const params = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
    startTransition(() => router.push(`${pathname}?${params}`))
  }, [filters, pathname, router])

  const totalPages = Math.ceil(data.count / 12)
  const currentPage = Number(filters.page ?? 1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">Marketplace</h1>
        <p className="text-muted">Shop unique products from Black and African-owned businesses worldwide</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            defaultValue={filters.search}
            placeholder="Search products…"
            className="input pl-10"
            onChange={e => updateFilters({ search: e.target.value || undefined })}
          />
        </div>
        <select
          className="input sm:w-48"
          value={filters.stock_status ?? ''}
          onChange={e => updateFilters({ stock_status: e.target.value || undefined })}
        >
          <option value="">All availability</option>
          <option value="in_stock">In Stock</option>
          <option value="made_to_order">Made to Order</option>
        </select>
        <select
          className="input sm:w-44"
          value={filters.ordering ?? '-created_at'}
          onChange={e => updateFilters({ ordering: e.target.value })}
        >
          <option value="-created_at">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </div>

      {/* Active chips */}
      {Object.entries(filters).some(([k, v]) => v && k !== 'page' && k !== 'ordering') && (
        <div className="flex gap-2 flex-wrap mb-5">
          {Object.entries(filters).map(([k, v]) =>
            v && k !== 'page' && k !== 'ordering' ? (
              <span key={k} className="badge bg-primary-50 text-primary-700 border border-primary-200 gap-1.5">
                {k}: {v}
                <button onClick={() => updateFilters({ [k]: undefined })}><X className="w-3 h-3" /></button>
              </span>
            ) : null,
          )}
        </div>
      )}

      <p className="text-sm text-muted mb-6">{isPending ? 'Loading…' : `${data.count} products`}</p>

      {data.results.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-charcoal mb-2">No products yet</h3>
          <p className="text-muted text-sm">Black-owned products are being listed — check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button disabled={currentPage <= 1} onClick={() => updateFilters({ page: String(currentPage - 1) })} className="btn-outline px-3 py-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => updateFilters({ page: String(currentPage + 1) })} className="btn-outline px-3 py-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0]?.image ?? null

  return (
    <div className="card overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative aspect-square bg-surface-2 overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
        )}
        <span className={cn('absolute top-2 left-2 badge text-[9px] font-semibold', STOCK_STYLES[product.stock_status])}>
          {STOCK_LABELS[product.stock_status]}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-muted mb-0.5 truncate">{product.company_name}</p>
        <h3 className="text-sm font-semibold text-charcoal line-clamp-2 mb-2 leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between gap-1 mt-auto">
          <span className="text-sm font-bold text-charcoal">
            {product.currency} {product.price}
          </span>
          {product.external_purchase_url && product.stock_status !== 'out_of_stock' && (
            <a
              href={product.external_purchase_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-[10px] px-2 py-1 gap-1"
            >
              Buy
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
