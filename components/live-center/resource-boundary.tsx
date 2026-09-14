'use client'

import type { ReactNode } from 'react'
import { ArrowClockwise } from '@phosphor-icons/react/dist/ssr'
import type { RallyLynxResourceState } from './use-rallylynx-resource'
import { useLocale, useT } from '../locale-provider'
import { formatUpdatedAt } from './format'

export const EMPTY_BOX = 'border border-line bg-mist px-6 py-14 text-center text-sm font-semibold text-slate'

/**
 * Ühine "laadin / seadistamata / viga / valmis / vananenud" seisundite kuva,
 * et iga vahekaart ei peaks seda ise kordama. Viga on `role="alert"`, nii
 * et lugeja kuuleb seda; vananenud seis jätab tabeli alles ja lisab ainult
 * rea "ühendus katkes · näitan hh:mm seisu · proovi uuesti".
 */
export function ResourceBoundary<T>({
  state,
  children,
}: {
  state: RallyLynxResourceState<T> & { reload?: () => void }
  children: (data: T) => ReactNode
}) {
  const t = useT()
  const locale = useLocale()

  if (state.kind === 'ready') {
    return (
      <>
        {state.stale ? (
          <p
            role="status"
            className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-l-[3px] border-caution bg-mist px-4 py-2.5 text-[13px] text-black"
          >
            <span className="font-semibold">{t.live.connectionLost}</span>
            <span className="text-slate">
              {t.live.showingStateFrom} {formatUpdatedAt(new Date(state.fetchedAt).toISOString(), locale)}
            </span>
            {state.reload ? (
              <button
                type="button"
                onClick={state.reload}
                className="inline-flex min-h-[32px] items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-blue hover:text-black"
              >
                <ArrowClockwise size={14} weight="bold" aria-hidden="true" />
                {t.live.retry}
              </button>
            ) : null}
          </p>
        ) : null}
        {children(state.data)}
      </>
    )
  }

  if (state.kind === 'loading') {
    return (
      <div className={EMPTY_BOX} aria-busy="true">
        {t.common.loading}
      </div>
    )
  }

  if (state.kind === 'unconfigured') {
    return <div className={EMPTY_BOX}>{t.live.unconfigured}</div>
  }

  return (
    <div role="alert" className="border border-line bg-mist px-6 py-14 text-center">
      <p className="text-sm font-semibold text-black">
        {state.error === 'server' ? t.live.errorServer(state.status ?? 0) : t.live.errorNetwork}
      </p>
      {state.reload ? (
        <button
          type="button"
          onClick={state.reload}
          className="mt-4 inline-flex min-h-[44px] skew-x-[-19deg] items-center border border-blue bg-blue px-5 text-white transition-colors hover:bg-black"
        >
          <span className="flex skew-x-[19deg] items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em]">
            <ArrowClockwise size={14} weight="bold" aria-hidden="true" />
            {t.live.retry}
          </span>
        </button>
      ) : null}
    </div>
  )
}
