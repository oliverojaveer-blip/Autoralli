'use client'

import type { RallyItineraryDayView, RallyItineraryItemView } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { formatDate, formatDuration } from './format'

const TYPE_LABEL: Record<RallyItineraryItemView['type'], string> = {
  tc: 'Ajakontroll',
  stage: 'Kiiruskatse',
  liaison: 'Transiit',
  regroup: 'Ümberrühmitus',
  service: 'Hooldus',
}

function itemDetail(item: RallyItineraryItemView): string | null {
  if (item.type === 'stage' && item.distanceM) return `${(item.distanceM / 1000).toFixed(2)} km`
  if (item.type === 'liaison') {
    const parts: string[] = []
    if (item.distanceM) parts.push(`${(item.distanceM / 1000).toFixed(2)} km`)
    if (item.targetTimeMs) parts.push(`siht ${formatDuration(item.targetTimeMs)}`)
    return parts.join(' · ') || null
  }
  if (item.type === 'regroup' && item.maxTimeMs) return `max ${formatDuration(item.maxTimeMs)}`
  if (item.type === 'service' && item.allowedTimeMs) return `${formatDuration(item.allowedTimeMs)}`
  return null
}

export function TimetableTab() {
  const state = useRallyLynxResource<RallyItineraryDayView[]>('/api/rallylynx/itinerary')

  return (
    <ResourceBoundary state={state}>
      {(days) => (
        <div className="flex flex-col gap-8">
          {days.map((day) => (
            <div key={day.dayId}>
              <h3 className="mb-3 font-display text-lg font-bold uppercase capitalize text-black">
                {formatDate(day.date)}
              </h3>
              <ol className="flex flex-col divide-y divide-line overflow-hidden rounded-md border border-line">
                {day.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-[0.06em] text-blue">
                        {TYPE_LABEL[item.type]}
                      </span>
                      <span className="font-semibold text-black">{item.code ?? '—'}</span>
                      {item.name ? <span className="text-slate">{item.name}</span> : null}
                    </div>
                    {itemDetail(item) ? (
                      <span className="font-mono text-xs tabular-nums text-slate">
                        {itemDetail(item)}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </ResourceBoundary>
  )
}
