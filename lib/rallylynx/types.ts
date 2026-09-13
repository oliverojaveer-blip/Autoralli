/**
 * ============================================================================
 *  RallyLynx API — tüübid.
 * ============================================================================
 *  Peegeldab https://api.rallylynx.com OpenAPI kirjeldust (spec.json).
 *  Päris vastused sisaldavad mõnikord spec'is kirjeldamata lisavälju
 *  (nt classification stage'idel `penaltyMs`/`stageTimeMs`) ja `status`
 *  väärtus võib olla ka "official"/"amended", mitte ainult "provisional" —
 *  seepärast on need väljad siin `string`, mitte kitsas enum.
 * ============================================================================
 */

export type RallyLynxDateRange = {
  start: string | null
  end: string | null
}

export type RallyLynxClass = {
  id: string
  name: string
}

export type RallyLynxSeries = {
  id: string
  name: string
  code: string
  classes: RallyLynxClass[]
}

export type RallyLynxEventDetail = {
  id: string
  name: string
  timezone?: string
  status: 'scheduled' | 'live' | 'finished'
  dates: RallyLynxDateRange
  series: RallyLynxSeries[]
}

export type RallyLynxPerson = {
  name: string
  nationality?: string | null
}

export type RallyLynxCompetitorEntry = {
  competitorId: string
  number: string
  driver: RallyLynxPerson
  coDriver: RallyLynxPerson
  vehicle: string
  entrant?: string | null
  classes: string[]
}

export type RallyLynxItineraryItem = {
  id: string
  type: 'tc' | 'stage' | 'liaison' | 'regroup' | 'service'
  code?: string
  name?: string | null
  distanceM?: number
  targetTimeMs?: number
  maxTimeMs?: number
  allowedTimeMs?: number
}

export type RallyLynxItineraryDay = {
  dayId: string
  date?: string | null
  items: RallyLynxItineraryItem[]
}

export type RallyLynxItinerary = {
  days: RallyLynxItineraryDay[]
}

export type RallyLynxRankInfo = {
  position: number
  gapToLeaderMs: number
  diffToPrevMs: number
}

export type RallyLynxRankings = Record<string, RallyLynxRankInfo>

export type RallyLynxClassificationStage = {
  durationMs: number | null
  source: string
  anomaly?: string | null
  /** Väljaspool spec'i, aga esineb päris vastustes. */
  penaltyMs?: number
  stageTimeMs?: number
}

export type RallyLynxAppliedPenalty = {
  itineraryItemId: string
  reason: string
  amountMs: number
}

export type RallyLynxClassificationEntry = {
  competitorId: string
  number: string
  stageTimeMs: number
  penaltyTimeMs: number
  totalTimeMs: number
  stages: Record<string, RallyLynxClassificationStage>
  penalties: RallyLynxAppliedPenalty[]
  rankings: RallyLynxRankings
}

export type RallyLynxNotClassified = {
  competitorId: string
  reason: 'retired' | 'noTime' | string
}

export type RallyLynxClassification = {
  generatedAt: string
  updatedAt?: string | null
  /** Spec lubab ainult "provisional", aga päris API tagastab ka "official". */
  status: string
  afterStage?: string
  completedStages: string[]
  entries: RallyLynxClassificationEntry[]
  notClassified: RallyLynxNotClassified[]
}

export type RallyLynxSplitRankInfo = {
  position: number
  gapToBestMs: number
}

export type RallyLynxStageResultSplit = {
  splitIndex: number
  elapsedMs: number
  rankings: Record<string, RallyLynxSplitRankInfo>
}

export type RallyLynxStageResultEntry = {
  competitorId: string
  number: string
  durationMs: number | null
  startAt?: string | null
  finishAt?: string | null
  source: string
  avgSpeedMs?: number | null
  anomaly?: string | null
  splits: RallyLynxStageResultSplit[]
  rankings: RallyLynxRankings
}

export type RallyLynxSplit = {
  splitIndex: number
  distanceM: number
}

export type RallyLynxStageResults = {
  stageId: string
  code: string
  status: string
  generatedAt: string
  updatedAt?: string | null
  splits: RallyLynxSplit[]
  entries: RallyLynxStageResultEntry[]
}

export type RallyLynxRetirement = {
  competitorId: string
  afterPoint?: string | null
  reason: string
  retiredAt?: string | null
  rejoined: boolean
}

export type RallyLynxPenalty = {
  competitorId: string
  itineraryItemId: string
  reason: string
  amountMs: number
  source: string
}
