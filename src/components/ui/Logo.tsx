import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/images/logo.webp"
      alt="SankofaX"
      width={400}
      height={100}
      className={cn('h-auto object-contain', className)}
      style={{ width: 150 }}
      priority
    />
  )
}
