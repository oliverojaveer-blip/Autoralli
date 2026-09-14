'use client'

import { createContext, useContext, useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'

type StripRole = 'tablist' | 'radiogroup'
type Tone = 'light' | 'dark'

const StripContext = createContext<{ role: StripRole; tone: Tone }>({ role: 'radiogroup', tone: 'light' })

/**
 * Horisontaalselt keritav valikuriba lipulõikega plaatidest — sama kuju,
 * mis päise vahekaartidel ja avalehe kiirlinkidel.
 *
 * - `role="tablist"` ainult päris vaadete jaoks (paneelid `aria-controls`
 *   kaudu); sarja/katse valik on `radiogroup`.
 * - Klaviatuur: nooled / Home / End liigutavad fookust ja valivad (roving
 *   tabindex), nii et Tab-klahv ei pea 40 plaadist läbi käima.
 * - Aktiivne plaat keritakse vaatesse; parem serv hajub, et kerimine oleks
 *   nähtav (ühtib avalehe kiirlinkide ribaga).
 */
export function ChipStrip({
  children,
  ariaLabel,
  role = 'radiogroup',
  tone = 'light',
  className = '',
}: {
  children: ReactNode
  ariaLabel: string
  role?: StripRole
  tone?: Tone
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    const strip = ref.current
    if (!strip) return
    const buttons = Array.from(strip.querySelectorAll<HTMLButtonElement>('button:not([disabled])'))
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (current === -1) return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? buttons.length - 1
          : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length
    buttons[next].focus()
    buttons[next].click()
  }

  return (
    <StripContext.Provider value={{ role, tone }}>
      <div
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className={`scrollbar-none relative flex gap-[3px] overflow-x-auto px-1 py-1 [mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)] ${className}`}
      >
        {children}
      </div>
    </StripContext.Provider>
  )
}

export function Chip({
  active,
  onClick,
  children,
  id,
  controls,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  /** Vahekaardi ID (`tablist` korral), millele paneel `aria-labelledby`-ga viitab. */
  id?: string
  /** Paneeli ID (`tablist` korral). */
  controls?: string
}) {
  const { role, tone } = useContext(StripContext)
  const ref = useRef<HTMLButtonElement>(null)
  const isTab = role === 'tablist'

  // Ainult horisontaalne kerimine (`scrollLeft`), mitte scrollIntoView —
  // see keriks laadimisel ka kogu lehe riba juurde.
  useEffect(() => {
    const el = ref.current
    const strip = el?.parentElement
    if (!active || !el || !strip) return
    const left = el.offsetLeft - 12
    const right = el.offsetLeft + el.offsetWidth + 40
    if (left < strip.scrollLeft) strip.scrollLeft = left
    else if (right > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = right - strip.clientWidth
  }, [active])

  const inactive =
    tone === 'dark'
      ? 'border-white/15 text-white/80 hover:border-blue hover:bg-blue hover:text-white'
      : 'border-line text-slate hover:border-blue hover:text-blue'

  return (
    <button
      ref={ref}
      type="button"
      id={id}
      role={isTab ? 'tab' : 'radio'}
      aria-selected={isTab ? active : undefined}
      aria-checked={isTab ? undefined : active}
      aria-controls={isTab ? controls : undefined}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={`flex min-h-[44px] shrink-0 skew-x-[-19deg] items-center border px-4 transition-colors duration-200 ease-forward focus-visible:ring-offset-2 ${
        tone === 'dark' ? 'focus-visible:ring-offset-midnight' : 'focus-visible:ring-offset-white'
      } ${active ? 'border-blue bg-blue text-white' : inactive}`}
    >
      <span className="block skew-x-[19deg] whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.08em]">
        {children}
      </span>
    </button>
  )
}
