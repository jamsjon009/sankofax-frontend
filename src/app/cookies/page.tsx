import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How SankofaX uses cookies and how you can manage them.',
}

export default function CookiesPage() {
  return <LegalPage slug="cookies" fallbackTitle="Cookie Policy" />
}
