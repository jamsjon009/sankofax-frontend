import NewsletterForm from '@/components/ui/NewsletterForm'

export default function NewsletterSection() {
  return (
    <section className="bg-primary-950 text-white py-14">
      <div className="max-w-lg mx-auto px-4 text-center">
        <span className="text-3xl">🌱</span>
        <h2 className="text-2xl font-bold mt-3 mb-2">Stay Connected</h2>
        <p className="text-white/60 text-sm mb-6">
          New listings, events, and diaspora news — no spam, unsubscribe anytime.
        </p>
        <NewsletterForm variant="dark" />
      </div>
    </section>
  )
}
