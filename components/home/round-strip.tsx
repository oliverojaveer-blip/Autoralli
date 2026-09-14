'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Broadcast, CaretRight } from '@phosphor-icons/react/dist/ssr'
import { useCountdown } from '@/components/use-countdown'
import { useHref, useLocale, useT } from '@/components/locale-provider'
import { formatDateRange } from '@/lib/dates'
import { pick } from '@/lib/i18n'
import type { RallyEvent } from '@/lib/events'

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

/**
 * Ringiriba nagu F1.com-i päise all: R6 · kuupäev · ralli nimi · loendur.
 * Päevade arv tuleb serverist (`initialDays`), nii et ka ilma JS-ita ja
 * enne hüdratsiooni on riba kõige olulisem number olemas; tunnid-minutid-
 * sekundid hakkavad jooksma kliendis. Loendur ise on link otseülekandele.
 */
export function RoundStrip({
  event,
  roundNumber,
  initialDays,
}: {
  event: RallyEvent
  roundNumber: number
  initialDays: number
}) {
  const t = useT()
  const locale = useLocale()
  const href = useHref()
  const left = useCountdown(event.startsAt)
  const started = left !== null && left.days + left.hours + left.minutes + left.seconds === 0

  const cells: Array<{ value: string; unit: string; unitLong: string }> = [
    { value: pad(left ? left.days : initialDays), unit: t.home.countdownDays, unitLong: t.home.countdownDaysLong },
    { value: left ? pad(left.hours) : '--', unit: t.home.countdownHours, unitLong: t.home.countdownHoursLong },
    { value: left ? pad(left.minutes) : '--', unit: t.home.countdownMinutes, unitLong: t.home.countdownMinutesLong },
    { value: left ? pad(left.seconds) : '--', unit: t.home.countdownSeconds, unitLong: t.home.countdownSecondsLong },
  ]

  return (
    <section
      aria-label={t.home.roundStripAria}
      className="border-b border-white/10 bg-midnight text-white"
    >
      <div className="shell flex min-h-[56px] items-stretch justify-between gap-3 sm:gap-4">
        <Link
          href={href('/kalender')}
          className="group flex min-w-0 items-center gap-3 py-2 focus-visible:ring-offset-midnight sm:gap-4"
        >
          {event.logo ? (
            <Image
              src={event.logo.src}
              alt={event.logo.alt}
              width={event.logo.width}
              height={event.logo.height}
              className="hidden h-8 w-auto max-w-[96px] shrink-0 object-contain sm:block sm:h-9"
            />
          ) : (
            <Image
              src="/images/erc-flag-color.png"
              alt=""
              width={560}
              height={476}
              className="hidden h-6 w-auto shrink-0 sm:block"
            />
          )}
          <span className="flex min-w-0 flex-col gap-y-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
            <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65 sm:text-[12px]">
              {t.home.round}
              {roundNumber}
              <span className="mx-2 text-white/30" aria-hidden="true">
                |
              </span>
              {formatDateRange(event.startsAt, event.endsAt, locale)}
            </span>
            <span className="flex min-w-0 items-center gap-1 font-display text-lg font-bold uppercase leading-none tracking-[0.02em] sm:text-xl">
              <span className="line-clamp-2">{event.name}</span>
              <CaretRight
                size={14}
                weight="bold"
                className="shrink-0 text-blue transition-transform duration-200 ease-forward group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
            <span className="hidden text-[12px] text-white/60 md:inline">{pick(event.location, locale)}</span>
          </span>
        </Link>

        {started ? (
          <Link
            href={href('/otse')}
            className="flex shrink-0 items-center gap-2 self-center bg-live px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] focus-visible:ring-offset-midnight"
          >
            <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
            {t.home.ongoing}
          </Link>
        ) : (
          <Link
            href={href('/otse')}
            aria-label={`${t.home.countdownAria}: ${event.name}. ${t.common.live}`}
            className="group/timer -mr-5 flex shrink-0 items-center gap-3 self-stretch bg-blue pl-6 pr-5 text-white transition-colors hover:bg-white hover:text-black focus-visible:ring-offset-midnight sm:-mr-8 sm:gap-5 sm:pl-8 sm:pr-8 [clip-path:polygon(16px_0,100%_0,100%_100%,0_100%)] sm:[clip-path:polygon(20px_0,100%_0,100%_100%,0_100%)]"
          >
            <span role="timer" className="flex items-center gap-1.5 sm:gap-3">
              {cells.map((cell) => (
                <span key={cell.unit} className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold leading-none tnum sm:text-[28px]">{cell.value}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-75 sm:text-[11px]">
                    <span className="sm:hidden">{cell.unit}</span>
                    <span className="hidden sm:inline">{cell.unitLong}</span>
                  </span>
                </span>
              ))}
            </span>
            <span className="hidden items-center gap-1.5 border-l border-white/30 pl-4 text-[12px] font-bold uppercase tracking-[0.1em] group-hover/timer:border-black/20 md:flex">
              <Broadcast size={15} weight="bold" aria-hidden="true" />
              {t.common.live}
            </span>
          </Link>
        )}
      </div>
    </section>
  )
}
