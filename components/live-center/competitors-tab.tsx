'use client'

import type { RallyCompetitorRow } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { useLiveSelection } from './live-selection'
import { SeriesFilter, allowedClassIds } from './series-filter'
import { useT } from '../locale-provider'
import { MOBILE_LIST, ROW, TABLE, TABLE_WRAP, TabHeader, TD, TH, THEAD_ROW } from './table'

export function CompetitorsTab() {
  const t = useT()
  const { filter, setFilter, event } = useLiveSelection()
  const competitorsState = useRallyLynxResource<RallyCompetitorRow[]>('/api/rallylynx/competitors')

  return (
    <ResourceBoundary state={event}>
      {(ev) => (
        <ResourceBoundary state={competitorsState}>
          {(competitors) => {
            const allowed = allowedClassIds(ev.series, filter)
            const rows = allowed
              ? competitors.filter((c) => c.classIds.some((id) => allowed.has(id)))
              : competitors

            return (
              <div>
                <div className="border-b border-line pb-5">
                  <SeriesFilter series={ev.series} value={filter} onChange={setFilter} />
                </div>

                <div className="mt-6">
                  <TabHeader source={t.live.sourceRallyLynx} title={t.live.tabs.startList} detail={t.live.crewCount(rows.length)} />

                  <div className={TABLE_WRAP}>
                    <table className={`${TABLE} min-w-[640px]`}>
                      <thead>
                        <tr className={THEAD_ROW}>
                          <th className={`w-14 ${TH}`}>{t.live.th.number}</th>
                          <th className={TH}>{t.live.th.crew}</th>
                          <th className={TH}>{t.live.th.car}</th>
                          <th className={TH}>{t.live.th.team}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.competitorId} className={ROW}>
                            <td className={`${TD} font-display text-lg font-bold text-black tnum`}>{row.number}</td>
                            <td className={TD}>
                              <p className="font-semibold leading-tight text-black">{row.driver}</p>
                              <p className="text-xs text-slate">{row.coDriver}</p>
                            </td>
                            <td className={`${TD} text-slate`}>{row.vehicle}</td>
                            <td className={`${TD} text-slate`}>{row.entrant ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className={MOBILE_LIST}>
                    {rows.map((row) => (
                      <li key={row.competitorId} className="grid grid-cols-[2.25rem_1fr] items-center gap-3 py-2.5">
                        <span className="font-display text-lg font-bold leading-none text-black tnum">{row.number}</span>
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-semibold leading-tight text-black">{row.driver}</span>
                          <span className="block truncate text-[12px] text-slate">
                            {row.coDriver} · {row.vehicle}
                            {row.entrant ? ` · ${row.entrant}` : ''}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          }}
        </ResourceBoundary>
      )}
    </ResourceBoundary>
  )
}
