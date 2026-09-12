'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { getDictionary } from '@/lib/i18n'
import { useLiveCountdown } from './use-live-countdown'
import { Dial } from './dial'
import type { LiveCountdownProps } from './types'

const FINAL_STRETCH_MS = 10_000

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

/**
 * Otseülekande loendur Live Centeri jaoks. Ajaloogika (`useLiveCountdown`)
 * on esitlusest lahus. Üks korduvkasutatav `Dial`, mitte neli eraldi
 * komponenti. Sihtaeg, staatus ja YouTube ID tulevad väljastpoolt (lehe
 * andmetest / tulevikus CMS-ist) — ühtki konkreetset ralli pole siia kõvasti
 * kirjutatud.
 */
export function LiveCountdown({
  eventName,
  targetTime,
  status,
  youtubeVideoId,
  locale,
  bare = false,
  showHeader = true,
  units = ['days', 'hours', 'minutes', 'seconds'],
  size = 'default',
}: LiveCountdownProps) {
  const reducedMotionRaw = useReducedMotion()
  const reducedMotion = reducedMotionRaw ?? false
  const dict = getDictionary(locale).liveCountdown
  const parts = useLiveCountdown(targetTime)

  const [announcement, setAnnouncement] = useState('')
  const prevPhaseRef = useRef<string | null>(null)

  const localTimerHitZero = parts?.isValid && parts.isZero
  const phase: 'scheduled' | 'starting-soon' | 'live' | 'ended' =
    status === 'live'
      ? 'live'
      : status === 'ended'
        ? 'ended'
        : status === 'starting-soon' || localTimerHitZero
          ? 'starting-soon'
          : 'scheduled'

  useEffect(() => {
    if (prevPhaseRef.current === phase) return
    prevPhaseRef.current = phase
    if (phase === 'starting-soon') setAnnouncement(dict.announceStartingSoon)
    if (phase === 'live') setAnnouncement(dict.announceLive)
  }, [phase, dict])

  const showSeconds = units.includes('seconds')
  const showMinutes = units.includes('minutes')
  const showHours = units.includes('hours')
  // Enne mount'i (parts === null) eeldame, et päevi on — nii ei "hüppa"
  // paigutus 4 rattalt 3-le kohe pärast laadimist enamiku juhtude jaoks
  // (sihtajad on tavaliselt rohkem kui 24h kaugusel, kui loendur avaneb).
  const showDays = units.includes('days') && (parts ? parts.days > 0 : true)

  const displayDays = parts?.days ?? 0
  const displayHours = parts?.hours ?? 0
  const displayMinutes = parts?.minutes ?? 0
  const displaySeconds = parts?.seconds ?? 0

  const totalMs = parts?.totalMs ?? 0
  const totalSecFloat = totalMs / 1000
  const daysProgress = 1 - (displayDays % 60) / 60
  const hoursProgress = 1 - ((totalSecFloat / 3600) % 24) / 24
  const minutesProgress = 1 - ((totalSecFloat / 60) % 60) / 60
  const secondsProgress = 1 - (totalSecFloat % 60) / 60
  const emphasizeSeconds = phase === 'scheduled' && totalMs > 0 && totalMs <= FINAL_STRETCH_MS

  const timerLabel = parts?.isValid
    ? dict.remainingTimeLabel(displayDays, displayHours, displayMinutes, displaySeconds)
    : undefined

  const Wrapper = bare ? 'div' : 'section'

  return (
    <Wrapper
      className={
        bare
          ? 'relative text-white'
          : 'relative overflow-hidden rounded-[28px] border border-white/15 bg-black/70 px-4 py-8 text-white backdrop-blur sm:px-10 sm:py-10'
      }
      aria-label={eventName}
    >
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {phase === 'scheduled' ? (
        <div role="timer" aria-label={timerLabel}>
          {showHeader ? (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
                {dict.nextLiveBroadcast}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
                {eventName}
              </h2>
            </div>
          ) : null}

          <span className="sr-only">{timerLabel}</span>

          <div
            aria-hidden="true"
            className={`flex flex-wrap items-start justify-center gap-x-2 gap-y-4 sm:flex-nowrap sm:gap-x-6 lg:gap-x-8 ${
              showHeader ? 'mt-8 sm:mt-10' : ''
            }`}
          >
            {units.includes('days') ? (
              <div
                className={`inline-flex shrink-0 overflow-hidden transition-all duration-500 ease-forward ${
                  showDays ? 'max-w-[220px] opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                <Dial
                  value={displayDays}
                  progress={daysProgress}
                  label={dict.days}
                  reducedMotion={reducedMotion}
                  minDigits={displayDays >= 100 ? 3 : 2}
                  size={size}
                />
              </div>
            ) : null}
            {showHours ? (
              <Dial
                value={displayHours}
                progress={hoursProgress}
                label={dict.hours}
                reducedMotion={reducedMotion}
                size={size}
              />
            ) : null}
            {showMinutes ? (
              <Dial
                value={displayMinutes}
                progress={minutesProgress}
                label={dict.minutes}
                reducedMotion={reducedMotion}
                size={size}
              />
            ) : null}
            {showSeconds ? (
              <Dial
                value={displaySeconds}
                progress={secondsProgress}
                label={dict.seconds}
                reducedMotion={reducedMotion}
                emphasize={emphasizeSeconds}
                size={size}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {phase === 'starting-soon' ? (
        <div role="status" className="flex flex-col items-center gap-4 py-6 text-center">
          <span
            className={`h-3 w-3 rounded-full bg-blue ${reducedMotion ? '' : 'animate-pulse'}`}
            aria-hidden="true"
          />
          <p className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            {dict.startingSoon}
          </p>
          <p className="text-sm text-white/60">{eventName}</p>
        </div>
      ) : null}

      {phase === 'live' ? (
        <div role="status" className="flex flex-col gap-5">
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-live" aria-hidden="true" />
            <p className="font-display text-2xl font-bold uppercase tracking-wide text-live sm:text-3xl">
              {dict.liveNow}
            </p>
          </div>
          {youtubeVideoId ? (
            <YouTubeEmbed videoId={youtubeVideoId} title={eventName} />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center border border-white/15 bg-white/[0.03] text-sm text-white/60">
              {dict.noStream}
            </div>
          )}
        </div>
      ) : null}

      {phase === 'ended' ? (
        <div role="status" className="flex flex-col gap-5">
          <p className="text-center font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {youtubeVideoId ? dict.watchReplay : eventName}
          </p>
          {youtubeVideoId ? (
            <YouTubeEmbed videoId={youtubeVideoId} title={eventName} />
          ) : (
            <p className="text-center text-sm text-white/60">{dict.noReplay}</p>
          )}
        </div>
      ) : null}
    </Wrapper>
  )
}
