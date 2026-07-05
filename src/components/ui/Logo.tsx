import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ variant = 'dark', size = 'md', className }: LogoProps) {
  const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-14' }
  const gold = '#b5813b'
  const goldDark = '#8a6028'
  const textColor = variant === 'light' ? '#ffffff' : '#1c1a17'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        className={cn(sizes[size], 'w-auto')}
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Glow circle */}
        <circle cx="20" cy="22" r="18" fill={gold} opacity="0.1" />
        {/* Egg on head */}
        <circle cx="20" cy="6" r="2.5" fill={gold} />
        {/* Sankofa bird body */}
        <path
          d="M20 10C15 10 11 14 11 19C11 22.5 13 25.5 16 27L14 34H18L19.5 28.5H20.5L22 34H26L24 27C27 25.5 29 22.5 29 19C29 14 25 10 20 10Z"
          fill={gold}
        />
        {/* Eye */}
        <circle cx="17.5" cy="18" r="1.4" fill="white" opacity="0.9" />
        {/* Subtle gold shine on body */}
        <path
          d="M20 10C17 10 14.5 11.5 13 14C15 12.5 17.5 11.8 20 12C22.5 11.8 25 12.5 27 14C25.5 11.5 23 10 20 10Z"
          fill="white"
          opacity="0.15"
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={cn('font-bold tracking-tight', size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-2xl')}
          style={{ color: textColor }}
        >
          Sankofa<span style={{ color: gold }}>X</span>
        </span>
        {size !== 'sm' && (
          <span
            className={cn('font-light tracking-widest uppercase', size === 'lg' ? 'text-[10px]' : 'text-[9px]')}
            style={{ color: variant === 'light' ? 'rgba(255,255,255,0.6)' : gold }}
          >
            Business Directory
          </span>
        )}
      </div>
    </div>
  )
}