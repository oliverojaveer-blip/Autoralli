'use client'

import type { RallyPenaltyRow } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'
import { formatDuration } from './format'

const REASON_LABEL: Record<string, string> = {
  tcLate: 'Hilinemine ajakontrolli',
  tcEarly: 'Ennetähtaegne ajakontroll',
  falseStart: 'Valestart',
  stewardsDecision: 'Sportskomissaride otsus',
  cocDecision: 'Võistlusjuhi otsus',
}

export function PenaltiesTab() {
  const state = useRallyLynxResource<RallyPenaltyRow[]>('/api/rallylynx/penalties', {
    pollMs: 30_000,
  })

  return (
    <ResourceBoundary state={state}>
      {(rows) =>
        rows.length === 0 ? (
          <div className="rounded-md border border-line bg-gradient-to-b from-white to-mist px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate">Karistusi ei ole rakendatud.</p>
          </div>
        ) : (
          <div>
            <div className="hidden overflow-x-auto rounded-md border border-line sm:block">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-gradient-to-b from-white to-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
                    <th className="w-14 px-3 py-2.5">Nr</th>
                    <th className="px-3 py-2.5">Ekipaaž</th>
                    <th className="px-3 py-2.5">Punkt</th>
                    <th className="px-3 py-2.5">Põhjus</th>
                    <th className="px-3 py-2.5 text-right">Karistus</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={`${row.competitorId}-${i}`} className="border-b border-line last:border-0">
                      <td className="px-3 py-2.5 font-mono text-slate">{row.number}</td>
                      <td className="px-3 py-2.5">
                        <p className="font-semibold leading-tight text-black">{row.driver}</p>
                        <p className="text-xs text-slate">{row.coDriver}</p>
                      </td>
                      <td className="px-3 py-2.5 text-slate">{row.itineraryItemLabel}</td>
                      <td className="px-3 py-2.5 text-black">
                        {REASON_LABEL[row.reason] ?? row.reason}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-blue">
                        +{formatDuration(row.amountMs)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="flex flex-col gap-2 sm:hidden">
              {rows.map((row, i) => (
                <li key={`${row.competitorId}-${i}`} className="rounded-md border border-line bg-gradient-to-b from-white to-mist p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-black">
                      #{row.number} {row.driver}
                    </p>
                    <span className="whitespace-nowrap font-mono text-sm font-bold tabular-nums text-blue">
                      +{formatDuration(row.amountMs)}
                    </span>
                  </div>
                  <p className="text-xs text-slate">{row.coDriver}</p>
                  <p className="mt-1 text-xs text-slate">{row.itineraryItemLabel}</p>
                  <p className="mt-1 text-sm text-black">{REASON_LABEL[row.reason] ?? row.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    </ResourceBoundary>
  )
}
