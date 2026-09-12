'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowSquareOut, CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { formatRange, type RallyEvent } from '@/lib/events'

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
 * Üherealine horisontaalselt keritav kalender, brändiraamatu 07/Graphic
 * Language "checker module" ja fotokesksete ürituskaartide vaimus.
 * Iga kaart on päris EMV-etapi foto (`Fotod/`), mitte lavastatud stock.
 * Ürituse enda logo (kui olemas) hõljub foto keskel, ilma taustaplaadita.
 *
 * "Coverflow" käitumine: järgmine (esimene mitte-toimunud) võistlus on
 * vaikimisi keskel ja 1,2x suurem. Sõrmega libistades (või nooltega) saab
 * kerimise keskele iga kord uue kaardi suureneb, eelmine taandub tagasi.
 * Nähtamatud "spacer"-elemendid alguses ja lõpus lubavad ka esimest ja
 * viimast kaarti tegelikult keskele kerida, mitte jääda serva taha kinni.
 */
export function CalendarScroller({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const startSpacerRef = useRef<HTMLLIElement>(null)
  const endSpacerRef = useRef<HTMLLIElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const updateActive = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const trackRect = track.getBoundingClientRect()
    const center = trackRect.left + trackRect.width / 2

    let closestId: string | null = null
    let closestDistance = Infinity
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      const distance = Math.abs(r.left + r.width / 2 - center)
      if (distance < closestDistance) {
        closestDistance = distance
        closestId = items[i]?.event.id ?? null
      }
    })
    setActiveId(closestId)
  }, [items])

  const layoutSpacers = useCallback(() => {
    const track = trackRef.current
    const firstCard = itemRefs.current[0]
    if (!track || !firstCard) return 0
    const pad = Math.max((track.clientWidth - firstCard.offsetWidth) / 2, 0)
    if (startSpacerRef.current) startSpacerRef.current.style.width = `${pad}px`
    if (endSpacerRef.current) endSpacerRef.current.style.width = `${pad}px`
    return pad
  }, [])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    layoutSpacers()

    // Järgmine (esimene mitte-toimunud) võistlus keskele, enne kui
    // kasutaja üldse käsitsi kerima jõuab — see on esimene, mida näeb.
    // scrollIntoView jätab kerimise ja snap-loogika täpse arvutuse
    // brauserile, nii ei jää see käsitsi arvutatud nihkest lahku.
    //
    // Probleem #1: kalendri sektsioon on avalehel esimesel laadimisel
    // enamasti allpool nähtavat ala, nii et "block: nearest" kerib ka KOGU
    // LEHE sinna alla, mitte ainult seda horisontaalset riba. Fikseerime
    // lehe vertikaalse asendi enne ja pärast, et muutuks ainult ribafookus.
    //
    // Probleem #2: `html { scroll-behavior: smooth }` (globals.css) muudab
    // nii scrollIntoView kui ka parandava scrollTo animeerituks — kaks
    // samaaegset sujuvat kerimist ei tühista teineteist usaldusväärselt
    // (eriti mobiilis), mistõttu leht jäi nähtavalt keset lehte "hüppama".
    // Lülitame sujuva kerimise selleks hetkeks otse välja.
    const upcomingIndex = items.findIndex((it) => !it.isPast)
    const targetIndex = upcomingIndex === -1 ? 0 : upcomingIndex
    const targetEl = itemRefs.current[targetIndex]
    if (targetEl) {
      const root = document.documentElement
      const prevScrollBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'

      const scrollX = window.scrollX
      const scrollY = window.scrollY
      targetEl.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' })
      window.scrollTo(scrollX, scrollY)

      root.style.scrollBehavior = prevScrollBehavior
    }
    updateActive()
    // Ainult esimesel renderdusel: items ei muutu selle komponendi elueas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateActive)
    }
    const onResize = () => {
      layoutSpacers()
      onScroll()
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [updateActive, layoutSpacers])

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = itemRefs.current[0]
    const step = card ? card.clientWidth + 20 : 320
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="scrollbar-none -mx-5 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-5 py-14 sm:-mx-8 sm:px-8"
      >
        <li ref={startSpacerRef} aria-hidden="true" className="shrink-0" />

        {items.map(({ event, isPast }, i) => {
          const isActive = event.id === activeId
          return (
            <li
              key={event.id}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className={`w-[78vw] shrink-0 snap-center transition-transform duration-300 ease-forward sm:w-[320px] ${
                isActive ? 'z-10 scale-[1.2]' : 'scale-100'
              }`}
            >
              <Link
                href={event.websiteUrl ?? `/kalender/${event.id}`}
                target={event.websiteUrl ? '_blank' : undefined}
                rel={event.websiteUrl ? 'noopener noreferrer' : undefined}
                className="group relative block aspect-[3/4] overflow-hidden bg-black"
              >
                <Image
                  src={event.photo.src}
                  alt={event.photo.alt}
                  fill
                  sizes="(min-width: 640px) 320px, 78vw"
                  className={`object-cover transition-transform duration-500 ease-forward group-hover:scale-105 ${
                    isPast ? 'grayscale' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20" />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                  {isPast ? (
                    <span className="bg-white/15 px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
                      Toimunud
                    </span>
                  ) : (
                    <span className="bg-black/70 px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                      {dateChip(event.startsAt)}
                    </span>
                  )}
                  <span className="bg-blue px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-white">
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
                      className="h-16 w-auto max-w-[65%] object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
                    />
                  </div>
                ) : null}

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-mono text-xs text-white/70">
                    {formatRange(event.startsAt, event.endsAt)}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold uppercase leading-none text-white">
                    {event.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-white/70">{event.location}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-white">
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
            </li>
          )
        })}

        <li ref={endSpacerRef} aria-hidden="true" className="shrink-0" />
      </ul>

      <div className="mt-2 hidden items-center gap-3 sm:flex">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="flex h-11 w-11 items-center justify-center border border-line text-black transition-colors hover:border-blue hover:text-blue"
          aria-label="Keri kalender vasakule"
        >
          <CaretLeft size={18} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="flex h-11 w-11 items-center justify-center border border-line text-black transition-colors hover:border-blue hover:text-blue"
          aria-label="Keri kalender paremale"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}
