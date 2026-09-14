import type { Metadata, Viewport } from 'next'
import { StudioClient } from './studio-client'

/**
 * Sanity Studio saidi sees: autoralli.ee/studio. Teed /studio ei kirjuta
 * keele-middleware ümber (vt middleware.ts) ja robots ei indekseeri.
 */
export const metadata: Metadata = {
  title: 'Autoralli.ee Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function StudioPage() {
  return <StudioClient />
}
