import type {
  Category, ListingCard, ListingDetail, Review, Plan,
  PaginatedResponse, CompanyProfile, User, Amenity,
} from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
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
  register: (data: { email: string; password: string; password2: string; region?: string }) =>
    request<{ access: string; refresh: string; user: User }>('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<{ access: string; refresh: string; user: User }>('/auth/login/', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: (token: string) =>
    request<User>('/auth/me/', { headers: { Authorization: `Bearer ${token}` } }),
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
  list: (token: string) =>
    request<CompanyProfile[]>('/companies/', { headers: authHeader(token) }),

  create: (token: string, formData: FormData) =>
    requestForm<CompanyProfile>('/companies/', formData, token),

  update: (token: string, slug: string, formData: FormData) =>
    requestForm<CompanyProfile>(`/companies/${slug}/`, formData, token, 'PATCH'),
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
  city?: string
  country?: string
  q?: string
  price_range?: string
  amenities?: string
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
