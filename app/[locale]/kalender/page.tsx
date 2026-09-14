import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { CalendarBrowser } from '@/components/calendar-browser'
import { getEvents } from '@/lib/events-source'
import { getDictionary } from '@/lib/i18n'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  return pageMetadata(locale, '/kalender', t.calendar.metaTitle, t.calendar.metaDescription)
}

export default async function KalenderPage({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  const now = Date.now()
  const items = (await getEvents())
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">{t.calendar.eyebrow}</p>
            <h1 className="mt-5 max-w-[24ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
              {t.calendar.seasonTitle}
            </h1>

            <div className="mt-14">
              <CalendarBrowser items={items} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
