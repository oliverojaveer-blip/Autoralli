import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteNav } from '@/components/site-nav'
import { ClassSelector } from '@/components/class-selector'
import { SiteFooter } from '@/components/site-footer'
import { TyreSection } from '@/components/tyre-section'
import { getDictionary } from '@/lib/i18n'
import { pageMetadata, toLocale, type LocaleParams } from '@/lib/page-metadata'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = toLocale((await params).locale)
  const t = getDictionary(locale)
  return pageMetadata(locale, '/klassid', t.classes.metaTitle, t.classes.metaDescription)
}

export default async function KlassidPage({ params }: LocaleParams) {
  const locale = toLocale((await params).locale)
  return (
    <>
      <SiteNav />
      <main id="sisu">
        <Suspense fallback={null}>
          <ClassSelector />
        </Suspense>
        <TyreSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
