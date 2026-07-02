'use client'

import { useFormContext } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import type { ListingFormData } from '../page'

const COUNTRIES = [
  'United Kingdom', 'United States', 'Nigeria', 'Ghana', 'Kenya', 'South Africa',
  'Canada', 'France', 'Germany', 'Netherlands', 'Belgium', 'Italy', 'Spain',
  'Ethiopia', 'Uganda', 'Tanzania', 'Senegal', 'Cameroon', 'Ivory Coast',
  'Jamaica', 'Trinidad and Tobago', 'Barbados', 'Haiti', 'Brazil', 'Colombia',
  'Australia', 'New Zealand', 'Sweden', 'Norway', 'Denmark', 'Finland',
  'Other',
]

export default function StepLocation() {
  const { register, formState: { errors } } = useFormContext<ListingFormData>()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-charcoal mb-1">Location</h2>
        <p className="text-sm text-muted mb-5">
          Where is your business based? This helps people find you in search and on the map.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Street Address <span className="text-muted font-normal">(optional)</span></label>
        <input {...register('address_line')} className="input" placeholder="123 Example Street" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">City *</label>
          <input {...register('city')} className="input" placeholder="e.g. London" />
          {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">State / Region</label>
          <input {...register('state')} className="input" placeholder="e.g. Greater London" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Country *</label>
          <select {...register('country')} className="input">
            <option value="">Select country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Postal Code</label>
          <input {...register('postal_code')} className="input" placeholder="e.g. SW1A 1AA" />
        </div>
      </div>

      {/* Coordinates — optional, for map pin */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-primary-600" />
          Map Coordinates <span className="text-muted font-normal">(optional, for precise map pin)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            {...register('latitude')}
            type="number"
            step="any"
            className="input"
            placeholder="Latitude e.g. 51.5074"
          />
          <input
            {...register('longitude')}
            type="number"
            step="any"
            className="input"
            placeholder="Longitude e.g. -0.1278"
          />
        </div>
        <p className="text-xs text-muted mt-1.5">
          Find your coordinates at{' '}
          <a href="https://www.latlong.net" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
            latlong.net
          </a>
        </p>
      </div>
    </div>
  )
}
