import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { FlagLink } from './flag-link'
import { byDate, nextEvent } from '@/lib/events'
import { formatDateRange } from '@/lib/dates'
import { getDictionary, localizedHref, pick, type Locale } from '@/lib/i18n'

/**
 * Hooaja kuus ringi ühes reas (telefonis keritav, laial ekraanil kuus
 * kõrvuti). DOM-järjekord on tähtsuse järgi: järgmine ring, siis tulevased,
 * siis toimunud — nii on telefonis ja ilma JS-ita esimesena näha see, mida
 * fänn otsib. Laial ekraanil paneb `order` kaardid tagasi kronoloogiliseks.
 * Toimunud ringid on tuhmid ja märgitud, järgmine ring kannab sinist
 * ülaserva ja ürituse embleemi. Andmed: `lib/events.ts`.
 */
export function SeasonStrip({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const events = byDate()
  const next = nextEvent(events)
  const now = Date.now()
  const nextIndex = events.findIndex((e) => e.id === next.id)
  const ordered = [
    ...events.slice(nextIndex),
    ...events.slice(0, nextIndex),
  ].map((event) => ({ event, index: events.indexOf(event) }))
  const ORDER = ['xl:order-1', 'xl:order-2', 'xl:order-3', 'xl:order-4', 'xl:order-5', 'xl:order-6']

  return (
    <section className="border-t border-white/10 bg-black py-14 text-white lg:py-20" aria-labelledby="hooaeg">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h2 id="hooaeg" className="max-w-[24ch] font-display text-4xl font-bold uppercase leading-[0.96] sm:text-5xl">
              {t.calendar.seasonTitle}
            </h2>
            <FlagLink href={localizedHref(locale, '/kalender')} size="sm" className="mr-2">
              {t.home.seasonAll}
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </FlagLink>
        </div>

        <ul
          className="scrollbar-none -mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scroll-pl-5 sm:-mx-8 sm:px-8 sm:scroll-pl-8 xl:mx-0 xl:grid xl:grid-cols-6 xl:overflow-visible xl:px-0"
          aria-label={t.home.seasonAria}
        >
            {ordered.map(({ event, index: i }) => {
              const isPast = new Date(event.endsAt).getTime() < now
              const isNext = event.id === next.id
              const external = Boolean(event.websiteUrl)
              const cardClass = `group relative flex h-full min-h-[300px] flex-col overflow-hidden border transition-colors duration-200 ease-forward focus-visible:ring-offset-black ${
                isNext ? 'border-blue' : 'border-white/10 hover:border-white/40'
              }`
              const card = (
                <>
                    <div className="absolute inset-0">
                      <Image
                        src={event.photo.src}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 16vw, (min-width: 640px) 300px, 76vw"
                        className={`object-cover transition-opacity duration-300 ${
                          isPast ? 'opacity-30 grayscale' : isNext ? 'opacity-80 group-hover:opacity-100' : 'opacity-55 group-hover:opacity-75'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" aria-hidden="true" />
                    </div>

                    {isNext ? <span className="absolute inset-x-0 top-0 h-1 bg-blue" aria-hidden="true" /> : null}

                    <div className="relative flex items-center justify-between p-4">
                      <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">
                        {t.home.round}
                        {i + 1}
                      </span>
                      {isPast ? (
                        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
                          <span className="bg-checker h-3 w-3 text-white/60" aria-hidden="true" />
                          {t.home.seasonDone}
                        </span>
                      ) : isNext ? (
                        <span className="skew-x-[-19deg] bg-blue px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                          <span className="block skew-x-[19deg]">{t.home.seasonNext}</span>
                        </span>
                      ) : null}
                    </div>

                    <div className="relative flex flex-1 items-center justify-center px-6 py-2">
                      {event.logo && !isPast ? (
                        <Image
                          src={event.logo.src}
                          alt={event.logo.alt}
                          width={event.logo.width}
                          height={event.logo.height}
                          className="max-h-16 w-auto max-w-[70%] object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.7)]"
                        />
                      ) : null}
                    </div>

                    <div className="relative p-4 pt-2">
                      <h3 className="font-display text-2xl font-bold uppercase leading-[0.98]">{event.name}</h3>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-white/70">
                        <span className="tnum font-semibold text-white">{formatDateRange(event.startsAt, event.endsAt, locale)}</span>
                        <span className="text-white/30" aria-hidden="true">
                          ·
                        </span>
                        {pick(event.location, locale)}
                        {external ? (
                          <ArrowUpRight size={12} weight="bold" className="text-blue" aria-hidden="true" />
                        ) : null}
                      </p>
                    </div>
                </>
              )
              return (
                <li key={event.id} className={`w-[76vw] shrink-0 snap-start sm:w-[300px] xl:w-auto ${ORDER[i]}`}>
                  {external ? (
                    <a href={event.websiteUrl} target="_blank" rel="noopener noreferrer" className={cardClass}>
                      {card}
                    </a>
                  ) : (
                    <Link href={localizedHref(locale, '/kalender')} className={cardClass}>
                      {card}
                    </Link>
                  )}
                </li>
              )
            })}
        </ul>
      </div>
    </section>
  )
}
