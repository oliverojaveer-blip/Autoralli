'use client'

import { Studio } from 'sanity'
import config from '@/sanity.config'

/**
 * Studio peab saama kogu vaateakna kõrguse — muidu ei tea tema sisemised
 * paneelid, kui kõrged nad on, ja nimekirjad kerivad koos lehega valesti.
 */
export function StudioInner() {
  return (
    <div style={{ height: '100dvh', overflow: 'hidden' }}>
      <Studio config={config} unstable_globalStyles />
    </div>
  )
}
