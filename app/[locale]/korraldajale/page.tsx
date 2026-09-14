import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { getDictionary } from '@/lib/i18n'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  return pageMetadata(locale, '/korraldajale', getDictionary(locale).pages.organisers.title)
}

export default async function KorraldajalePage({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  const page = t.pages.organisers

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="border-b border-line py-24 lg:py-32">
          <div className="shell">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">{t.pages.eyebrow}</p>
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[1.02] text-black sm:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-slate">
              {t.pages.underConstruction} {page.lead}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
