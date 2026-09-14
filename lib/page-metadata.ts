import type { Metadata } from 'next'
import { isLocale, localizedHref, type Locale } from './i18n'

export type LocaleParams = { params: Promise<{ locale: string }> }

/** `params.locale` -> kindel Locale (vale väärtus langeb eesti keelele; layout teeb 404). */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : 'et'
}

/** Lehtede `generateMetadata` abi: pealkiri + kirjeldus + hreflang-alternatiivid. */
export function pageMetadata(locale: Locale, path: string, title: string, description?: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: localizedHref(locale, path),
      languages: {
        et: localizedHref('et', path),
        en: localizedHref('en', path),
        'x-default': localizedHref('et', path),
      },
    },
  }
}
