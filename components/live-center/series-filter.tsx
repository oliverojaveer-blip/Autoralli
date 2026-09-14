'use client'

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
 * Kahetasandiline filter: sari (EMV, EJC …) ja selle sees üksik klass
 * (EMV1, EMV2 …). Sarja vahetus nullib klassivaliku, sest vana klass ei
 * pruugi uude sarja kuuluda.
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
  const classes = classesForSeries(series, value.seriesId)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">{t.live.series}</p>
        <div className="mt-2">
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
                {s.name}
              </Chip>
            ))}
          </ChipStrip>
        </div>
      </div>

      {classes.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">{t.live.classLabel}</p>
          <div className="mt-2">
            <ChipStrip ariaLabel={t.live.chooseClass}>
              <Chip
                active={value.classId === ALL_CLASSES}
                onClick={() => onChange({ ...value, classId: ALL_CLASSES })}
              >
                {t.common.all}
              </Chip>
              {classes.map((c) => (
                <Chip
                  key={c.id}
                  active={value.classId === c.id}
                  onClick={() => onChange({ ...value, classId: c.id })}
                >
                  {c.name}
                </Chip>
              ))}
            </ChipStrip>
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
