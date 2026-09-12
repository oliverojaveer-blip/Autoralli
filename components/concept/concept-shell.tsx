'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ConceptMode } from '@/lib/concept/fixtures'
import { SiteFooter } from '@/components/site-footer'
import { ModeProvider, useMode } from './mode'
import { ConceptNav } from './concept-nav'
import { ModeSwitch } from './mode-switch'
import { DemoBadge } from './demo-badge'
import { EASE } from './motion'
import { NormalHero } from './normal/normal-hero'
import { CalendarStrip } from './normal/calendar-strip'
import { NewsGrid } from './normal/news-grid'
import { StandingsPreview } from './normal/standings-preview'
import { Classes } from './normal/classes'
import { StartPath } from './normal/start-path'
import { Partners } from './normal/partners'
import { RaceHero } from './race/race-hero'
import { StageRoute } from './race/stage-route'
import { Leaderboard } from './race/leaderboard'
import { LiveFeed } from './race/live-feed'
import { LiveMedia } from './race/live-media'
import { SpectatorDocs } from './race/spectator-docs'

function NormalHome() {
  return (
    <>
      <NormalHero />
      <CalendarStrip />
      <NewsGrid />
      <StandingsPreview />
      <Classes />
      <StartPath />
      <Partners />
    </>
  )
}

function RaceHome() {
  return (
    <>
      <RaceHero />
      <StageRoute />
      <Leaderboard />
      <LiveFeed />
      <LiveMedia />
      <SpectatorDocs />
    </>
  )
}

/**
 * Režiimivahetus: kollane pühkimine üle ekraani katab vana sisu ja
 * paljastab uue. See on tahtlikult suur žest, sest muutub kogu lehe
 * prioriteet, mitte üks sektsioon. Reduced-motion korral vahetub sisu kohe.
 */
function Stage() {
  const { mode } = useMode()
  const reduced = useReducedMotion()
  const [wipe, setWipe] = useState<ConceptMode | null>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
    if (reduced) return
    setWipe(mode)
    const id = window.setTimeout(() => setWipe(null), 900)
    return () => window.clearTimeout(id)
  }, [mode, reduced])

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={mode}
          id="sisu"
          data-mode={mode}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.45, delay: 0.3, ease: EASE } }}
          exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
        >
          {mode === 'race' ? <RaceHome /> : <NormalHome />}
        </motion.main>
      </AnimatePresence>

      <AnimatePresence>
        {wipe ? (
          <motion.div
            key={wipe}
            className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-signal"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0 0 100%)'] }}
            transition={{ duration: 0.85, times: [0, 0.45, 1], ease: EASE }}
            aria-hidden
          >
            <span className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-ink">
              {wipe === 'race' ? 'Race Mode' : 'Tavavaade'}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export function ConceptShell({ initialMode }: { initialMode: ConceptMode }) {
  return (
    <ModeProvider initialMode={initialMode}>
      <ConceptNav />
      <Stage />
      <SiteFooter />
      <DemoBadge />
      {/* AJUTINE: prototüübi lüliti. Eemaldamiseks kustuta see rida ja mode-switch.tsx. */}
      <ModeSwitch />
    </ModeProvider>
  )
}
