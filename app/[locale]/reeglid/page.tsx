import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { RulesList } from '@/components/rules-list'
import { RULE_DOCUMENTS, TECHNICAL_DOCUMENTS } from '@/lib/rules-documents'
import { getDictionary } from '@/lib/i18n'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  return pageMetadata(locale, '/reeglid', t.rules.metaTitle, t.rules.metaDescription)
}

export default async function ReeglidPage({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="relative overflow-hidden border-b border-line bg-mist">
          <Image
            src="/eal-logo.png"
            alt=""
            width={399}
            height={400}
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-1/2 h-[320px] w-[320px] -translate-y-1/2 opacity-[0.14] sm:-right-6 sm:h-[440px] sm:w-[440px]"
          />
          <div className="shell relative py-20 lg:py-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">{t.rules.eyebrow}</p>
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[1.02] text-black sm:text-6xl">
              {t.rules.title}
            </h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-slate">{t.rules.lead}</p>
          </div>
        </section>

        <section className="border-b border-line py-16 lg:py-20">
          <div className="shell">
            <h2 className="font-display text-3xl font-bold uppercase text-black sm:text-4xl">{t.rules.documents}</h2>
            <div className="mt-8">
              <RulesList documents={RULE_DOCUMENTS} locale={locale} />
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="shell">
            <h2 className="font-display text-3xl font-bold uppercase text-black sm:text-4xl">{t.rules.technical}</h2>
            <div className="mt-8">
              <RulesList documents={TECHNICAL_DOCUMENTS} locale={locale} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
