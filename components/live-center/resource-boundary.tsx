import type { ReactNode } from 'react'
import type { RallyLynxResourceState } from './use-rallylynx-resource'

const MESSAGE: Record<'loading' | 'unconfigured', string> = {
  loading: 'Laadin andmeid…',
  unconfigured: 'Otsetulemuste liides ei ole hetkel seadistatud.',
}

/**
 * Ühine "laadin / seadistamata / viga / valmis" seisundite kuvamine, et iga
 * Live Center'i vahekaart ei peaks seda ise kordama.
 */
export function ResourceBoundary<T>({
  state,
  children,
}: {
  state: RallyLynxResourceState<T>
  children: (data: T) => ReactNode
}) {
  if (state.kind === 'ready') return <>{children(state.data)}</>

  const message = state.kind === 'error' ? state.message : MESSAGE[state.kind]

  return (
    <div className="rounded-md border border-line bg-gradient-to-b from-white to-mist px-6 py-16 text-center">
      <p className="text-sm font-semibold text-slate">{message}</p>
    </div>
  )
}
