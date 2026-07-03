'use client'

import { useEffect, useRef } from 'react'

interface Props {
  latitude: number
  longitude: number
  title: string
}

export default function SingleListingMap({ latitude, longitude, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const load = async () => {
      const L = (await import('leaflet')).default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
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

      map.setView([latitude, longitude], 15)
      L.marker([latitude, longitude]).addTo(map).bindPopup(`<strong>${title}</strong>`).openPopup()
    }

    load()
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
  }, [latitude, longitude, title])

  return (
    <div ref={containerRef} className="w-full h-48 rounded-xl overflow-hidden border border-gray-100" />
  )
}
