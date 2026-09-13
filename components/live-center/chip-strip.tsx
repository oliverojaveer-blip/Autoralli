import type { ReactNode } from 'react'

/**
 * Horisontaalselt keritav "slider" valikuriba (sarja/etapi/vahekaardi
 * valimiseks). Mobiilis on see palju lihtsamini kasutatav kui rea
 * murdmine (flex-wrap) — sõrmega lohistades näeb kõiki valikuid ilma
 * lehte pikemaks muutmata.
 *
 * Peidab kerimisriba visuaalselt, kuid jätab klaviatuuri/lugejaga
 * kerimise toimima (`overflow-x-auto` + `tabIndex` säilib nuppudel).
 */
export function ChipStrip({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  )
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-[44px] shrink-0 snap-start whitespace-nowrap rounded-md border bg-gradient-to-b px-4 py-2.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
        active
          ? 'border-blue from-blue/[0.04] to-blue/[0.18] text-blue'
          : 'border-transparent from-transparent to-transparent text-slate hover:from-white hover:to-mist hover:text-black [[aria-selected=true]+&]:border-line/70 [&:has(+[aria-selected=true])]:border-line/70'
      }`}
    >
      {children}
    </button>
  )
}
