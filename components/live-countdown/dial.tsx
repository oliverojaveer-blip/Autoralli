'use client'

import type { CSSProperties } from 'react'
import { SevenSegmentNumber } from './seven-segment-digit'

/**
 * Täkid genereeritakse üks kord mooduli laadimisel, mitte iga uuenduse
 * peale — kõik neli ratast jagavad sama massiivi, ainult värv/heledus
 * erineb `progress` järgi renderdamise hetkel.
 */
const TICK_COUNT = 60
const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => {
  const angle = (i * 360) / TICK_COUNT - 90 // -90, et täkk 0 oleks kell 12
  const isMajor = i % 5 === 0
  const outer = 47
  const inner = isMajor ? 39 : 43
  const rad = (angle * Math.PI) / 180
  return {
    key: i,
    x1: 50 + inner * Math.cos(rad),
    y1: 50 + inner * Math.sin(rad),
    x2: 50 + outer * Math.cos(rad),
    y2: 50 + outer * Math.sin(rad),
    isMajor,
  }
})

export type DialProps = {
  value: number
  /** 0..1, mitu osa täisringist on "läbitud" — juhib täkkide heledust ja liikuvat valgustäppi. */
  progress: number
  label: string
  reducedMotion: boolean
  /** Viimased 10 sekundit: sekundiratas heledam, ilma vilkumiseta. */
  emphasize?: boolean
  minDigits?: number
  /** "compact" — väiksem versioon, nt avalehe Hero jaoks. */
  size?: 'default' | 'compact'
}

const SIZE_CLASSES: Record<'default' | 'compact', string> = {
  default: 'w-[clamp(62px,19vw,88px)] sm:w-[clamp(120px,16vw,150px)] lg:w-[clamp(150px,15vw,220px)]',
  compact: 'w-[clamp(52px,15vw,64px)] sm:w-[clamp(64px,9vw,80px)] lg:w-[clamp(72px,7vw,92px)]',
}

export function Dial({
  value,
  progress,
  label,
  reducedMotion,
  emphasize,
  minDigits = 2,
  size = 'default',
}: DialProps) {
  const clamped = Math.min(1, Math.max(0, progress))
  const activeCount = Math.round(clamped * TICK_COUNT)
  const style = { '--dial-progress': clamped } as CSSProperties

  return (
    <div className="flex flex-col items-center gap-2.5 sm:gap-3">
      <div
        className={`relative aspect-square shrink-0 ${SIZE_CLASSES[size]}`}
        style={style}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {TICKS.map((tick, i) => {
            const isActive = i < activeCount
            return (
              <line
                key={tick.key}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke="#FFFFFF"
                strokeOpacity={isActive ? (tick.isMajor ? 0.95 : 0.5) : tick.isMajor ? 0.22 : 0.1}
                strokeWidth={tick.isMajor ? 2 : 1}
                strokeLinecap="round"
              />
            )
          })}

          {!reducedMotion ? (
            <g
              style={{
                rotate: 'calc(var(--dial-progress) * 360deg)',
                transformOrigin: '50px 50px',
                transition: 'rotate 260ms linear',
              }}
            >
              <circle
                cx="50"
                cy="3"
                r={emphasize ? 3 : 2.4}
                fill="#FFFFFF"
                style={{
                  filter: emphasize
                    ? 'drop-shadow(0 0 6px rgba(255,255,255,1))'
                    : 'drop-shadow(0 0 4px rgba(255,255,255,0.85))',
                }}
              />
            </g>
          ) : null}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center p-[26%]">
          <SevenSegmentNumber value={value} minDigits={minDigits} reducedMotion={reducedMotion} />
        </div>
      </div>

      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 sm:text-xs">
        {label}
      </span>
    </div>
  )
}
