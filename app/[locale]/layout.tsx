import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import { LocaleProvider } from '@/components/locale-provider'
import { getDictionary, isLocale, LOCALES } from '@/lib/i18n'
import type { LocaleParams } from '@/lib/page-metadata'
import '../globals.css'

/**
 * latin-ext on kohustuslik: ilma selleta ei renderdu õ ä ö ü korrektselt.
 * next/font hostib fondid ise, nii et välist päringut Google'ile ei tehta.
 *
 * Fondid: ainult Barlow Condensed (display) ja Barlow (kehatekst, sildid,
 * ajad) — vt claude.md "UI ja UX". Ajad püsivad joondatud Barlow'
 * tabelnumbritega (`tabular-nums`), eraldi monospace-fonti pole.
 */
const display = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const sans = Barlow({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params
  const t = getDictionary(isLocale(locale) ? locale : 'et')
  return {
    title: { default: t.meta.siteTitle, template: '%s | Autoralli.ee' },
    description: t.meta.siteDescription,
    metadataBase: new URL('https://autoralli.ee'),
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D71B8',
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  return (
    <html lang={t.meta.htmlLang} className={`${display.variable} ${sans.variable}`}>
      <body>
        <LocaleProvider locale={locale}>
          <a
            href="#sisu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-blue focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
          >
            {t.common.skipToContent}
          </a>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
