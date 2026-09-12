'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowSquareOut } from '@phosphor-icons/react/dist/ssr'
import { byDate, type RallyEvent } from '@/lib/events'

function TileContent({ event }: { event: RallyEvent }) {
  return (
    <div className="flex h-28 w-44 shrink-0 items-center justify-center border border-line bg-white p-5 transition-colors group-hover:border-blue sm:h-32 sm:w-52">
      {event.logo ? (
        <Image
          src={event.logo.src}
          alt={event.logo.alt}
          width={event.logo.width}
          height={event.logo.height}
          className="h-full w-full object-contain"
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
 */
function ResultsTile({ event }: { event: RallyEvent }) {
  if (!event.websiteUrl) {
    return (
      <li className="shrink-0 snap-start">
        <div className="relative cursor-default opacity-50" aria-disabled="true">
          <TileContent event={event} />
        </div>
        <p className="mt-2 max-w-[176px] text-center text-xs text-slate sm:max-w-[208px]">
          {event.name}
        </p>
      </li>
    )
  }

  return (
    <li className="shrink-0 snap-start">
      <Link
        href={event.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block"
        aria-label={`Ava ${event.name} tulemused (avaneb uues aknas)`}
      >
        <TileContent event={event} />
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-blue text-white opacity-0 transition-opacity group-hover:opacity-100">
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

  return (
    <ul className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 py-2 sm:-mx-8 sm:gap-6 sm:px-8">
      {events.map((event) => (
        <ResultsTile key={event.id} event={event} />
      ))}
    </ul>
  )
}
