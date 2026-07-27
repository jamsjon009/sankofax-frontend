'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Package, Store, ShoppingBag, CheckCircle2, Check, X } from 'lucide-react'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { marketplace } from '@/lib/api'
import { tokenStore } from '@/lib/auth'
import type { Order, OrderStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_UI: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending payment', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  paid: { label: 'Paid', cls: 'text-green-700 bg-green-50 border-green-200' },
  fulfilled: { label: 'Fulfilled', cls: 'text-primary-700 bg-primary-50 border-primary-200' },
  cancelled: { label: 'Cancelled', cls: 'text-red-600 bg-red-50 border-red-200' },
  refunded: { label: 'Refunded', cls: 'text-gray-600 bg-gray-50 border-gray-200' },
}

function OrdersInner() {
  const search = useSearchParams()
  const justPaid = search.get('success')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (r: 'buyer' | 'seller') => {
    const token = tokenStore.getAccess()
    if (!token) return
    setLoading(true)
    try {
      setOrders(await marketplace.orders(token, r))
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(role) }, [role, load])

  async function setStatus(o: Order, status: OrderStatus) {
    const token = tokenStore.getAccess()
    if (!token) return
    setOrders(prev => prev.map(x => (x.id === o.id ? { ...x, status } : x)))
    await marketplace.updateOrder(token, o.order_number, status).catch(() => load(role))
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-charcoal mb-1">Orders</h1>
        <p className="text-muted text-sm mb-6">Your marketplace purchases and sales.</p>

        {justPaid && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 mb-6 text-sm text-green-800">
            <CheckCircle2 className="w-4 h-4" /> Payment complete — order {justPaid} is confirmed.
          </div>
        )}

        <div className="flex gap-1 mb-6 border-b border-gray-100">
          {([['buyer', 'My Purchases', ShoppingBag], ['seller', 'Sales', Store]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setRole(key)}
              className={cn('flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                role === key ? 'border-primary-700 text-primary-700' : 'border-transparent text-muted hover:text-charcoal')}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[0, 1].map(i => <div key={i} className="skeleton h-28 w-full rounded-xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-muted text-sm">{role === 'buyer' ? 'No purchases yet.' : 'No sales yet.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => {
              const s = STATUS_UI[o.status]
              return (
                <div key={o.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-xs text-muted">{o.order_number}</p>
                      <p className="font-semibold text-charcoal">
                        {role === 'buyer' ? o.company_name : o.contact_name}
                      </p>
                    </div>
                    <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border', s.cls)}>{s.label}</span>
                  </div>

                  <ul className="text-sm text-charcoal space-y-1 mb-3">
                    {o.items.map(it => (
                      <li key={it.id} className="flex justify-between gap-3">
                        <span>{it.quantity} × {it.name}</span>
                        <span className="text-muted">{o.currency} {it.subtotal}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm font-bold text-charcoal">Total: {o.currency} {o.total}</span>
                    {role === 'seller' && o.status === 'paid' && (
                      <div className="flex gap-2">
                        <button onClick={() => setStatus(o, 'fulfilled')} className="btn-primary text-xs gap-1.5 py-1.5">
                          <Check className="w-3.5 h-3.5" /> Mark fulfilled
                        </button>
                        <button onClick={() => setStatus(o, 'cancelled')} className="btn-outline text-xs gap-1.5 py-1.5 text-red-600 border-red-200 hover:bg-red-50">
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {o.shipping_address && role === 'seller' && (
                    <p className="text-xs text-muted mt-2">Ship to: {o.shipping_address}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersInner />
    </Suspense>
  )
}
