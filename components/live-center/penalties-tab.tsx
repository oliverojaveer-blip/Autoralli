'use client'

import type { RallyPenaltyRow } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary, EMPTY_BOX } from './resource-boundary'
import { useLiveSelection } from './live-selection'
import { formatDuration } from './format'
import { useT } from '../locale-provider'
import { MOBILE_LIST, NUM, ROW, TABLE, TABLE_WRAP, TabHeader, TD, TH, THEAD_ROW } from './table'

export function PenaltiesTab() {
  const t = useT()
  const { pollMs } = useLiveSelection()
  const state = useRallyLynxResource<RallyPenaltyRow[]>('/api/rallylynx/penalties', {
    pollMs: pollMs(30_000),
  })
  const reason = (key: string) => t.live.penaltyReason[key as keyof typeof t.live.penaltyReason] ?? key

  return (
    <ResourceBoundary state={state}>
      {(rows) => (
        <div>
          <TabHeader title={t.live.tabs.penalties} updatedAt={state.kind === 'ready' ? new Date(state.fetchedAt).toISOString() : null} />
          {rows.length === 0 ? (
            <div className={EMPTY_BOX}>{t.live.noPenalties}</div>
          ) : (
            <>
              <div className={TABLE_WRAP}>
                <table className={`${TABLE} min-w-[560px]`}>
                  <thead>
                    <tr className={THEAD_ROW}>
                      <th className={`w-14 ${TH}`}>{t.live.th.number}</th>
                      <th className={TH}>{t.live.th.crew}</th>
                      <th className={TH}>{t.live.th.point}</th>
                      <th className={TH}>{t.live.th.reason}</th>
                      <th className={`${TH} text-right`}>{t.live.th.penalty}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={`${row.competitorId}-${i}`} className={ROW}>
                        <td className={`${TD} ${NUM}`}>{row.number}</td>
                        <td className={TD}>
                          <p className="font-semibold leading-tight text-black">{row.driver}</p>
                          <p className="text-xs text-slate">{row.coDriver}</p>
                        </td>
                        <td className={`${TD} text-slate`}>{row.itineraryItemLabel}</td>
                        <td className={`${TD} text-black`}>{reason(row.reason)}</td>
                        <td className={`${TD} text-right font-mono font-semibold tabular-nums text-black`}>
                          +{formatDuration(row.amountMs)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className={MOBILE_LIST}>
                {rows.map((row, i) => (
                  <li key={`${row.competitorId}-${i}`} className="grid grid-cols-[1fr_auto] items-center gap-3 py-2.5">
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold leading-tight text-black">
                        <span className="mr-1.5 font-mono text-[12px] font-normal text-slate">#{row.number}</span>
                        {row.driver}
                      </span>
                      <span className="block truncate text-[12px] text-slate">
                        {row.itineraryItemLabel} · {reason(row.reason)}
                      </span>
                    </span>
                    <span className="font-mono text-[15px] font-semibold tabular-nums text-black">+{formatDuration(row.amountMs)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </ResourceBoundary>
  )
}
