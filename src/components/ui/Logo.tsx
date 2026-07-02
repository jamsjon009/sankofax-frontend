import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ variant = 'dark', size = 'md', className }: LogoProps) {
  const sizes = { sm: 'h-7', md: 'h-9', lg: 'h-12' }
  const textColor = variant === 'light' ? 'text-white' : 'text-charcoal'
  const accentColor = variant === 'light' ? '#fbbf24' : '#047857'

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Abstract icon mark — geometric Adinkra-inspired diamond/network glyph */}
      <svg
        className={cn(sizes[size], 'w-auto')}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer diamond */}
        <path
          d="M20 2L38 20L20 38L2 20L20 2Z"
          fill={accentColor}
          opacity="0.15"
        />
        {/* Inner connected nodes — network/roots motif */}
        <circle cx="20" cy="20" r="3.5" fill={accentColor} />
        <circle cx="20" cy="8" r="2.5" fill={accentColor} opacity="0.8" />
        <circle cx="32" cy="20" r="2.5" fill={accentColor} opacity="0.8" />
        <circle cx="20" cy="32" r="2.5" fill={accentColor} opacity="0.8" />
        <circle cx="8" cy="20" r="2.5" fill={accentColor} opacity="0.8" />
        {/* Connection lines */}
        <line x1="20" y1="10.5" x2="20" y2="16.5" stroke={accentColor} strokeWidth="1.5" opacity="0.6" />
        <line x1="29.5" y1="20" x2="23.5" y2="20" stroke={accentColor} strokeWidth="1.5" opacity="0.6" />
        <line x1="20" y1="29.5" x2="20" y2="23.5" stroke={accentColor} strokeWidth="1.5" opacity="0.6" />
        <line x1="10.5" y1="20" x2="16.5" y2="20" stroke={accentColor} strokeWidth="1.5" opacity="0.6" />
        {/* Diagonal connections */}
        <line x1="27.2" y1="12.8" x2="22.5" y2="17.5" stroke={accentColor} strokeWidth="1" opacity="0.35" />
        <line x1="27.2" y1="27.2" x2="22.5" y2="22.5" stroke={accentColor} strokeWidth="1" opacity="0.35" />
        <line x1="12.8" y1="27.2" x2="17.5" y2="22.5" stroke={accentColor} strokeWidth="1" opacity="0.35" />
        <line x1="12.8" y1="12.8" x2="17.5" y2="17.5" stroke={accentColor} strokeWidth="1" opacity="0.35" />
      </svg>

      {/* Wordmark */}
      <div className={cn('flex flex-col leading-none', textColor)}>
        <span
          className={cn(
            'font-semibold tracking-tight',
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg',
          )}
        >
          Diaspora
        </span>
        <span
          className={cn(
            'font-light tracking-widest uppercase',
            size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]',
            variant === 'light' ? 'text-white/70' : 'text-primary-600',
          )}
        >
          Directory
        </span>
      </div>
    </div>
  )
}
