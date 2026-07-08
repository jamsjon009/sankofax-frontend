import { siteSettings } from '@/lib/api'
import ContactClient from './ContactClient'

export const revalidate = 3600

export default async function ContactPage() {
  const site = await siteSettings.get().catch(() => null)
  return <ContactClient site={site} />
}
