'use client'

import type { RallySeriesView } from '@/lib/rallylynx/adapter'

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
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">Sari</p>
      <div role="tablist" aria-label="Vali sari" className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={activeId === ALL_SERIES}
          onClick={() => onChange(ALL_SERIES)}
          className={`border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
            activeId === ALL_SERIES ? 'border-blue bg-blue text-white' : 'border-line text-slate'
          }`}
        >
          Kõik
        </button>
        {series.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={activeId === s.id}
            onClick={() => onChange(s.id)}
            className={`border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
              activeId === s.id ? 'border-blue bg-blue text-white' : 'border-line text-slate'
            }`}
          >
            {s.name}
          </button>
        ))}
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
