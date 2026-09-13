/**
 * ============================================================================
 *  RallyLynx adapter — API kuju -> saidi enda tulemuste vaated.
 * ============================================================================
 *  claude.md nõue: "Välised andmeallikad tuleb ühendada adapterite kaudu."
 *  Ükski komponent ei tohi importida `lib/rallylynx/types.ts` otse — kõik
 *  käib läbi siinsete funktsioonide ja `Rally*View` tüüpide, et RallyLynx'i
 *  skeemi muutused ei leviks kogu koodibaasi.
 * ============================================================================
 */

import { rallyLynxFetch } from './client'
import type { RallyLynxEventCredentials } from './config'
import type {
  RallyLynxClassification,
  RallyLynxCompetitorEntry,
  RallyLynxEventDetail,
  RallyLynxItinerary,
  RallyLynxItineraryItem,
  RallyLynxPenalty,
  RallyLynxRetirement,
  RallyLynxStageResults,
} from './types'

export type ResultStatus = 'unofficial' | 'provisional' | 'official' | 'amended'

/** RallyLynx staatused, mida API tegelikult tagastab, saidi enda sõnavarasse. */
function toResultStatus(rallyLynxStatus: string): ResultStatus {
  switch (rallyLynxStatus) {
    case 'official':
      return 'official'
    case 'amended':
      return 'amended'
    case 'provisional':
      return 'provisional'
    default:
      return 'unofficial'
  }
}

function competitorLookup(competitors: RallyLynxCompetitorEntry[]) {
  const byId = new Map(competitors.map((c) => [c.competitorId, c]))
  return (id: string) => byId.get(id) ?? null
}

function itineraryLookup(itinerary: RallyLynxItinerary) {
  const byId = new Map<string, RallyLynxItineraryItem>()
  for (const day of itinerary.days) {
    for (const item of day.items) byId.set(item.id, item)
  }
  return (id: string) => byId.get(id) ?? null
}

function itineraryItemLabel(item: RallyLynxItineraryItem | null): string {
  if (!item) return '—'
  return item.name ? `${item.code ?? item.type} — ${item.name}` : (item.code ?? item.type)
}

async function fetchCore(credentials: RallyLynxEventCredentials) {
  const { eventId, apiKey } = credentials
  const [eventRes, competitorsRes, itineraryRes] = await Promise.all([
    rallyLynxFetch<RallyLynxEventDetail>({ eventId, apiKey, path: '' }),
    rallyLynxFetch<{ competitors: RallyLynxCompetitorEntry[] }>({
      eventId,
      apiKey,
      path: '/competitors',
    }),
    rallyLynxFetch<RallyLynxItinerary>({ eventId, apiKey, path: '/itinerary' }),
  ])

  if (!eventRes || !competitorsRes || !itineraryRes) {
    throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')
  }

  return {
    event: eventRes.data,
    competitors: competitorsRes.data.competitors,
    itinerary: itineraryRes.data,
  }
}

// ---------------------------------------------------------------------------
// Event overview (sarjad/klassid — filtrite jaoks)
// ---------------------------------------------------------------------------

export type RallyClassView = { id: string; name: string }
export type RallySeriesView = { id: string; name: string; code: string; classes: RallyClassView[] }

export type RallyEventOverview = {
  eventId: string
  eventName: string
  status: 'scheduled' | 'live' | 'finished'
  series: RallySeriesView[]
}

export async function fetchRallyEventOverview(
  credentials: RallyLynxEventCredentials,
): Promise<RallyEventOverview> {
  const res = await rallyLynxFetch<RallyLynxEventDetail>({
    eventId: credentials.eventId,
    apiKey: credentials.apiKey,
    path: '',
  })
  if (!res) throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')

  return {
    eventId: res.data.id,
    eventName: res.data.name,
    status: res.data.status,
    series: res.data.series,
  }
}

// ---------------------------------------------------------------------------
// Stage list (võistluskatsete valik)
// ---------------------------------------------------------------------------

export type RallyStageView = {
  id: string
  code: string
  name: string | null
  distanceM: number | null
}

export async function fetchRallyStages(
  credentials: RallyLynxEventCredentials,
): Promise<RallyStageView[]> {
  const res = await rallyLynxFetch<RallyLynxItinerary>({
    eventId: credentials.eventId,
    apiKey: credentials.apiKey,
    path: '/itinerary',
  })
  if (!res) throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')

  const stages: RallyStageView[] = []
  for (const day of res.data.days) {
    for (const item of day.items) {
      if (item.type !== 'stage') continue
      stages.push({
        id: item.id,
        code: item.code ?? '—',
        name: item.name ?? null,
        distanceM: item.distanceM ?? null,
      })
    }
  }
  return stages
}

