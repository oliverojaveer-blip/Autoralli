'use client'

import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { useHref, useLocale, useT } from '@/components/locale-provider'

/**
 * `not-found` ei saa `params`-i, aga renderdub `[locale]/layout` sees,
 * seega keel tuleb LocaleProvider'ist (klientkomponent).
 */
export default function NotFound() {
  const t = useT()
  const locale = useLocale()
  const href = useHref()
  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="border-b border-line py-24 lg:py-32">
          <div className="shell">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">404</p>
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[1.02] text-black sm:text-6xl">
              {t.notFound.title}
            </h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-slate">{t.notFound.lead}</p>
            <Link
              href={href('/')}
              className="mt-8 inline-flex items-center bg-blue px-6 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
            >
              {t.notFound.home}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
