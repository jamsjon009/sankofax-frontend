import Link from 'next/link'

export default function CTABanner() {
  return (
    <section className="bg-primary-700 text-white py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Join the Directory. Be Seen. Be Supported. Be SankofaX.
        </h2>
        <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of businesses already connecting with the diaspora community. Get listed in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/list-your-business"
            className="btn-primary bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold text-base px-8 py-3 rounded-xl"
          >
            List Your Business &mdash; Free
          </Link>
          <Link
            href="/pricing"
            className="btn-outline border-white/40 text-white hover:bg-white/10 hover:border-white/60 text-base px-8 py-3 rounded-xl"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </section>
  )
}