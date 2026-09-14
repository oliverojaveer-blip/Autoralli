'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { formatDateRange } from '@/lib/dates'
import { NEXT_EVENT, SEASON } from '@/lib/concept/fixtures'
import { useCountdown } from '@/components/use-countdown'
import { DUR, EASE, MaskedLines } from '../motion'

function Unit({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="min-w-0">
      <div className="tnum font-mono text-3xl font-bold leading-none sm:text-4xl">
        {value === null ? '--' : String(value).padStart(2, '0')}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
    </div>
  )
}

/**
 * Kinemaatiline sissejuhatus: täispildis foto, pealkiri all vasakul,
 * järgmise võistluse plokk all paremal. Asümmeetria on tahtlik: pilk
 * liigub pealkirjast loendurini, mitte keskelt alla.
 */
export function NormalHero() {
  const reduced = useReducedMotion()
  const countdown = useCountdown(NEXT_EVENT.startsAt)

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.reveal, delay, ease: EASE },
        }

  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      {/* Telefonis on foto voolus (ülal), tahvlis ja arvutis kogu sektsiooni taust. */}
      <motion.div
        className="relative h-[46vh] min-h-[260px] md:absolute md:inset-0 md:-z-10 md:h-auto md:min-h-0"
        initial={reduced ? false : { scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <Image
          src="/concept/rally-pan.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10 md:via-ink/70" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/80 via-ink/20 to-transparent md:block" />
      </motion.div>

      <div className="shell relative flex flex-col justify-end pb-8 pt-7 md:min-h-[calc(100dvh-4rem)] md:pt-24 lg:min-h-[min(860px,calc(100dvh-4rem))] lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <motion.p {...rise(0)} className="text-xs font-semibold uppercase tracking-[0.22em] text-signal">
              Eesti meistrivõistlused {SEASON.year}
            </motion.p>
            <MaskedLines
              delay={0.1}
              className="mt-5 text-[2.75rem] font-bold leading-[0.94] tracking-headline sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]"
              lines={['Kruus, mets ja', <span key="l2" className="text-muted">sekundi sajandikud.</span>]}
            />
            <motion.p {...rise(0.35)} className="mt-6 max-w-[46ch] text-base leading-relaxed text-chalk/80 sm:text-lg">
              Kalender, stardinimekirjad, otsetulemused ja uudised Eesti rallihooajast. Ühes kohas.
            </motion.p>
            <motion.div {...rise(0.45)} className="mt-8 flex flex-wrap gap-3">
              <a
                href="#kalender"
                className="inline-flex items-center gap-2 bg-signal px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
              >
                Vaata kalendrit <ArrowRight size={16} weight="bold" />
              </a>
              <a
                href="#alusta"
                className="inline-flex items-center gap-2 border border-chalk/30 bg-ink/40 px-6 py-3.5 text-sm font-semibold text-chalk backdrop-blur transition-colors duration-150 hover:border-chalk"
              >
                Kuidas alustada
              </a>
            </motion.div>
          </div>

          <motion.aside
            id="jargmine"
            {...rise(0.3)}
            className="border border-line/80 bg-ink/75 backdrop-blur-md lg:col-span-5 lg:col-start-8"
            aria-label="Järgmine võistlus"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5 sm:px-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                Järgmine võistlus
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-signal">
                {SEASON.roundsDone + 1}. etapp / {SEASON.rounds}
              </span>
            </div>
            <div className="px-5 py-6 sm:px-6">
              <h2 className="text-3xl font-bold leading-none tracking-headline sm:text-4xl">
                {NEXT_EVENT.name}
              </h2>
              <p className="mt-3 font-mono text-sm text-muted">
                {formatDateRange(NEXT_EVENT.startsAt, NEXT_EVENT.endsAt, 'et')}, {NEXT_EVENT.town}
              </p>
              <div className="mt-6 grid grid-cols-4 gap-3 border-t border-line pt-6">
                <Unit value={countdown?.days ?? null} label="päeva" />
                <Unit value={countdown?.hours ?? null} label="tundi" />
                <Unit value={countdown?.minutes ?? null} label="min" />
                <Unit value={countdown?.seconds ?? null} label="sek" />
              </div>
              <a
                href="#kalender"
                className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-chalk"
              >
                Stardinimekiri ja ajakava
                <CaretRight size={14} weight="bold" className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
