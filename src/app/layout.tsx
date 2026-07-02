import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'SankofaX â€” Global Black & African Business Directory',
    template: '%s | SankofaX',
  },
  description: 'Find Black-owned and African businesses, wellness retreats, healthcare providers, tech companies, and more worldwide.',
  keywords: ['Black-owned businesses', 'African diaspora', 'Black directory', 'African businesses worldwide'],
  openGraph: {
    type: 'website',
    siteName: 'SankofaX',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
