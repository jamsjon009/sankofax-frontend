'use client'

import { useFormContext } from 'react-hook-form'
import { AlertCircle, Loader2 } from 'lucide-react'
import type { CompanyProfile, Category } from '@/types'
import type { ListingFormData } from '../page'

export default function StepReview({
  companies,
  categories,
  submitting,
  error,
  onSubmit,
}: {
  companies: CompanyProfile[]
  categories: Category[]
  submitting: boolean
  error: string
  onSubmit: () => void
}) {
  const { watch } = useFormContext<ListingFormData>()
  const values = watch()

  const company = companies.find(c => c.id === values.company)
  const category = categories.find(c => c.id === Number(values.category))

  const rows: { label: string; value: string | undefined }[] = [
    { label: 'Company', value: company?.company_name },
    { label: 'Category', value: category?.name },
    { label: 'Title', value: values.title },
    { label: 'Short Description', value: values.short_description },
    { label: 'City', value: values.city },
    { label: 'Country', value: values.country },
    { label: 'Website', value: values.website },
    { label: 'Phone', value: values.phone },
    { label: 'Price Range', value: values.price_range },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-charcoal mb-1">Review & Submit</h2>
        <p className="text-sm text-muted mb-5">
          Check your listing details before submitting for review. Our team typically approves listings within 24 hours.
        </p>
      </div>

      {/* Summary table */}
      <div className="bg-surface-2 rounded-2xl overflow-hidden">
        {rows.filter(r => r.value).map((row, i) => (
          <div key={row.label} className={`flex gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-white' : ''}`}>
            <span className="text-muted w-36 flex-shrink-0">{row.label}</span>
            <span className="text-charcoal font-medium line-clamp-2">{row.value}</span>
          </div>
        ))}
      </div>

      {/* What happens next */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-4 text-sm text-primary-800">
        <p className="font-semibold mb-1">What happens after you submit?</p>
        <ul className="list-disc pl-4 space-y-1 text-primary-700 text-xs">
          <li>Our team reviews your listing for accuracy and community guidelines</li>
          <li>You&apos;ll get an email when it&apos;s approved or if changes are needed</li>
          <li>Approved listings go live immediately and appear in search results</li>
        </ul>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-between pt-6 border-t border-gray-100">
        <div />
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="btn-primary gap-2 px-8"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            'Submit for Review'
          )}
        </button>
      </div>
    </div>
  )
}
