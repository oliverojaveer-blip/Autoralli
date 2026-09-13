/**
 * ============================================================================
 *  RallyLynx API — HTTP klient.
 * ============================================================================
 *  Ainult serveripoolne (kasutab `x-api-key`-t, mida ei tohi kliendile
 *  saata). Iga võti kehtib ühe võistluse jaoks (vt spec.json), seega
 *  eventId ja apiKey käivad alati koos.
 *
 *  Impordi seda faili ainult Route Handleritest / Server Componentidest —
 *  see ei tohi kunagi jõuda kliendi JS bundlisse.
 * ============================================================================
 */

const BASE_URL = 'https://api.rallylynx.com'

export class RallyLynxError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'RallyLynxError'
  }
}

type RallyLynxRequestOptions = {
  eventId: string
  apiKey: string
  path: string
  searchParams?: Record<string, string | undefined>
  /** Kui antud, saadetakse If-None-Match ja 304 korral tagastatakse `null`. */
  ifNoneMatch?: string
}

export type RallyLynxResponse<T> = {
  data: T
  etag: string | null
  cacheControl: string | null
}

/**
 * Teeb päringu RallyLynx API-le. Viskab `RallyLynxError`, kui vastus pole ok
 * (v.a 304, mis tähendab "andmed samad, mis eelmine kord").
 */
export async function rallyLynxFetch<T>(
  options: RallyLynxRequestOptions,
): Promise<RallyLynxResponse<T> | null> {
  const { eventId, apiKey, path, searchParams, ifNoneMatch } = options

  const url = new URL(`${BASE_URL}/events/${eventId}${path}`)
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value)
  }

  const headers: Record<string, string> = { 'x-api-key': apiKey }
  if (ifNoneMatch) headers['If-None-Match'] = ifNoneMatch

  const res = await fetch(url, { headers, cache: 'no-store' })

  if (res.status === 304) return null

  if (!res.ok) {
    throw new RallyLynxError(
      `RallyLynx ${path} vastas ${res.status}-ga`,
      res.status,
    )
  }

  const data = (await res.json()) as T
  return {
    data,
    etag: res.headers.get('etag'),
    cacheControl: res.headers.get('cache-control'),
  }
}
