'use client'

import { motion, useReducedMotion } from 'motion/react'
import { STAGE_ROUTE, STAGES } from '@/lib/concept/fixtures'
import { EASE, Rise } from '../motion'

const SIDE = {
  right: 'left-4 top-1/2 -translate-y-1/2',
  left: 'right-4 top-1/2 -translate-y-1/2',
  above: 'bottom-4 left-1/2 -translate-x-1/2',
  below: 'top-4 left-1/2 -translate-x-1/2',
} as const

const STATUS_LABEL = {
  lopetatud: 'lõpetatud',
  kaimas: 'käimas',
  tulemas: 'tulemas',
  katkestatud: 'katkestatud',
} as const

/**
 * Katse skeem ja päeva ajakava kõrvuti. Skeem on SVG-joon vahepunktidega,
 * mis joonistub vaatevälja jõudes. Lõpplahenduses asendab selle MapLibre
 * kaart GPX-trassiga. Ajakava on tekstiline alternatiiv, mis töötab ilma
 * pildita ja ekraanilugejaga.
 */
export function StageRoute() {
  const reduced = useReducedMotion()
  const { stage, path, splits, leaderPassed } = STAGE_ROUTE
  const today = STAGES.filter((s) => s.day === 'laupäev')

  return (
    <section id="rada" className="scroll-mt-28 border-b border-line py-14 lg:py-20">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Rise className="lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-headline sm:text-3xl">
              KK{stage.no} {stage.name}, {stage.km.toFixed(1).replace('.', ',')} km
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Skeem, mitte kaart</span>
          </div>

          <figure className="relative mt-6 aspect-[4/3] border border-line bg-surface sm:aspect-[16/9]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <pattern id="route-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#27272B" strokeWidth="0.25" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#route-grid)" />
              <path d={path} fill="none" stroke="#27272B" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
              <motion.path
                d={path}
                fill="none"
                stroke="#FFB800"
                strokeWidth="2.2"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                initial={reduced ? { pathLength: leaderPassed / (splits.length - 1) } : { pathLength: 0 }}
                whileInView={{ pathLength: leaderPassed / (splits.length - 1) }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
              />
            </svg>
            {splits.map((s) => {
              const passed = s.at <= leaderPassed
              return (
                <div
                  key={s.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <span className={`block h-3 w-3 border-2 ${passed ? 'border-signal bg-signal' : 'border-muted bg-ink'}`} />
                  <span className={`absolute whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] sm:text-[11px] ${SIDE[s.side]} ${passed ? 'text-chalk' : 'text-muted'}`}>
                    {s.label} <span className="tnum">{s.km.toFixed(1).replace('.', ',')}</span>
                  </span>
                </div>
              )
            })}
            <figcaption className="sr-only">
              Katse {stage.name} skeem: liider on läbinud {leaderPassed} vahepunkti {splits.length - 2}-st.
            </figcaption>
          </figure>
          <p className="mt-3 font-mono text-xs text-muted">
            Kollane joon näitab, kui kaugel on katse liider. Vahepunktid VP1 kuni VP3.
          </p>
        </Rise>

        <Rise delay={0.08} className="lg:col-span-5" >
          <div id="ajakava" className="scroll-mt-28">
            <h2 className="text-2xl font-bold tracking-headline sm:text-3xl">Laupäeva ajakava</h2>
            <ol className="mt-6 border-t border-line">
              {today.map((s) => {
                const live = s.status === 'kaimas'
                const done = s.status === 'lopetatud'
                return (
                  <li
                    key={s.id}
                    className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-line py-3 ${live ? 'bg-surface px-3 -mx-3' : ''}`}
                    aria-current={live ? 'step' : undefined}
                  >
                    <span className={`tnum font-mono text-sm font-bold ${live ? 'text-signal' : done ? 'text-muted' : 'text-chalk'}`}>KK{s.no}</span>
                    <span className="min-w-0">
                      <span className={`block truncate text-sm font-semibold ${done ? 'text-muted' : ''}`}>{s.name}</span>
                      <span className="block font-mono text-[11px] text-muted">
                        {s.km.toFixed(1).replace('.', ',')} km
                        {done && s.winner ? ` · ${s.winner} ${s.time}` : ''}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="tnum block font-mono text-sm">{s.start}</span>
                      <span className={`block font-mono text-[10px] uppercase tracking-[0.14em] ${live ? 'text-signal' : 'text-muted'}`}>
                        {STATUS_LABEL[s.status]}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </Rise>
      </div>
    </section>
  )
}
