import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { getDictionary, localizedHref } from '@/lib/i18n'
import { formatLongDate } from '@/lib/dates'
import { CONTROLLER, PRIVACY_INTRO, PRIVACY_SECTIONS, PRIVACY_UPDATED } from '@/lib/privacy'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  return pageMetadata(locale, '/privaatsus', t.privacy.title, t.privacy.metaDescription)
}

/**
 * Privaatsusteade. Sisu on `lib/privacy.ts` failis (et/en), et teksti
 * saaks muuta ilma lehte puutumata. Lugemisleht: üks veerg, 65–72ch.
 */
export default async function PrivaatsusPage({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="border-b border-line py-16 lg:py-24">
          <div className="shell">
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.96] text-black sm:text-6xl">
              {t.privacy.title}
            </h1>
            <p className="mt-3 text-[13px] text-slate">
              {t.privacy.updated} <span className="tnum">{formatLongDate(PRIVACY_UPDATED, locale)}</span>
              <span className="mx-2 text-line" aria-hidden="true">
                ·
              </span>
              {CONTROLLER.name}
            </p>
            <p className="mt-8 max-w-[68ch] text-lg leading-relaxed text-black">{PRIVACY_INTRO[locale]}</p>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="shell">
            <div className="max-w-[72ch]">
              {PRIVACY_SECTIONS.map((section, i) => (
                <section key={section.title.et} className={i > 0 ? 'mt-12 border-t border-line pt-10' : ''}>
                  <h2 className="font-display text-2xl font-bold uppercase leading-none text-black sm:text-3xl">
                    {section.title[locale]}
                  </h2>
                  {section.paragraphs[locale].map((p) => (
                    <p key={p} className="mt-4 text-[16px] leading-relaxed text-black/85">
                      {p}
                    </p>
                  ))}
                  {section.bullets ? (
                    <ul className="mt-4 space-y-2 pl-5 text-[16px] leading-relaxed text-black/85 marker:text-blue">
                      {section.bullets[locale].map((b) => (
                        <li key={b} className="list-disc">
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <p className="mt-12 border-t border-line pt-8 text-[15px] text-slate">
                {t.privacy.contactLead}{' '}
                <Link href={localizedHref(locale, CONTROLLER.contactPath)} className="font-bold text-blue hover:text-black">
                  {t.nav.contact}
                </Link>
                {CONTROLLER.email ? (
                  <>
                    {' · '}
                    <a href={`mailto:${CONTROLLER.email}`} className="font-bold text-blue hover:text-black">
                      {CONTROLLER.email}
                    </a>
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
