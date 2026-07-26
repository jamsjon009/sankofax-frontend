import type { Metadata } from 'next'
import CategoryLanding from '@/components/blog/CategoryLanding'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Business stories and legacy — founders and companies thriving across the African diaspora.',
}

export default function StoriesPage() {
  return (
    <CategoryLanding
      categorySlug="success-stories"
      eyebrow="Business Stories & Legacy"
      title="Success Stories"
      subtitle="Real journeys from founders and businesses building lasting legacies across the diaspora."
      emptyEmoji="🏆"
      emptyText="No success stories published yet."
    />
  )
}
