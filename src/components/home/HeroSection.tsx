'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import type { Category } from '@/types'

const POPULAR = ['Restaurants', 'Wellness', 'Tech Companies', 'Therapists', 'Creatives', 'Hair & Beauty']

export default function HeroSection({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('city', location)
    if (category) params.set('category', category)
    router.push(`/directory?${params}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              <circle cx="30" cy="30" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <span className="badge bg-accent-500/20 text-accent-300 border border-accent-500/30 mb-5">
            The Global Black &amp; African Business Directory
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mt-3 leading-[1.1]">
            The Global Directory for<br />
            <span className="text-accent-400">Black &amp; African-Owned Businesses</span>
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-xl leading-relaxed">
            Discover, support, and connect with Black and African-owned businesses across the diaspora &mdash; restaurants, wellness, tech, creatives, and more.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-10 max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="flex-shrink-0 bg-white/10 border-0 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-white/30 cursor-pointer appearance-none min-w-[160px]"
            >
              <option value="">All categories</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug} className="text-charcoal">{c.name}</option>
              ))}
            </select>

            <div className="hidden sm:block w-px bg-white/20 my-1" />

            <div className="flex items-center gap-2 flex-1 px-2">
              <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search businesses..."
                className="bg-transparent border-0 text-white placeholder:text-white/40 text-sm flex-1 focus:outline-none"
              />
            </div>

            <div className="hidden sm:block w-px bg-white/20 my-1" />

            <div className="flex items-center gap-2 flex-1 px-2">
              <MapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City or country..."
                className="bg-transparent border-0 text-white placeholder:text-white/40 text-sm flex-1 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn-primary rounded-xl bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold px-6 py-2.5 flex-shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-2 items-center">
          <span className="text-white/40 text-sm">Popular:</span>
          {POPULAR.map(term => (
            <button
              key={term}
              onClick={() => router.push(`/directory?q=${encodeURIComponent(term)}`)}
              className="text-sm text-white/60 hover:text-white border border-white/15 hover:border-white/30 rounded-full px-3 py-1 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-8">
          {[
            { label: 'Listed Businesses', value: '2,400+' },
            { label: 'Countries Covered', value: '54+' },
            { label: 'Categories', value: '10+' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/50 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}