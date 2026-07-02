import { categories, listings } from '@/lib/api'
import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedListings from '@/components/home/FeaturedListings'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import CTABanner from '@/components/home/CTABanner'

export default async function HomePage() {
  const [cats, featured] = await Promise.all([
    categories.list().catch(() => []),
    listings.list({ featured: true, page: 1 }).catch(() => ({ results: [] })),
  ])

  return (
    <>
      <HeroSection categories={cats} />
      <CategoryGrid categories={cats} />
      <FeaturedListings listings={featured.results} />
      <CTABanner />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
