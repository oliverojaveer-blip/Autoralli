'use client'

import { useEffect, useState } from 'react'
import type { RallyStageResultsView, RallyStageView } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { StageSelector } from './stage-selector'
import { formatDuration, formatGap } from './format'

export function SplitTimesTab() {
  const stagesState = useRallyLynxResource<RallyStageView[]>('/api/rallylynx/stages')
  const [stageId, setStageId] = useState<string | null>(null)

  useEffect(() => {
    if (stagesState.kind === 'ready' && stageId === null && stagesState.data.length > 0) {
      setStageId(stagesState.data[stagesState.data.length - 1].id)
    }
  }, [stagesState, stageId])

  const stageResultsState = useRallyLynxResource<RallyStageResultsView>(
    stageId ? `/api/rallylynx/stages/${stageId}/results` : null,
    { pollMs: 15_000 },
  )

  return (
    <ResourceBoundary state={stagesState}>
      {(stages) => (
        <div>
          <div className="border-b border-line pb-6">
            <StageSelector stages={stages} activeId={stageId} onChange={setStageId} />
          </div>

          <div className="mt-8">
            <ResourceBoundary state={stageResultsState}>
              {(stage) => <SplitTimesTable stage={stage} />}
            </ResourceBoundary>
          </div>
        </div>
      )}
    </ResourceBoundary>
  )
}

function SplitTimesTable({ stage }: { stage: RallyStageResultsView }) {
  if (stage.splitDistances.length === 0) {
    return (
      <div className="border border-line bg-mist px-6 py-16 text-center">
        <p className="text-sm font-semibold text-slate">
          Sellel kiiruskatsel ei ole vahepunkte.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 text-xs text-slate">
        {stage.code}
        {stage.name ? ` — ${stage.name}` : ''}
      </p>

      <div className="hidden overflow-x-auto border border-line sm:block">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
              <th className="w-10 px-3 py-2.5">Koht</th>
              <th className="px-3 py-2.5">Ekipaaž</th>
              {stage.splitDistances.map((split) => (
                <th key={split.splitIndex} className="px-2 py-2.5 text-right font-mono">
                  VP{split.splitIndex}
                </th>
              ))}
              <th className="px-3 py-2.5 text-right">Finiš</th>
            </tr>
          </thead>
          <tbody>
            {stage.rows.map((row) => (
              <tr key={row.competitorId} className="border-b border-line last:border-0">
                <td className="px-3 py-2.5 font-display text-base font-bold text-black">
                  {row.position ?? '—'}
                </td>
                <td className="px-3 py-2.5">
                  <p className="font-semibold leading-tight text-black">
                    #{row.number} {row.driver}
                  </p>
                  <p className="text-xs text-slate">{row.coDriver}</p>
                </td>
                {stage.splitDistances.map((split) => {
                  const time = row.splits.find((s) => s.splitIndex === split.splitIndex)
                  return (
                    <td key={split.splitIndex} className="px-2 py-2.5 text-right">
                      {time ? (
                        <>
                          <p className="font-mono tabular-nums text-black">
                            {formatDuration(time.elapsedMs)}
                          </p>
                          <p className="font-mono text-[11px] tabular-nums text-blue">
                            {formatGap(time.gapToBestMs)}
                          </p>
                        </>
                      ) : (
                        <span className="text-slate">—</span>
                      )}
                    </td>
                  )
                })}
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-black">
                  {row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-2 sm:hidden">
        {stage.rows.map((row) => (
          <li key={row.competitorId} className="border border-line p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-xl font-bold leading-none text-black">
                  {row.position ?? '—'}
                </span>
                <div>
                  <p className="font-semibold leading-tight text-black">
                    #{row.number} {row.driver}
                  </p>
                  <p className="text-xs text-slate">{row.coDriver}</p>
                </div>
              </div>
              <span className="whitespace-nowrap font-mono text-base font-bold tabular-nums text-black">
                {row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-line pt-2">
              {stage.splitDistances.map((split) => {
                const time = row.splits.find((s) => s.splitIndex === split.splitIndex)
                return (
                  <div key={split.splitIndex} className="text-center">
                    <p className="font-mono text-[10px] uppercase text-slate/70">
                      VP{split.splitIndex}
                    </p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-black">
                      {time ? formatDuration(time.elapsedMs) : '—'}
                    </p>
                  </div>
                )
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
