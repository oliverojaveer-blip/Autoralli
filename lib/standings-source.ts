import { defineQuery } from 'next-sanity'
import { sanityClient } from '@/sanity/client'
import { sanityConfigured } from '@/sanity/env'
import type { ResultStatus } from '@/lib/rallylynx/adapter'
import type { RallyEvent } from './events'
import { STANDINGS, STANDINGS_EVENT_CODES, type StandingsClass } from './standings'

/**
 * ============================================================================
 *  Punktiseis Sanityst — serveripoolne allikas.
 * ============================================================================
 *  `standingsTable` dokumendid -> `StandingsClass[]` (kuju, mida tabel
 *  juba kasutab). Punktiveerud joondatakse hooaja kalendriga: iga rea
 *  `points[i]` vastab `events[i]`-le, nii et veerupäised ja read tulevad
 *  samast allikast. Kui Sanitys pole hooaja tabeleid, jäävad kehtima
 *  `lib/standings.ts` selgelt märgistatud näidisread (`sample: true`).
 * ============================================================================
 */

export type StandingsView = {
  classes: StandingsClass[]
  /** Veerupäised, üks võistluse kohta, kalendri järjekorras. */
  eventCodes: string[]
  source: string | null
  sourceUrl: string | null
  updatedAt: string | null
  status: ResultStatus | null
  afterEventName: string | null
  sample: boolean
}

const REVALIDATE_SECONDS = 600

const QUERY = defineQuery(`
  *[_type == "standingsTable" && season == $season] | order(order asc, label asc){
    classId, label, status, source, sourceUrl, updatedAt,
    "afterEventName": afterEvent->name,
    rows[]{ position, driver, coDriver, entrant, car, total, points[]{ "eventId": event->eventId, points } }
  }
`)

type SanityTable = {
  classId: string
  label: string
  status: ResultStatus | null
  source: string | null
  sourceUrl: string | null
  updatedAt: string | null
  afterEventName: string | null
  rows: Array<{
    position: number
    driver: string
    coDriver: string | null
    entrant: string | null
    car: string | null
    total: number
    points: Array<{ eventId: string | null; points: number | null }> | null
  }> | null
}

/**
 * Lühikoodid veerupäisteks: nime esimese sõna kolm esimest tähte (ALŪ,
 * JYV, PAI). Kui kaks võistlust annaksid sama koodi (Saaremaa Sprintralli
 * ja Saaremaa Ralli), võetakse kaks tähte esimesest ja üks teisest sõnast
 * (SAS, SAR). Toimetaja võib koodi Sanitys ise määrata (`shortCode`).
 */
export function eventCodes(events: RallyEvent[]): string[] {
  const first = events.map((e) => e.shortCode ?? e.name.split(/\s+/)[0].slice(0, 3).toUpperCase())
  return first.map((code, i) => {
    if (events[i].shortCode || first.filter((c) => c === code).length === 1) return code
    const words = events[i].name.split(/\s+/)
    return (words[0].slice(0, 2) + (words[1]?.[0] ?? '')).toUpperCase()
  })
}

export async function getStandings(events: RallyEvent[], season = new Date().getFullYear()): Promise<StandingsView> {
  const sample: StandingsView = {
    classes: STANDINGS,
    eventCodes: [...STANDINGS_EVENT_CODES],
    source: null,
    sourceUrl: null,
    updatedAt: null,
    status: null,
    afterEventName: null,
    sample: true,
  }
  if (!sanityConfigured) return sample

  let tables: SanityTable[] = []
  try {
    tables = await sanityClient.fetch<SanityTable[]>(QUERY, { season }, { next: { revalidate: REVALIDATE_SECONDS } })
  } catch (error) {
    console.error('[standings] Sanity päring ebaõnnestus, kasutan näidisandmeid', error)
    return sample
  }
  if (tables.length === 0) return sample

  const eventIds = events.map((e) => e.id)
  const classes: StandingsClass[] = tables.map((t) => ({
    classId: t.classId,
    label: t.label,
    rows: (t.rows ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((r) => ({
        position: r.position,
        driver: r.coDriver ? `${r.driver} / ${r.coDriver}` : r.driver,
        entrant: r.entrant ?? '—',
        car: r.car ?? '—',
        points: eventIds.map((id) => r.points?.find((p) => p.eventId === id)?.points ?? null),
        total: r.total,
      })),
  }))

  // Metaandmed absoluutarvestuselt (esimene tabel), kui klassidel need erinevad.
  const head = tables[0]
  return {
    classes,
    eventCodes: eventCodes(events),
    source: head.source,
    sourceUrl: head.sourceUrl,
    updatedAt: head.updatedAt,
    status: head.status,
    afterEventName: head.afterEventName,
    sample: false,
  }
}
