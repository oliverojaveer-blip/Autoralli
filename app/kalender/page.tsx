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
  const now = Date.now()
  const items = byDate()
    .map((event) => ({ event, isPast: new Date(event.endsAt).getTime() < now }))
    // Tulemas etapid ees (lähim enne), toimunud etapid taga (viimane enne) —
    // mitte puhtalt kronoloogiline, kus jaanuari toimunud etapp oleks esimene.
    .sort((a, b) => {
      if (a.isPast !== b.isPast) return a.isPast ? 1 : -1
      const diff = new Date(a.event.startsAt).getTime() - new Date(b.event.startsAt).getTime()
      return a.isPast ? -diff : diff
    })

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
