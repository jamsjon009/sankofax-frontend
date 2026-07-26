import { ShieldCheck, BadgeCheck, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Tier-aware verification badge.
 *   Level 1 — Basic (automated checks)  · slate shield
 *   Level 2 — Verified (documents)       · primary check
 *   Level 3 — Certified (partner)        · gold award
 * Renders nothing for level 0 (unverified).
 */
const TIERS: Record<number, { label: string; Icon: typeof BadgeCheck; classes: string }> = {
  1: { label: 'Basic', Icon: ShieldCheck, classes: 'bg-slate-100 text-slate-600' },
  2: { label: 'Verified', Icon: BadgeCheck, classes: 'bg-primary-50 text-primary-700' },
  3: { label: 'Certified', Icon: Award, classes: 'bg-amber-50 text-amber-700' },
}

export default function VerificationBadge({
  level,
  label,
  showLabel = true,
  size = 'md',
  className,
}: {
  level: number
  /** Override the short label (e.g. the full server label). */
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}) {
  const tier = TIERS[level]
  if (!tier) return null
  const { Icon, classes } = tier
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'

  if (!showLabel) {
    return (
      <span
        title={label ?? `${tier.label} verified`}
        className={cn('inline-flex items-center justify-center rounded-full p-1', classes, className)}
      >
        <Icon className={iconSize} />
      </span>
    )
  }

  return (
    <span
      title={label ?? `${tier.label} verified`}
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        classes,
        className,
      )}
    >
      <Icon className={iconSize} />
      {label ?? tier.label}
    </span>
  )
}
