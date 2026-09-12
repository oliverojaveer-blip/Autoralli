import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CalendarBrowser } from '@/components/calendar-browser'
import { byDate } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Kalender',
  description: 'Terminal Autoralli Eesti meistrivõistlused 2026 — kogu hooaja kalender.',
}

export default function KalenderPage() {
  const events = byDate()
  const now = Date.now()
  const items = events.map((event) => ({
    event,
    isPast: new Date(event.endsAt).getTime() < now,
  }))

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="border-b border-line py-20 lg:py-28">
          <div className="shell">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
              Kalender
            </p>
            <h1 className="mt-5 max-w-[24ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
              Terminal Autoralli Eesti meistrivõistlused 2026
            </h1>

            <div className="mt-14">
              <CalendarBrowser items={items} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
