'use client'

import dynamic from 'next/dynamic'

/**
 * Studio laetakse ainult kliendis (ilma SSR-ita) — see on toimetuse
 * rakendus, mitte avalik leht. Kasutame `sanity` paketi enda `<Studio>`-t,
 * mitte `next-sanity/studio` ümbrist: viimane nõuab Reacti
 * `useEffectEvent`-i, mida Next 15 kaasa pandud React ei ekspordi.
 */
const StudioInner = dynamic(() => import('./studio-inner').then((m) => m.StudioInner), { ssr: false })

export function StudioClient() {
  return <StudioInner />
}
