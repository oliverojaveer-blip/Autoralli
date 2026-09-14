import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { StandingsTable } from '@/components/standings-table'
import { ResultsEventSlider } from '@/components/results-event-slider'
import { SeasonSelector } from '@/components/season-selector'
import { getDictionary } from '@/lib/i18n'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'
import { getEvents } from '@/lib/events-source'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  return pageMetadata(locale, '/tulemused', t.results.metaTitle, t.results.metaDescription)
}

/**
 * Eraldi tulemuste leht (mitte Live Center — vt `/otse`). Iga etapi plaat
 * viib korraldaja kodulehele, kus ametlikud tulemused avaldatakse;
 * punktiseis on `lib/standings.ts` andmetest.
 */
export default async function TulemusedPage({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  const events = await getEvents()

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="border-b border-line py-20 lg:py-28">
          <div className="shell">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">{t.results.eyebrow}</p>
            <h1 className="mt-5 max-w-[26ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
              {t.results.title}
            </h1>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-slate">{t.results.lead}</p>

            <div className="mt-8">
              <SeasonSelector locale={locale} />
            </div>

            <div className="mt-8">
              <ResultsEventSlider events={events} />
            </div>

            {/* Ajavõtupartneri tunnustus: tulemused ja registreerimine elavad RallyLynxis. */}
            <a
              href="https://rallylynx.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.results.poweredByAria}
              className="group mt-10 inline-flex items-center gap-3 border-t border-line pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate transition-colors hover:text-black"
            >
              {t.results.poweredBy}
              <Image
                src="/images/partners/rallylynx-logo.png"
                alt="RallyLynx"
                width={1024}
                height={551}
                className="h-9 w-auto object-contain transition-opacity group-hover:opacity-80 sm:h-11"
              />
            </a>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="shell">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">{t.results.standingsEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-black sm:text-4xl">
              {t.results.standingsTitle}
            </h2>
            <div className="mt-10">
              <StandingsTable />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
