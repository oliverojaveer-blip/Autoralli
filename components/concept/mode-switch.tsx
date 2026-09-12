'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useMode } from './mode'
import { DUR, EASE } from './motion'

/**
 * AJUTINE PROTOTÜÜBI LÜLITI. Eemaldamiseks kustuta see fail ja üks rida
 * concept-shell.tsx failis. Lõpplahenduses vahetab režiimi server
 * (võistluse staatus), mitte kasutaja.
 */
export function ModeSwitch() {
  const { mode, setMode } = useMode()
  const reduced = useReducedMotion()

  return (
    <div
      className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6"
      data-testid="mode-switch"
    >
      <div
        role="radiogroup"
        aria-label="Prototüübi režiim"
        className="relative flex border border-line bg-ink/95 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur"
      >
        {(['normal', 'race'] as const).map((value) => {
          const active = mode === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMode(value)}
              className={`relative z-10 whitespace-nowrap px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                active ? 'text-ink' : 'text-muted hover:text-chalk'
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="mode-switch-pill"
                  className="absolute inset-0 -z-10 bg-signal"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: DUR.control, ease: EASE }
                  }
                />
              ) : null}
              {value === 'normal' ? 'Tavavaade' : 'Race Mode'}
            </button>
          )
        })}
      </div>
      <p className="mt-1.5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted/70">
        prototüübi lüliti
      </p>
    </div>
  )
}
