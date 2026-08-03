import type {
  Category, ListingCard, ListingDetail, Review, Plan,
  PaginatedResponse, CompanyProfile, User, Amenity, IdentityBadge,
  VerificationStatus, VerificationRequest,
  ForumCategory, ForumThread, ForumThreadDetail, ForumReply,
  EventItem, EventRegistration, MyTicket, AttendeeList,
  Product, Service, Order, ServiceBooking,
  StoryPackage, StorySubmission,
} from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // Pull headers out of options so the spread below can't overwrite the merged
  // headers (which would drop Content-Type and make DRF reject the body as text/plain).
  const { headers: optionHeaders, ...rest } = options ?? {}
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...optionHeaders },
    ...rest,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw Object.assign(new Error(error.detail ?? 'API error'), { status: res.status, data: error })
  }
  // 204 No Content
  if (res.status === 204) return undefined as T
  return res.json()
}

// Multipart/form-data request (for file uploads)
async function requestForm<T>(path: string, formData: FormData, token: string, method = 'POST'): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw Object.assign(new Error(error.detail ?? 'Upload error'), { status: res.status, data: error })
  }
  return res.json()
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

// Auth
export const auth = {
  register: (data: { email: string; password: string; password2: string; region?: string; country?: string; account_type?: string }) =>
    request<{ access: string; refresh: string; user: User }>('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<{ access: string; refresh: string; user: User }>('/auth/login/', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: (token: string) =>
    request<User>('/auth/me/', { headers: { Authorization: `Bearer ${token}` } }),

  verifyEmail: (token: string) =>
    request<{ detail: string }>('/auth/verify-email/', { method: 'POST', body: JSON.stringify({ token }) }),

  resendVerification: (email: string) =>
    request<{ detail: string }>('/auth/resend-verification/', { method: 'POST', body: JSON.stringify({ email }) }),

  forgotPassword: (email: string) =>
    request<{ detail: string }>('/auth/forgot-password/', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, password: string, password2: string) =>
    request<{ detail: string }>('/auth/reset-password/', { method: 'POST', body: JSON.stringify({ token, password, password2 }) }),
}

// Categories
export const categories = {
  list: () => request<Category[] | { results: Category[] }>('/categories/')
    .then(r => Array.isArray(r) ? r : (r.results ?? [])),
  get: (slug: string) => request<Category>(`/categories/${slug}/`),
}

// Amenities
export const amenities = {
  list: () => request<Amenity[] | { results: Amenity[] }>('/amenities/')
    .then(r => Array.isArray(r) ? r : (r.results ?? [])),
}

// Identity / ownership badges
export const badges = {
  list: () => request<IdentityBadge[] | { results: IdentityBadge[] }>('/badges/')
    .then(r => Array.isArray(r) ? r : (r.results ?? [])),
}

// Authenticated listing CRUD
export const myListings = {
  list: (token: string) =>
    request<PaginatedResponse<ListingCard>>('/listings/?my=true', { headers: authHeader(token) }),

  create: (token: string, data: Record<string, unknown>) =>
    request<ListingDetail>('/listings/', {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),

  update: (token: string, slug: string, data: Record<string, unknown>) =>
    request<ListingDetail>(`/listings/${slug}/`, {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),

  delete: (token: string, slug: string) =>
    request<void>(`/listings/${slug}/`, {
      method: 'DELETE',
      headers: authHeader(token),
    }),

  uploadImage: (token: string, listingId: string, formData: FormData) =>
    requestForm<{ id: number; image: string }>(`/listings/${listingId}/images/`, formData, token),
}

// Authenticated company CRUD
export const myCompanies = {
  // The endpoint is paginated ({count, results}); unwrap to a plain array.
  list: (token: string) =>
    request<PaginatedResponse<CompanyProfile> | CompanyProfile[]>('/companies/', { headers: authHeader(token) })
      .then(r => (Array.isArray(r) ? r : (r.results ?? []))),

  create: (token: string, formData: FormData) =>
    requestForm<CompanyProfile>('/companies/', formData, token),

  update: (token: string, slug: string, formData: FormData) =>
    requestForm<CompanyProfile>(`/companies/${slug}/`, formData, token, 'PATCH'),
}

// Verification tiers & workflow (item #12)
export const verification = {
  status: (token: string, slug: string) =>
    request<VerificationStatus>(`/verification/companies/${slug}/`, { headers: authHeader(token) }),

  requests: (token: string, slug?: string) =>
    request<VerificationRequest[]>(
      `/verification/requests/${slug ? `?company=${slug}` : ''}`,
      { headers: authHeader(token) },
    ),

  // Multipart because Level 2/3 include document uploads.
  submit: (token: string, formData: FormData) =>
    requestForm<{ request: VerificationRequest; status: VerificationStatus }>(
      '/verification/requests/', formData, token),
}

// Reviews management
export const myReviews = {
  reply: (token: string, reviewId: number, owner_reply: string) =>
    request<Review>(`/reviews/${reviewId}/reply/`, {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify({ owner_reply }),
    }),

  submitReview: (token: string, listingSlug: string, data: { rating: number; title: string; body: string }) =>
    request<Review>(`/listings/${listingSlug}/reviews/`, {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),
}

// Listings
export interface ListingFilters {
  category?: string
  company?: string
  business_type?: string
  city?: string
  country?: string
  q?: string
  price_range?: string
  amenities?: string
  badges?: string
  min_rating?: number
  featured?: boolean
  ordering?: string
  page?: number
}

export const listings = {
  list: (filters: ListingFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) params.set(k, String(v))
    })
    return request<PaginatedResponse<ListingCard>>(`/listings/?${params}`)
  },

  get: (slug: string) => request<ListingDetail>(`/listings/${slug}/`),

  reviews: (listingSlug: string) =>
    request<PaginatedResponse<Review>>(`/listings/${listingSlug}/reviews/`),
}

// Site Settings
export interface SiteSettings {
  site_name: string
  meta_description: string
  footer_text: string
  contact_email: string
  contact_phone: string
  contact_address: string
  response_time: string
  map_embed_code: string
  instagram_url: string
  facebook_url: string
  twitter_url: string
  linkedin_url: string
  youtube_url: string
  tiktok_url: string
  instagram_embed_code: string
  google_tag_manager_id: string
  google_analytics_id: string
  google_search_console_code: string
}

export const siteSettings = {
  get: () => request<SiteSettings>('/site-settings/'),
}

// Public homepage stats
export interface PublicStats {
  businesses: number
  members: number
  partnerships: number
  countries: number
}

export const stats = {
  get: () => request<PublicStats>('/stats/'),
}

// Editable homepage marketing copy (admin-managed — item #22)
export interface HomeBenefit {
  title: string
  desc: string
}

export interface HomeContent {
  hero_badge: string
  hero_title: string
  hero_title_highlight: string
  hero_subtitle: string
  hero_popular_searches: string[]
  why_list_title: string
  why_list_subtitle: string
  why_list_benefits: HomeBenefit[]
  mission_title: string
  mission_body: string
  vision_title: string
  vision_body: string
  pricing_title: string
  pricing_subtitle: string
  pricing_note: string
  cta_title: string
  cta_subtitle: string
  newsletter_title: string
  newsletter_subtitle: string
}

export const homeContent = {
  get: () => request<HomeContent>('/home-content/'),
}

// Plans
export const plans = {
  list: (region?: string) => {
    const q = region ? `?region=${region}` : ''
    return request<Plan[] | { results: Plan[] }>(`/plans/${q}`)
      .then(r => Array.isArray(r) ? r : (r.results ?? []))
  },
}

// Companies
export const companies = {
  get: (slug: string) => request<CompanyProfile>(`/companies/${slug}/`),
}

// Testimonials
export interface Testimonial {
  id: number
  body: string
  role: string
  author: string
  initials: string
}

export interface MyTestimonial {
  id: number
  body: string
  role: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export const testimonials = {
  list: () => request<Testimonial[]>('/testimonials/'),
  my: (token: string) =>
    request<MyTestimonial | null>('/testimonials/my/', { headers: authHeader(token) }),
  submit: (token: string, body: string, role: string) =>
    request<{ id: number; status: string }>('/testimonials/my/', {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify({ body, role }),
    }),
}

// FAQs
export interface FAQ {
  question: string
  answer: string
}

export const faqs = {
  list: () => request<FAQ[]>('/faqs/'),
}

// Static / legal pages (Terms, Privacy, Cookies, …) — admin-editable content
export interface StaticPage {
  title: string
  content: string
  updated_at?: string
}

export const pages = {
  get: (slug: string) => request<StaticPage>(`/pages/${slug}/`),
}

// Connections (Connect / Collaborate)
export interface Connection {
  id: string
  kind: 'connect' | 'collaborate'
  subject: string
  message: string
  status: 'pending' | 'accepted' | 'declined'
  is_read: boolean
  sender_name: string
  sender_email: string
  recipient_name: string
  listing_title: string | null
  listing_slug: string | null
  company_name: string | null
  created_at: string
}

export const connections = {
  list: (token: string, box: 'inbox' | 'sent' = 'inbox') =>
    request<PaginatedResponse<Connection> | Connection[]>(`/connections/?box=${box}`, { headers: authHeader(token) })
      .then(r => (Array.isArray(r) ? r : (r.results ?? []))),

  create: (token: string, data: { listing: string; kind: 'connect' | 'collaborate'; subject?: string; message?: string }) =>
    request<Connection>('/connections/', {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),

  updateStatus: (token: string, id: string, data: { status?: 'accepted' | 'declined'; is_read?: boolean }) =>
    request<Connection>(`/connections/${id}/`, {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),

  unreadCount: (token: string) =>
    request<{ unread: number }>('/connections/unread-count/', { headers: authHeader(token) }),
}

// Community / Discussion Forum (item #14)
export const community = {
  categories: () =>
    request<ForumCategory[]>('/community/categories/'),

  threads: (params?: { category?: string; q?: string; page?: number }) => {
    const qs = new URLSearchParams()
    if (params?.category) qs.set('category', params.category)
    if (params?.q) qs.set('q', params.q)
    if (params?.page) qs.set('page', String(params.page))
    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    return request<PaginatedResponse<ForumThread> | ForumThread[]>(`/community/threads/${suffix}`)
  },

  thread: (slug: string) =>
    request<ForumThreadDetail>(`/community/threads/${slug}/`),

  createThread: (token: string, data: { category: string; title: string; body: string }) =>
    request<ForumThreadDetail>('/community/threads/', {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify(data),
    }),

  reply: (token: string, slug: string, body: string) =>
    request<ForumReply>(`/community/threads/${slug}/replies/`, {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify({ body }),
    }),

  deleteThread: (token: string, slug: string) =>
    request<void>(`/community/threads/${slug}/`, { method: 'DELETE', headers: authHeader(token) }),
}

// Events & in-platform RSVP / ticketing (item #16)
export const events = {
  get: (slug: string, token?: string) =>
    request<EventItem>(`/events/${slug}/`, token ? { headers: authHeader(token) } : undefined),

  register: (token: string, slug: string, data: { quantity?: number; note?: string } = {}) =>
    request<EventRegistration>(`/events/${slug}/register/`, {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify({ quantity: data.quantity ?? 1, note: data.note ?? '' }),
    }),

  cancel: (token: string, slug: string) =>
    request<void>(`/events/${slug}/register/`, { method: 'DELETE', headers: authHeader(token) }),

  myTickets: (token: string) =>
    request<MyTicket[]>('/events/my-tickets/', { headers: authHeader(token) }),

  attendees: (token: string, slug: string) =>
    request<AttendeeList>(`/events/${slug}/attendees/`, { headers: authHeader(token) }),

  checkIn: (token: string, slug: string, regId: string, checked_in: boolean) =>
    request<EventRegistration>(`/events/${slug}/attendees/${regId}/check-in/`, {
      method: 'POST',
      headers: authHeader(token),
      body: JSON.stringify({ checked_in }),
    }),
}

// Marketplace: products, services, in-platform checkout & booking (item #17)
export const marketplace = {
  // Products
  products: (params?: { category?: string; company?: string; stock_status?: string; search?: string; ordering?: string; page?: number }) => {
    const q = new URLSearchParams()
    Object.entries(params ?? {}).forEach(([k, v]) => { if (v !== undefined && v !== '') q.set(k, String(v)) })
    const qs = q.toString() ? `?${q}` : ''
    return request<PaginatedResponse<Product>>(`/marketplace/${qs}`)
  },
  product: (slug: string) => request<Product>(`/marketplace/${slug}/`),

  // Services
  services: (params?: { category?: string; company?: string; is_virtual?: boolean; search?: string; ordering?: string; page?: number }) => {
    const q = new URLSearchParams()
    Object.entries(params ?? {}).forEach(([k, v]) => { if (v !== undefined && v !== '') q.set(k, String(v)) })
    const qs = q.toString() ? `?${q}` : ''
    return request<PaginatedResponse<Service>>(`/marketplace/services/${qs}`)
  },
  service: (slug: string) => request<Service>(`/marketplace/services/${slug}/`),

  // Checkout (products) -> Stripe redirect
  checkout: (token: string, data: {
    items: { product: string; quantity: number }[]
    contact_name: string; contact_email: string; shipping_address?: string; note?: string
  }) =>
    request<{ checkout_url: string; order: Order }>('/marketplace/checkout/', {
      method: 'POST', headers: authHeader(token), body: JSON.stringify(data),
    }),

  // Orders
  orders: (token: string, role: 'buyer' | 'seller' = 'buyer') =>
    request<PaginatedResponse<Order> | Order[]>(`/marketplace/orders/?role=${role}`, { headers: authHeader(token) })
      .then(r => (Array.isArray(r) ? r : (r.results ?? []))),
  order: (token: string, orderNumber: string) =>
    request<Order>(`/marketplace/orders/${orderNumber}/`, { headers: authHeader(token) }),
  updateOrder: (token: string, orderNumber: string, status: Order['status']) =>
    request<Order>(`/marketplace/orders/${orderNumber}/`, {
      method: 'PATCH', headers: authHeader(token), body: JSON.stringify({ status }),
    }),

  // Bookings
  book: (token: string, data: {
    service: string; scheduled_for: string; contact_name: string; contact_email: string; note?: string
  }) =>
    request<{ checkout_url: string | null; booking: ServiceBooking }>('/marketplace/bookings/', {
      method: 'POST', headers: authHeader(token), body: JSON.stringify(data),
    }),
  bookings: (token: string, role: 'customer' | 'seller' = 'customer') =>
    request<ServiceBooking[]>(`/marketplace/bookings/?role=${role}`, { headers: authHeader(token) }),
  updateBooking: (token: string, bookingNumber: string, status: ServiceBooking['status']) =>
    request<ServiceBooking>(`/marketplace/bookings/${bookingNumber}/`, {
      method: 'PATCH', headers: authHeader(token), body: JSON.stringify({ status }),
    }),
}

// Story-promotion packages (item #18)
export const promotions = {
  packages: (token?: string) =>
    request<StoryPackage[]>('/promotions/packages/', token ? { headers: authHeader(token) } : undefined),

  // Multipart because the story can include a cover image.
  submit: (token: string, formData: FormData) =>
    requestForm<{ checkout_url: string; submission: StorySubmission }>(
      '/promotions/submissions/', formData, token),

  mySubmissions: (token: string) =>
    request<StorySubmission[]>('/promotions/submissions/', { headers: authHeader(token) }),

  submission: (token: string, reference: string) =>
    request<StorySubmission>(`/promotions/submissions/${reference}/`, { headers: authHeader(token) }),
}

// Newsletter
export const newsletter = {
  subscribe: (email: string, source = 'homepage') =>
    request('/newsletter/subscribe/', { method: 'POST', body: JSON.stringify({ email, source }) }),
}

// Contact
export const contact = {
  send: (data: { name: string; email: string; message: string }) =>
    request('/contact/', { method: 'POST', body: JSON.stringify(data) }),
}

// Blog
export interface BlogPost {
  id: string
  title: string
  slug: string
  author_name: string
  category: { id: number; name: string; slug: string; description: string; post_count: number } | null
  excerpt: string
  cover_image: string | null
  tags_list: string[]
  is_featured: boolean
  read_time_minutes: number
  view_count: number
  published_at: string | null
  content?: string
  meta_title?: string
  meta_description?: string
  og_image?: string | null
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
  description: string
  post_count: number
}

export const blog = {
  list: (params?: { category__slug?: string; featured?: boolean; search?: string }) => {
    const q = new URLSearchParams()
    if (params?.category__slug) q.set('category__slug', params.category__slug)
    if (params?.featured) q.set('is_featured', 'true')
    if (params?.search) q.set('search', params.search)
    const qs = q.toString() ? `?${q}` : ''
    return request<PaginatedResponse<BlogPost>>(`/blog/${qs}`)
  },
  get: (slug: string) => request<BlogPost>(`/blog/${slug}/`),
  categories: () => request<BlogCategory[]>('/blog/categories/'),
}