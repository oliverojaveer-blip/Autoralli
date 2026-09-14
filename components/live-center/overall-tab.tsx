'use client'

import type { RallyClassificationView } from '@/lib/rallylynx/adapter'
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

/** Üldarvestus pärast valitud kiiruskatset (RallyLynx `?afterStage=`). */
export function OverallTab() {
  const { stageId, setStageId, filter, setFilter, event, stages, pollMs } = useLiveSelection()

  const overallState = useRallyLynxResource<RallyClassificationView>(
    stageId ? `/api/rallylynx/classification?afterStage=${stageId}` : null,
    { pollMs: pollMs(30_000) },
  )

  return (
    <ResourceBoundary state={event}>
      {(ev) => (
        <ResourceBoundary state={stages}>
          {(stageList) => {
            const activeStage = stageList.find((s) => s.id === stageId) ?? null
            return (
              <div>
                <div className="flex flex-col gap-4 border-b border-line pb-5">
                  <StageSelector stages={stageList} activeId={stageId} onChange={setStageId} />
                  <SeriesFilter series={ev.series} value={filter} onChange={setFilter} />
                </div>

                <div className="mt-6">
                  <ResourceBoundary state={overallState}>
                    {(overall) => (
                      <OverallTable
                        overall={overall}
                        stageCode={activeStage?.code ?? null}
                        allowedClassIds={allowedClassIds(ev.series, filter)}
                        className={selectedClassName(ev.series, filter)}
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
  className,
}: {
  overall: RallyClassificationView
  stageCode: string | null
  allowedClassIds: Set<string> | null
  /** Valitud üksiku klassi nimi; siis on koht ja vahe klassisisesed. */
  className: string | null
}) {
  const t = useT()
  const filtered = allowedClassIds
    ? overall.rows.filter((row) => row.classIds.some((id) => allowedClassIds.has(id)))
    : overall.rows
  // Üksiku klassi vaates on koht ja vahe klassi sees: klassifitseeritud
  // read on RallyLynxis juba koguaja järgi järjestatud, seega on klassi
  // koht rea järjekorranumber ja vahe erinevus klassi liidri koguajast.
  // Klassifitseerimata (position null) read jäävad kohata.
  const classLeaderMs = className ? filtered.find((r) => r.position !== null)?.totalTimeMs ?? null : null
  let rank = 0
  const rows = className
    ? filtered.map((row) => {
        if (row.position === null) return row
        rank += 1
        return {
          ...row,
          position: rank,
          gapToLeaderMs: classLeaderMs === null ? null : row.totalTimeMs - classLeaderMs,
        }
      })
    : filtered

  return (
    <div>
      <TabHeader source={t.live.sourceRallyLynx}
        title={
          <>
            {className ? t.live.classView(className) : t.live.overall}
            {stageCode ? <span className="ml-2 text-lg text-slate">— {t.live.after(stageCode)}</span> : null}
          </>
        }
        detail={t.live.completedStages(overall.completedStageCount, overall.totalStageCount)}
        updatedAt={overall.updatedAt}
        status={overall.status}
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
              <th className={`${TH} text-right`}>{t.live.th.total}</th>
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
                <td className={`${TD} ${TIME}`}>{formatDuration(row.totalTimeMs)}</td>
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
            timeMs={row.totalTimeMs}
            gapMs={row.gapToLeaderMs}
          />
        ))}
      </ul>
    </div>
  )
}
