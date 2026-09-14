'use client'

import { setEmbedMode, useEmbedMode } from '@/lib/embed-consent'
import { useT } from './locale-provider'

/**
 * Jaluse rida: kas sotsiaalmeedia manused laetakse automaatselt või
 * klõpsuga. Sama eelistus, mille lugeja otseblogis andis; siit saab selle
 * tagasi keerata (privaatsusteade viitab siia).
 */
export function EmbedPreference() {
  const t = useT()
  const mode = useEmbedMode()
  return (
    <p className="font-mono text-xs text-white/50">
      {t.footer.embedsLabel}: {mode === 'auto' ? t.footer.embedsAuto : t.footer.embedsAsk}
      <span className="mx-2 text-white/25" aria-hidden="true">
        ·
      </span>
      <button
        type="button"
        onClick={() => setEmbedMode(mode === 'auto' ? 'ask' : 'auto')}
        className="font-semibold text-white/80 underline-offset-4 hover:text-blue hover:underline focus-visible:ring-offset-midnight"
      >
        {t.footer.embedsToggle}
      </button>
    </p>
  )
}
