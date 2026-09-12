import { byDate } from '@/lib/events'
import { CalendarScroller } from './calendar-scroller'
import { Reveal } from './reveal'

export function CalendarList() {
  const events = byDate()
  const now = Date.now()
  const items = events.map((event) => ({
    event,
    isPast: new Date(event.endsAt).getTime() < now,
  }))

  return (
    <section className="border-b border-line py-20 lg:py-28" id="kalender">
      <div className="shell">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
            Kalender
          </p>
          <h2 className="mt-5 max-w-[20ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
            Terminal Autoralli Eesti meistrivõistlused 2026
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <CalendarScroller items={items} />
        </Reveal>
      </div>
    </section>
  )
}
