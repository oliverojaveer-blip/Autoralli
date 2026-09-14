import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from './reveal'
import { NewsScroller } from './news-scroller'
import { fetchRallyNews, type NewsArticleView } from '@/lib/autosport/adapter'
import { getDictionary, localizedHref, type Locale } from '@/lib/i18n'

const LATEST_COUNT = 5

/**
 * Avalehe uudiste sektsioon: viis viimast autosport.ee ralliuudist
 * sliderina + link /uudised lehele. Kui autosport.ee ei vasta, jätame
 * sektsiooni vaikselt ära — avalehel ei tohi olla tühja veateadet.
 */
export async function NewsSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  let articles: NewsArticleView[] = []
  try {
    articles = (await fetchRallyNews({ perPage: LATEST_COUNT })).articles
  } catch {
    articles = []
  }

  if (articles.length === 0) return null

  return (
    <section className="border-b border-line py-20 lg:py-28" id="uudised">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">{t.home.newsEyebrow}</p>
              <h2 className="mt-5 max-w-[20ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
                {t.home.newsTitle}
              </h2>
            </div>
            <Link
              href={localizedHref(locale, '/uudised')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line px-5 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:border-blue hover:text-blue"
            >
              {t.home.allNews}
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <NewsScroller articles={articles} locale={locale} />
        </Reveal>
      </div>
    </section>
  )
}
