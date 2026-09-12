'use client'

import { useEffect, useState } from 'react'

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Sekundi täpsusega loendur sihtajani. Jagatud avalehe hero ja /concept vahel.
 * null = server ja esimene render, nii ei teki hydration mismatch'i.
 */
export function useCountdown(targetIso: string): Countdown | null {
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    const target = new Date(targetIso).getTime()
    const tick = () => setLeft(Math.max(0, target - Date.now()))

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetIso])

  if (left === null) return null

  const totalSeconds = Math.floor(left / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}
