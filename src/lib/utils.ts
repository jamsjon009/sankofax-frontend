import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRating(rating: number) {
  return rating.toFixed(1)
}

export function getPriceLabel(range: string) {
  const labels: Record<string, string> = {
    '$': 'Budget', '$$': 'Mid-range', '$$$': 'Upscale', '$$$$': 'Luxury',
  }
  return labels[range] ?? range
}

export function mediaUrl(path: string | null | undefined) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_MEDIA_URL ?? 'http://localhost:8000'}${path}`
}

export function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '…' : str
}

/** Extract a human-readable message from a thrown API error (DRF returns
 * strings, {detail}, arrays, or {field: [msg]} shapes). */
export function apiError(e: unknown, fallback = 'Something went wrong.'): string {
  const err = e as { data?: unknown; message?: string }
  const d = err?.data
  if (typeof d === 'string') return d
  if (Array.isArray(d) && d.length) return String(d[0])
  if (d && typeof d === 'object') {
    const obj = d as Record<string, unknown>
    if (typeof obj.detail === 'string') return obj.detail
    const first = Object.values(obj)[0]
    if (Array.isArray(first) && first.length) return String(first[0])
    if (typeof first === 'string') return first
  }
  return err?.message || fallback
}