// ---------------------------------------------------------------------------
// Classification (üldklassifikatsioon)
// ---------------------------------------------------------------------------

export type RallyResultRow = {
  competitorId: string
  number: string
  driver: string
  coDriver: string
  vehicle: string
  entrant: string | null
  classIds: string[]
  position: number | null
  stageTimeMs: number
  penaltyTimeMs: number
  totalTimeMs: number
  gapToLeaderMs: number | null
  diffToPrevMs: number | null
}

export type RallyNotClassifiedRow = {
  competitorId: string
  number: string
  driver: string
  coDriver: string
  reason: string
}

export type RallyClassificationView = {
  eventId: string
  eventName: string
  source: 'rallylynx'
  status: ResultStatus
  generatedAt: string
  updatedAt: string | null
  afterStage: string | null
  completedStageCount: number
  totalStageCount: number
  rows: RallyResultRow[]
  notClassified: RallyNotClassifiedRow[]
}

export async function fetchRallyClassification(
  credentials: RallyLynxEventCredentials,
  options: { afterStage?: string } = {},
): Promise<RallyClassificationView> {
  const { eventId, apiKey } = credentials
  const [{ event, competitors, itinerary }, classificationRes] = await Promise.all([
    fetchCore(credentials),
    rallyLynxFetch<RallyLynxClassification>({
      eventId,
      apiKey,
      path: '/classification',
      searchParams: { afterStage: options.afterStage },
    }),
  ])

  if (!classificationRes) {
    throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')
  }

  const findCompetitor = competitorLookup(competitors)
  const totalStageCount = itinerary.days.reduce(
    (total, day) => total + day.items.filter((item) => item.type === 'stage').length,
    0,
  )
  const classification = classificationRes.data

  const rows: RallyResultRow[] = classification.entries.map((entry) => {
    const competitor = findCompetitor(entry.competitorId)
    const overall = entry.rankings.overall ?? null

    return {
      competitorId: entry.competitorId,
      number: entry.number,
      driver: competitor?.driver.name ?? 'Teadmata',
      coDriver: competitor?.coDriver.name ?? 'Teadmata',
      vehicle: competitor?.vehicle ?? '—',
      entrant: competitor?.entrant ?? null,
      classIds: competitor?.classes ?? [],
      position: overall?.position ?? null,
      stageTimeMs: entry.stageTimeMs,
      penaltyTimeMs: entry.penaltyTimeMs,
      totalTimeMs: entry.totalTimeMs,
      gapToLeaderMs: overall?.gapToLeaderMs ?? null,
      diffToPrevMs: overall?.diffToPrevMs ?? null,
    }
  })

  rows.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))

  const notClassified: RallyNotClassifiedRow[] = classification.notClassified.map((nc) => {
    const competitor = findCompetitor(nc.competitorId)
    return {
      competitorId: nc.competitorId,
      number: competitor?.number ?? '—',
      driver: competitor?.driver.name ?? 'Teadmata',
      coDriver: competitor?.coDriver.name ?? 'Teadmata',
      reason: nc.reason,
    }
  })

  return {
    eventId: event.id,
    eventName: event.name,
    source: 'rallylynx',
    status: toResultStatus(classification.status),
    generatedAt: classification.generatedAt,
    updatedAt: classification.updatedAt ?? null,
    afterStage: classification.afterStage ?? null,
    completedStageCount: classification.completedStages.length,
    totalStageCount,
    rows,
    notClassified,
  }
}

// ---------------------------------------------------------------------------
// Stage results (kiiruskatse tulemus + vahepunktid)
// ---------------------------------------------------------------------------

export type RallyStageSplitTime = {
  splitIndex: number
  elapsedMs: number
  position: number | null
  gapToBestMs: number | null
}

export type RallyStageResultRow = {
  competitorId: string
  number: string
  driver: string
  coDriver: string
  vehicle: string
  classIds: string[]
  position: number | null
  durationMs: number | null
  gapToLeaderMs: number | null
  diffToPrevMs: number | null
  source: string
  avgSpeedMs: number | null
  anomaly: string | null
  onStage: boolean
  splits: RallyStageSplitTime[]
}

export type RallyStageResultsView = {
  stageId: string
  code: string
  name: string | null
  distanceM: number | null
  status: ResultStatus
  generatedAt: string
  updatedAt: string | null
  splitDistances: Array<{ splitIndex: number; distanceM: number }>
  rows: RallyStageResultRow[]
}

