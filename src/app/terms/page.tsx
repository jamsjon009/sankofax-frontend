import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions for using SankofaX.',
}

export default function TermsPage() {
  return <LegalPage slug="terms" fallbackTitle="Terms of Service" />
}
