'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { STANDINGS, STANDINGS_EVENT_CODES, type StandingsClass } from '@/lib/standings'
import { useT } from './locale-provider'

function formatPoints(value: number | null) {
  if (value === null) return '–'
  return value.toString().replace('.', ',')
}

function ClassTable({ cls }: { cls: StandingsClass }) {
  const t = useT()
  if (cls.rows.length === 0) {
    return (
      <div className="border border-line bg-mist px-6 py-16 text-center">
        <p className="text-sm font-semibold text-slate">
          {t.results.classPending(cls.label)}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Desktop/tablet: täistabel, horisontaalselt keritav kitsamatel akendel. */}
      <div className="hidden overflow-x-auto border border-line sm:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-mist text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate">
              <th className="w-12 px-4 py-3">{t.results.position}</th>
              <th className="px-4 py-3">{t.results.crew}</th>
              <th className="px-4 py-3">{t.results.entrant}</th>
              <th className="px-4 py-3">{t.results.car}</th>
              {STANDINGS_EVENT_CODES.map((code) => (
                <th key={code} className="w-14 px-2 py-3 text-center font-mono">
                  {code}
                </th>
              ))}
              <th className="w-16 px-4 py-3 text-right">{t.results.total}</th>
            </tr>
          </thead>
          <tbody>
            {cls.rows.map((row) => (
              <tr key={row.position} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-display text-base font-bold text-black">
                  {row.position}
                </td>
                <td className="px-4 py-3 font-semibold text-black">{row.driver}</td>
                <td className="px-4 py-3 text-slate">{row.entrant}</td>
                <td className="px-4 py-3 text-slate">{row.car}</td>
                {row.points.map((pts, i) => (
                  <td key={i} className="px-2 py-3 text-center font-mono tabular-nums text-slate">
                    {formatPoints(pts)}
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-mono text-base font-bold tabular-nums text-blue">
                  {row.total.toString().replace('.', ',')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobiil: kaardivaade, claude.md nõue tulemustabelite mobiilse vaate kohta. */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {cls.rows.map((row) => (
          <li key={row.position} className="border border-line p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold leading-none text-black">
                  {row.position}
                </span>
                <div>
                  <p className="font-semibold leading-tight text-black">{row.driver}</p>
                  <p className="mt-0.5 text-xs text-slate">{row.entrant}</p>
                </div>
              </div>
              <span className="whitespace-nowrap font-mono text-lg font-bold tabular-nums text-blue">
                {row.total.toString().replace('.', ',')}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate">{row.car}</p>
            <div className="mt-3 grid grid-cols-6 gap-1 border-t border-line pt-3">
              {STANDINGS_EVENT_CODES.map((code, i) => (
                <div key={code} className="text-center">
                  <p className="font-mono text-[10px] uppercase text-slate/70">{code}</p>
                  <p className="mt-0.5 font-mono text-xs tabular-nums text-black">
                    {formatPoints(row.points[i])}
                  </p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StandingsTable() {
  const t = useT()
  const [activeId, setActiveId] = useState(STANDINGS[0].classId)
  const reducedMotionRaw = useReducedMotion()
  const reducedMotion = reducedMotionRaw ?? false
  const active = STANDINGS.find((c) => c.classId === activeId) ?? STANDINGS[0]

  return (
    <div>
      <div role="tablist" aria-label={t.results.classAria} className="flex flex-wrap gap-2">
        {STANDINGS.map((cls) => {
          const isActive = cls.classId === activeId
          return (
            <button
              key={cls.classId}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(cls.classId)}
              className="relative px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] transition-colors"
            >
              {isActive ? (
                <motion.span
                  layoutId="standings-class-pill"
                  className="absolute inset-0 bg-blue"
                  transition={
                    reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }
                  }
                />
              ) : (
                <span className="absolute inset-0 border border-line" aria-hidden="true" />
              )}
              <span className={`relative ${isActive ? 'text-white' : 'text-slate'}`}>
                {cls.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8">
        <ClassTable cls={active} />
      </div>
    </div>
  )
}
