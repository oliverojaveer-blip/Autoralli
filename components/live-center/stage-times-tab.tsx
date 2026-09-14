'use client'

import type { RallyStageResultsView } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { useLiveSelection } from './live-selection'
import { SeriesFilter, allowedClassIds, selectedClassName } from './series-filter'
import { StageSelector } from './stage-selector'
import { formatDuration, formatGap } from './format'
import { useT } from '../locale-provider'
import {
  GAP,
  MOBILE_LIST,
  NUM,
  POS,
  ResultRowMobile,
  TABLE,
  TABLE_WRAP,
  TabHeader,
  TD,
  TH,
  THEAD_ROW,
  TIME,
  rowClass,
} from './table'

/** Ühe kiiruskatse ajad. */
export function StageTimesTab() {
  const { stageId, setStageId, filter, setFilter, event, stages, pollMs } = useLiveSelection()

  const stageResultsState = useRallyLynxResource<RallyStageResultsView>(
    stageId ? `/api/rallylynx/stages/${stageId}/results` : null,
    { pollMs: pollMs(15_000) },
  )

  return (
    <ResourceBoundary state={event}>
      {(ev) => (
        <ResourceBoundary state={stages}>
          {(stageList) => (
            <div>
              <div className="flex flex-col gap-4 border-b border-line pb-5">
                <StageSelector stages={stageList} activeId={stageId} onChange={setStageId} />
                <SeriesFilter series={ev.series} value={filter} onChange={setFilter} />
              </div>

              <div className="mt-6">
                <ResourceBoundary state={stageResultsState}>
                  {(stage) => (
                    <StageTimesTable
                      stage={stage}
                      allowedClassIds={allowedClassIds(ev.series, filter)}
                      className={selectedClassName(ev.series, filter)}
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
  className,
}: {
  stage: RallyStageResultsView
  allowedClassIds: Set<string> | null
  className: string | null
}) {
  const t = useT()
  const filtered = allowedClassIds
    ? stage.rows.filter((row) => row.classIds.some((id) => allowedClassIds.has(id)))
    : stage.rows
  // Klassi vaates koht ja vahe klassi sees (vt overall-tab).
  const classLeaderMs = className ? filtered.find((r) => r.position !== null && r.durationMs !== null)?.durationMs ?? null : null
  let rank = 0
  const rows = className
    ? filtered.map((row) => {
        if (row.position === null || row.durationMs === null) return row
        rank += 1
        return {
          ...row,
          position: rank,
          gapToLeaderMs: classLeaderMs === null ? null : row.durationMs - classLeaderMs,
        }
      })
    : filtered

  return (
    <div>
      <TabHeader source={t.live.sourceRallyLynx}
        title={
          <>
            {stage.code}
            {stage.name ? <span className="ml-2 text-lg text-slate">{stage.name}</span> : null}
            {className ? <span className="ml-2 text-lg text-slate">· {className}</span> : null}
          </>
        }
        detail={stage.distanceM ? `${(stage.distanceM / 1000).toFixed(2)} km` : undefined}
        updatedAt={stage.updatedAt}
        status={stage.status}
        note={className ? t.live.classPositionsNote : undefined}
      />

      <div className={TABLE_WRAP}>
        <table className={`${TABLE} min-w-[560px]`}>
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`w-12 ${TH}`}>{t.live.th.position}</th>
              <th className={`w-14 ${TH}`}>{t.live.th.number}</th>
              <th className={TH}>{t.live.th.crew}</th>
              <th className={TH}>{t.live.th.car}</th>
              <th className={`${TH} text-right`}>{t.live.th.time}</th>
              <th className={`${TH} text-right`}>{t.live.th.gap}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.competitorId} className={rowClass(row.position)}>
                <td className={TD}>
                  <span className={POS}>{row.position ?? '—'}</span>
                </td>
                <td className={`${TD} ${NUM}`}>{row.number}</td>
                <td className={TD}>
                  <p className="font-semibold leading-tight text-black">{row.driver}</p>
                  <p className="text-xs text-slate">{row.coDriver}</p>
                </td>
                <td className={`${TD} text-slate`}>{row.vehicle}</td>
                <td className={`${TD} ${TIME}`}>
                  {row.onStage ? (
                    <span className="text-live">{t.live.onStage}</span>
                  ) : row.durationMs !== null ? (
                    formatDuration(row.durationMs)
                  ) : (
                    '—'
                  )}
                </td>
                <td className={`${TD} ${GAP} ${row.position === 1 ? 'text-blue' : ''}`}>{formatGap(row.gapToLeaderMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className={MOBILE_LIST}>
        {rows.map((row) => (
          <ResultRowMobile
            key={row.competitorId}
            position={row.position}
            number={row.number}
            driver={row.driver}
            coDriver={row.coDriver}
            vehicle={row.vehicle}
            timeMs={row.durationMs}
            timeLabel={row.onStage ? t.live.onStage : null}
            gapMs={row.gapToLeaderMs}
          />
        ))}
      </ul>
    </div>
  )
}
