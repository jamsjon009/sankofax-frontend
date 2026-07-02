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
