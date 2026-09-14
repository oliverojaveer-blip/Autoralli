'use client'

import { useEffect } from 'react'
import type { RallyEventOverview, RallyStageResultsView, RallyStageView } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { useLiveSelection } from './live-selection'
import { SeriesFilter, allowedClassIds } from './series-filter'
import { StageSelector } from './stage-selector'
import { formatDuration, formatGap } from './format'
import { useT } from '../locale-provider'

/** Ühe valitud kiiruskatse tulemus (koht/aeg/vahe, ilma vahepunktideta). */
export function StageTimesTab() {
  const eventState = useRallyLynxResource<RallyEventOverview>('/api/rallylynx/event')
  const stagesState = useRallyLynxResource<RallyStageView[]>('/api/rallylynx/stages')

  const { stageId, setStageId, filter, setFilter } = useLiveSelection()

  useEffect(() => {
    if (stagesState.kind === 'ready' && stageId === null && stagesState.data.length > 0) {
      setStageId(stagesState.data[stagesState.data.length - 1].id)
    }
  }, [stagesState, stageId, setStageId])

  const stageResultsState = useRallyLynxResource<RallyStageResultsView>(
    stageId ? `/api/rallylynx/stages/${stageId}/results` : null,
    { pollMs: 15_000 },
  )

  return (
    <ResourceBoundary state={eventState}>
      {(event) => (
        <ResourceBoundary state={stagesState}>
          {(stages) => (
            <div>
              <div className="flex flex-col gap-4 border-b border-line pb-6">
                <SeriesFilter series={event.series} value={filter} onChange={setFilter} />
                <StageSelector stages={stages} activeId={stageId} onChange={setStageId} />
              </div>

              <div className="mt-8">
                <ResourceBoundary state={stageResultsState}>
                  {(stage) => (
                    <StageTimesTable
                      stage={stage}
                      allowedClassIds={allowedClassIds(event.series, filter)}
                    />
                  )}
                </ResourceBoundary>
              </div>
            </div>
          )}
        </ResourceBoundary>
      )}
    </ResourceBoundary>
  )
}

function StageTimesTable({
  stage,
  allowedClassIds,
}: {
  stage: RallyStageResultsView
  allowedClassIds: Set<string> | null
}) {
  const t = useT()
  const rows = allowedClassIds
    ? stage.rows.filter((row) => row.classIds.some((id) => allowedClassIds.has(id)))
    : stage.rows

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold uppercase text-black">
            {stage.code}
            {stage.name ? ` — ${stage.name}` : ''}
          </h3>
          {stage.distanceM ? (
            <p className="mt-1 text-xs text-slate">{(stage.distanceM / 1000).toFixed(2)} km</p>
          ) : null}
        </div>
        <span className="inline-flex items-center rounded-md border border-blue bg-gradient-to-b from-blue/[0.04] to-blue/[0.18] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-blue">
          {t.live.status[stage.status]}
        </span>
      </div>

      <div className="hidden overflow-x-auto rounded-md border border-line sm:block">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-gradient-to-b from-white to-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
              <th className="w-10 px-3 py-2.5">{t.live.th.position}</th>
              <th className="w-14 px-2 py-2.5">{t.live.th.number}</th>
              <th className="px-3 py-2.5">{t.live.th.crew}</th>
              <th className="px-3 py-2.5">{t.live.th.car}</th>
              <th className="px-3 py-2.5 text-right">{t.live.th.time}</th>
              <th className="px-3 py-2.5 text-right">{t.live.th.gap}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.competitorId}
                className={`border-b border-line last:border-0 ${
                  row.position === 1 ? 'bg-gradient-to-b from-blue/[0.03] to-blue/[0.10]' : ''
                }`}
              >
                <td className="px-3 py-2.5 font-display text-base font-bold text-black">
                  {row.position ?? '—'}
                </td>
                <td className="px-2 py-2.5 font-mono text-slate">{row.number}</td>
                <td className="px-3 py-2.5">
                  <p className="font-semibold leading-tight text-black">{row.driver}</p>
                  <p className="text-xs text-slate">{row.coDriver}</p>
                </td>
                <td className="px-3 py-2.5 text-slate">{row.vehicle}</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-black">
                  {row.onStage ? t.live.onStage : row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
                </td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-blue">
                  {formatGap(row.gapToLeaderMs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-2 sm:hidden">
        {rows.map((row) => (
          <li
            key={row.competitorId}
            className={`rounded-md border bg-gradient-to-b p-3 ${
              row.position === 1
                ? 'border-blue from-blue/[0.04] to-blue/[0.18]'
                : 'border-line from-white to-mist'
            }`}
          >
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
                {row.onStage ? t.live.onStage : row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate">{row.vehicle}</p>
            <p className="mt-1 font-mono text-xs tabular-nums text-blue">
              {formatGap(row.gapToLeaderMs)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
