'use client'

import type { RallyStageResultsView } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary, EMPTY_BOX } from './resource-boundary'
import { useLiveSelection } from './live-selection'
import { SeriesFilter, allowedClassIds } from './series-filter'
import { StageSelector } from './stage-selector'
import { formatDuration, formatGap } from './format'
import { useT } from '../locale-provider'
import { MOBILE_LIST, NUM, POS, TABLE, TABLE_WRAP, TabHeader, TD, TH, THEAD_ROW, TIME, rowClass } from './table'

/** Vahepunktide ajad valitud katsel — sama katse ja klass, mis mujal. */
export function SplitTimesTab() {
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
                  {(stage) => <SplitTimesTable stage={stage} allowedClassIds={allowedClassIds(ev.series, filter)} />}
                </ResourceBoundary>
              </div>
            </div>
          )}
        </ResourceBoundary>
      )}
    </ResourceBoundary>
  )
}

function SplitTimesTable({
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

  const header = (
    <TabHeader source={t.live.sourceRallyLynx}
      title={
        <>
          {t.live.tabs.splits}
          <span className="ml-2 text-lg text-slate">
            — {stage.code}
            {stage.name ? ` ${stage.name}` : ''}
          </span>
        </>
      }
      detail={stage.distanceM ? `${(stage.distanceM / 1000).toFixed(2)} km` : undefined}
      updatedAt={stage.updatedAt}
      status={stage.status}
    />
  )

  if (stage.splitDistances.length === 0) {
    return (
      <div>
        {header}
        <div className={EMPTY_BOX}>{t.live.noSplits}</div>
      </div>
    )
  }

  return (
    <div>
      {header}

      <div className={TABLE_WRAP}>
        <table className={`${TABLE} min-w-[640px]`}>
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`w-12 ${TH}`}>{t.live.th.position}</th>
              <th className={TH}>{t.live.th.crew}</th>
              {stage.splitDistances.map((split) => (
                <th key={split.splitIndex} className={`${TH} text-right`}>
                  {t.live.th.split(split.splitIndex)}
                  <span className="ml-1 font-normal normal-case tracking-normal text-slate/70">
                    {(split.distanceM / 1000).toFixed(1)} km
                  </span>
                </th>
              ))}
              <th className={`${TH} text-right`}>{t.live.th.finish}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.competitorId} className={rowClass(row.position)}>
                <td className={TD}>
                  <span className={POS}>{row.position ?? '—'}</span>
                </td>
                <td className={TD}>
                  <p className="font-semibold leading-tight text-black">
                    <span className={`mr-1.5 ${NUM}`}>#{row.number}</span>
                    {row.driver}
                  </p>
                  <p className="text-xs text-slate">{row.coDriver}</p>
                </td>
                {stage.splitDistances.map((split) => {
                  const time = row.splits.find((s) => s.splitIndex === split.splitIndex)
                  return (
                    <td key={split.splitIndex} className={`${TD} text-right`}>
                      {time ? (
                        <>
                          <p className="font-mono tabular-nums text-black">{formatDuration(time.elapsedMs)}</p>
                          <p className="font-mono text-[11px] tabular-nums text-slate">{formatGap(time.gapToBestMs)}</p>
                        </>
                      ) : (
                        <span className="text-slate">—</span>
                      )}
                    </td>
                  )
                })}
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
          <li
            key={row.competitorId}
            className={`py-2.5 ${row.position === 1 ? 'shadow-[inset_3px_0_0_0_#0D71B8] bg-blue/[0.04] pl-2' : ''}`}
          >
            <div className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3">
              <span className={POS}>{row.position ?? '—'}</span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-semibold leading-tight text-black">
                  <span className="mr-1.5 font-mono text-[12px] font-normal text-slate">#{row.number}</span>
                  {row.driver}
                </span>
                <span className="block truncate text-[12px] text-slate">{row.coDriver}</span>
              </span>
              <span className="font-mono text-[15px] font-semibold tabular-nums text-black">
                {row.durationMs !== null ? formatDuration(row.durationMs) : '—'}
              </span>
            </div>
            <div className="mt-2 flex gap-4 overflow-x-auto pl-[2.25rem] text-[12px]">
              {stage.splitDistances.map((split) => {
                const time = row.splits.find((s) => s.splitIndex === split.splitIndex)
                return (
                  <span key={split.splitIndex} className="shrink-0">
                    <span className="mr-1 font-semibold uppercase text-slate/70">{t.live.th.split(split.splitIndex)}</span>
                    <span className="font-mono tabular-nums text-black">{time ? formatDuration(time.elapsedMs) : '—'}</span>
                    {time ? <span className="ml-1 font-mono tabular-nums text-slate">{formatGap(time.gapToBestMs)}</span> : null}
                  </span>
                )
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
