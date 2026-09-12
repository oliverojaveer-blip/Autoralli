'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { LAST_STAGE, LEADERBOARD, LIVE_EVENT } from '@/lib/concept/fixtures'
import { DUR, EASE, Rise } from '../motion'
import { Delta } from './race-hero'

const TABS = [
  { id: 'emv', label: 'Üldarvestus' },
  { id: 'junior', label: 'Junior Challenge' },
] as const

/**
 * Laiendatud tabel. Arvutis tabelina, telefonis kaartidena (claude.md nõue).
 * Iga tabel kannab staatust, allikat ja uuendusaega.
 */
export function Leaderboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('emv')
  const reduced = useReducedMotion()
  const rows = LEADERBOARD[tab]

  return (
    <section id="tulemused" className="scroll-mt-28 border-b border-line py-14 lg:py-20">
      <div className="shell">
        <Rise>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-headline sm:text-3xl">Tulemused pärast KK{LAST_STAGE.no}</h2>
              <p className="mt-2 font-mono text-xs text-muted">
                <span className="uppercase tracking-[0.16em] text-signal">{LIVE_EVENT.resultStatus}</span>
                {' · '}
                {LIVE_EVENT.source}, {LIVE_EVENT.clock}
              </p>
            </div>
            <div role="tablist" aria-label="Arvestus" className="flex border border-line">
              {TABS.map((t) => {
                const active = t.id === tab
                return (
                  <button
                    key={t.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setTab(t.id)}
                    className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 ${active ? 'text-ink' : 'text-muted hover:text-chalk'}`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="leaderboard-tab"
                        className="absolute inset-0 -z-10 bg-signal"
                        transition={reduced ? { duration: 0 } : { duration: DUR.control, ease: EASE }}
                      />
                    ) : null}
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>
        </Rise>

        <Rise delay={0.06} className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Tabel: sm ja laiem */}
              <table className="hidden w-full border-t border-line sm:table" data-testid="leaderboard-table">
                <thead>
                  <tr className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    <th scope="col" className="py-3 pr-3 text-left font-medium">Koht</th>
                    <th scope="col" className="py-3 pr-3 text-left font-medium">Nr</th>
                    <th scope="col" className="py-3 pr-3 text-left font-medium">Ekipaaž</th>
                    <th scope="col" className="hidden py-3 pr-3 text-left font-medium lg:table-cell">Auto</th>
                    <th scope="col" className="py-3 pr-3 text-left font-medium">Klass</th>
                    <th scope="col" className="py-3 pr-3 text-right font-medium">Aeg</th>
                    <th scope="col" className="py-3 text-right font-medium">Vahe</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <motion.tr
                      key={row.no}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: DUR.control, delay: i * 0.03, ease: EASE }}
                      className="border-b border-line"
                    >
                      <td className="py-3.5 pr-3">
                        <span className="flex items-center gap-2">
                          <span className={`tnum font-mono text-xl font-bold ${i === 0 ? 'text-signal' : ''}`}>{row.pos}</span>
                          <Delta value={row.delta} />
                        </span>
                      </td>
                      <td className="tnum py-3.5 pr-3 font-mono text-sm text-muted">{row.no}</td>
                      <td className="py-3.5 pr-3 text-base font-semibold">{row.crew}</td>
                      <td className="hidden py-3.5 pr-3 font-mono text-xs text-muted lg:table-cell">{row.car}</td>
                      <td className="py-3.5 pr-3 font-mono text-xs text-muted">{row.cls}</td>
                      <td className="tnum py-3.5 pr-3 text-right font-mono text-base font-bold">{row.time}</td>
                      <td className="tnum py-3.5 text-right font-mono text-base text-muted">{row.gap || 'liider'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Kaardid: telefon */}
              <ol className="border-t border-line sm:hidden" data-testid="leaderboard-cards">
                {rows.map((row, i) => (
                  <motion.li
                    key={row.no}
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.control, delay: i * 0.03, ease: EASE }}
                    className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 border-b border-line py-3.5"
                  >
                    <span className="flex flex-col items-start gap-1">
                      <span className={`tnum font-mono text-2xl font-bold leading-none ${i === 0 ? 'text-signal' : ''}`}>{row.pos}</span>
                      <Delta value={row.delta} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-base font-semibold">{row.crew}</span>
                      <span className="block truncate font-mono text-[11px] text-muted">#{row.no} · {row.cls} · {row.car}</span>
                    </span>
                    <span className="text-right">
                      <span className="tnum block font-mono text-base font-bold">{row.time}</span>
                      <span className="tnum block font-mono text-xs text-muted">{row.gap || 'liider'}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </Rise>
      </div>
    </section>
  )
}
