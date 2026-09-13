'use client'

import { useEffect, useState } from 'react'

export type RallyLynxResourceState<T> =
  | { kind: 'loading' }
  | { kind: 'unconfigured' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; data: T }

/**
 * Toob ühe RallyLynx route'i (nt `/api/rallylynx/classification`) andmed ja
 * kordab päringut valikulise intervalliga. `path === null` jätab päringu
 * tegemata (nt kui oodatakse veel kiiruskatse valikut).
 */
export function useRallyLynxResource<T>(
  path: string | null,
  options: { pollMs?: number } = {},
): RallyLynxResourceState<T> {
  const [state, setState] = useState<RallyLynxResourceState<T>>({ kind: 'loading' })

  useEffect(() => {
    if (!path) return

    let cancelled = false
    setState({ kind: 'loading' })

    async function load() {
      try {
        const res = await fetch(path as string, { cache: 'no-store' })
        if (cancelled) return

        if (res.status === 503) {
          setState({ kind: 'unconfigured' })
          return
        }
        if (!res.ok) {
          setState({ kind: 'error', message: `Serveri viga (${res.status}).` })
          return
        }

        const data = (await res.json()) as T
        if (!cancelled) setState({ kind: 'ready', data })
      } catch {
        if (!cancelled) setState({ kind: 'error', message: 'Andmete laadimine ebaõnnestus.' })
      }
    }

    load()
    const interval = options.pollMs ? setInterval(load, options.pollMs) : undefined
    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, options.pollMs])

  return state
}
