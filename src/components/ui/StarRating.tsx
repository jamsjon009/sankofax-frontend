import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StarRating({
  rating,
  count,
  size = 'sm',
}: {
  rating: number
  count?: number
  size?: 'sm' | 'md'
}) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5'

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              iconSize,
              i < full ? 'fill-accent-400 text-accent-400' : 'text-gray-200 fill-gray-200',
            )}
          />
        ))}
      </div>
      <span className={cn('font-medium text-charcoal', size === 'md' ? 'text-sm' : 'text-xs')}>
        {Number(rating).toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={cn('text-muted', size === 'md' ? 'text-sm' : 'text-xs')}>
          ({count})
        </span>
      )}
    </div>
  )
}
