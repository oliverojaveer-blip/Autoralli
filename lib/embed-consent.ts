'use client'

import { useSyncExternalStore } from 'react'

/**
 * Sotsiaalmeedia manuste (Instagram, Facebook, TikTok, YouTube) laadimise
 * eelistus. Vaikimisi laetakse iga postitus klõpsuga — see on ühtlasi
 * lugeja nõusolek kolmanda osapoole küpsisteks. Kui lugeja on korra
 * öelnud "näita automaatselt", jääb see tema seadmesse meelde
 * (localStorage) ja manused laetakse ise, kui need vaatesse kerivad.
 * Eelistuse saab jaluses tagasi keerata. Serverisse ei jõua midagi.
 */

export type EmbedMode = 'ask' | 'auto'

const KEY = 'autoralli.embeds'
const EVENT = 'autoralli:embeds'

function read(): EmbedMode {
  try {
    return localStorage.getItem(KEY) === 'auto' ? 'auto' : 'ask'
  } catch {
    return 'ask'
  }
}

export function setEmbedMode(mode: EmbedMode) {
  try {
    if (mode === 'auto') localStorage.setItem(KEY, 'auto')
    else localStorage.removeItem(KEY)
  } catch {
    /* privaatne aken vms — eelistus jääb selleks sessiooniks mällu */
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

/** Serveris ja esimesel renderdusel alati 'ask', et HTML klapiks. */
export function useEmbedMode(): EmbedMode {
  return useSyncExternalStore(subscribe, read, () => 'ask')
}
