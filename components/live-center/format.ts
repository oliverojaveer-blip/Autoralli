import { getDictionary, type Locale } from '@/lib/i18n'

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

export function formatUpdatedAt(iso: string | null, locale: Locale): string {
  if (!iso) return getDictionary(locale).common.unknown
  return new Date(iso).toLocaleString(getDictionary(locale).dates.intlTag, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(getDictionary(locale).dates.intlTag, {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  })
}
