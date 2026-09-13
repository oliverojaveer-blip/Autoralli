'use client'

import type { RallyStageWinnerRow } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { formatDuration } from './format'

export function StageWinnersTab() {
  const state = useRallyLynxResource<RallyStageWinnerRow[]>('/api/rallylynx/stage-winners', {
    pollMs: 30_000,
  })

  return (
    <ResourceBoundary state={state}>
      {(rows) => (
        <div>
          <div className="hidden overflow-x-auto border border-line sm:block">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
                  <th className="px-3 py-2.5">Kiiruskatse</th>
                  <th className="px-3 py-2.5">Võitja</th>
                  <th className="px-3 py-2.5 text-right">Aeg</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.stageId} className="border-b border-line last:border-0">
                    <td className="px-3 py-2.5">
                      <p className="font-semibold text-black">{row.code}</p>
                      <p className="text-xs text-slate">
                        {row.name ?? '—'}
                        {row.distanceM ? ` · ${(row.distanceM / 1000).toFixed(2)} km` : ''}
                      </p>
                    </td>
                    <td className="px-3 py-2.5">
                      {row.winnerDriver ? (
                        <>
                          <p className="font-semibold leading-tight text-black">
                            #{row.winnerNumber} {row.winnerDriver}
                          </p>
                          <p className="text-xs text-slate">{row.winnerCoDriver}</p>
                        </>
                      ) : (
                        <span className="text-slate">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-black">
                      {row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-2 sm:hidden">
            {rows.map((row) => (
              <li key={row.stageId} className="border border-line p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-black">{row.code}</p>
                  <span className="whitespace-nowrap font-mono text-sm font-bold tabular-nums text-black">
                    {row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate">{row.name ?? '—'}</p>
                {row.winnerDriver ? (
                  <p className="mt-1.5 text-sm font-semibold text-black">
                    #{row.winnerNumber} {row.winnerDriver}{' '}
                    <span className="font-normal text-slate">/ {row.winnerCoDriver}</span>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ResourceBoundary>
  )
}
