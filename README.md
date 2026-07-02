# SankofaX — Frontend

Next.js 16 App Router frontend for the SankofaX Global Black & African Business Directory platform.

## Tech Stack

- **Next.js** 16.2.9 (App Router, Server Components)
- **TypeScript** 5
- **Tailwind CSS** 3 — custom design system (emerald + amber)
- **react-hook-form** + **zod** — form validation
- **Leaflet** — interactive maps
- **Stripe.js** — payment checkout
- **js-cookie** — JWT token storage

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Home page
│   │   ├── directory/                    # Business directory + map
│   │   ├── listing/[slug]/              # Listing detail + JSON-LD SEO
│   │   ├── events/                       # Community events
│   │   ├── marketplace/                  # Products shop
│   │   ├── pricing/                      # Subscription plans
│   │   ├── dashboard/
│   │   │   ├── business/                 # My listings + new listing wizard
│   │   │   ├── billing/                  # Subscription & Stripe portal
│   │   │   └── profile/                  # Profile editor
│   │   ├── login/ register/              # Auth pages
│   │   ├── sitemap.ts                    # Auto-generated XML sitemap
│   │   └── robots.ts                     # robots.txt
│   ├── components/
│   │   ├── layout/    Navbar Footer
│   │   ├── listings/  ListingCard Skeleton
│   │   ├── map/       ListingsMap SingleListingMap
│   │   ├── dashboard/ DashboardShell
│   │   ├── home/      Hero CategoryGrid FeaturedListings Newsletter CTA
│   │   └── ui/        Logo StarRating NewsletterForm
│   ├── hooks/
│   │   └── useAuth.tsx                   # Auth context + JWT refresh
│   ├── lib/
│   │   ├── api.ts                        # Full typed API client
│   │   ├── auth.ts                       # Token storage (cookie + localStorage)
│   │   └── utils.ts                      # cn(), mediaUrl()
│   └── types/
│       └── index.ts                      # TypeScript interfaces
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── Dockerfile
└── vercel.json
```

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- Backend API running at `http://localhost:8000`

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_ORG/sankofax-frontend.git
cd sankofax-frontend
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

`.env.local` should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000
NEXT_PUBLIC_SITE_NAME=SankofaX
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Start the dev server
```bash
npm run dev
```

Open `http://localhost:3000`

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, featured listings, categories |
| `/directory` | Searchable directory with map toggle |
| `/listing/[slug]` | Listing detail, gallery, reviews, map, JSON-LD |
| `/events` | Community events with filters |
| `/marketplace` | Product shop |
| `/pricing` | Subscription plans (Global North / South toggle) |
| `/login` `/register` | Auth |
| `/dashboard/business` | My listings table |
| `/dashboard/business/new-listing` | 5-step listing wizard |
| `/dashboard/business/listings/[slug]/edit` | Edit listing |
| `/dashboard/billing` | Subscription status + Stripe portal |
| `/dashboard/profile` | Profile editor |

---

## Building for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` → your backend API URL
   - `NEXT_PUBLIC_SITE_URL` → your frontend domain
4. Deploy

See `vercel.json` for build config.

### Deploy with Docker

```bash
docker build -t sankofax-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.sankofax.com/api/v1 \
  sankofax-frontend
```

---

## Design System

Custom Tailwind tokens:

| Token | Value | Use |
|---|---|---|
| `primary` | Deep emerald | Buttons, links, badges |
| `accent` | Warm amber | Stars, highlights |
| `charcoal` | `#1c1c1e` | Headings, body text |
| `muted` | `#6b7280` | Secondary text |
| `surface` | `#fafaf8` | Page background |

Global CSS classes: `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.card`, `.input`, `.badge`, `.skeleton`

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Source of truth |
| `production` | Live release |
| `staging` | Pre-release QA |
| `development` | Integration branch |
| `frontend` | Active development work |

Workflow: `frontend` → `development` → `staging` → `production` → `main`
