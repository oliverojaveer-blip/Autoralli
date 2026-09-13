'use client'

import { useEffect, useState } from 'react'
import type {
  RallyClassificationView,
  RallyEventOverview,
  RallyStageResultsView,
  RallyStageView,
} from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { SeriesFilter, ALL_SERIES, classIdsForSeries } from './series-filter'
import { StageSelector } from './stage-selector'
import { STATUS_LABEL, formatDuration, formatGap, formatUpdatedAt } from './format'

export function ClassificationTab() {
  const eventState = useRallyLynxResource<RallyEventOverview>('/api/rallylynx/event')
  const stagesState = useRallyLynxResource<RallyStageView[]>('/api/rallylynx/stages')

  const [stageId, setStageId] = useState<string | null>(null)
  const [seriesId, setSeriesId] = useState(ALL_SERIES)

  useEffect(() => {
    if (stagesState.kind === 'ready' && stageId === null && stagesState.data.length > 0) {
      setStageId(stagesState.data[stagesState.data.length - 1].id)
    }
  }, [stagesState, stageId])

  const stageResultsState = useRallyLynxResource<RallyStageResultsView>(
    stageId ? `/api/rallylynx/stages/${stageId}/results` : null,
    { pollMs: 15_000 },
  )
  const overallState = useRallyLynxResource<RallyClassificationView>(
    stageId ? `/api/rallylynx/classification?afterStage=${stageId}` : null,
    { pollMs: 30_000 },
  )

  return (
    <ResourceBoundary state={eventState}>
      {(event) => (
        <ResourceBoundary state={stagesState}>
          {(stages) => (
            <div>
              <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                <SeriesFilter series={event.series} activeId={seriesId} onChange={setSeriesId} />
                <StageSelector stages={stages} activeId={stageId} onChange={setStageId} />
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase text-black">
                    Kiiruskatse
                  </h3>
                  <ResourceBoundary state={stageResultsState}>
                    {(stage) => (
                      <StageResultsColumn
                        stage={stage}
                        allowedClassIds={classIdsForSeries(event.series, seriesId)}
                      />
                    )}
                  </ResourceBoundary>
                </div>

                <div>
                  <h3 className="mb-4 font-display text-lg font-bold uppercase text-black">
                    Üldarvestus
                  </h3>
                  <ResourceBoundary state={overallState}>
                    {(overall) => (
                      <OverallColumn
                        overall={overall}
                        allowedClassIds={classIdsForSeries(event.series, seriesId)}
                      />
                    )}
                  </ResourceBoundary>
                </div>
              </div>
            </div>
          )}
        </ResourceBoundary>
      )}
    </ResourceBoundary>
  )
}

function StageResultsColumn({
  stage,
  allowedClassIds,
}: {
  stage: RallyStageResultsView
  allowedClassIds: Set<string> | null
}) {
  const rows = allowedClassIds
    ? stage.rows.filter((row) => row.classIds.some((id) => allowedClassIds.has(id)))
    : stage.rows

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate">
          {stage.code}
          {stage.name ? ` — ${stage.name}` : ''}
          {stage.distanceM ? ` · ${(stage.distanceM / 1000).toFixed(2)} km` : ''}
        </p>
        <span className="inline-flex items-center border border-blue px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-blue">
          {STATUS_LABEL[stage.status]}
        </span>
      </div>

      <div className="hidden overflow-x-auto border border-line sm:block">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
              <th className="w-10 px-3 py-2.5">Koht</th>
              <th className="px-3 py-2.5">Ekipaaž</th>
              <th className="px-3 py-2.5 text-right">Aeg</th>
              <th className="px-3 py-2.5 text-right">Vahe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
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
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-black">
                  {row.onStage ? 'katsel' : row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
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
                {row.onStage ? 'katsel' : row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
              </span>
            </div>
            <p className="mt-1.5 font-mono text-xs tabular-nums text-blue">
              {formatGap(row.gapToLeaderMs)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OverallColumn({
  overall,
  allowedClassIds,
}: {
  overall: RallyClassificationView
  allowedClassIds: Set<string> | null
}) {
  const rows = allowedClassIds
    ? overall.rows.filter((row) => row.classIds.some((id) => allowedClassIds.has(id)))
    : overall.rows

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate">
          Läbitud {overall.completedStageCount}/{overall.totalStageCount} kiiruskatset · allikas
          RallyLynx · uuendatud {formatUpdatedAt(overall.updatedAt)}
        </p>
        <span className="inline-flex items-center border border-blue px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-blue">
          {STATUS_LABEL[overall.status]}
        </span>
      </div>

      <div className="hidden overflow-x-auto border border-line sm:block">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
              <th className="w-10 px-3 py-2.5">Koht</th>
              <th className="px-3 py-2.5">Ekipaaž</th>
              <th className="px-3 py-2.5 text-right">Kokku</th>
              <th className="px-3 py-2.5 text-right">Vahe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
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
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-black">
                  {formatDuration(row.totalTimeMs)}
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
                {formatDuration(row.totalTimeMs)}
              </span>
            </div>
            <p className="mt-1.5 font-mono text-xs tabular-nums text-blue">
              {formatGap(row.gapToLeaderMs)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
