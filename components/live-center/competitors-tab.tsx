'use client'

import { useState } from 'react'
import type { RallyCompetitorRow, RallyEventOverview } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { SeriesFilter, ALL_SERIES, classIdsForSeries } from './series-filter'

export function CompetitorsTab() {
  const eventState = useRallyLynxResource<RallyEventOverview>('/api/rallylynx/event')
  const competitorsState = useRallyLynxResource<RallyCompetitorRow[]>('/api/rallylynx/competitors')
  const [seriesId, setSeriesId] = useState(ALL_SERIES)

  return (
    <ResourceBoundary state={eventState}>
      {(event) => (
        <ResourceBoundary state={competitorsState}>
          {(competitors) => {
            const allowedClassIds = classIdsForSeries(event.series, seriesId)
            const rows = allowedClassIds
              ? competitors.filter((c) => c.classIds.some((id) => allowedClassIds.has(id)))
              : competitors

            return (
              <div>
                <div className="border-b border-line pb-6">
                  <SeriesFilter series={event.series} activeId={seriesId} onChange={setSeriesId} />
                </div>

                <div className="mt-8 hidden overflow-x-auto rounded-md border border-line sm:block">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-line bg-gradient-to-b from-white to-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
                        <th className="w-14 px-3 py-2.5">Nr</th>
                        <th className="px-3 py-2.5">Ekipaaž</th>
                        <th className="px-3 py-2.5">Auto</th>
                        <th className="px-3 py-2.5">Meeskond</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.competitorId} className="border-b border-line last:border-0">
                          <td className="px-3 py-2.5 font-mono text-slate">{row.number}</td>
                          <td className="px-3 py-2.5">
                            <p className="font-semibold leading-tight text-black">{row.driver}</p>
                            <p className="text-xs text-slate">{row.coDriver}</p>
                          </td>
                          <td className="px-3 py-2.5 text-slate">{row.vehicle}</td>
                          <td className="px-3 py-2.5 text-slate">{row.entrant ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <ul className="mt-8 flex flex-col gap-2 sm:hidden">
                  {rows.map((row) => (
                    <li key={row.competitorId} className="rounded-md border border-line bg-gradient-to-b from-white to-mist p-3">
                      <p className="font-semibold text-black">
                        #{row.number} {row.driver}{' '}
                        <span className="font-normal text-slate">/ {row.coDriver}</span>
                      </p>
                      <p className="mt-1 text-xs text-slate">{row.vehicle}</p>
                      {row.entrant ? <p className="mt-0.5 text-xs text-slate">{row.entrant}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            )
          }}
        </ResourceBoundary>
      )}
    </ResourceBoundary>
  )
}
