import Link from 'next/link'
import type { Category } from '@/types'

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
            className="group flex flex-col items-center rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-primary-200 transition-all duration-200 text-center overflow-hidden"
          >
            {/* Image */}
            <div className="w-full h-28 bg-surface-2 overflow-hidden">
              {cat.cover_image ? (
                <img
                  src={cat.cover_image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🌍</div>
              )}
            </div>
            {/* Name */}
            <span className="px-3 py-3 text-sm font-medium text-charcoal group-hover:text-primary-700 leading-snug line-clamp-2">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
