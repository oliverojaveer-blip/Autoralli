import type { Metadata } from 'next'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { RoundStrip } from '@/components/home/round-strip'
import { QuickLinks } from '@/components/home/quick-links'
import { NewsHero } from '@/components/home/news-hero'
import { SeasonStrip } from '@/components/home/season-strip'
import { StandingsBrief } from '@/components/home/standings-brief'
import { NewsGrid } from '@/components/home/news-grid'
import { JoinBand } from '@/components/home/join-band'
import { byDate, nextEvent } from '@/lib/events'
import { fetchRallyNews, type NewsArticleView } from '@/lib/autosport/adapter'
import { getDictionary } from '@/lib/i18n'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  return { ...pageMetadata(locale, '/', t.meta.siteTitle, t.meta.siteDescription), title: { absolute: t.meta.siteTitle } }
}

/** Lava 3 roteeruvat + 2 seisvat, ruudustik 4 — üks päring autosport.ee-le. */
const HERO_ROTATING = 3
const HERO_ASIDE = 2
const GRID_COUNT = 4

/**
 * Avaleht "Broadcast Grid": ringiriba loenduriga → uudistelava → hooaeg →
 * punktiseis → uudised → kutse. Serverikomponent; liikumine on ainult
 * lavas (NewsHero), loenduris (RoundStrip) ja ilmumises (Reveal).
 */
export default async function Home({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  const events = byDate()
  const next = nextEvent(events)
  const roundNumber = events.findIndex((e) => e.id === next.id) + 1
  // Päevade arv serverist, et riba kõige olulisem number oleks olemas ka
  // ilma JS-ita; tunnid-minutid-sekundid jooksevad kliendis.
  const initialDays = Math.max(0, Math.floor((new Date(next.startsAt).getTime() - Date.now()) / 86_400_000))

  let articles: NewsArticleView[] = []
  try {
    articles = (await fetchRallyNews({ perPage: HERO_ROTATING + HERO_ASIDE + GRID_COUNT })).articles
  } catch {
    // autosport.ee ei vasta: avaleht jääb ilma uudisteta, mitte veateatega.
    articles = []
  }
  const rotating = articles.slice(0, HERO_ROTATING)
  const aside = articles.slice(HERO_ROTATING, HERO_ROTATING + HERO_ASIDE)
  const grid = articles.slice(HERO_ROTATING + HERO_ASIDE, HERO_ROTATING + HERO_ASIDE + GRID_COUNT)

  return (
    <>
      <SiteNav />
      <main id="sisu" className="bg-black text-white">
        <RoundStrip event={next} roundNumber={roundNumber} initialDays={initialDays} />
        <QuickLinks locale={locale} />
        {rotating.length > 0 ? (
          <NewsHero rotating={rotating} aside={aside} />
        ) : (
          <p className="shell flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/10 py-6 text-sm text-white/70">
            {t.home.newsUnavailable}
            <a
              href="https://autosport.ee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-blue hover:text-white"
            >
              autosport.ee
              <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
            </a>
          </p>
        )}
        <SeasonStrip locale={locale} />
        <StandingsBrief locale={locale} />
        <NewsGrid articles={grid} locale={locale} />
        <JoinBand locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
