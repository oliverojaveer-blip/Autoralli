'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { RALLY_CLASSES, type ClassFact, type RallyClass } from '@/lib/rally-classes'
import { pick } from '@/lib/i18n'
import { useLocale, useT } from './locale-provider'

const SWIPE_THRESHOLD = 40
const TRANSITION_MS = 420
const EASE = [0.22, 1, 0.36, 1] as const

function useNeighborPreload(list: RallyClass[], index: number) {
  useEffect(() => {
    const next = list[(index + 1) % list.length]
    const prev = list[(index - 1 + list.length) % list.length]
    ;[next, prev].forEach((item) => {
      if (!item.imageWebp) return
      const img = new window.Image()
      img.src = item.imageWebp
    })
  }, [list, index])
}

export function ClassSelector() {
  const list = RALLY_CLASSES
  const reduced = useReducedMotion()
  const t = useT()
  const locale = useLocale()
  const factValue = (fact: ClassFact) => ('years' in fact ? t.classes.years(fact.years) : pick(fact.value, locale))
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialIndex = useMemo(() => {
    const requested = searchParams.get('class')
    const found = list.findIndex((c) => c.id === requested)
    return found === -1 ? 0 : found
  }, [searchParams, list])

  const [index, setIndex] = useState(initialIndex)
  const [direction, setDirection] = useState<1 | -1>(1)
  const animatingRef = useRef(false)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const railRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [announcement, setAnnouncement] = useState('')

  const active = list[index]
  useNeighborPreload(list, index)

  const go = useCallback(
    (nextIndex: number, dir: 1 | -1) => {
      if (animatingRef.current) return
      animatingRef.current = true
      setDirection(dir)
      setIndex(nextIndex)
      window.setTimeout(
        () => {
          animatingRef.current = false
        },
        reduced ? 0 : TRANSITION_MS,
      )
    },
    [reduced],
  )

  const goToIndex = useCallback(
    (target: number) => {
      const len = list.length
      const wrapped = ((target % len) + len) % len
      if (wrapped === index) return
      const forwardDistance = (wrapped - index + len) % len
      const backwardDistance = (index - wrapped + len) % len
      const dir: 1 | -1 = forwardDistance <= backwardDistance ? 1 : -1
      go(wrapped, dir)
    },
    [go, index, list.length],
  )

  const next = useCallback(() => go((index + 1) % list.length, 1), [go, index, list.length])
  const prev = useCallback(
    () => go((index - 1 + list.length) % list.length, -1),
    [go, index, list.length],
  )

  // URL sünkroniseerimine: ?class=<id>, ilma navigeerimiseta ja teisi
  // parameetreid kaotamata.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get('class') === active.id) return
    params.set('class', active.id)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    // searchParams/router/pathname identity ei tohi käivitada uut kerimist —
    // see effekt reageerib ainult valitud klassi muutusele.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.id])

  useEffect(() => {
    setAnnouncement(t.classes.selected(pick(active.name, locale)))
  }, [active, t, locale])

  const onRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        next()
        railRefs.current[(index + 1) % list.length]?.focus()
        break
      case 'ArrowLeft':
        event.preventDefault()
        prev()
        railRefs.current[(index - 1 + list.length) % list.length]?.focus()
        break
      case 'Home':
        event.preventDefault()
        goToIndex(0)
        railRefs.current[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        goToIndex(list.length - 1)
        railRefs.current[list.length - 1]?.focus()
        break
      default:
        break
    }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current
    dragStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) next()
    else prev()
  }

  const carVariants = reduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: 1 | -1) => ({
          x: dir * 90,
          opacity: 0,
          scale: 0.96,
          filter: 'blur(6px)',
        }),
        center: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: (dir: 1 | -1) => ({
          x: dir * -90,
          opacity: 0,
          scale: 0.96,
          filter: 'blur(6px)',
        }),
      }

  const copyVariants = reduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (dir: 1 | -1) => ({ x: dir * 24, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: 1 | -1) => ({ x: dir * -24, opacity: 0 }),
      }

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black text-white [clip-path:inset(0)]"
      aria-roledescription="carousel"
      aria-label={t.classes.carouselAria}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/rally-classes/rally-selector-background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/40" />
      </div>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className="shell relative z-10 flex flex-1 flex-col justify-center py-24 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="order-2 lg:order-1 lg:col-span-4">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={active.id}
                custom={direction}
                variants={copyVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduced ? 0.15 : TRANSITION_MS / 1000, ease: EASE }}
              >
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue">
                  {t.classes.eyebrow}
                  <span className="ml-3 text-white/50">
                    {active.series === 'emv' ? t.classes.seriesEmv : t.classes.seriesCup}
                  </span>
                </p>
                <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] sm:text-6xl">
                  {active.shortName}
                </h1>
                <p className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-blue sm:text-3xl">
                  {pick(active.name, locale)}
                </p>
                <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-white/70">
                  {pick(active.description, locale)}
                </p>

                {active.facts.length > 0 ? (
                  <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-6">
                    {active.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                          {t.classes[fact.label]}
                        </dt>
                        <dd className="mt-1 font-mono text-sm text-white">{factValue(fact)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  {active.rulesUrl ? (
                    <a
                      href={active.rulesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center border border-white/40 px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-white"
                    >
                      {t.classes.technicalRules}
                    </a>
                  ) : null}
                  {active.resultsUrl ? (
                    <a
                      href={active.resultsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
                    >
                      {t.classes.results}
                    </a>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="relative order-1 flex touch-pan-y items-center justify-center lg:order-2 lg:col-span-8"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div className="relative aspect-[3/2] w-[92vw] sm:w-[88vw] lg:w-[clamp(620px,60vw,1120px)]">
              {active.imageWebp ? (
                <div
                  aria-hidden="true"
                  className="absolute bottom-[1%] left-1/2 h-[7%] w-[60%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl"
                />
              ) : null}
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={active.id}
                  custom={direction}
                  variants={carVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduced ? 0.15 : TRANSITION_MS / 1000, ease: EASE }}
                  className="absolute inset-0"
                >
                  {active.imageWebp ? (
                    <Image
                      src={active.imageWebp}
                      alt={active.imageAlt ? pick(active.imageAlt, locale) : pick(active.name, locale)}
                      fill
                      priority={index === initialIndex}
                      sizes="(min-width: 1024px) 60vw, 92vw"
                      className="object-contain object-bottom drop-shadow-[0_20px_24px_rgba(0,0,0,0.55)]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5 border border-white/10 bg-white/[0.02]">
                      <span
                        aria-hidden="true"
                        className="bg-checker h-16 w-16 text-white/10 sm:h-20 sm:w-20"
                      />
                      <span className="font-display text-6xl font-bold uppercase leading-none text-white/20 sm:text-7xl">
                        {active.shortName}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
                        {t.classes.photoPending}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={prev}
              className="absolute left-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70 sm:left-4"
              aria-label={t.classes.previousClass}
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70 sm:right-4"
              aria-label={t.classes.nextClass}
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={t.classes.chooseClass}
        onKeyDown={onRailKeyDown}
        className="scrollbar-none relative z-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-4 sm:px-8 lg:justify-center"
      >
        {list.map((item, i) => {
          const isActive = i === index
          return (
            <button
              key={item.id}
              ref={(el) => {
                railRefs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => goToIndex(i)}
              className={`flex min-h-[44px] shrink-0 snap-center items-center border-b-2 px-4 py-2 font-bold uppercase tracking-[0.08em] transition-all ${
                isActive
                  ? 'border-blue text-base text-white sm:text-lg'
                  : 'border-transparent text-sm text-white/50 hover:text-white/80'
              }`}
            >
              {item.shortName}
            </button>
          )
        })}
      </div>
    </section>
  )
}