export async function fetchRallyStageResults(
  credentials: RallyLynxEventCredentials,
  stageId: string,
): Promise<RallyStageResultsView> {
  const { eventId, apiKey } = credentials
  const [{ competitors, itinerary }, stageRes] = await Promise.all([
    fetchCore(credentials),
    rallyLynxFetch<RallyLynxStageResults>({
      eventId,
      apiKey,
      path: `/stages/${stageId}/results`,
    }),
  ])

  if (!stageRes) {
    throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')
  }

  const findCompetitor = competitorLookup(competitors)
  const findItineraryItem = itineraryLookup(itinerary)
  const stageItem = findItineraryItem(stageId)
  const stage = stageRes.data

  const rows: RallyStageResultRow[] = stage.entries.map((entry) => {
    const competitor = findCompetitor(entry.competitorId)
    const overall = entry.rankings.overall ?? null

    return {
      competitorId: entry.competitorId,
      number: entry.number,
      driver: competitor?.driver.name ?? 'Teadmata',
      coDriver: competitor?.coDriver.name ?? 'Teadmata',
      vehicle: competitor?.vehicle ?? '—',
      classIds: competitor?.classes ?? [],
      position: overall?.position ?? null,
      durationMs: entry.durationMs,
      gapToLeaderMs: overall?.gapToLeaderMs ?? null,
      diffToPrevMs: overall?.diffToPrevMs ?? null,
      source: entry.source,
      avgSpeedMs: entry.avgSpeedMs ?? null,
      anomaly: entry.anomaly ?? null,
      onStage: entry.durationMs === null && entry.splits.length > 0,
      splits: entry.splits.map((split) => ({
        splitIndex: split.splitIndex,
        elapsedMs: split.elapsedMs,
        position: split.rankings.overall?.position ?? null,
        gapToBestMs: split.rankings.overall?.gapToBestMs ?? null,
      })),
    }
  })

  rows.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))

  return {
    stageId: stage.stageId,
    code: stage.code,
    name: stageItem?.name ?? null,
    distanceM: stageItem?.distanceM ?? null,
    status: toResultStatus(stage.status),
    generatedAt: stage.generatedAt,
    updatedAt: stage.updatedAt ?? null,
    splitDistances: stage.splits.map((split) => ({
      splitIndex: split.splitIndex,
      distanceM: split.distanceM,
    })),
    rows,
  }
}

// ---------------------------------------------------------------------------
// Stage winners (iga kiiruskatse võitja)
// ---------------------------------------------------------------------------

export type RallyStageWinnerRow = {
  stageId: string
  code: string
  name: string | null
  distanceM: number | null
  winnerDriver: string | null
  winnerCoDriver: string | null
  winnerNumber: string | null
  durationMs: number | null
}

/**
 * Iga kiiruskatse võitja. Teeb ühe päringu etapi kohta (RallyLynx ei paku
 * koondvaadet) — testkasutuse jaoks aktsepteeritav, tootmises tasub
 * paralleelseks/vahemällu panna, kui etappe on palju.
 */
export async function fetchRallyStageWinners(
  credentials: RallyLynxEventCredentials,
): Promise<RallyStageWinnerRow[]> {
  const stages = await fetchRallyStages(credentials)

  const results = await Promise.all(
    stages.map(async (stage) => {
      try {
        const stageResults = await fetchRallyStageResults(credentials, stage.id)
        const winner = stageResults.rows.find((row) => row.position === 1) ?? null
        return {
          stageId: stage.id,
          code: stage.code,
          name: stage.name,
          distanceM: stage.distanceM,
          winnerDriver: winner?.driver ?? null,
          winnerCoDriver: winner?.coDriver ?? null,
          winnerNumber: winner?.number ?? null,
          durationMs: winner?.durationMs ?? null,
        }
      } catch {
        return {
          stageId: stage.id,
          code: stage.code,
          name: stage.name,
          distanceM: stage.distanceM,
          winnerDriver: null,
          winnerCoDriver: null,
          winnerNumber: null,
          durationMs: null,
        }
      }
    }),
  )

  return results
}

// ---------------------------------------------------------------------------
// Timetable (päevakava)
// ---------------------------------------------------------------------------

export type RallyItineraryItemView = {
  id: string
  type: RallyLynxItineraryItem['type']
  code: string | null
  name: string | null
  distanceM: number | null
  targetTimeMs: number | null
  maxTimeMs: number | null
  allowedTimeMs: number | null
}

export type RallyItineraryDayView = {
  dayId: string
  date: string | null
  items: RallyItineraryItemView[]
}

