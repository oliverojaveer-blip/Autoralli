'use client'

import { useEffect, useState } from 'react'

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** Alles jäänud millisekundid, kunagi mitte negatiivne. */
  totalMs: number
  /** false, kui `targetTime` ei parsitud kehtivaks kuupäevaks. */
  isValid: boolean
  isZero: boolean
}

const TICK_MS = 250 // ≥ 4 korda sekundis, nagu nõutud

function computeParts(targetMs: number): CountdownParts {
  if (!Number.isFinite(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isValid: false, isZero: true }
  }

  const diff = Math.max(0, targetMs - Date.now())
  const totalSeconds = Math.floor(diff / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs: diff,
    isValid: true,
    isZero: diff <= 0,
  }
}

/**
 * Arvutab allesjäänud aja alati `targetTimestamp - Date.now()` valemiga —
 * EI vähenda salvestatud numbrit sekundi kaupa, sest see triiviks, kui
 * brauseri vahekaart on vahepeal taustal olnud (taimerid aeglustuvad seal).
 *
 * Tagastab `null` enne esimest kliendipoolset renderdust, et vältida
 * server/klient hydratsiooni-lahknevust (sama muster mis `use-countdown.ts`).
 */
export function useLiveCountdown(targetTime: string | undefined): CountdownParts | null {
  const targetMs = targetTime ? Date.parse(targetTime) : NaN
  const [parts, setParts] = useState<CountdownParts | null>(null)

  useEffect(() => {
    const tick = () => setParts(computeParts(targetMs))
    tick()

    const id = window.setInterval(tick, TICK_MS)

    // Paranda kohe, kui vahekaart muutub uuesti aktiivseks — taustal
    // olles brauser aeglustab või peatab intervallid.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', tick)

    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', tick)
    }
  }, [targetMs])

  return parts
}
