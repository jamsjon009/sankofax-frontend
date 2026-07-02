'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Building2, PlusCircle, BadgeCheck } from 'lucide-react'
import type { CompanyProfile } from '@/types'
import type { ListingFormData } from '../page'
import { cn } from '@/lib/utils'
import NewCompanyModal from './NewCompanyModal'

export default function StepCompany({ companies }: { companies: CompanyProfile[] }) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ListingFormData>()
  const selected = watch('company')
  const [showModal, setShowModal] = useState(false)
  const [allCompanies, setAllCompanies] = useState(companies)

  function onCompanyCreated(c: CompanyProfile) {
    setAllCompanies(prev => [...prev, c])
    setValue('company', c.id)
    setShowModal(false)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-charcoal mb-1">Select your company</h2>
      <p className="text-sm text-muted mb-6">Each listing belongs to a company profile. Choose one or create new.</p>

      {allCompanies.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
          <Building2 className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-sm font-medium text-charcoal mb-1">No companies yet</p>
          <p className="text-xs text-muted mb-4">Create your company profile first</p>
          <button type="button" onClick={() => setShowModal(true)} className="btn-primary gap-2">
            <PlusCircle className="w-4 h-4" />
            Create Company
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {allCompanies.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setValue('company', c.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                selected === c.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-100 bg-white hover:border-primary-200',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  {c.logo ? (
                    <img src={c.logo} alt={c.company_name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="font-bold text-primary-700">{c.company_name[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-charcoal text-sm">{c.company_name}</p>
                    {c.is_verified && <BadgeCheck className="w-4 h-4 text-primary-600" />}
                  </div>
                  {c.description && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{c.description}</p>
                  )}
                </div>
                <div className={cn('w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors',
                  selected === c.id ? 'border-primary-600 bg-primary-600' : 'border-gray-200'
                )}>
                  {selected === c.id && (
                    <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full flex items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 text-muted hover:border-primary-300 hover:text-primary-700 transition-colors text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4" />
            Add another company
          </button>
        </div>
      )}

      {errors.company && (
        <p className="text-red-600 text-xs mt-3">{errors.company.message}</p>
      )}

      {showModal && (
        <NewCompanyModal onCreated={onCompanyCreated} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
