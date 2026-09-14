'use client'

import { useCallback, useEffect, useState } from 'react'

export type RallyLynxErrorKind = 'server' | 'network'

export type RallyLynxResourceState<T> =
  | { kind: 'loading' }
  | { kind: 'unconfigured' }
  | { kind: 'error'; error: RallyLynxErrorKind; status?: number }
  /**
   * `stale` = viimane päring ebaõnnestus, aga `data` on viimane õnnestunud
   * vastus. Tabel jääb ekraanile; UI näitab ainult "ühendus katkes" rida.
   */
  | { kind: 'ready'; data: T; fetchedAt: number; stale: boolean; error?: RallyLynxErrorKind }

type CacheEntry = { data: unknown; fetchedAt: number }

/**
 * Mooduli-tasemel vahemälu: sama tee (nt `/api/rallylynx/stages`) laetakse
 * vahekaardi vahetusel vahemälust kohe, mitte uuesti serverist. Poll
 * uuendab kirje taustal.
 */
const cache = new Map<string, CacheEntry>()

function initialState<T>(path: string | null): RallyLynxResourceState<T> {
  const hit = path ? cache.get(path) : undefined
  if (hit) return { kind: 'ready', data: hit.data as T, fetchedAt: hit.fetchedAt, stale: false }
  return { kind: 'loading' }
}

/**
 * Toob ühe RallyLynx route'i andmed ja kordab päringut valikulise
 * intervalliga. `path === null` jätab päringu tegemata (nt kui oodatakse
 * veel kiiruskatse valikut).
 *
 * Ebaõnnestunud poll EI kustuta juba nähtavaid andmeid (claude.md: ametlikke
 * tulemusi ei kirjutata üle; raja ääres katkeb 3G pidevalt) — seis
 * märgitakse `stale` ja kasutaja saab "Proovi uuesti" nupuga uuesti laadida.
 */
export function useRallyLynxResource<T>(
  path: string | null,
  options: { pollMs?: number } = {},
): RallyLynxResourceState<T> & { reload: () => void } {
  const [state, setState] = useState<RallyLynxResourceState<T>>(() => initialState<T>(path))
  const [reloadTick, setReloadTick] = useState(0)
  const reload = useCallback(() => setReloadTick((n) => n + 1), [])
  const pollMs = options.pollMs

  useEffect(() => {
    if (!path) return

    let cancelled = false
    setState(initialState<T>(path))

    const fail = (error: RallyLynxErrorKind, status?: number) =>
      setState((prev) =>
        prev.kind === 'ready' ? { ...prev, stale: true, error } : { kind: 'error', error, status },
      )

    async function load() {
      try {
        const res = await fetch(path as string, { cache: 'no-store' })
        if (cancelled) return

        if (res.status === 503) {
          setState({ kind: 'unconfigured' })
          return
        }
        if (!res.ok) {
          fail('server', res.status)
          return
        }

        const data = (await res.json()) as T
        if (cancelled) return
        const fetchedAt = Date.now()
        cache.set(path as string, { data, fetchedAt })
        setState({ kind: 'ready', data, fetchedAt, stale: false })
      } catch {
        if (!cancelled) fail('network')
      }
    }

    load()
    const interval = pollMs ? setInterval(load, pollMs) : undefined
    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
    }
  }, [path, pollMs, reloadTick])

  return { ...state, reload }
}
