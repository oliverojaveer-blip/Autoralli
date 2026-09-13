import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { PartnerStrip } from '@/components/partner-strip'
import { CalendarList } from '@/components/calendar-list'
import { NewsSection } from '@/components/news-section'
import { ResultsIntegrity } from '@/components/results-integrity'
import { SiteFooter } from '@/components/site-footer'
import { nextEvent } from '@/lib/events'

/**
 * Server Component. Liikumine on isoleeritud klientkomponentidesse
 * (Hero, Reveal, SiteNav), ülejäänud leht renderdub serveris.
 */
export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="sisu">
        <Hero event={nextEvent()} />
        <PartnerStrip />
        <CalendarList />
        <NewsSection />
        <ResultsIntegrity />
      </main>
      <SiteFooter />
    </>
  )
}
