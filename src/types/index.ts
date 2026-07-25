export interface User {
  id: string
  email: string
  phone_number: string
  role: 'visitor' | 'business_owner' | 'staff' | 'admin'
  is_verified: boolean
  region: 'global_north' | 'global_south'
  avatar: string | null
  date_joined: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon: string
  description: string
  listing_type: 'business' | 'event' | 'product'
  cover_image: string | null
  subcategories: Category[]
}

export interface Amenity {
  id: number
  name: string
  slug: string
  icon: string
}

export interface IdentityBadge {
  id: number
  name: string
  slug: string
  icon: string
  color: string
  description?: string
}

export interface ListingCard {
  id: string
  slug: string
  title: string
  short_description: string
  city: string
  country: string
  avg_rating: number
  review_count: number
  price_range: string
  featured: boolean
  category_name: string
  category_slug: string
  company_name: string
  company_verified: boolean
  cover_image: string | null
  gallery_images: string[]
  badges: IdentityBadge[]
}

export interface ListingDetail extends Omit<ListingCard, 'gallery_images'> {
  full_description: string
  listing_status: string
  address_line: string
  state: string
  postal_code: string
  latitude: number | null
  longitude: number | null
  phone: string
  email: string
  website: string
  whatsapp: string
  opening_hours: Record<string, string>
  view_count: number
  amenities: Amenity[]
  badges: IdentityBadge[]
  gallery_images: { id: number; image: string; caption: string; order: number }[]
  category: Category
  company_slug: string
  company_logo: string | null
  created_at: string
  published_at: string
}

export interface Review {
  id: number
  listing: string
  user_email: string
  user_avatar: string | null
  rating: number
  title: string
  body: string
  status: string
  owner_reply: string
  owner_reply_at: string | null
  created_at: string
}

export interface Plan {
  id: number
  name: string
  tier_level: number
  region: string
  price: string
  currency: string
  billing_cycle: string
  max_listings: number
  featured_listing_slots: number
  analytics_access: boolean
  priority_support: boolean
  description: string
  features_list: string[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface CompanyProfile {
  id: string
  owner_email: string
  company_name: string
  slug: string
  logo: string | null
  cover_image: string | null
  founded_year: number | null
  company_size: string
  description: string
  website: string
  contact_email: string
  contact_phone: string
  is_verified: boolean
  badges: IdentityBadge[]
  created_at: string
}
