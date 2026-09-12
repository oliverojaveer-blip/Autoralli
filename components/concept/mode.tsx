'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ConceptMode } from '@/lib/concept/fixtures'

type ModeContextValue = {
  mode: ConceptMode
  setMode: (next: ConceptMode) => void
}

const ModeContext = createContext<ModeContextValue | null>(null)

/**
 * Režiim elab URL-is (?mode=race), et Playwright ja lingid saaksid mõlemad
 * seisud otse avada. Serverilt tuleb algväärtus, klient hoiab seda sünkroonis
 * history.replaceState kaudu ilma lehte uuesti laadimata.
 */
export function ModeProvider({
  initialMode,
  children,
}: {
  initialMode: ConceptMode
  children: ReactNode
}) {
  const [mode, setModeState] = useState<ConceptMode>(initialMode)

  const setMode = useCallback((next: ConceptMode) => {
    setModeState(next)
    const url = new URL(window.location.href)
    if (next === 'race') url.searchParams.set('mode', 'race')
    else url.searchParams.delete('mode')
    window.history.replaceState(window.history.state, '', url)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.mode = mode
    return () => {
      delete document.documentElement.dataset.mode
    }
  }, [mode])

  return (
    <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode vajab ModeProvider-it')
  return ctx
}
