'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { StandingsClass } from '@/lib/standings'
import type { StandingsView } from '@/lib/standings-source'
import { useLocale } from './locale-provider'
import { formatLongDate } from '@/lib/dates'
import { useT } from './locale-provider'

function formatPoints(value: number | null) {
  if (value === null) return '–'
  return value.toString().replace('.', ',')
}

function ClassTable({ cls, eventCodes }: { cls: StandingsClass; eventCodes: string[] }) {
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
              {eventCodes.map((code) => (
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
              {eventCodes.map((code, i) => (
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

export function StandingsTable({ view }: { view: StandingsView }) {
  const t = useT()
  const locale = useLocale()
  const { classes, eventCodes } = view
  const [activeId, setActiveId] = useState(classes[0]?.classId ?? '')
  const reducedMotionRaw = useReducedMotion()
  const reducedMotion = reducedMotionRaw ?? false
  const active = classes.find((c) => c.classId === activeId) ?? classes[0]
  if (!active) return <p className="border border-line bg-mist px-6 py-16 text-center text-sm font-semibold text-slate">{t.common.dataComingSoon}</p>

  return (
    <div>
      <div role="tablist" aria-label={t.results.classAria} className="flex flex-wrap gap-2">
        {classes.map((cls) => {
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

      <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate">
        {view.sample ? (
          <span className="inline-flex items-center gap-2">
            <span className="bg-checker h-3 w-3 text-caution" aria-hidden="true" />
            <strong className="font-bold uppercase tracking-[0.1em] text-caution">{t.home.standingsSample}:</strong> {t.home.standingsSampleNote}
          </span>
        ) : (
          <>
            {view.source ? (
              view.sourceUrl ? (
                <a href={view.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue hover:text-black">
                  {t.common.source}: {view.source}
                </a>
              ) : (
                <span>{t.common.source}: {view.source}</span>
              )
            ) : null}
            {view.updatedAt ? <span>{t.live.updated} <span className="tnum">{formatLongDate(view.updatedAt, locale)}</span></span> : null}
            {view.afterEventName ? <span>{t.live.after(view.afterEventName)}</span> : null}
            {view.status ? <span className="font-bold uppercase tracking-[0.1em]">{t.live.status[view.status]}</span> : null}
          </>
        )}
      </p>

      <div className="mt-6">
        <ClassTable cls={active} eventCodes={eventCodes} />
      </div>
    </div>
  )
}
