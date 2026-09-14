import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Üks interaktiivne kuju kogu avalehel: 19° lipulõikega plaat (nagu
 * päise vahekaardid). `solid` on sinine täisplaat, `outline` on hairline
 * raam tumedal taustal. Sisu on tagasi püsti keeratud.
 */
export function FlagLink({
  href,
  children,
  variant = 'outline',
  external = false,
  className = '',
  size = 'md',
}: {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline'
  external?: boolean
  className?: string
  size?: 'sm' | 'md'
}) {
  const shape = `group inline-flex skew-x-[-19deg] items-center justify-center transition-colors duration-200 ease-forward focus-visible:ring-offset-black ${
    size === 'sm' ? 'min-h-[44px] px-4' : 'min-h-[52px] px-7'
  } ${
    variant === 'solid'
      ? 'border border-blue bg-blue text-white hover:border-white hover:bg-white hover:text-black'
      : 'border border-white/25 text-white hover:border-blue hover:bg-blue'
  } ${className}`
  const inner = (
    <span className="flex skew-x-[19deg] items-center gap-2 whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.1em]">
      {children}
    </span>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={shape}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={shape}>
      {inner}
    </Link>
  )
}
