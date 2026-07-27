import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Product } from '@/types'
import ProductDetailClient from './ProductDetailClient'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE}/marketplace/${slug}/`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product | SankofaX' }
  return { title: `${product.name} | SankofaX`, description: product.description?.slice(0, 160) }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
