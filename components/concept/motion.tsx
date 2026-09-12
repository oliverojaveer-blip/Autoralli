'use client'

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'

/**
 * Kontseptsiooni liikumissüsteem. Üks kõver, kolm kestuse klassi.
 *
 *   micro   140-200 ms   hover, fookus, lülitid
 *   control 280-420 ms   kaardid, nupud, nav-olekud
 *   reveal  550-850 ms   hero, pealkirjad, režiimivahetus
 *
 * Kõik animeerib ainult transform'i ja opacity't. prefers-reduced-motion
 * korral on sisu kohe kohal.
 */
export const EASE = [0.22, 1, 0.36, 1] as const

export const DUR = {
  micro: 0.18,
  control: 0.34,
  reveal: 0.7,
} as const

/** Sektsiooni ilmumine vaatevälja jõudmisel. */
export function Rise({
  children,
  delay = 0,
  className,
  amount = 0.25,
  y = 20,
}: {
  children: ReactNode
  delay?: number
  className?: string
  amount?: number
  y?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Maskitud pealkirja ilmumine: iga rida tõuseb oma lõikeaknast välja.
 * Kasuta ainult hero-tasemel pealkirjadel, mitte igal sektsioonil.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = 'h1',
  inView = false,
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  as?: 'h1' | 'h2' | 'p' | 'div'
  inView?: boolean
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[Tag]

  return (
    <MotionTag
      className={className}
      initial={reduced ? undefined : 'hidden'}
      {...(inView
        ? { whileInView: 'shown', viewport: { once: true, amount: 0.5 } }
        : { animate: 'shown' })}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ''}`}
            variants={{
              hidden: { y: '110%' },
              shown: {
                y: 0,
                transition: {
                  duration: DUR.reveal,
                  delay: delay + i * 0.09,
                  ease: EASE,
                },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

/**
 * Kerge sügavusnihe pildile kerimisel. Amplituud on väike (umbes 6 %),
 * et pilt ei tunduks lahti tulevat. Mobiilis ja reduced-motion korral väljas.
 */
export function Parallax({
  children,
  className,
  strength = 40,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        style={reduced ? undefined : { y }}
        className="h-full w-full max-lg:!transform-none"
      >
        {children}
      </motion.div>
    </div>
  )
}

/** Elav indikaator. Pulseerib ainult siis, kui liikumine on lubatud. */
export function LiveDot({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  return (
    <span className={`relative inline-flex h-2.5 w-2.5 ${className}`} aria-hidden>
      {!reduced ? (
        <motion.span
          className="absolute inset-0 bg-signal"
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      ) : null}
      <span className="relative inline-flex h-2.5 w-2.5 bg-signal" />
    </span>
  )
}

/** Vertikaalne loenduslülitus numbrile (nt gap või sekundid). */
export function FlipNumber({ value, className }: { value: string; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className ?? ''}`}>
      <motion.span
        key={value}
        className="tnum block"
        initial={reduced ? false : { y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DUR.control, ease: EASE }}
      >
        {value}
      </motion.span>
    </span>
  )
}
