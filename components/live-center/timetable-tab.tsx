'use client'

import type { RallyItineraryDayView, RallyItineraryItemView } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { useLiveSelection } from './live-selection'
import { formatDate, formatDuration } from './format'
import { useLocale, useT } from '../locale-provider'
import type { Dictionary } from '@/lib/i18n'
import { TabHeader } from './table'

function itemDetail(item: RallyItineraryItemView, t: Dictionary): string | null {
  if (item.type === 'stage' && item.distanceM) return `${(item.distanceM / 1000).toFixed(2)} km`
  if (item.type === 'liaison') {
    const parts: string[] = []
    if (item.distanceM) parts.push(`${(item.distanceM / 1000).toFixed(2)} km`)
    if (item.targetTimeMs) parts.push(`${t.live.target} ${formatDuration(item.targetTimeMs)}`)
    return parts.join(' · ') || null
  }
  if (item.type === 'regroup' && item.maxTimeMs) return `${t.live.max} ${formatDuration(item.maxTimeMs)}`
  if (item.type === 'service' && item.allowedTimeMs) return `${formatDuration(item.allowedTimeMs)}`
  return null
}

/**
 * Ajatabel: katse kood juhib rida (Barlow Condensed), tüüp on vaikne silt.
 * Valitud kiiruskatse rida kannab sinist vasakserva, nii et kasutaja näeb,
 * kus ta teistes vaadetes parasjagu on.
 */
export function TimetableTab() {
  const t = useT()
  const locale = useLocale()
  const { stageId } = useLiveSelection()
  const state = useRallyLynxResource<RallyItineraryDayView[]>('/api/rallylynx/itinerary')

  return (
    <ResourceBoundary state={state}>
      {(days) => (
        <div>
          <TabHeader title={t.live.tabs.timetable} />
          <div className="flex flex-col gap-8">
            {days.map((day) => (
              <div key={day.dayId}>
                <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate">
                  {formatDate(day.date, locale)}
                </h4>
                <ol className="divide-y divide-line border-y border-line">
                  {day.items.map((item) => {
                    const selected = item.type === 'stage' && item.id === stageId
                    return (
                      <li
                        key={item.id}
                        className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5 pr-2 text-sm ${
                          selected ? 'shadow-[inset_3px_0_0_0_#0D71B8] bg-blue/[0.04] pl-3' : 'pl-1'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`w-14 shrink-0 font-display text-lg font-bold uppercase leading-none ${
                              item.type === 'stage' ? 'text-black' : 'text-slate'
                            }`}
                          >
                            {item.code ?? '—'}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-black">
                              {item.name ?? t.live.itinerary[item.type]}
                            </span>
                            {item.name ? (
                              <span className="block text-[11px] uppercase tracking-[0.1em] text-slate">
                                {t.live.itinerary[item.type]}
                              </span>
                            ) : null}
                          </span>
                        </div>
                        {itemDetail(item, t) ? (
                          <span className="font-mono text-xs tabular-nums text-slate">{itemDetail(item, t)}</span>
                        ) : null}
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}
    </ResourceBoundary>
  )
}
