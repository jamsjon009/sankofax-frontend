import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import NewsletterForm from '@/components/ui/NewsletterForm'

const links = {
  Discover: [
    { label: 'Directory', href: '/directory' },
    { label: 'Events', href: '/events' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'List Your Business', href: '/list-your-business' },
  ],
  Legal: [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo variant="light" size="md" />
            <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
              The global directory connecting the African diaspora with Black and African-owned businesses, services, and experiences worldwide.
            </p>
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-2">Stay in the loop</p>
              <NewsletterForm variant="dark" />
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-white font-semibold text-sm mb-3">{group}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} SankofaX. All rights reserved.</p>
          <p>Built by the community, for the community.</p>
        </div>
      </div>
    </footer>
  )
}