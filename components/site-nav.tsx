'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CaretDown, List, X } from '@phosphor-icons/react/dist/ssr'

const LINKS = [
  { label: 'Uudised', href: '/uudised' },
  { label: 'Kalender', href: '/kalender' },
  { label: 'Tulemused', href: '/tulemused' },
  { label: 'Võistlusklassid', href: '/klassid' },
  { label: 'Kontakt', href: '/kontakt' },
]

const MORE_LINKS = [
  { label: 'Pealtvaatajale', href: '/pealtvaatajale' },
  { label: 'Võistlejale', href: '/voistlejale' },
  { label: 'Korraldajale', href: '/korraldajale' },
  { label: 'Reeglid', href: '/reeglid' },
]

/**
 * Brändiraamat 04/Logo: täislogo juhib desktopil, lipumärk üksi mobiilis.
 * Alla 260 px laiuse täisnime asemel tuleb kasutada lipumärki (small-screen rule).
 */
export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!moreOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [moreOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <nav className="shell flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Autoralli.ee avaleht — Estonian Rally Championship"
        >
          <Image
            src="/images/erc-logo-color.png"
            alt="Estonian Rally Championship"
            width={340}
            height={40}
            priority
            className="h-6 w-auto sm:h-8 lg:h-9"
          />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate transition-colors hover:text-black"
            >
              Veel
              <CaretDown
                size={12}
                weight="bold"
                className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {moreOpen ? (
              <div
                role="menu"
                aria-label="Veel"
                className="absolute right-0 top-full mt-3 w-56 border border-line bg-white py-2 shadow-lg"
              >
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-mist hover:text-blue"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        </ul>

        <Link
          href="/tulemused"
          className="hidden items-center bg-blue px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90 lg:inline-flex"
        >
          Otsetulemused
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-black lg:hidden"
          aria-expanded={open}
          aria-controls="mobiilimenuu"
          aria-label={open ? 'Sulge menüü' : 'Ava menüü'}
        >
          {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </nav>

      {open ? (
        <div id="mobiilimenuu" className="border-t border-line bg-white lg:hidden">
          <ul className="shell flex flex-col py-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-bold uppercase tracking-[0.04em] text-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="mt-2 border-t border-line pt-2">
              <span className="block py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
                Veel
              </span>
            </li>
            {MORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-bold uppercase tracking-[0.04em] text-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="py-3">
              <Link
                href="/tulemused"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center bg-blue px-4 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white"
              >
                Otsetulemused
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}
