import Link from 'next/link'
import type { Category } from '@/types'

// Lucide icon name → emoji fallback for SSR simplicity
const ICON_MAP: Record<string, string> = {
  'utensils': '🍽️',
  'heart-pulse': '💚',
  'stethoscope': '🏥',
  'calendar': '🗓️',
  'plane': '✈️',
  'palette': '🎨',
  'brain': '🧠',
  'shopping-bag': '🛍️',
  'laptop': '💻',
  'sparkles': '✨',
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="section-title text-center mb-2">Browse by Category</h2>
      <p className="text-center text-muted mb-10 text-sm">
        10 curated categories across the global diaspora
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-primary-200 transition-all duration-200 text-center"
          >
            <span className="text-3xl" role="img" aria-label={cat.name}>
              {ICON_MAP[cat.icon] ?? '🌍'}
            </span>
            <span className="text-sm font-medium text-charcoal group-hover:text-primary-700 leading-snug line-clamp-2">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
