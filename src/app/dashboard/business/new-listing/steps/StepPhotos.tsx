'use client'

import { useState, useRef } from 'react'
import { ImagePlus, X, CheckCircle } from 'lucide-react'
import { myListings } from '@/lib/api'
import { tokenStore } from '@/lib/auth'

interface UploadedImage {
  id: number
  url: string
  name: string
}

export default function StepPhotos({ listingId }: { listingId: string | null }) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (!listingId) {
      setError('Please complete previous steps first to enable photo upload.')
      return
    }
    const token = tokenStore.getAccess()
    if (!token) return

    setUploading(true)
    setError('')
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append('image', file)
        const result = await myListings.uploadImage(token, listingId, fd)
        setImages(prev => [...prev, { id: result.id, url: result.image, name: file.name }])
      } catch {
        setError(`Failed to upload ${file.name}`)
      }
    }
    setUploading(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-charcoal mb-1">Photos</h2>
        <p className="text-sm text-muted mb-5">
          Add up to 10 photos. High-quality images significantly increase engagement.
          {!listingId && (
            <span className="text-amber-600 ml-1">(Photos can be added after submitting — skip this step if needed.)</span>
          )}
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
      >
        <ImagePlus className="w-10 h-10 text-muted mx-auto mb-3" />
        <p className="text-sm font-medium text-charcoal mb-1">Drop photos here or click to upload</p>
        <p className="text-xs text-muted">JPG, PNG, WebP · Max 5MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-red-600 text-xs">{error}</p>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          Uploading…
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map(img => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-surface-2 group">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <button
                onClick={e => { e.stopPropagation(); setImages(prev => prev.filter(i => i.id !== img.id)) }}
                className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5 text-charcoal" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        <button type="button" className="text-sm text-muted hover:text-charcoal" onClick={() => {}}>
          Skip for now →
        </button>
      </div>
    </div>
  )
}
