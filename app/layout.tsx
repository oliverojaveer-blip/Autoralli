import type { Metadata, Viewport } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'

/**
 * latin-ext on kohustuslik: ilma selleta ei renderdu õ ä ö ü korrektselt.
 * next/font hostib fondid ise, nii et välist päringut Google'ile ei tehta.
 *
 * Brändiraamat (Autoralli_Brand_Guidelines_v1.pdf) nimetab Barlow Condensed
 * (display), Inter (UI + body) ja IBM Plex Mono (ajad + andmed). Inter ja
 * Plex Mono on asendatud Barlow'ga, et sait räägiks ühe perekonna häälega
 * ega näeks välja nagu iga teine Inter/Plex-põhine tooteleht. Ajad püsivad
 * joondatud Barlow' tabelnumbritega (`tabular-nums`), mono pole vaja.
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

export const metadata: Metadata = {
  title: {
    default: 'Autoralli.ee | Estonian Rally Championship',
    template: '%s | Autoralli.ee',
  },
  description:
    'Estonian Rally Championship — Eesti autoralli kalender, stardinimekirjad, tulemused ja uudised ühes kohas.',
  metadataBase: new URL('https://autoralli.ee'),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D71B8',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="et" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a
          href="#sisu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-blue focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Liigu põhisisu juurde
        </a>
        {children}
      </body>
    </html>
  )
}
