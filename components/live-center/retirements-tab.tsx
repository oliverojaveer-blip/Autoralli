'use client'

import type { RallyRetirementRow } from '@/lib/rallylynx/adapter'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { ResourceBoundary } from './resource-boundary'

export function RetirementsTab() {
  const state = useRallyLynxResource<RallyRetirementRow[]>('/api/rallylynx/retirements', {
    pollMs: 30_000,
  })

  return (
    <ResourceBoundary state={state}>
      {(rows) =>
        rows.length === 0 ? (
          <div className="border border-line bg-mist px-6 py-16 text-center">
            <p className="text-sm font-semibold text-slate">Katkestamisi ei ole registreeritud.</p>
          </div>
        ) : (
          <div>
            <div className="hidden overflow-x-auto border border-line sm:block">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
                    <th className="w-14 px-3 py-2.5">Nr</th>
                    <th className="px-3 py-2.5">Ekipaaž</th>
                    <th className="px-3 py-2.5">Auto</th>
                    <th className="px-3 py-2.5">Katse</th>
                    <th className="px-3 py-2.5">Põhjus</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.competitorId} className="border-b border-line last:border-0">
                      <td className="px-3 py-2.5 font-mono text-slate">{row.number}</td>
                      <td className="px-3 py-2.5">
                        <p className="font-semibold leading-tight text-black">{row.driver}</p>
                        <p className="text-xs text-slate">{row.coDriver}</p>
                      </td>
                      <td className="px-3 py-2.5 text-slate">{row.vehicle}</td>
                      <td className="px-3 py-2.5 text-slate">{row.stageLabel}</td>
                      <td className="px-3 py-2.5 text-black">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="flex flex-col gap-2 sm:hidden">
              {rows.map((row) => (
                <li key={row.competitorId} className="border border-line p-3">
                  <p className="font-semibold text-black">
                    #{row.number} {row.driver} <span className="font-normal text-slate">/ {row.coDriver}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate">{row.vehicle}</p>
                  <p className="mt-1 text-xs text-slate">Katse: {row.stageLabel}</p>
                  <p className="mt-1 text-sm text-black">{row.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    </ResourceBoundary>
  )
}
