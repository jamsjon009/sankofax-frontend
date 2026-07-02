'use client'

import { useEffect, useRef } from 'react'
import type { ListingCard } from '@/types'

interface Props {
  listings: ListingCard[]
  center?: [number, number]
  zoom?: number
}

declare global {
  interface Window {
    L: typeof import('leaflet')
  }
}

export default function ListingsMap({ listings, center = [20, 0], zoom = 2 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Load Leaflet CSS + JS dynamically (avoids SSR issues)
    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default

      // Fix default marker icon paths broken by webpack
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, { zoomControl: true, scrollWheelZoom: false })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const validListings = listings.filter(
        l => (l as ListingCard & { latitude?: number; longitude?: number }).latitude &&
             (l as ListingCard & { latitude?: number; longitude?: number }).longitude,
      ) as (ListingCard & { latitude: number; longitude: number })[]

      if (validListings.length > 0) {
        const bounds: [number, number][] = validListings.map(l => [l.latitude, l.longitude])
        validListings.forEach(listing => {
          const popup = `
            <div style="min-width:180px">
              <strong style="font-size:13px">${listing.title}</strong><br/>
              <span style="font-size:11px;color:#6b7280">${listing.city}, ${listing.country}</span><br/>
              ${listing.avg_rating > 0 ? `<span style="font-size:11px">⭐ ${listing.avg_rating.toFixed(1)}</span>` : ''}
              <br/><a href="/listing/${listing.slug}" style="font-size:12px;color:#059669;font-weight:600">View Listing →</a>
            </div>
          `
          L.marker([listing.latitude, listing.longitude]).addTo(map).bindPopup(popup)
        })
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 })
      } else {
        map.setView(center, zoom)
      }
    }

    loadLeaflet()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl overflow-hidden border border-gray-100"
      style={{ minHeight: 320 }}
    />
  )
}
