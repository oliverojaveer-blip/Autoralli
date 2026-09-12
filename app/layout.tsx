import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

/**
 * latin-ext on kohustuslik: ilma selleta ei renderdu õ ä ö ü korrektselt.
 * next/font hostib fondid ise, nii et välist päringut Google'ile ei tehta.
 *
 * Fondivalik tuleb otse Autoralli_Brand_Guidelines_v1.pdf failist:
 * Barlow Condensed (display), Inter (UI + body), IBM Plex Mono (ajad + andmed).
 */
const display = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-mono',
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
    <html lang="et" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
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
