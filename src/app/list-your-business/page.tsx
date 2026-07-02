import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List Your Business',
  description: 'Add your Black or African-owned business to the global SankofaX.',
}

const STEPS = [
  { n: '01', title: 'Create Your Account', desc: 'Sign up free in under 2 minutes.' },
  { n: '02', title: 'Add Your Company', desc: 'Set up your company profile with logo and description.' },
  { n: '03', title: 'Create a Listing', desc: 'Fill in your business details, location, and photos.' },
  { n: '04', title: 'Choose a Plan', desc: 'Start free or unlock more listings and features.' },
  { n: '05', title: 'Go Live', desc: 'Your listing is reviewed and published â€” usually within 24hrs.' },
]

export default function ListYourBusinessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-4">
          Put Your Business on the Map
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Join thousands of Black and African-owned businesses already connecting with the diaspora community worldwide.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary text-base px-8 py-3 rounded-xl">
            Get Started Free
          </Link>
          <Link href="/pricing" className="btn-outline text-base px-8 py-3 rounded-xl">
            View Pricing
          </Link>
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-primary-100 hidden sm:block" />
        <div className="space-y-8">
          {STEPS.map(step => (
            <div key={step.n} className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-700 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-card relative z-10">
                {step.n}
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-charcoal text-base">{step.title}</h3>
                <p className="text-muted text-sm mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-br from-primary-950 to-primary-800 text-white rounded-3xl p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to grow?</h2>
        <p className="text-white/70 mb-6">Your community is already searching for what you offer.</p>
        <Link href="/register" className="btn-primary bg-accent-500 hover:bg-accent-600 text-charcoal font-semibold px-8 py-3 text-base rounded-xl">
          Start for Free
        </Link>
      </div>
    </div>
  )
}
