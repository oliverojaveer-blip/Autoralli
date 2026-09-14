import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { NewsArticleView } from '@/lib/autosport/adapter'
import { formatLongDate } from '@/lib/dates'
import { getDictionary, localizedHref, type Locale } from '@/lib/i18n'
import { FlagLink } from './flag-link'

/**
 * Uudiste ruudustik lehe lõpuosas: järgmised autosport.ee ralliuudised
 * pärast lava viit. Ilma piltideta uudis saab ruudulise märgi, mitte
 * tühja kasti.
 */
export function NewsGrid({ articles, locale }: { articles: NewsArticleView[]; locale: Locale }) {
  const t = getDictionary(locale)
  if (articles.length === 0) return null

  return (
    <section className="border-t border-white/10 bg-black py-14 text-white lg:py-20" aria-labelledby="uudised">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h2 id="uudised" className="font-display text-4xl font-bold uppercase leading-[0.96] sm:text-5xl">
              {t.home.newsTitleGrid}
            </h2>
            <FlagLink href={localizedHref(locale, '/uudised')} size="sm" className="mr-2">
              {t.home.allNews}
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </FlagLink>
        </div>

        <ul className="mt-10 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4" aria-label={t.home.latestNewsAria}>
            {articles.map((article) => (
              <li key={article.id}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block focus-visible:ring-offset-black"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-midnight">
                    {article.image ? (
                      <Image
                        src={article.image.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="bg-checker h-12 w-12 text-white/10" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-balance font-display text-xl font-bold uppercase leading-[1.02] transition-colors group-hover:text-blue">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-white/60">
                    <span className="tnum">{formatLongDate(article.publishedAt, locale)}</span> · autosport.ee
                  </p>
                  {article.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">{article.excerpt}</p>
                  ) : null}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-blue">
                    {t.news.readOnAutosport}
                    <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}
