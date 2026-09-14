'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { useT } from './locale-provider'

/**
 * Horisontaalne snap-"slider": sõrmega libistatav, nooltega kaardi kaupa
 * keritav, klaviatuuriga läbitav (sisu on tavalised lingid/nupud). Nooled
 * lülituvad välja, kui vastavas suunas pole enam midagi kerida. Rada
 * ulatub `shell`-i servadeni (-mx), et järgmine kaart paistaks serva alt.
 *
 * `tone="dark"` on tumeda tausta (nt midnight) sektsioonide jaoks.
 */
export function SnapScroller({
  children,
  ariaLabel,
  tone = 'light',
  className = '',
}: {
  children: ReactNode
  ariaLabel: string
  tone?: 'light' | 'dark'
  className?: string
}) {
  const t = useT()
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateArrows()
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      track.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>('li')
    if (!track || !card) return
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  const arrowClass =
    tone === 'dark'
      ? 'border-white/20 bg-gradient-to-b from-white/10 to-white/[0.03] text-white hover:border-white/60 disabled:hover:border-white/20'
      : 'border-line bg-gradient-to-b from-white to-mist text-black hover:border-blue hover:text-blue disabled:hover:border-line disabled:hover:text-black'

  return (
    <div className={className}>
      <ul
        ref={trackRef}
        aria-label={ariaLabel}
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 scroll-pl-5 sm:-mx-8 sm:px-8 sm:scroll-pl-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label={t.common.previous}
          className={`flex h-11 w-11 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${arrowClass}`}
        >
          <CaretLeft size={18} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label={t.common.next}
          className={`flex h-11 w-11 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${arrowClass}`}
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}

/** Kaardi laius: 1 telefonis (järgmine paistab), 2 tahvlis, 3 laual. */
export const SNAP_ITEM_CLASS =
  'w-[82vw] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]'
