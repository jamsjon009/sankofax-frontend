import type { Metadata } from 'next'
import CategoryLanding from '@/components/blog/CategoryLanding'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Diaspora News',
  description: 'News and updates from across the global African diaspora.',
}

export default function NewsPage() {
  return (
    <CategoryLanding
      categorySlug="diaspora-news"
      eyebrow="From Across the Diaspora"
      title="Diaspora News"
      subtitle="The latest news, events and opportunities from the global African diaspora community."
      emptyEmoji="📰"
      emptyText="No news published yet."
    />
  )
}
