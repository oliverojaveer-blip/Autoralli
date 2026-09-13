import type { ResultStatus } from '@/lib/rallylynx/adapter'

export const STATUS_LABEL: Record<ResultStatus, string> = {
  unofficial: 'Mitteametlik',
  provisional: 'Esialgne',
  official: 'Ametlik',
  amended: 'Muudetud',
}

/** Millisekundid -> "h:mm:ss,d" (rallis tavapärane ajavorming). */
export function formatDuration(ms: number): string {
  const totalTenths = Math.round(ms / 100)
  const tenths = totalTenths % 10
  const totalSeconds = Math.floor(totalTenths / 10)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)},${tenths}`
  }
  return `${minutes}:${pad(seconds)},${tenths}`
}

export function formatGap(ms: number | null): string {
  if (ms === null || ms === 0) return '—'
  return `+${formatDuration(ms)}`
}

export function formatUpdatedAt(iso: string | null): string {
  if (!iso) return 'teadmata'
  return new Date(iso).toLocaleString('et-EE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('et-EE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  })
}
