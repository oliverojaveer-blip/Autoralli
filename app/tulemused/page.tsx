import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { LiveCountdown } from '@/components/live-countdown'
import { nextEvent } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Tulemused',
  description: 'Otseülekanne ja tulemused — Estonian Rally Championship Live Center.',
}

/**
 * Live Center. `status` on siin praegu alati "scheduled", sest saidil ei
 * ole veel ajavõtupartneri liidestust, mis annaks teada, millal etapp on
 * tegelikult otse-eetris (vt claude.md "Live-andmete puudumisel ära
 * genereeri oletatavaid positsioone" — sama põhimõte kehtib staatuse
 * kohta). Kui adapter valmib, tuleb `status` ja `youtubeVideoId` siduda
 * selle päris andmeallikaga, mitte kõvasti kirjutada.
 */
export default function TulemusedPage() {
  const event = nextEvent()

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="bg-black py-20 lg:py-28">
          <div className="shell">
            <LiveCountdown
              eventName={event.name}
              targetTime={event.startsAt}
              status="scheduled"
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
