import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { fetchRallyNews, type NewsArticleView, type NewsPageView } from '@/lib/autosport/adapter'

export const metadata: Metadata = {
  title: 'Uudised',
  description: 'Eesti autoralli uudised — Eesti Autospordi Liidu ralliuudised ühes kohas.',
}

const MONTHS = ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets']

/** Ilma Intl-ita, et server ja klient annaksid sama tulemuse (vt lib/events.ts). */
function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getUTCDate()}. ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function ArticleCard({ article, featured = false }: { article: NewsArticleView; featured?: boolean }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col overflow-hidden rounded-md border border-line bg-gradient-to-b from-white to-mist transition-colors hover:border-blue ${
        featured ? 'lg:col-span-2 lg:flex-row' : ''
      }`}
    >
      <div
        className={`relative aspect-[3/2] shrink-0 overflow-hidden bg-mist ${
          featured ? 'lg:aspect-auto lg:w-[56%]' : ''
        }`}
      >
        {article.image ? (
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="object-cover transition-transform duration-700 ease-forward group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="bg-checker h-12 w-12 text-black/10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col p-5 ${featured ? 'lg:justify-center lg:p-8' : ''}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
          {formatDate(article.publishedAt)}
        </p>
        <h2
          className={`mt-2 font-display font-bold uppercase leading-[1.05] text-black transition-colors group-hover:text-blue ${
            featured ? 'text-2xl sm:text-3xl' : 'text-lg'
          }`}
        >
          {article.title}
        </h2>
        {article.excerpt ? (
          <p className={`mt-3 text-sm leading-relaxed text-slate ${featured ? 'line-clamp-4 sm:text-base' : 'line-clamp-3'}`}>
            {article.excerpt}
          </p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold uppercase tracking-[0.08em] text-blue">
          Loe autosport.ee-s
          <ArrowUpRight size={14} weight="bold" />
        </span>
      </div>
    </a>
  )
}

function Pagination({ news }: { news: NewsPageView }) {
  if (news.totalPages <= 1) return null
  const prev = news.page > 1 ? news.page - 1 : null
  const next = news.page < news.totalPages ? news.page + 1 : null
  const linkClass =
    'inline-flex min-h-[44px] items-center gap-2 rounded-md border px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors'

  return (
    <nav aria-label="Uudiste lehed" className="mt-12 flex items-center justify-between gap-4">
      {prev ? (
        <Link href={prev === 1 ? '/uudised' : `/uudised?leht=${prev}`} className={`${linkClass} border-line text-black hover:border-blue hover:text-blue`}>
          <CaretLeft size={14} weight="bold" />
          Uuemad
        </Link>
      ) : (
        <span />
      )}
      <span className="font-mono text-xs text-slate">
        {news.page} / {news.totalPages}
      </span>
      {next ? (
        <Link href={`/uudised?leht=${next}`} className={`${linkClass} border-line text-black hover:border-blue hover:text-blue`}>
          Vanemad
          <CaretRight size={14} weight="bold" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default async function UudisedPage({
  searchParams,
}: {
  searchParams: Promise<{ leht?: string }>
}) {
  const { leht } = await searchParams
  const page = Number(leht) > 0 ? Math.floor(Number(leht)) : 1

  let news: NewsPageView | null = null
  try {
    news = await fetchRallyNews({ page })
  } catch {
    news = null
  }

  const [feature, ...rest] = news?.articles ?? []

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="border-b border-line py-20 lg:py-28">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">Uudised</p>
                <h1 className="mt-5 max-w-[24ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
                  Eesti autoralli uudised
                </h1>
                <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-slate">
                  Eesti Autospordi Liidu ralliuudised. Täisartiklid avanevad autosport.ee lehel.
                </p>
              </div>
              <a
                href={news?.sourceUrl ?? 'https://autosport.ee/category/ralli/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line px-5 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:border-blue hover:text-blue"
              >
                Kõik uudised autosport.ee-s
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>

            {news && feature ? (
              <>
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {news.page === 1 ? <ArticleCard article={feature} featured /> : <ArticleCard article={feature} />}
                  {rest.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                <Pagination news={news} />
              </>
            ) : (
              <div className="mt-14 rounded-md border border-line bg-gradient-to-b from-white to-mist px-6 py-16 text-center">
                <p className="font-semibold text-black">Uudiseid ei õnnestunud praegu laadida.</p>
                <p className="mt-2 text-sm text-slate">
                  Proovi hiljem uuesti või loe uudiseid otse{' '}
                  <a href="https://autosport.ee/category/ralli/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue underline-offset-2 hover:underline">
                    autosport.ee
                  </a>{' '}
                  lehel.
                </p>
              </div>
            )}

            <p className="mt-10 text-xs text-slate">
              Allikas:{' '}
              <a href="https://autosport.ee" target="_blank" rel="noopener noreferrer" className="font-semibold text-black underline-offset-2 hover:underline">
                Eesti Autospordi Liit · autosport.ee
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
