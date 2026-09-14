import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { PartnerStrip } from '@/components/partner-strip'
import { CalendarList } from '@/components/calendar-list'
import { NewsSection } from '@/components/news-section'
import { ResultsIntegrity } from '@/components/results-integrity'
import { SiteFooter } from '@/components/site-footer'
import type { Metadata } from 'next'
import { nextEvent } from '@/lib/events'
import { getDictionary } from '@/lib/i18n'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  return { ...pageMetadata(locale, '/', t.meta.siteTitle, t.meta.siteDescription), title: { absolute: t.meta.siteTitle } }
}

/**
 * Server Component. Liikumine on isoleeritud klientkomponentidesse
 * (Hero, Reveal, SiteNav), ülejäänud leht renderdub serveris.
 */
export default async function Home({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  return (
    <>
      <SiteNav />
      <main id="sisu">
        <Hero event={nextEvent()} />
        <PartnerStrip locale={locale} />
        <CalendarList locale={locale} />
        <NewsSection locale={locale} />
        <ResultsIntegrity locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
