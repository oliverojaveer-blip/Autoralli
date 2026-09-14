'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { DEFAULT_LOCALE, getDictionary, localizedHref, type Dictionary, type Locale } from '@/lib/i18n'

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

/** Antakse `app/[locale]/layout.tsx`-ist; klientkomponendid loevad siit. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useT(): Dictionary {
  return getDictionary(useContext(LocaleContext))
}

/** `href("/kalender")` -> "/kalender" või "/en/kalender" vastavalt keelele. */
export function useHref(): (path: string) => string {
  const locale = useContext(LocaleContext)
  return (path: string) => localizedHref(locale, path)
}
