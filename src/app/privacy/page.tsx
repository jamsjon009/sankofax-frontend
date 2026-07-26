import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How SankofaX collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return <LegalPage slug="privacy" fallbackTitle="Privacy Policy" />
}
