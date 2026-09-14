'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Üks korduvkasutatav ilmumisanimatsioon. Sisu on ALATI serverist nähtav:
 * ilma JS-ita, aeglase levi või prefers-reduced-motion korral ei peida see
 * midagi (claude.md: oluline võistlusinfo peab töötama ka aeglase
 * internetiga). Alles pärast mount'i, ja ainult elementidel, mis on veel
 * vaateala all, lülitub peitmine sisse ja sisu tõuseb nähtavale kerimisel.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'static' | 'hidden' | 'shown'>('static')

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return

    // Juba nähtav element ei tohi korraks kaduda: animeeri ainult seda,
    // mis on mount'i hetkel vaateala all.
    if (el.getBoundingClientRect().top < window.innerHeight - 40) return

    setState('hidden')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -80px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <div
      ref={ref}
      className={className}
      style={
        state === 'static'
          ? undefined
          : {
              opacity: state === 'shown' ? 1 : 0,
              transform: state === 'shown' ? 'none' : 'translateY(16px)',
              transition: `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
            }
      }
    >
      {children}
    </div>
  )
}
