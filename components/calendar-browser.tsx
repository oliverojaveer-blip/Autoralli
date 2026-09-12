'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowSquareOut } from '@phosphor-icons/react/dist/ssr'
import { formatRange, type RallyEvent } from '@/lib/events'

type Filter = 'all' | 'upcoming' | 'past'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Kõik' },
  { id: 'upcoming', label: 'Tulemas' },
  { id: 'past', label: 'Toimunud' },
]

const MONTHS_SHORT = [
  'JAAN',
  'VEEBR',
  'MÄRTS',
  'APR',
  'MAI',
  'JUUNI',
  'JUULI',
  'AUG',
  'SEPT',
  'OKT',
  'NOV',
  'DETS',
]

function dateChip(startsAt: string) {
  const d = new Date(startsAt)
  return `${d.getUTCDate()}. ${MONTHS_SHORT[d.getUTCMonth()]}`
}

type Item = { event: RallyEvent; isPast: boolean }

/**
 * Täisleheline kalender — sama andmed ja fotod/logod mis avalehe
 * horisontaalses ribas (`CalendarScroller`), aga siin on kõik etapid
 * korraga nähtaval vertikaalse nimekirjana, koos toimiva filtriga.
 * Filtri vahetus ja kaartide ilmumine on üleminekutega, mitte hüplevad.
 */
export function CalendarBrowser({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const reducedMotionRaw = useReducedMotion()
  const reducedMotion = reducedMotionRaw ?? false

  const filtered = useMemo(() => {
    if (filter === 'upcoming') return items.filter((i) => !i.isPast)
    if (filter === 'past') return items.filter((i) => i.isPast)
    return items
  }, [items, filter])

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtreeri kalendrit"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => {
          const isActive = f.id === filter
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(f.id)}
              className="relative px-5 py-2.5 text-sm font-bold uppercase tracking-[0.06em] transition-colors"
            >
              {isActive ? (
                <motion.span
                  layoutId="calendar-filter-pill"
                  className="absolute inset-0 bg-blue"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 400, damping: 32 }
                  }
                />
              ) : (
                <span className="absolute inset-0 border border-line" aria-hidden="true" />
              )}
              <span className={`relative ${isActive ? 'text-white' : 'text-slate'}`}>
                {f.label}
              </span>
            </button>
          )
        })}
      </div>

      <ul className="mt-10 flex flex-col gap-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map(({ event, isPast }, i) => (
            <motion.li
              key={event.id}
              layout={!reducedMotion}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{
                duration: reducedMotion ? 0.001 : 0.4,
                delay: reducedMotion ? 0 : Math.min(i, 6) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border border-line"
            >
              <Link
                href={event.websiteUrl ?? `/kalender/${event.id}`}
                target={event.websiteUrl ? '_blank' : undefined}
                rel={event.websiteUrl ? 'noopener noreferrer' : undefined}
                className="group flex flex-col sm:flex-row"
              >
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-black sm:aspect-square sm:w-64">
                  <Image
                    src={event.photo.src}
                    alt={event.photo.alt}
                    fill
                    sizes="(min-width: 640px) 256px, 100vw"
                    className={`object-cover transition-transform duration-500 ease-forward group-hover:scale-105 ${
                      isPast ? 'grayscale' : ''
                    }`}
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                    {isPast ? (
                      <span className="bg-white/15 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
                        Toimunud
                      </span>
                    ) : (
                      <span className="bg-black/70 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                        {dateChip(event.startsAt)}
                      </span>
                    )}
                    <span className="bg-blue px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
                      {event.series}
                    </span>
                  </div>
                  {event.logo ? (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <Image
                        src={event.logo.src}
                        alt=""
                        width={event.logo.width}
                        height={event.logo.height}
                        className="h-14 w-auto max-w-[60%] object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col justify-center gap-2 p-6">
                  <p className="font-mono text-xs text-slate">
                    {formatRange(event.startsAt, event.endsAt)}
                  </p>
                  <h3 className="font-display text-3xl font-bold uppercase leading-none text-black">
                    {event.name}
                  </h3>
                  <p className="text-sm text-slate">{event.location}</p>
                  <span className="mt-2 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-blue">
                    {event.websiteUrl
                      ? 'Ava koduleht'
                      : isPast
                        ? 'Vaata tulemusi'
                        : 'Vaata võistlust'}
                    {event.websiteUrl ? (
                      <ArrowSquareOut size={14} weight="bold" />
                    ) : (
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
