'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, ExternalLink, Loader2, Store, Minus, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { marketplace } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { cn, apiError } from '@/lib/utils'

const STOCK: Record<Product['stock_status'], { label: string; cls: string }> = {
  in_stock: { label: 'In Stock', cls: 'bg-green-50 text-green-700 border-green-200' },
  made_to_order: { label: 'Made to Order', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  out_of_stock: { label: 'Out of Stock', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { user } = useAuth()
  const [qty, setQty] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const cover = product.images[0]?.image ?? null
  const soldOut = product.stock_status === 'out_of_stock'
  const stock = STOCK[product.stock_status]
  const lineTotal = (Number(product.price) * qty).toFixed(2)

  async function buy() {
    const token = tokenStore.getAccess()
    if (!token) return
    setBusy(true); setError('')
    try {
      const { checkout_url } = await marketplace.checkout(token, {
        items: [{ product: product.slug, quantity: qty }],
        contact_name: name || user?.email?.split('@')[0] || 'Customer',
        contact_email: email || user?.email || '',
        shipping_address: address,
      })
      window.location.href = checkout_url
    } catch (e) {
      setError(apiError(e, 'Could not start checkout.'))
      setBusy(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-2">
            {cover ? (
              <Image src={cover} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {product.images.slice(0, 5).map(img => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-surface-2">
                  <Image src={img.image} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details + buy */}
        <div>
          <Link href={`/company/${product.company_slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline mb-2">
            <Store className="w-4 h-4" /> {product.company_name}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl font-bold text-charcoal">{product.currency} {product.price}</span>
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', stock.cls)}>{stock.label}</span>
          </div>

          <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line mb-8">{product.description}</p>

          {/* Buy card */}
          <div className="card p-6">
            {soldOut ? (
              <p className="text-sm text-muted text-center py-2">This product is currently out of stock.</p>
            ) : !user ? (
              <div className="text-center">
                <p className="text-sm text-muted mb-3">Sign in to purchase securely with card.</p>
                <Link href={`/login?next=/marketplace/${product.slug}`} className="btn-primary w-full">Sign in to buy</Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary-300">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-semibold">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(99, q + 1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary-300">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="input" />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder={user.email} className="input" />
                </div>
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
                  placeholder="Shipping address" className="input resize-none" />

                {error && <p className="text-xs text-red-600">{error}</p>}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-muted">Total</span>
                  <span className="text-lg font-bold text-charcoal">{product.currency} {lineTotal}</span>
                </div>
                <button onClick={buy} disabled={busy} className="btn-primary w-full gap-2">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                  {busy ? 'Redirecting to checkout…' : 'Buy now'}
                </button>
                <p className="text-[11px] text-muted text-center">Secure payment by card via Stripe.</p>
              </div>
            )}

            {product.external_purchase_url && !soldOut && (
              <a href={product.external_purchase_url} target="_blank" rel="noopener noreferrer"
                className="btn-outline w-full gap-1.5 mt-3 text-sm">
                Buy on {product.company_name}’s site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
