'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_FILTER, type ClassFilter } from './series-filter'

type LiveSelection = {
  /** Valitud kiiruskatse ID; `null` enne, kui katsete nimekiri on laetud. */
  stageId: string | null
  setStageId: (id: string | null) => void
  filter: ClassFilter
  setFilter: (next: ClassFilter) => void
}

const LiveSelectionContext = createContext<LiveSelection | null>(null)

/**
 * Live Centeri ühine valik: kiiruskatse ja sari/klass elavad vahekaartide
 * kohal, mitte igas vahekaardis eraldi. Nii jääb "SS6" valituks, kui
 * kasutaja liigub katseaegadelt üldarvestusse — ta vaatab sama hetke
 * eri nurkade alt, mitte ei vali katset iga kord uuesti.
 */
export function LiveSelectionProvider({ children }: { children: ReactNode }) {
  const [stageId, setStageId] = useState<string | null>(null)
  const [filter, setFilter] = useState<ClassFilter>(DEFAULT_FILTER)
  const value = useMemo(() => ({ stageId, setStageId, filter, setFilter }), [stageId, filter])
  return <LiveSelectionContext.Provider value={value}>{children}</LiveSelectionContext.Provider>
}

export function useLiveSelection(): LiveSelection {
  const ctx = useContext(LiveSelectionContext)
  if (!ctx) throw new Error('useLiveSelection: LiveSelectionProvider puudub')
  return ctx
}
