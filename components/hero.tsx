'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { LiveCountdown } from '@/components/live-countdown'
import { useHref, useLocale, useT } from './locale-provider'
import { pick } from '@/lib/i18n'
import type { RallyEvent } from '@/lib/events'

export function Hero({ event }: { event: RallyEvent }) {
  const reduced = useReducedMotion()
  const t = useT()
  const locale = useLocale()
  const href = useHref()

  const rise = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }

  return (
    <section className="relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-rally.jpg"
          alt={t.home.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="cut-tr object-cover object-[70%_50%] opacity-70"
        />
        {/* Kalm scrim fotol, brändiraamatu 04/Logo nõue teksti loetavuse jaoks. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="shell relative grid gap-14 pb-20 pt-16 lg:grid-cols-12 lg:gap-12 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-7">
          <motion.p
            {...rise}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-blue"
          >
            {t.home.eyebrow}
          </motion.p>

          <motion.h1
            {...rise}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-6xl font-bold uppercase leading-[0.92] text-white sm:text-7xl lg:text-8xl"
          >
            {t.home.titleLine1}
            <br />
            <span className="text-white/60">{t.home.titleLine2}</span>
          </motion.h1>

          <motion.p
            {...rise}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[52ch] text-lg leading-relaxed text-white/75"
          >
            {t.home.lead}
          </motion.p>

          <motion.div
            {...rise}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href={href('/kalender')}
              className="inline-flex items-center gap-2 whitespace-nowrap bg-blue px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
            >
              {t.home.viewCalendar}
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              href={href('/otse')}
              className="inline-flex items-center whitespace-nowrap border border-white/40 px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:border-white"
            >
              {t.common.live}
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...(reduced
            ? {}
            : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } })}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <div className="overflow-hidden rounded-[28px] border border-white/15 bg-black/60 backdrop-blur">
            <div className="flex min-h-[112px] items-center justify-center px-8 pb-2 pt-8">
              {event.logo ? (
                <Image
                  src={event.logo.src}
                  alt={event.logo.alt}
                  width={event.logo.width}
                  height={event.logo.height}
                  className="h-20 w-auto object-contain sm:h-24"
                />
              ) : (
                <div className="text-center">
                  <h2 className="font-display text-3xl font-bold uppercase leading-tight text-white">
                    {event.name}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-white/60">{pick(event.location, locale)}</p>
                </div>
              )}
            </div>

            <div className="px-6 pb-8 pt-4">
              <LiveCountdown
                eventName={event.name}
                targetTime={event.startsAt}
                status="scheduled"
                locale={locale}
                bare
                showHeader={false}
                size="compact"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
