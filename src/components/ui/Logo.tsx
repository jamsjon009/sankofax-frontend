import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ variant = 'dark', size = 'md', className }: LogoProps) {
  const sizes = { sm: 'h-7', md: 'h-9', lg: 'h-12' }
  const textColor = variant === 'light' ? 'text-white' : 'text-charcoal'
  const gold = '#b5813b'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Sankofa bird - geometric icon */}
      <svg
        className={cn(sizes[size], 'w-auto')}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="18" fill={gold} opacity="0.12" />
        <circle cx="20" cy="5.5" r="2" fill={gold} />
        <path
          d="M20 8.5C15.5 8.5 12 12 12 16.5C12 19.5 13.5 22 16 23.5L14.5 31H18L19 26.5H21L22 31H25.5L24 23.5C26.5 22 28 19.5 28 16.5C28 12 24.5 8.5 20 8.5Z"
          fill={gold}
        />
        <circle cx="17.5" cy="15.5" r="1.2" fill="white" opacity="0.85" />
      </svg>

      {/* Wordmark */}
      <span
        className={cn(
          'font-bold tracking-tight logo-text',
          textColor,
          size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl',
        )}
      >
        SankofaX
      </span>
    </div>
  )
}