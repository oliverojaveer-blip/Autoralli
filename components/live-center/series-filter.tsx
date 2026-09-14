'use client'

import type { RallySeriesView } from '@/lib/rallylynx/adapter'
import { ChipStrip, Chip } from './chip-strip'
import { useT } from '../locale-provider'

export const ALL_SERIES = 'all'

export function SeriesFilter({
  series,
  activeId,
  onChange,
}: {
  series: RallySeriesView[]
  activeId: string
  onChange: (id: string) => void
}) {
  const t = useT()
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">{t.live.series}</p>
      <div className="mt-2">
        <ChipStrip ariaLabel={t.live.chooseSeries}>
          <Chip active={activeId === ALL_SERIES} onClick={() => onChange(ALL_SERIES)}>
            {t.common.all}
          </Chip>
          {series.map((s) => (
            <Chip key={s.id} active={activeId === s.id} onClick={() => onChange(s.id)}>
              {s.name}
            </Chip>
          ))}
        </ChipStrip>
      </div>
    </div>
  )
}

/** Klassi ID-de hulk, mis kuulub valitud sarja (või `null`, kui "Kõik"). */
export function classIdsForSeries(series: RallySeriesView[], activeId: string): Set<string> | null {
  if (activeId === ALL_SERIES) return null
  const found = series.find((s) => s.id === activeId)
  return new Set(found?.classes.map((c) => c.id) ?? [])
}
