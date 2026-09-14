'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CaretDown, List, X } from '@phosphor-icons/react/dist/ssr'
import { useHref, useLocale, useT } from './locale-provider'
import { localizedHref, splitLocale, type Locale } from '@/lib/i18n'

/** ET | EN lüliti: viib sama lehe teise keelde. */
function LanguageSwitch({ className = '' }: { className?: string }) {
  const locale = useLocale()
  const t = useT()
  const pathname = usePathname()
  const { path } = splitLocale(pathname ?? '/')
  const options: Array<{ code: Locale; label: string; aria: string }> = [
    { code: 'et', label: 'ET', aria: t.common.switchToEt },
    { code: 'en', label: 'EN', aria: t.common.switchToEn },
  ]

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={t.common.language}>
      {options.map((o, i) => (
        <span key={o.code} className="flex items-center gap-1">
          {i > 0 ? <span className="text-line" aria-hidden="true">/</span> : null}
          <Link
            href={localizedHref(o.code, path)}
            hrefLang={o.code}
            lang={o.code}
            aria-label={o.aria}
            aria-current={o.code === locale ? 'true' : undefined}
            className={`px-1 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors ${
              o.code === locale ? 'text-black' : 'text-slate hover:text-black'
            }`}
          >
            {o.label}
          </Link>
        </span>
      ))}
    </div>
  )
}

/**
 * Brändiraamat 04/Logo: täislogo juhib desktopil, lipumärk üksi mobiilis.
 * Alla 260 px laiuse täisnime asemel tuleb kasutada lipumärki (small-screen rule).
 */
export function SiteNav() {
  const t = useT()
  const href = useHref()
  const LINKS = [
    { label: t.nav.news, href: '/uudised' },
    { label: t.nav.calendar, href: '/kalender' },
    { label: t.nav.results, href: '/tulemused' },
    { label: t.nav.classes, href: '/klassid' },
    { label: t.nav.contact, href: '/kontakt' },
  ]
  const MORE_LINKS = [
    { label: t.nav.spectators, href: '/pealtvaatajale' },
    { label: t.nav.competitors, href: '/voistlejale' },
    { label: t.nav.organisers, href: '/korraldajale' },
    { label: t.nav.rules, href: '/reeglid' },
  ]
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
          href={href('/')}
          className="flex shrink-0 items-center"
          aria-label={t.common.homeAria}
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
                href={href(link.href)}
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
              {t.common.more}
              <CaretDown
                size={12}
                weight="bold"
                className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {moreOpen ? (
              <div
                role="menu"
                aria-label={t.common.more}
                className="absolute right-0 top-full mt-3 w-56 border border-line bg-white py-2 shadow-lg"
              >
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={href(link.href)}
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

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSwitch />
          <Link
            href={href('/otse')}
            className="inline-flex items-center bg-blue px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
          >
            {t.common.live}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-black lg:hidden"
          aria-expanded={open}
          aria-controls="mobiilimenuu"
          aria-label={open ? t.common.closeMenu : t.common.openMenu}
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
                  href={href(link.href)}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-bold uppercase tracking-[0.04em] text-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="mt-2 border-t border-line pt-2">
              <span className="block py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
                {t.common.more}
              </span>
            </li>
            {MORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={href(link.href)}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-bold uppercase tracking-[0.04em] text-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="py-3">
              <Link
                href={href('/otse')}
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center bg-blue px-4 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white"
              >
                {t.common.live}
              </Link>
            </li>
            <li className="border-t border-line py-3">
              <LanguageSwitch />
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}
