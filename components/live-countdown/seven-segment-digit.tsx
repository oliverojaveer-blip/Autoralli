'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Päris seitsme-segmendiga number, joonistatud SVG-ga — mitte fondifail
 * ega bittkaart. Kustunud segmendid jäävad tuhmilt nähtavaks (nagu päris
 * LCD/LED-kellal), põlevad segmendid saavad sinise hõõgu.
 *
 *   a
 * f   b
 *   g
 * e   c
 *   d
 */
type SegmentId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'

const SEGMENT_PATHS: Record<SegmentId, string> = {
  a: '6,4 10,0 30,0 34,4 30,8 10,8',
  b: '36,6 40,10 40,29 36,33 32,29 32,10',
  c: '36,35 40,39 40,58 36,62 32,58 32,39',
  d: '6,60 10,56 30,56 34,60 30,64 10,64',
  e: '4,35 8,39 8,58 4,62 0,58 0,39',
  f: '4,6 8,10 8,29 4,33 0,29 0,10',
  g: '6,28 10,24 30,24 34,28 30,32 10,32',
}

const DIGIT_SEGMENTS: Record<string, SegmentId[]> = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '4': ['f', 'g', 'b', 'c'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'g', 'e', 'c', 'd'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
  '-': ['g'],
}

const ALL_SEGMENTS = Object.keys(SEGMENT_PATHS) as SegmentId[]

export function SevenSegmentDigit({
  char,
  reducedMotion,
}: {
  char: string
  reducedMotion: boolean
}) {
  const active = DIGIT_SEGMENTS[char] ?? []
  const prevRef = useRef(char)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (prevRef.current !== char) {
      prevRef.current = char
      setAnimKey((k) => k + 1)
    }
  }, [char])

  return (
    <svg viewBox="0 0 40 64" className="h-full w-auto" aria-hidden="true">
      {/* Kustunud segmendid — alati nähtaval, väga tuhmilt. */}
      {ALL_SEGMENTS.map((id) => (
        <polygon key={id} points={SEGMENT_PATHS[id]} className="fill-white/[0.07]" />
      ))}
      {/* Põlevad segmendid. `key` sunnib <g>-i uuesti mountima ainult siis,
          kui number tegelikult muutub — nii ei animeeru muutumatu number. */}
      <g key={reducedMotion ? 'static' : animKey} className={reducedMotion ? '' : 'digit-enter'}>
        {active.map((id) => (
          <polygon
            key={id}
            points={SEGMENT_PATHS[id]}
            className="fill-white"
            style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.55))' }}
          />
        ))}
      </g>
    </svg>
  )
}

/** Näitab arvu mitme seitsme-segmendiga numbrina, vähemalt kahekohaline. */
export function SevenSegmentNumber({
  value,
  minDigits = 2,
  reducedMotion,
}: {
  value: number
  minDigits?: number
  reducedMotion: boolean
}) {
  const text = String(Math.max(0, value)).padStart(minDigits, '0')
  return (
    <div className="tnum flex h-full items-center gap-[3px]">
      {text.split('').map((char, i) => (
        <SevenSegmentDigit key={i} char={char} reducedMotion={reducedMotion} />
      ))}
    </div>
  )
}
