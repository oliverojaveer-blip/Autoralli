'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { Play, Warning, ArrowRight, CaretUp, CaretDown, Minus } from '@phosphor-icons/react/dist/ssr'
import {
  CURRENT_STAGE,
  LAST_STAGE,
  LEADERBOARD,
  LIVE_EVENT,
  NEXT_STAGE,
  ORGANIZER_NOTICE,
  STAGES,
  STREAM,
} from '@/lib/concept/fixtures'
import { DUR, EASE, LiveDot, MaskedLines } from '../motion'

/** Uuendusest möödunud aeg. Loeb edasi, positsioone ei muuda. */
function useAgo(start: number) {
  const [ago, setAgo] = useState<number | null>(null)
  useEffect(() => {
    const t0 = Date.now()
    const tick = () => setAgo(start + Math.floor((Date.now() - t0) / 1000))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [start])
  return ago
}

export function Delta({ value }: { value: number }) {
  if (value > 0) return <CaretUp size={12} weight="bold" className="text-signal" aria-label={`tõusis ${value}`} />
  if (value < 0) return <CaretDown size={12} weight="bold" className="text-muted" aria-label={`langes ${-value}`} />
  return <Minus size={12} weight="bold" className="text-line" aria-label="sama" />
}

/**
 * Race Mode'i esimene ekraan: kõik ajakriitiline korraga. Vasakul käimasolev
 * katse, keskel esikolmik, paremal järgmine start ja otseülekanne.
 * Telefonis sama järjekord ülevalt alla, midagi ei peideta.
 */
export function RaceHero() {
  const reduced = useReducedMotion()
  const top = LEADERBOARD.emv.slice(0, 3)
  const ago = useAgo(LIVE_EVENT.updatedAgoSeconds)
  const done = STAGES.filter((s) => s.status === 'lopetatud').length

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.reveal, delay, ease: EASE },
        }

  return (
    <section className="relative isolate overflow-hidden border-b border-line" aria-label="Otseülevaade">
      <div className="absolute inset-0 -z-10">
        <Image src="/concept/rally-crowd.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[70%_40%] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/85 to-ink" />
      </div>

      <div className="shell pb-10 pt-8 lg:pb-14 lg:pt-10">
        <motion.div {...rise(0)} className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span className="flex items-center gap-2 text-signal"><LiveDot /> Live</span>
          <span className="text-chalk">{LIVE_EVENT.name} {LIVE_EVENT.year}</span>
          <span className="text-muted">Päev {LIVE_EVENT.day}, {LIVE_EVENT.dayLabel}</span>
          <span className="text-muted">{done} / {STAGES.length} katset sõidetud</span>
          <span className="ml-auto text-muted">kell {LIVE_EVENT.clock}</span>
        </motion.div>

        <div className="mt-8 grid gap-10 md:grid-cols-2 lg:mt-12 lg:grid-cols-12 lg:gap-8">
          {/* Käimasolev katse */}
          <div className="lg:col-span-5">
            <motion.p {...rise(0.05)} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-signal">
              Käimas
            </motion.p>
            <MaskedLines
              delay={0.1}
              className="mt-3 text-5xl font-bold leading-[0.92] tracking-headline sm:text-6xl lg:text-7xl"
              lines={[`KK${CURRENT_STAGE.no}`, <span key="n" className="text-chalk">{CURRENT_STAGE.name}</span>]}
            />
            <motion.dl {...rise(0.3)} className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5 font-mono text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Pikkus</dt>
                <dd className="tnum mt-1 text-lg font-bold">{CURRENT_STAGE.km.toFixed(1).replace('.', ',')} km</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Start</dt>
                <dd className="tnum mt-1 text-lg font-bold">{CURRENT_STAGE.start}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Vahepunkt</dt>
                <dd className="tnum mt-1 text-lg font-bold">2 / 3</dd>
              </div>
            </motion.dl>
            <motion.p {...rise(0.36)} className="mt-5 text-sm text-muted">
              Eelmine katse KK{LAST_STAGE.no} {LAST_STAGE.name}: võitis {LAST_STAGE.winner},{' '}
              <span className="tnum font-mono text-chalk">{LAST_STAGE.time}</span>
            </motion.p>
          </div>

          {/* Esikolmik */}
          <motion.div {...rise(0.2)} className="lg:col-span-4" data-testid="top3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Üldarvestus pärast KK{LAST_STAGE.no}</h2>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">{LIVE_EVENT.resultStatus}</span>
            </div>
            <ol className="mt-4 border-t border-line">
              {top.map((row, i) => (
                <li key={row.no} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-line py-3.5">
                  <span className={`tnum font-mono text-3xl font-bold leading-none ${i === 0 ? 'text-signal' : ''}`}>{row.pos}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-base font-bold tracking-headline lg:text-lg">{row.crew}</span>
                    <span className="block truncate font-mono text-xs text-muted">{row.car}</span>
                  </span>
                  <span className="flex items-center gap-2 text-right">
                    <Delta value={row.delta} />
                    <span className="tnum font-mono text-lg font-bold">{i === 0 ? row.time : row.gap}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted">
              <span>{LIVE_EVENT.source}</span>
              <span className="tnum">uuendatud {ago ?? LIVE_EVENT.updatedAgoSeconds} s tagasi</span>
            </div>
            <a href="#tulemused" className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-chalk">
              Kogu tabel <ArrowRight size={14} weight="bold" className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          {/* Järgmine start ja otseülekanne */}
          <motion.div {...rise(0.3)} className="grid gap-6 md:col-span-2 md:grid-cols-2 lg:col-span-3 lg:flex lg:flex-col">
            <div className="border border-line bg-ink/70 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Järgmine start</p>
              <p className="mt-2 text-xl font-bold tracking-headline">KK{NEXT_STAGE.no} {NEXT_STAGE.name}</p>
              <p className="tnum mt-3 font-mono text-4xl font-bold leading-none">{NEXT_STAGE.start}</p>
              <p className="mt-2 font-mono text-xs text-muted">{NEXT_STAGE.km.toFixed(1).replace('.', ',')} km, esimene auto 20 min pärast</p>
            </div>
            <a id="otse" href="#meedia" className="group relative block aspect-[16/10] overflow-hidden border border-line lg:flex-1" data-testid="stream-entry">
              <Image src={STREAM.poster} alt="" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <span>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-signal"><LiveDot /> Otseülekanne</span>
                  <span className="mt-1 block text-sm font-semibold">{STREAM.title}</span>
                </span>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-signal text-ink transition-transform duration-200 group-hover:scale-105">
                  <Play size={16} weight="fill" />
                </span>
              </div>
            </a>
          </motion.div>
        </div>

        {ORGANIZER_NOTICE.active ? (
          <motion.aside
            {...rise(0.45)}
            role="status"
            className="mt-10 flex gap-4 border-l-4 border-signal bg-surface px-5 py-4 lg:mt-12"
            data-testid="organizer-notice"
          >
            <Warning size={20} weight="fill" className="mt-0.5 shrink-0 text-signal" />
            <div>
              <p className="flex flex-wrap items-center gap-x-3 text-xs font-semibold uppercase tracking-[0.18em] text-signal">
                {ORGANIZER_NOTICE.title}
                <span className="font-mono normal-case tracking-normal text-muted">{ORGANIZER_NOTICE.time}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-chalk">{ORGANIZER_NOTICE.text}</p>
            </div>
          </motion.aside>
        ) : null}
      </div>
    </section>
  )
}
