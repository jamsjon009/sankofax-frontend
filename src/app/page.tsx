import { categories, listings } from '@/lib/api'
import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedListings from '@/components/home/FeaturedListings'
import WhyListSection from '@/components/home/WhyListSection'
import PricingPreviewSection from '@/components/home/PricingPreviewSection'
import MissionVisionSection from '@/components/home/MissionVisionSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import LatestBlogsSection from '@/components/home/LatestBlogsSection'
import FAQSection from '@/components/home/FAQSection'
import CTABanner from '@/components/home/CTABanner'
import NewsletterSection from '@/components/home/NewsletterSection'

export default async function HomePage() {
  const [catsRaw, featured] = await Promise.all([
    categories.list().catch(() => []),
    listings.list({ featured: true, page: 1 }).catch(() => ({ results: [] })),
  ])
  const cats = Array.isArray(catsRaw) ? catsRaw : ((catsRaw as { results?: typeof catsRaw })?.results ?? [])

  return (
    <>
      <HeroSection categories={cats} />
      <CategoryGrid categories={cats} />
      <FeaturedListings listings={featured.results} />
      <WhyListSection />
      <PricingPreviewSection />
      <MissionVisionSection />
      <TestimonialsSection />
      <LatestBlogsSection />
      <FAQSection />
      <CTABanner />
      <NewsletterSection />
    </>
  )
}