'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SEASON, STANDINGS } from '@/lib/concept/fixtures'
import { DUR, EASE, Rise } from '../motion'

const TABS = [
  { id: 'emv', label: 'EMV absoluut' },
  { id: 'junior', label: 'Junior Challenge' },
] as const

/**
 * Punktiseisu eelvaade. Vahekaardi vahetus animeerib read sisse
 * järjekorras, et positsioonimuutus oleks loetav, mitte hüplik.
 */
export function StandingsPreview() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('emv')
  const reduced = useReducedMotion()
  const rows = STANDINGS[tab]
  const gap = rows[0].points - rows[1].points

  return (
    <section id="punktiseis" className="scroll-mt-16 border-b border-line py-16 lg:py-24">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-8">
        <Rise className="lg:col-span-4">
          <h2 className="text-3xl font-bold leading-[1.02] tracking-headline sm:text-4xl lg:text-5xl">
            Punktiseis pärast {SEASON.roundsDone}. etappi
          </h2>
          <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-muted">
            Liidril on {gap} punkti edu. Kolm etappi on veel ees, maksimum ühelt etapilt on 30.
          </p>
          <div role="tablist" aria-label="Arvestus" className="mt-8 flex border border-line">
            {TABS.map((t) => {
              const active = t.id === tab
              return (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`relative flex-1 px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                    active ? 'text-ink' : 'text-muted hover:text-chalk'
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="standings-tab"
                      className="absolute inset-0 -z-10 bg-signal"
                      transition={reduced ? { duration: 0 } : { duration: DUR.control, ease: EASE }}
                    />
                  ) : null}
                  {t.label}
                </button>
              )
            })}
          </div>
          <Link href="/punktiseis" className="mt-6 inline-block text-sm font-semibold text-muted transition-colors duration-150 hover:text-chalk">
            Kõik arvestused ja klassid
          </Link>
        </Rise>

        <Rise delay={0.08} className="lg:col-span-8">
          <div className="relative min-h-[22rem] border-t border-line">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ol
                key={tab}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {rows.map((row, i) => (
                  <motion.li
                    key={row.crew}
                    initial={reduced ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: DUR.control, delay: i * 0.05, ease: EASE }}
                    className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-line py-4 sm:grid-cols-[4rem_1fr_1fr_auto] sm:py-5"
                  >
                    <span className={`tnum font-mono text-3xl font-bold leading-none sm:text-4xl ${i === 0 ? 'text-signal' : 'text-chalk'}`}>
                      {row.pos}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-lg font-bold tracking-headline sm:text-xl">{row.crew}</span>
                      <span className="block truncate font-mono text-xs text-muted sm:hidden">{row.car}</span>
                    </span>
                    <span className="hidden font-mono text-sm text-muted sm:block">{row.car}</span>
                    <span className="text-right">
                      <span className="tnum block font-mono text-2xl font-bold leading-none sm:text-3xl">{row.points}</span>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                        {row.wins} {row.wins === 1 ? 'võit' : 'võitu'}
                      </span>
                    </span>
                  </motion.li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </Rise>
      </div>
    </section>
  )
}
