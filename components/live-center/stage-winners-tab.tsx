'use client'

import type { RallyStageWinnerRow } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { useLiveSelection } from './live-selection'
import { formatDuration } from './format'
import { useT } from '../locale-provider'
import { MOBILE_LIST, NUM, TABLE, TABLE_WRAP, TabHeader, TD, TH, THEAD_ROW, TIME, ROW } from './table'

export function StageWinnersTab() {
  const t = useT()
  const { pollMs } = useLiveSelection()
  const state = useRallyLynxResource<RallyStageWinnerRow[]>('/api/rallylynx/stage-winners', {
    pollMs: pollMs(30_000),
  })

  return (
    <ResourceBoundary state={state}>
      {(rows) => (
        <div>
          <TabHeader source={t.live.sourceRallyLynx} title={t.live.tabs.winners} updatedAt={state.kind === 'ready' ? new Date(state.fetchedAt).toISOString() : null} />

          <div className={TABLE_WRAP}>
            <table className={`${TABLE} min-w-[560px]`}>
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={TH}>{t.live.stage}</th>
                  <th className={TH}>{t.live.th.winner}</th>
                  <th className={`${TH} text-right`}>{t.live.th.time}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.stageId} className={ROW}>
                    <td className={TD}>
                      <p className="font-display text-lg font-bold uppercase leading-none text-black">{row.code}</p>
                      <p className="mt-1 text-xs text-slate">
                        {row.name ?? '—'}
                        {row.distanceM ? ` · ${(row.distanceM / 1000).toFixed(2)} km` : ''}
                      </p>
                    </td>
                    <td className={TD}>
                      {row.winnerDriver ? (
                        <>
                          <p className="font-semibold leading-tight text-black">
                            <span className={`mr-1.5 ${NUM}`}>#{row.winnerNumber}</span>
                            {row.winnerDriver}
                          </p>
                          <p className="text-xs text-slate">{row.winnerCoDriver}</p>
                        </>
                      ) : (
                        <span className="text-slate">—</span>
                      )}
                    </td>
                    <td className={`${TD} ${TIME} font-semibold`}>
                      {row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className={MOBILE_LIST}>
            {rows.map((row) => (
              <li key={row.stageId} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 py-2.5">
                <span className="font-display text-lg font-bold uppercase leading-none text-black">{row.code}</span>
                <span className="min-w-0">
                  {row.winnerDriver ? (
                    <>
                      <span className="block truncate text-[15px] font-semibold leading-tight text-black">
                        <span className="mr-1.5 font-mono text-[12px] font-normal text-slate">#{row.winnerNumber}</span>
                        {row.winnerDriver}
                      </span>
                      <span className="block truncate text-[12px] text-slate">
                        {row.winnerCoDriver}
                        {row.name ? ` · ${row.name}` : ''}
                      </span>
                    </>
                  ) : (
                    <span className="text-[12px] text-slate">{row.name ?? '—'}</span>
                  )}
                </span>
                <span className="font-mono text-[15px] font-semibold tabular-nums text-black">
                  {row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ResourceBoundary>
  )
}
