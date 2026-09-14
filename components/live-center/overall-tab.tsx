'use client'

import { useEffect, useState } from 'react'
import type { RallyClassificationView, RallyEventOverview, RallyStageView } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { SeriesFilter, ALL_SERIES, classIdsForSeries } from './series-filter'
import { StageSelector } from './stage-selector'
import { formatDuration, formatGap, formatUpdatedAt } from './format'
import { useLocale, useT } from '../locale-provider'

/** Üldarvestus pärast valitud kiiruskatset (RallyLynx `?afterStage=`). */
export function OverallTab() {
  const eventState = useRallyLynxResource<RallyEventOverview>('/api/rallylynx/event')
  const stagesState = useRallyLynxResource<RallyStageView[]>('/api/rallylynx/stages')

  const [stageId, setStageId] = useState<string | null>(null)
  const [seriesId, setSeriesId] = useState(ALL_SERIES)

  useEffect(() => {
    if (stagesState.kind === 'ready' && stageId === null && stagesState.data.length > 0) {
      setStageId(stagesState.data[stagesState.data.length - 1].id)
    }
  }, [stagesState, stageId])

  const overallState = useRallyLynxResource<RallyClassificationView>(
    stageId ? `/api/rallylynx/classification?afterStage=${stageId}` : null,
    { pollMs: 30_000 },
  )

  return (
    <ResourceBoundary state={eventState}>
      {(event) => (
        <ResourceBoundary state={stagesState}>
          {(stages) => {
            const activeStage = stages.find((s) => s.id === stageId) ?? null
            return (
              <div>
                <div className="flex flex-col gap-4 border-b border-line pb-6">
                  <SeriesFilter series={event.series} activeId={seriesId} onChange={setSeriesId} />
                  <StageSelector stages={stages} activeId={stageId} onChange={setStageId} />
                </div>

                <div className="mt-8">
                  <ResourceBoundary state={overallState}>
                    {(overall) => (
                      <OverallTable
                        overall={overall}
                        stageCode={activeStage?.code ?? null}
                        allowedClassIds={classIdsForSeries(event.series, seriesId)}
                      />
                    )}
                  </ResourceBoundary>
                </div>
              </div>
            )
          }}
        </ResourceBoundary>
      )}
    </ResourceBoundary>
  )
}

function OverallTable({
  overall,
  stageCode,
  allowedClassIds,
}: {
  overall: RallyClassificationView
  stageCode: string | null
  allowedClassIds: Set<string> | null
}) {
  const t = useT()
  const locale = useLocale()
  const rows = allowedClassIds
    ? overall.rows.filter((row) => row.classIds.some((id) => allowedClassIds.has(id)))
    : overall.rows

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold uppercase text-black">
            {stageCode ? t.live.overallAfter(stageCode) : t.live.overall}
          </h3>
          <p className="mt-1 text-xs text-slate">
            {t.live.completedStages(overall.completedStageCount, overall.totalStageCount)} ·{' '}
            {t.live.sourceRallyLynx} · {t.live.updated} {formatUpdatedAt(overall.updatedAt, locale)}
          </p>
        </div>
        <span className="inline-flex items-center rounded-md border border-blue bg-gradient-to-b from-blue/[0.04] to-blue/[0.18] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-blue">
          {t.live.status[overall.status]}
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
              <th className="px-3 py-2.5 text-right">{t.live.th.total}</th>
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
                {formatDuration(row.totalTimeMs)}
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
