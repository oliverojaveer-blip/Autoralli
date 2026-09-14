'use client'

import { useId } from 'react'
import { CaretDown } from '@phosphor-icons/react/dist/ssr'
import type { RallyClassView, RallySeriesView } from '@/lib/rallylynx/adapter'
import { ChipStrip, Chip } from './chip-strip'
import { useT } from '../locale-provider'

export const ALL_SERIES = 'all'
export const ALL_CLASSES = 'all'

export type ClassFilter = { seriesId: string; classId: string }

export const DEFAULT_FILTER: ClassFilter = { seriesId: ALL_SERIES, classId: ALL_CLASSES }

/**
 * Klassid, mida saab valitud sarja sees filtreerida. "Kõik" sarjad annab
 * kõik klassid üle sarjade (sama klass võib kuuluda mitmesse sarja, seega
 * dubleerivad ID-d eemaldatakse).
 */
export function classesForSeries(series: RallySeriesView[], seriesId: string): RallyClassView[] {
  const pool = seriesId === ALL_SERIES ? series : series.filter((s) => s.id === seriesId)
  const seen = new Set<string>()
  const classes: RallyClassView[] = []
  for (const s of pool) {
    for (const c of s.classes) {
      if (seen.has(c.id)) continue
      seen.add(c.id)
      classes.push(c)
    }
  }
  return classes
}

/**
 * Kahetasandiline filter: sari (mõni plaat) ja selle sees klass. Klasse
 * võib olla kakskümmend, seega on see natiivne `<select>` — töötab ilma
 * JS-ita, avab telefonis süsteemse valija ega venita riba kahe meetri
 * pikkuseks. Sarja vahetus nullib klassivaliku.
 */
export function SeriesFilter({
  series,
  value,
  onChange,
}: {
  series: RallySeriesView[]
  value: ClassFilter
  onChange: (next: ClassFilter) => void
}) {
  const t = useT()
  const selectId = useId()
  const classes = classesForSeries(series, value.seriesId)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate">{t.live.series}</p>
        <div className="mt-1.5">
          <ChipStrip ariaLabel={t.live.chooseSeries}>
            <Chip
              active={value.seriesId === ALL_SERIES}
              onClick={() => onChange({ seriesId: ALL_SERIES, classId: ALL_CLASSES })}
            >
              {t.common.all}
            </Chip>
            {series.map((s) => (
              <Chip
                key={s.id}
                active={value.seriesId === s.id}
                onClick={() => onChange({ seriesId: s.id, classId: ALL_CLASSES })}
              >
                {s.code || s.name}
              </Chip>
            ))}
          </ChipStrip>
        </div>
      </div>

      {classes.length > 0 ? (
        <div className="shrink-0">
          <label htmlFor={selectId} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate">
            {t.live.classLabel}
          </label>
          <div className="relative mt-1.5 ml-1 inline-flex skew-x-[-19deg] border border-line bg-white transition-colors focus-within:border-blue hover:border-blue">
            <select
              id={selectId}
              value={value.classId}
              onChange={(e) => onChange({ ...value, classId: e.target.value })}
              className="min-h-[44px] skew-x-[19deg] cursor-pointer appearance-none bg-transparent py-2 pl-4 pr-10 text-[12px] font-bold uppercase tracking-[0.08em] text-black focus:outline-none"
            >
              <option value={ALL_CLASSES}>{t.common.all}</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <CaretDown
              size={14}
              weight="bold"
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 skew-x-[19deg] text-slate"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Klassi ID-de hulk, mille ridu näidata, või `null`, kui filtrit pole.
 * Üksik klass võidab sarja: siis on lubatud ainult see klass.
 */
export function allowedClassIds(series: RallySeriesView[], filter: ClassFilter): Set<string> | null {
  if (filter.classId !== ALL_CLASSES) return new Set([filter.classId])
  if (filter.seriesId === ALL_SERIES) return null
  const found = series.find((s) => s.id === filter.seriesId)
  return new Set(found?.classes.map((c) => c.id) ?? [])
}

/** Valitud üksiku klassi nimi (pealkirja jaoks), või `null`. */
export function selectedClassName(series: RallySeriesView[], filter: ClassFilter): string | null {
  if (filter.classId === ALL_CLASSES) return null
  return classesForSeries(series, ALL_SERIES).find((c) => c.id === filter.classId)?.name ?? null
}