export async function fetchRallyItinerary(
  credentials: RallyLynxEventCredentials,
): Promise<RallyItineraryDayView[]> {
  const res = await rallyLynxFetch<RallyLynxItinerary>({
    eventId: credentials.eventId,
    apiKey: credentials.apiKey,
    path: '/itinerary',
  })
  if (!res) throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')

  return res.data.days.map((day) => ({
    dayId: day.dayId,
    date: day.date ?? null,
    items: day.items.map((item) => ({
      id: item.id,
      type: item.type,
      code: item.code ?? null,
      name: item.name ?? null,
      distanceM: item.distanceM ?? null,
      targetTimeMs: item.targetTimeMs ?? null,
      maxTimeMs: item.maxTimeMs ?? null,
      allowedTimeMs: item.allowedTimeMs ?? null,
    })),
  }))
}

// ---------------------------------------------------------------------------
// Retirements (katkestamised)
// ---------------------------------------------------------------------------

export type RallyRetirementRow = {
  competitorId: string
  number: string
  driver: string
  coDriver: string
  vehicle: string
  reason: string
  afterPointLabel: string
  retiredAt: string | null
}

export async function fetchRallyRetirements(
  credentials: RallyLynxEventCredentials,
): Promise<RallyRetirementRow[]> {
  const { eventId, apiKey } = credentials
  const [{ competitors, itinerary }, retirementsRes] = await Promise.all([
    fetchCore(credentials),
    rallyLynxFetch<{ retirements: RallyLynxRetirement[] }>({
      eventId,
      apiKey,
      path: '/retirements',
    }),
  ])

  if (!retirementsRes) {
    throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')
  }

  const findCompetitor = competitorLookup(competitors)
  const findItineraryItem = itineraryLookup(itinerary)

  return retirementsRes.data.retirements.map((r) => {
    const competitor = findCompetitor(r.competitorId)
    return {
      competitorId: r.competitorId,
      number: competitor?.number ?? '—',
      driver: competitor?.driver.name ?? 'Teadmata',
      coDriver: competitor?.coDriver.name ?? 'Teadmata',
      vehicle: competitor?.vehicle ?? '—',
      reason: r.reason,
      afterPointLabel: r.afterPoint ? itineraryItemLabel(findItineraryItem(r.afterPoint)) : '—',
      retiredAt: r.retiredAt ?? null,
    }
  })
}

// ---------------------------------------------------------------------------
// Penalties (karistused)
// ---------------------------------------------------------------------------

export type RallyPenaltyRow = {
  competitorId: string
  number: string
  driver: string
  coDriver: string
  itineraryItemLabel: string
  reason: string
  amountMs: number
  source: string
}

export async function fetchRallyPenalties(
  credentials: RallyLynxEventCredentials,
): Promise<RallyPenaltyRow[]> {
  const { eventId, apiKey } = credentials
  const [{ competitors, itinerary }, penaltiesRes] = await Promise.all([
    fetchCore(credentials),
    rallyLynxFetch<{ penalties: RallyLynxPenalty[] }>({ eventId, apiKey, path: '/penalties' }),
  ])

  if (!penaltiesRes) {
    throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')
  }

  const findCompetitor = competitorLookup(competitors)
  const findItineraryItem = itineraryLookup(itinerary)

  return penaltiesRes.data.penalties.map((p) => {
    const competitor = findCompetitor(p.competitorId)
    return {
      competitorId: p.competitorId,
      number: competitor?.number ?? '—',
      driver: competitor?.driver.name ?? 'Teadmata',
      coDriver: competitor?.coDriver.name ?? 'Teadmata',
      itineraryItemLabel: itineraryItemLabel(findItineraryItem(p.itineraryItemId)),
      reason: p.reason,
      amountMs: p.amountMs,
      source: p.source,
    }
  })
}

// ---------------------------------------------------------------------------
// Competitors (osalejate nimekiri)
// ---------------------------------------------------------------------------

export type RallyCompetitorRow = {
  competitorId: string
  number: string
  driver: string
  driverNationality: string | null
  coDriver: string
  coDriverNationality: string | null
  vehicle: string
  entrant: string | null
  classIds: string[]
}

export async function fetchRallyCompetitors(
  credentials: RallyLynxEventCredentials,
): Promise<RallyCompetitorRow[]> {
  const res = await rallyLynxFetch<{ competitors: RallyLynxCompetitorEntry[] }>({
    eventId: credentials.eventId,
    apiKey: credentials.apiKey,
    path: '/competitors',
  })
  if (!res) throw new Error('RallyLynx tagastas ootamatult 304 esmasel päringul.')

  return res.data.competitors
    .map((c) => ({
      competitorId: c.competitorId,
      number: c.number,
      driver: c.driver.name,
      driverNationality: c.driver.nationality ?? null,
      coDriver: c.coDriver.name,
      coDriverNationality: c.coDriver.nationality ?? null,
      vehicle: c.vehicle,
      entrant: c.entrant ?? null,
      classIds: c.classes,
    }))
    .sort((a, b) => Number(a.number) - Number(b.number))
}
