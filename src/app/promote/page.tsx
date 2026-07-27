import type { Metadata } from 'next'
import PromoteClient from './PromoteClient'

export const metadata: Metadata = {
  title: 'Promote Your Story | SankofaX',
  description: 'Publish your founder story, brand feature or press release to the SankofaX diaspora audience.',
}

export default function PromotePage() {
  return <PromoteClient />
}
