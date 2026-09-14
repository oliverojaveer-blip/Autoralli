import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { LiveCenter } from '@/components/live-center/live-center'
import { LiveEventBar } from '@/components/live-center/live-event-bar'
import { LiveSelectionProvider } from '@/components/live-center/live-selection'
import { nextEvent } from '@/lib/events'
import { getEvents } from '@/lib/events-source'
import { getDictionary } from '@/lib/i18n'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'

/** Elav sisu (RallyLynx) — ei tohi ehitusaegselt kivistuda. */
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  return pageMetadata(locale, '/otse', t.live.metaTitle, t.live.metaDescription)
}

/**
 * Live Center — eraldi leht (mitte /tulemused, mis jääb omaette tulemuste
 * lehena). Kompositsioon on sama, mis avalehel: tume päis, võistluse riba
 * (avalehe ringiriba kuju, loenduri asemel staatus), tume kleepuv
 * vahekaardiriba ja selle all hele "ajavõtuleht" — hele sellepärast, et
 * raja ääres loetakse tulemusi päevavalguses ja minutite kaupa.
 *
 * Võistluse nimi ja staatus tulevad RallyLynxist kliendis (`LiveEventBar`);
 * hooajakalendri embleem/kuupäevad on ainult siis, kui need on sama
 * võistluse omad (vt claude.md "Live-andmete puudumisel ära genereeri").
 * Kui EAL alustab YouTube'i otseülekannet, tuleb see siduda päris
 * andmeallikaga, mitte kõvasti kirjutada.
 */
export default async function OtsePage({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const events = await getEvents()
  const event = nextEvent(events)
  const roundNumber = events.findIndex((e) => e.id === event.id) + 1

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <LiveSelectionProvider>
          <LiveEventBar calendarEvent={event} roundNumber={roundNumber} fallbackName={event.name} />
          <LiveCenter />
        </LiveSelectionProvider>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
