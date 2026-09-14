'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { RallyEventOverview, RallyStageView } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource, type RallyLynxResourceState } from './use-rallylynx-resource'
import { DEFAULT_FILTER, type ClassFilter } from './series-filter'

type LiveSelection = {
  /** Valitud kiiruskatse ID; `null` enne, kui katsete nimekiri on laetud. */
  stageId: string | null
  setStageId: (id: string | null) => void
  filter: ClassFilter
  setFilter: (next: ClassFilter) => void
  /** Võistluse ülevaade (sarjad, klassid, staatus) — laetakse üks kord kõigi vaadete jaoks. */
  event: RallyLynxResourceState<RallyEventOverview> & { reload: () => void }
  /** Kiiruskatsete nimekiri — laetakse üks kord. */
  stages: RallyLynxResourceState<RallyStageView[]> & { reload: () => void }
  /**
   * Pollimise intervall tulemuste jaoks või `undefined`, kui võistlus on
   * lõppenud: ametlikke tulemusi ei ole mõtet iga 15 s uuesti tõmmata.
   */
  pollMs: (base: number) => number | undefined
}

const LiveSelectionContext = createContext<LiveSelection | null>(null)

/**
 * Live Centeri ühine olek: kiiruskatse ja sari/klass elavad vahekaartide
 * kohal, mitte igas vahekaardis eraldi — SS6 katseaegadelt üldarvestusse
 * liikudes jääb vaade "pärast SS6". Samuti jagatud ülevaate- ja
 * katseteressurss, et vahekaardi vahetus ei laeks neid uuesti.
 */
export function LiveSelectionProvider({ children }: { children: ReactNode }) {
  const [stageId, setStageId] = useState<string | null>(null)
  const [filter, setFilter] = useState<ClassFilter>(DEFAULT_FILTER)
  const event = useRallyLynxResource<RallyEventOverview>('/api/rallylynx/event', { pollMs: 60_000 })
  const stages = useRallyLynxResource<RallyStageView[]>('/api/rallylynx/stages', { pollMs: 60_000 })
  const finished = event.kind === 'ready' && event.data.status === 'finished'

  // Vaikimisi viimane katse — üks kord, kui nimekiri saabub.
  useEffect(() => {
    if (stages.kind === 'ready' && stageId === null && stages.data.length > 0) {
      setStageId(stages.data[stages.data.length - 1].id)
    }
  }, [stages, stageId])

  const value = useMemo<LiveSelection>(
    () => ({
      stageId,
      setStageId,
      filter,
      setFilter,
      event,
      stages,
      pollMs: (base) => (finished ? undefined : base),
    }),
    [stageId, filter, event, stages, finished],
  )
  return <LiveSelectionContext.Provider value={value}>{children}</LiveSelectionContext.Provider>
}

export function useLiveSelection(): LiveSelection {
  const ctx = useContext(LiveSelectionContext)
  if (!ctx) throw new Error('useLiveSelection: LiveSelectionProvider puudub')
  return ctx
}
