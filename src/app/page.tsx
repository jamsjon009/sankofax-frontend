import { categories, listings, plans, testimonials, faqs, stats, homeContent } from '@/lib/api'
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
  const [catsRaw, featured, northPlans, southPlans, testimonialList, faqList, statsData, content] = await Promise.all([
    categories.list().catch(() => []),
    listings.list({ featured: true, page: 1 }).catch(() => ({ results: [] })),
    plans.list('global_north').catch(() => []),
    plans.list('global_south').catch(() => []),
    testimonials.list().catch(() => []),
    faqs.list().catch(() => []),
    stats.get().catch(() => null),
    homeContent.get().catch(() => null),
  ])
  const cats = Array.isArray(catsRaw) ? catsRaw : ((catsRaw as { results?: typeof catsRaw })?.results ?? [])

  return (
    <>
      <HeroSection categories={cats} stats={statsData} content={content} />
      <CategoryGrid categories={cats} />
      <FeaturedListings listings={featured.results} />
      <WhyListSection content={content} />
      <PricingPreviewSection northPlans={northPlans} southPlans={southPlans} content={content} />
      <MissionVisionSection content={content} />
      <TestimonialsSection testimonials={testimonialList} />
      <LatestBlogsSection />
      <FAQSection faqs={faqList} />
      <CTABanner content={content} />
      <NewsletterSection content={content} />
    </>
  )
}