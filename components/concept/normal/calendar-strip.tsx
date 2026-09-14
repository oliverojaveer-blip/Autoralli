import { CALENDAR } from '@/lib/concept/fixtures'
import Link from 'next/link'
import { Rise } from '../motion'

const MONTHS = ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets']

function day(iso: string) {
  const d = new Date(iso)
  return { d: d.getUTCDate(), m: MONTHS[d.getUTCMonth()] }
}

/**
 * Hooaeg ühe joonena. Telefonis keritav rida, arvutis seitse veergu.
 * Lõpetatud etapid tuhmuvad, järgmine saab kollase märgi. Kaarte pole,
 * hierarhia tuleb suurusest ja kontrastist.
 */
export function CalendarStrip() {
  return (
    <section id="kalender" className="scroll-mt-16 border-b border-line py-16 lg:py-24">
      <div className="shell">
        <Rise>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold leading-[1.02] tracking-headline sm:text-4xl lg:text-5xl">
              Hooaeg 2026, seitse etappi
            </h2>
            <Link href="/kalender" className="text-sm font-semibold text-muted transition-colors duration-150 hover:text-chalk">
              Täiskalender ja ICS
            </Link>
          </div>
        </Rise>

        <Rise delay={0.1} className="mt-10 lg:mt-14">
          <ol className="-mx-5 flex snap-x snap-mandatory gap-px overflow-x-auto border-y border-line bg-line px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:border-x lg:px-0">
            {CALENDAR.map((event, i) => {
              const { d, m } = day(event.startsAt)
              const done = event.status === 'lopetatud'
              const next = event.status === 'jargmine'
              return (
                <li
                  key={event.id}
                  className={`relative min-w-[11.5rem] shrink-0 snap-start bg-ink lg:min-w-0 ${
                    next ? 'bg-surface' : ''
                  }`}
                >
                  {next ? <span className="absolute inset-x-0 top-0 h-1 bg-signal" aria-hidden /> : null}
                  <a href={`/kalender/${event.id}`} className="group block h-full px-5 pb-6 pt-7 transition-colors duration-200 hover:bg-surface">
                    <div className="flex items-baseline justify-between">
                      <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${next ? 'text-signal' : 'text-muted'}`}>
                        {next ? 'Järgmine' : done ? 'Lõpetatud' : `${i + 1}. etapp`}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{event.surface}</span>
                    </div>
                    <div className={`mt-6 flex items-baseline gap-2 ${done ? 'text-muted' : 'text-chalk'}`}>
                      <span className="tnum font-mono text-5xl font-bold leading-none">{d}</span>
                      <span className="font-mono text-sm uppercase tracking-widest">{m}</span>
                    </div>
                    <div className={`mt-4 text-lg font-bold leading-tight tracking-headline ${done ? 'text-muted' : ''}`}>
                      {event.name}
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted">{event.town}</div>
                  </a>
                </li>
              )
            })}
          </ol>
        </Rise>
      </div>
    </section>
  )
}
