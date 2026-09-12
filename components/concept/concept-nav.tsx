'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { List, X, Play } from '@phosphor-icons/react/dist/ssr'
import { useMode } from './mode'
import { DUR, EASE, LiveDot } from './motion'
import {
  CURRENT_STAGE,
  LEADERBOARD,
  LIVE_EVENT,
  NEXT_EVENT,
} from '@/lib/concept/fixtures'

type NavLink = { label: string; href: string; wide?: boolean }

const NORMAL_LINKS: NavLink[] = [
  { label: 'Kalender', href: '#kalender' },
  { label: 'Uudised', href: '#uudised' },
  { label: 'Punktiseis', href: '#punktiseis' },
  { label: 'Alusta', href: '#alusta' },
]

/** `wide` lingid mahuvad ühele reale alles lg laiusest. Tahvlis on need mobiilimenüüs. */
const RACE_LINKS: NavLink[] = [
  { label: 'Tulemused', href: '#tulemused' },
  { label: 'Ajakava', href: '#ajakava' },
  { label: 'Rada', href: '#rada', wide: true },
  { label: 'Pealtvaatajale', href: '#pealtvaatajale' },
  { label: 'Dokumendid', href: '#dokumendid', wide: true },
]

/**
 * Navigatsioon vahetab prioriteeti koos režiimiga: tavavaates viib see
 * hooaja sisu juurde, Race Mode'is on esikohal otseülekanne ja tulemused.
 * Race Mode'is on nav all kitsas live-riba, mis jääb ka telefonis nähtavaks.
 */
export function ConceptNav() {
  const { mode } = useMode()
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const race = mode === 'race'
  const links = race ? RACE_LINKS : NORMAL_LINKS
  const leader = LEADERBOARD.emv[0]
  const second = LEADERBOARD.emv[1]

  const fade = reduced
    ? {}
    : {
        initial: { opacity: 0, y: -6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 6 },
        transition: { duration: DUR.control, ease: EASE },
      }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <nav className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/concept" className="flex shrink-0 items-center gap-3" aria-label="Autoralli.ee kontseptsiooni avaleht">
          <Image src="/eal-logo.png" alt="" width={32} height={32} priority className="h-8 w-8" />
          <span className="text-lg font-bold tracking-headline">
            Autoralli<span className="text-signal">.ee</span>
          </span>
        </Link>

        <AnimatePresence mode="wait" initial={false}>
          {race ? (
            <motion.div
              key="live-pill"
              {...fade}
              className="hidden items-center gap-3 border border-line px-3 py-1.5 lg:flex"
            >
              <LiveDot />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-signal">
                Live
              </span>
              <span className="text-sm font-semibold">
                {LIVE_EVENT.name} {LIVE_EVENT.year}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={mode} {...fade} className="hidden items-center gap-6 md:flex lg:gap-7">
            {links.map((link) => (
              <li key={link.href} className={link.wide ? 'hidden lg:block' : undefined}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-muted transition-colors duration-150 hover:text-chalk"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {race ? (
            <motion.a
              key="cta-race"
              {...fade}
              href="#otse"
              className="hidden items-center gap-2 whitespace-nowrap bg-signal px-4 py-2 text-sm font-semibold text-ink transition-transform duration-150 hover:-translate-y-px active:translate-y-0 md:inline-flex"
            >
              <Play size={14} weight="fill" />
              Vaata otse
            </motion.a>
          ) : (
            <motion.a
              key="cta-normal"
              {...fade}
              href="#jargmine"
              className="hidden items-center whitespace-nowrap border border-line px-4 py-2 text-sm font-semibold text-chalk transition-colors duration-150 hover:border-chalk md:inline-flex"
            >
              {NEXT_EVENT.short}
              <span className="ml-2 font-mono text-xs text-muted">9.10</span>
            </motion.a>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 text-chalk md:hidden"
          aria-expanded={open}
          aria-controls="concept-menu"
          aria-label={open ? 'Sulge menüü' : 'Ava menüü'}
        >
          {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </nav>

      {/* Live-riba: telefonis ainus koht, kus staatus on alati nähtav. */}
      <AnimatePresence initial={false}>
        {race ? (
          <motion.div
            key="ticker"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: DUR.control, ease: EASE }}
            className="overflow-hidden border-t border-line bg-surface"
            data-testid="live-ticker"
          >
            <div className="shell flex h-9 items-center gap-4 overflow-x-auto whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] [scrollbar-width:none]">
              <span className="flex items-center gap-2 text-signal lg:hidden">
                <LiveDot /> Live
              </span>
              <span className="text-chalk">
                KK{CURRENT_STAGE.no} {CURRENT_STAGE.name}
                <span className="ml-2 text-signal">käimas</span>
              </span>
              <span className="h-3 w-px bg-line" aria-hidden />
              <span className="text-muted">
                1. <span className="text-chalk">{leader.crew.split(' / ')[0]}</span>{' '}
                <span className="tnum text-chalk">{leader.time}</span>
              </span>
              <span className="text-muted">
                2. {second.crew.split(' / ')[0]}{' '}
                <span className="tnum text-chalk">{second.gap}</span>
              </span>
              <span className="ml-auto hidden text-muted sm:inline">
                {LIVE_EVENT.resultStatus} · {LIVE_EVENT.clock}
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {open ? (
        <div id="concept-menu" className="border-t border-line md:hidden">
          <ul className="shell flex flex-col py-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-chalk"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="py-3">
              {race ? (
                <a href="#otse" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 bg-signal px-4 py-2.5 text-sm font-semibold text-ink">
                  <Play size={14} weight="fill" /> Vaata otse
                </a>
              ) : (
                <a href="#jargmine" onClick={() => setOpen(false)} className="inline-flex border border-line px-4 py-2.5 text-sm font-semibold text-chalk">
                  Järgmine ralli
                </a>
              )}
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}
