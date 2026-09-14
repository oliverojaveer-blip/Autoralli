import Image from 'next/image'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { NewsArticleView } from '@/lib/autosport/adapter'
import { SnapScroller, SNAP_ITEM_CLASS } from './snap-scroller'
import { formatLongDate } from '@/lib/dates'
import { getDictionary, type Locale } from '@/lib/i18n'

/** Avalehe uudiste slider: viis viimast autosport.ee ralliuudist. */
export function NewsScroller({ articles, locale }: { articles: NewsArticleView[]; locale: Locale }) {
  const t = getDictionary(locale)
  return (
    <SnapScroller ariaLabel={t.home.latestNewsAria}>
      {articles.map((article) => (
        <li key={article.id} className={SNAP_ITEM_CLASS}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-gradient-to-b from-white to-mist transition-colors hover:border-blue"
          >
            <div className="relative aspect-[3/2] overflow-hidden bg-mist">
              {article.image ? (
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 82vw"
                  className="object-cover transition-transform duration-700 ease-forward group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="bg-checker h-12 w-12 text-black/10" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
                {formatLongDate(article.publishedAt, locale)}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold uppercase leading-[1.05] text-black transition-colors group-hover:text-blue">
                {article.title}
              </h3>
              {article.excerpt ? (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">{article.excerpt}</p>
              ) : null}
              <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold uppercase tracking-[0.08em] text-blue">
                {t.news.readOnAutosport}
                <ArrowUpRight size={14} weight="bold" />
              </span>
            </div>
          </a>
        </li>
      ))}
    </SnapScroller>
  )
}
