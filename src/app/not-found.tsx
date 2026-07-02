import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl mb-6">🌍</p>
      <h1 className="text-3xl font-bold text-charcoal mb-2">Page Not Found</h1>
      <p className="text-muted mb-8">This page doesn&apos;t exist — but plenty of great businesses do.</p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/directory" className="btn-outline">Browse Directory</Link>
      </div>
    </div>
  )
}
