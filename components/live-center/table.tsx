'use client'

import type { ReactNode } from 'react'
import type { ResultStatus } from '@/lib/rallylynx/adapter'
import { useLocale, useT } from '../locale-provider'
import { formatDuration, formatGap, formatUpdatedAt } from './format'

/**
 * Ühine tabelikeel kõigile Live Centeri vaadetele: lame, hairline,
 * nurgaraadiuseta "ajavõtuleht" — sama grammatika, mis avalehe
 * punktiseisul. Liidri rida kannab 3 px sinist vasakserva, mitte
 * gradienti; sinine on aktsent, mitte iga vahe värv.
 */
export const TABLE_WRAP = 'hidden overflow-x-auto border-y border-line sm:block'
export const TABLE = 'w-full border-collapse text-sm'
export const THEAD_ROW = 'border-b border-line bg-mist text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-slate'
export const TH = 'px-3 py-2.5'
export const ROW = 'border-b border-line last:border-0'
export const LEADER_ROW = 'border-b border-line last:border-0 shadow-[inset_3px_0_0_0_#0D71B8] bg-blue/[0.04]'
export const TD = 'px-3 py-2.5'
export const POS = 'font-display text-xl font-bold leading-none text-black tnum'
export const NUM = 'font-mono text-[13px] text-slate'
export const TIME = 'text-right font-mono tabular-nums text-black'
export const GAP = 'text-right font-mono tabular-nums text-slate'
export const MOBILE_LIST = 'flex flex-col divide-y divide-line border-y border-line sm:hidden'

export function rowClass(position: number | null) {
  return position === 1 ? LEADER_ROW : ROW
}

/** Staatuse märk: ruuduline moodul + silt, mitte nupp, mida ei saa vajutada. */
export function StatusMarker({ status, onDark = false }: { status: ResultStatus; onDark?: boolean }) {
  const t = useT()
  const tone =
    status === 'official'
      ? onDark
        ? 'text-white'
        : 'text-success'
      : status === 'amended'
        ? 'text-caution'
        : onDark
          ? 'text-white/70'
          : 'text-slate'
  return (
    <span className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] ${tone}`}>
      <span className="bg-checker h-3 w-3" aria-hidden="true" />
      {t.live.status[status]}
    </span>
  )
}

/**
 * Iga vaate päis: pealkiri, selle all rida allika, uuendusaja ja
 * staatusega (claude.md: tulemuse juures peab olema allikas ja viimase
 * uuenduse aeg) — mitte silt pealkirja kohal. Allikas on vaate oma:
 * ajavõtuvaated ütlevad RallyLynx, blogi ütleb kaasautorid.
 */
export function TabHeader({
  title,
  detail,
  source,
  updatedAt,
  status,
  note,
}: {
  title: ReactNode
  detail?: ReactNode
  /** Andmete allikas selle vaate jaoks (nt "allikas RallyLynx"); ilma selleta allikat ei näidata. */
  source?: string
  updatedAt?: string | null
  status?: ResultStatus
  note?: ReactNode
}) {
  const t = useT()
  const locale = useLocale()
  return (
    <div className="mb-4">
      <h3 className="font-display text-2xl font-bold uppercase leading-none text-black">{title}</h3>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate">
        {detail ? <span>{detail}</span> : null}
        {source ? <span>{source}</span> : null}
        {updatedAt !== undefined ? (
          <span>
            {t.live.updated} <span className="tnum">{formatUpdatedAt(updatedAt, locale)}</span>
          </span>
        ) : null}
        {status ? <StatusMarker status={status} /> : null}
      </p>
      {note ? <p className="mt-1.5 text-[12px] text-slate">{note}</p> : null}
    </div>
  )
}

/**
 * Telefoni tulemuserida (üldarvestus ja katseajad): koht · ekipaaž · aeg,
 * vahe on loetavaim number — see, mida raja ääres vaadatakse. ~64 px rea
 * kohta, mitte 140 px kaart.
 */
export function ResultRowMobile({
  position,
  number,
  driver,
  coDriver,
  vehicle,
  timeMs,
  timeLabel,
  gapMs,
}: {
  position: number | null
  number: string
  driver: string
  coDriver: string
  vehicle: string
  timeMs: number | null
  /** Aja asemel näidatav silt (nt "katsel"). */
  timeLabel?: string | null
  gapMs: number | null
}) {
  const leader = position === 1
  return (
    <li className={`grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-2.5 ${leader ? 'shadow-[inset_3px_0_0_0_#0D71B8] bg-blue/[0.04] pl-2' : ''}`}>
      <span className={POS}>{position ?? '—'}</span>
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-semibold leading-tight text-black">
          <span className="mr-1.5 font-mono text-[12px] font-normal text-slate">#{number}</span>
          {driver}
        </span>
        <span className="block truncate text-[12px] text-slate">
          {coDriver} · {vehicle}
        </span>
      </span>
      <span className="text-right">
        <span className="block font-mono text-[15px] font-semibold tabular-nums leading-tight text-black">
          {timeLabel ?? (timeMs !== null ? formatDuration(timeMs) : '—')}
        </span>
        <span className={`block font-mono text-[13px] font-bold tabular-nums ${leader ? 'text-blue' : 'text-slate'}`}>
          {formatGap(gapMs)}
        </span>
      </span>
    </li>
  )
}
