'use client'

import { useCallback, useLayoutEffect, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowSquareOut } from '@phosphor-icons/react/dist/ssr'
import { byDate, nextEvent, type RallyEvent } from '@/lib/events'

function TileContent({ event, isActive }: { event: RallyEvent; isActive: boolean }) {
  return (
    <div
      className={`flex h-28 w-40 shrink-0 items-center justify-center rounded-lg border bg-white p-5 shadow-sm transition-colors duration-300 ease-forward sm:h-32 sm:w-48 ${
        isActive ? 'border-blue' : 'border-line'
      }`}
    >
      {event.logo ? (
        <Image
          src={event.logo.src}
          alt={event.logo.alt}
          width={event.logo.width}
          height={event.logo.height}
          className={`h-full w-full object-contain transition-all duration-300 ease-forward sm:grayscale-0 sm:opacity-100 ${
            isActive ? 'grayscale-0 opacity-100' : 'grayscale opacity-50'
          }`}
        />
      ) : (
        <p className="text-center font-display text-sm font-bold uppercase leading-tight text-black">
          {event.name}
        </p>
      )}
    </div>
  )
}

/**
 * Iga plaat viib etapi enda ametlikule kodulehele, kus tulemused
 * avaldatakse — mitte väljamõeldud lehele. Etapid, millel pole veel
 * kinnitatud kodulehte (`websiteUrl`), näidatakse logoga, aga
 * mitteklikitavana (claude.md: ära suuna kasutajat olematule allikale).
 *
 * Mobiilis käitub riba "coverflow" moel (nagu avalehe kalendririba):
 * kesksel logol on värv ja 1,1x suurus, ülejäänud on hallskaalas.
 * Alates `sm`-ist (kus kõik plaadid mahuvad korraga nähtavale) on
 * kõik plaadid alati täisvärvi — aktiivsuse jälgimine on siis mõttetu.
 */
function ResultsTile({
  event,
  isActive,
  setRef,
}: {
  event: RallyEvent
  isActive: boolean
  setRef: (el: HTMLLIElement | null) => void
}) {
  const scaleClass = isActive ? 'scale-110' : 'scale-100'

  if (!event.websiteUrl) {
    return (
      <li
        ref={setRef}
        className={`shrink-0 snap-center transition-transform duration-300 ease-forward sm:scale-100 ${scaleClass}`}
      >
        <div className="relative cursor-default" aria-disabled="true">
          <TileContent event={event} isActive={isActive} />
        </div>
        <p className="mt-2 max-w-[176px] text-center text-xs text-slate sm:max-w-[208px]">
          {event.name}
        </p>
      </li>
    )
  }

  return (
    <li
      ref={setRef}
      className={`shrink-0 snap-center transition-transform duration-300 ease-forward sm:scale-100 ${scaleClass}`}
    >
      <Link
        href={event.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block"
        aria-label={`Ava ${event.name} tulemused (avaneb uues aknas)`}
      >
        <TileContent event={event} isActive={isActive} />
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded bg-blue text-white opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowSquareOut size={13} weight="bold" />
        </span>
      </Link>
      <p className="mt-2 max-w-[176px] text-center text-xs text-slate sm:max-w-[208px]">
        {event.name}
      </p>
    </li>
  )
}

export function ResultsEventSlider() {
  const events = byDate()
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
        closestId = events[i]?.id ?? null
      }
    })
    setActiveId(closestId)
  }, [events])

  const layoutSpacers = useCallback(() => {
    const track = trackRef.current
    const firstCard = itemRefs.current[0]
    if (!track || !firstCard) return
    const pad = Math.max((track.clientWidth - firstCard.offsetWidth) / 2, 0)
    if (startSpacerRef.current) startSpacerRef.current.style.width = `${pad}px`
    if (endSpacerRef.current) endSpacerRef.current.style.width = `${pad}px`
  }, [])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    layoutSpacers()

    const defaultEvent = nextEvent(events)
    const targetIndex = events.findIndex((e) => e.id === defaultEvent.id)
    const targetEl = itemRefs.current[targetIndex === -1 ? 0 : targetIndex]
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

  return (
    <ul
      ref={trackRef}
      className="scrollbar-none -mx-5 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto scroll-smooth px-5 py-4 sm:-mx-8 sm:gap-6 sm:px-8"
    >
      <li ref={startSpacerRef} aria-hidden="true" className="shrink-0" />
      {events.map((event, i) => (
        <ResultsTile
          key={event.id}
          event={event}
          isActive={event.id === activeId}
          setRef={(el) => {
            itemRefs.current[i] = el
          }}
        />
      ))}
      <li ref={endSpacerRef} aria-hidden="true" className="shrink-0" />
    </ul>
  )
}
