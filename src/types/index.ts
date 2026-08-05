export interface User {
  id: string
  email: string
  phone_number: string
  role: 'visitor' | 'business_owner' | 'moderator' | 'staff' | 'admin' | 'super_admin'
  is_verified: boolean
  region: 'global_north' | 'global_south'
  avatar: string | null
  date_joined: string
}

/** Roles that can create and manage a business (list, sell, verify). */
export function isBusinessRole(user: Pick<User, 'role'> | null | undefined): boolean {
  if (!user) return false
  return ['business_owner', 'moderator', 'staff', 'admin', 'super_admin'].includes(user.role)
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
  business_type: string
  business_type_display: string
  listing_status: string
  view_count: number
  category_name: string
  category_slug: string
  company_name: string
  company_verified: boolean
  company_verification_level: number
  company_verification_label: string
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
  company_founder_story: string
  company_services: string[]
  company_socials: Record<string, string>
  is_saved: boolean
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

// Community / Discussion Forum (item #14)
export interface ForumCategory {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  order: number
  thread_count: number
}

export interface ForumThread {
  id: string
  title: string
  slug: string
  author_name: string
  category_name: string
  category_slug: string
  is_pinned: boolean
  is_locked: boolean
  reply_count: number
  view_count: number
  excerpt: string
  created_at: string
  last_activity_at: string
}

export interface ForumReply {
  id: number
  author_name: string
  body: string
  created_at: string
}

export interface ForumThreadDetail {
  id: string
  title: string
  slug: string
  body: string
  author_name: string
  is_author: boolean
  category: ForumCategory
  is_pinned: boolean
  is_locked: boolean
  reply_count: number
  view_count: number
  created_at: string
  last_activity_at: string
  replies: ForumReply[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Events & in-platform RSVP / ticketing (item #16)
export interface EventRegistration {
  id: string
  name: string
  email: string
  quantity: number
  note: string
  status: 'confirmed' | 'waitlisted' | 'cancelled'
  ticket_code: string
  checked_in: boolean
  checked_in_at: string | null
  created_at: string
}

export interface EventItem {
  id: string
  slug: string
  title: string
  description: string
  city: string
  country: string
  venue_name: string
  latitude: string | null
  longitude: string | null
  start_datetime: string
  end_datetime: string
  timezone: string
  is_virtual: boolean
  virtual_link: string
  cover_image: string | null
  ticket_url: string
  ticket_price: string | null
  currency: string
  organizer: string
  organizer_name: string
  status: string
  // RSVP
  rsvp_enabled: boolean
  capacity: number | null
  allow_waitlist: boolean
  registration_deadline: string | null
  confirmed_count: number
  spots_left: number | null
  is_full: boolean
  registration_open: boolean
  registration_closes_at: string
  my_registration: EventRegistration | null
}

// Marketplace: products, services, orders, bookings (item #17)
export interface ProductImage {
  id: number
  image: string
  order: number
}

export interface Product {
  id: string
  slug: string
  company: string
  company_name: string
  company_slug: string
  category: number
  name: string
  description: string
  price: string
  currency: string
  stock_status: 'in_stock' | 'out_of_stock' | 'made_to_order'
  external_purchase_url: string
  is_active: boolean
  images: ProductImage[]
  created_at: string
}

export interface Service {
  id: string
  slug: string
  company: string
  company_name: string
  company_slug: string
  category: number
  name: string
  description: string
  price: string
  currency: string
  duration_minutes: number
  is_virtual: boolean
  location: string
  is_active: boolean
  created_at: string
}

export interface OrderItem {
  id: number
  product: string | null
  product_slug: string | null
  name: string
  unit_price: string
  quantity: number
  subtotal: string
}

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'

export interface Order {
  id: string
  order_number: string
  company: string
  company_name: string
  buyer_name: string
  status: OrderStatus
  currency: string
  total: string
  contact_name: string
  contact_email: string
  shipping_address: string
  note: string
  items: OrderItem[]
  paid_at: string | null
  created_at: string
  updated_at: string
}

export type BookingStatus =
  | 'pending_payment' | 'pending' | 'confirmed' | 'completed' | 'declined' | 'cancelled'

export interface ServiceBooking {
  id: string
  booking_number: string
  service: string | null
  service_slug: string | null
  service_name: string
  company: string
  company_name: string
  customer_name: string
  scheduled_for: string
  status: BookingStatus
  currency: string
  total: string
  contact_name: string
  contact_email: string
  note: string
  paid_at: string | null
  created_at: string
  updated_at: string
}

// Story-promotion packages (item #18)
export type StoryKind = 'founder_story' | 'brand_feature' | 'press_release'

export interface StoryPackage {
  id: number
  name: string
  slug: string
  kind: StoryKind
  kind_label: string
  price: string
  your_price: string
  currency: string
  duration_days: number
  subscriber_discount_percent: number
  description: string
  features_list: string[]
}

export type StorySubmissionStatus = 'pending_payment' | 'in_review' | 'published' | 'rejected'

export interface StorySubmission {
  id: string
  reference: string
  package: number
  package_name: string
  kind: StoryKind
  kind_label: string
  company: string
  company_name: string
  title: string
  body: string
  cover_image: string | null
  contact_email: string
  amount: string
  currency: string
  status: StorySubmissionStatus
  admin_note: string
  post_slug: string | null
  featured_until: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface MyTicket extends EventRegistration {
  event: {
    id: string
    title: string
    slug: string
    city: string
    country: string
    venue_name: string
    is_virtual: boolean
    start_datetime: string
    end_datetime: string
    cover_image: string | null
    status: string
  }
}

export interface AttendeeList {
  event: string
  capacity: number | null
  confirmed_count: number
  waitlist_count: number
  attendees: EventRegistration[]
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
  founder_story: string
  services: string
  services_list: string[]
  instagram_url: string
  facebook_url: string
  twitter_url: string
  linkedin_url: string
  youtube_url: string
  tiktok_url: string
  social_links: Record<string, string>
  website: string
  contact_email: string
  contact_phone: string
  is_verified: boolean
  verification_level: number
  verification_label: string
  verified_at: string | null
  verification_expires_at: string | null
  is_verification_expired: boolean
  badges: IdentityBadge[]
  created_at: string
}

// Verification tiers & workflow (item #12)
export interface VerificationCheck {
  key: string
  label: string
  passed: boolean
}

export interface VerificationRequest {
  id: number
  company_slug: string
  company_name: string
  requested_level: number
  requested_level_label: string
  status: 'pending' | 'approved' | 'rejected'
  documents: string | null
  note: string
  admin_notes: string
  reviewed_at: string | null
  created_at: string
}

export interface VerificationStatus {
  company_slug: string
  company_name: string
  verification_level: number
  verification_label: string
  verified_at: string | null
  verification_expires_at: string | null
  is_expired: boolean
  automated_checks: VerificationCheck[]
  passes_automated: boolean
  has_pending: boolean
  latest_request: VerificationRequest | null
}
