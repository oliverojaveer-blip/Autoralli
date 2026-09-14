import { getDictionary, type Locale } from './i18n'

/**
 * Kuupäevavormingud ilma Intl-ita (v.a kellaaeg), et server ja klient
 * annaksid kindlasti sama tulemuse — Intl locale-andmed erinevad
 * keskkonniti ja tekitavad hydration mismatch'i. Kõik UTC järgi, sest
 * sündmuste ISO-ajad kannavad oma nihet ja meid huvitab ainult kuupäev.
 */

function parts(iso: string) {
  const d = new Date(iso)
  return { day: d.getUTCDate(), month: d.getUTCMonth(), year: d.getUTCFullYear() }
}

/** "9. kuni 10. okt 2026" / "9–10 Oct 2026" */
export function formatDateRange(startsAt: string, endsAt: string, locale: Locale): string {
  const { dates } = getDictionary(locale)
  const s = parts(startsAt)
  const e = parts(endsAt)
  return dates.range(s.day, e.day, dates.monthsShort[s.month], dates.monthsShort[e.month], e.year)
}

/** "10. sept 2026" / "10 Sep 2026" */
export function formatLongDate(iso: string, locale: Locale): string {
  const { dates } = getDictionary(locale)
  const p = parts(iso)
  return dates.long(p.day, dates.monthsShort[p.month], p.year)
}

/** "10. SEPT" / "10 SEP" — kalendri- ja kuupäevaplaadid. */
export function formatDateChip(iso: string, locale: Locale): string {
  const { dates } = getDictionary(locale)
  const p = parts(iso)
  return dates.chip(p.day, dates.monthsShort[p.month])
}

/** Eraldi päev + kuu suurte tähtedega (kahe plaadi kuupäevakuva). */
export function dateTile(iso: string, locale: Locale): { day: number; month: string } {
  const { dates } = getDictionary(locale)
  const p = parts(iso)
  return { day: p.day, month: dates.monthsShort[p.month].toUpperCase() }
}
