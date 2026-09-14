'use client'

import Image from 'next/image'
import type { RallyClassificationView } from '@/lib/rallylynx/adapter'
import type { RallyEvent } from '@/lib/events'
import { formatDateRange } from '@/lib/dates'
import { pick } from '@/lib/i18n'
import { useLocale, useT } from '../locale-provider'
import { useLiveSelection } from './live-selection'
import { useRallyLynxResource } from './use-rallylynx-resource'
import { formatUpdatedAt } from './format'
import { StatusMarker } from './table'

/**
 * Võistluse riba — sama kuju, mis avalehe ringiribal (embleem · R5 ·
 * kuupäev · nimi), aga loenduri kohal on STAATUS: punane LIVE käimasoleva
 * katsega, või "Lõppenud · ametlik · uuendatud hh:mm". Foto asemel tekst:
 * 3G peal jõuab tulemuste JSON kohale enne, kui pilt oleks jõudnud.
 *
 * `calendarEvent` on hooajakalendri kirje; selle embleemi ja kuupäevi
 * näidatakse ainult siis, kui RallyLynxi hetke-võistlus on seesama (nimi
 * klapib) — muidu jääb riba ainult RallyLynxi nime juurde.
 */
export function LiveEventBar({
  calendarEvent,
  roundNumber,
  fallbackName,
}: {
  calendarEvent: RallyEvent
  roundNumber: number
  fallbackName: string
}) {
  const t = useT()
  const locale = useLocale()
  const { event, stages, pollMs } = useLiveSelection()
  const overall = useRallyLynxResource<RallyClassificationView>('/api/rallylynx/classification', {
    pollMs: pollMs(30_000),
  })

  const liveName = event.kind === 'ready' ? event.data.eventName : null
  const name = liveName ?? fallbackName
  const matchesCalendar = !liveName || liveName === calendarEvent.name
  const status = event.kind === 'ready' ? event.data.status : null
  const classification = overall.kind === 'ready' ? overall.data : null
  const stageList = stages.kind === 'ready' ? stages.data : []
  const runningStage =
    classification && stageList.length > 0
      ? stageList[Math.min(classification.completedStageCount, stageList.length - 1)]
      : null

  return (
    <section aria-label={t.live.eventBarAria} className="border-b border-white/10 bg-midnight text-white">
      <div className="shell flex min-h-[64px] items-stretch justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3 py-2 sm:gap-4">
          {matchesCalendar && calendarEvent.logo ? (
            <Image
              src={calendarEvent.logo.src}
              alt={calendarEvent.logo.alt}
              width={calendarEvent.logo.width}
              height={calendarEvent.logo.height}
              className="hidden h-8 w-auto max-w-[96px] shrink-0 object-contain sm:block sm:h-9"
            />
          ) : null}
          <div className="flex min-w-0 flex-col gap-y-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
            {matchesCalendar ? (
              <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65 sm:text-[12px]">
                {t.home.round}
                {roundNumber}
                <span className="mx-2 text-white/30" aria-hidden="true">
                  |
                </span>
                {formatDateRange(calendarEvent.startsAt, calendarEvent.endsAt, locale)}
              </span>
            ) : null}
            <h1 className="line-clamp-2 font-display text-xl font-bold uppercase leading-none tracking-[0.02em] sm:text-2xl">
              {name}
            </h1>
            {matchesCalendar ? (
              <span className="hidden text-[12px] text-white/60 md:inline">{pick(calendarEvent.location, locale)}</span>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-stretch border-l border-white/10 pl-3 sm:pl-6">
          {status === 'live' ? (
            <span className="flex items-center gap-3">
              <span className="flex skew-x-[-19deg] items-center bg-live px-3 py-1.5">
                <span className="flex skew-x-[19deg] items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em]">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  {t.common.live}
                </span>
              </span>
              {runningStage ? (
                <span className="font-display text-2xl font-bold leading-none tnum">{runningStage.code}</span>
              ) : null}
            </span>
          ) : status === 'finished' ? (
            <span className="flex flex-col items-end gap-1 text-right">
              <span className="font-display text-lg font-bold uppercase leading-none sm:text-xl">{t.live.finished}</span>
              <span className="flex flex-wrap items-center justify-end gap-x-3 text-[11px] text-white/65">
                {classification ? <StatusMarker status={classification.status} onDark /> : null}
                {classification?.updatedAt ? (
                  <span className="hidden sm:inline">
                    {t.live.updated} <span className="tnum">{formatUpdatedAt(classification.updatedAt, locale)}</span>
                  </span>
                ) : null}
              </span>
            </span>
          ) : status === 'scheduled' ? (
            <span className="font-display text-lg font-bold uppercase leading-none sm:text-xl">{t.live.scheduled}</span>
          ) : (
            <span className="text-[12px] text-white/50">{t.common.loading}</span>
          )}
        </div>
      </div>
    </section>
  )
}
