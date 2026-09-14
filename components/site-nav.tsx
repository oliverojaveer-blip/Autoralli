'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarBlank,
  CaretDown,
  CarProfile,
  EnvelopeSimple,
  List,
  Newspaper,
  Trophy,
  X,
} from '@phosphor-icons/react/dist/ssr'
import type { IconProps } from '@phosphor-icons/react'
import { useHref, useLocale, useT } from './locale-provider'
import { localizedHref, splitLocale, type Locale } from '@/lib/i18n'

type NavLink = { label: string; href: string; icon: ComponentType<IconProps> }

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
          {i > 0 ? <span className="text-white/25" aria-hidden="true">/</span> : null}
          <Link
            href={localizedHref(o.code, path)}
            hrefLang={o.code}
            lang={o.code}
            aria-label={o.aria}
            aria-current={o.code === locale ? 'true' : undefined}
            className={`flex min-h-[44px] min-w-[28px] items-center justify-center px-1.5 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors ${
              o.code === locale ? 'text-white' : 'text-white/55 hover:text-white'
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
 * Lipulõikega vahekaart: väline element on 19° kaldu (nagu ERC logo
 * ruudud), sisu on tagasi püsti. Aktiivne või hover-olek täidab plaadi
 * meistrivõistluse sinisega — üks kuju, üks aktsent.
 */
function FlagTab({
  link,
  active,
  onClick,
}: {
  link: NavLink
  active: boolean
  onClick?: () => void
}) {
  const href = useHref()
  const Icon = link.icon
  return (
    <Link
      href={href(link.href)}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`group flex h-10 skew-x-[-19deg] items-center border border-white/15 px-4 transition-colors duration-200 ease-forward focus-visible:ring-offset-black ${
        active ? 'border-blue bg-blue text-white' : 'text-white/80 hover:border-blue hover:bg-blue hover:text-white'
      }`}
    >
      <span className="flex skew-x-[19deg] items-center gap-2 whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.1em]">
        <Icon size={15} weight="bold" aria-hidden="true" className="shrink-0" />
        {link.label}
      </span>
    </Link>
  )
}

/**
 * Üks päis kogu saidile, tume nagu ajavõtutabloo. Täislogo igal
 * ekraanil, lipumärk üksi alles alla 320 px (brändiraamat 04/Logo
 * small-screen rule).
 * Põhilingid on lipulõikega vahekaardid, mis jätkavad logo ruudustiku
 * 19° kallet.
 */
export function SiteNav() {
  const t = useT()
  const href = useHref()
  const pathname = usePathname()
  const { path } = splitLocale(pathname ?? '/')
  const LINKS: NavLink[] = [
    { label: t.nav.news, href: '/uudised', icon: Newspaper },
    { label: t.nav.calendar, href: '/kalender', icon: CalendarBlank },
    { label: t.nav.results, href: '/tulemused', icon: Trophy },
    { label: t.nav.classes, href: '/klassid', icon: CarProfile },
    { label: t.nav.contact, href: '/kontakt', icon: EnvelopeSimple },
  ]
  const MORE_LINKS = [
    { label: t.nav.spectators, href: '/pealtvaatajale' },
    { label: t.nav.competitors, href: '/voistlejale' },
    { label: t.nav.organisers, href: '/korraldajale' },
    { label: t.nav.rules, href: '/reeglid' },
  ]
  const isActive = (target: string) => path === target || path.startsWith(`${target}/`)
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
      <nav className="shell flex h-16 items-center justify-between gap-6 sm:h-[72px]">
        <Link
          href={href('/')}
          className="flex shrink-0 items-center focus-visible:ring-offset-black"
          aria-label={t.common.homeAria}
        >
          {/* Täislogo mahub ka telefonile (24 px kõrgusel ~200 px lai);
              lipumärk üksi jääb ainult alla 320 px (brändiraamatu small-screen rule). */}
          <Image
            src="/images/erc-flag-white.png"
            alt="Estonian Rally Championship"
            width={120}
            height={112}
            priority
            className="h-7 w-auto min-[320px]:hidden"
          />
          <Image
            src="/images/erc-logo-white.png"
            alt="Estonian Rally Championship"
            width={340}
            height={40}
            priority
            className="hidden h-6 w-auto min-[320px]:block sm:h-7 lg:h-8"
          />
        </Link>

        <ul className="hidden items-center gap-[3px] pl-2 xl:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <FlagTab link={link} active={isActive(link.href)} />
            </li>
          ))}

          <li ref={moreRef} className="relative ml-2">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className="flex h-10 items-center gap-1.5 px-2 text-[12px] font-bold uppercase tracking-[0.1em] text-white/70 transition-colors hover:text-white focus-visible:ring-offset-black"
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
                className="absolute right-0 top-full mt-3 w-60 border border-white/15 bg-midnight py-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]"
              >
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={href(link.href)}
                    role="menuitem"
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-blue hover:text-white focus-visible:ring-offset-midnight"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </li>
        </ul>

        <div className="hidden items-center gap-5 xl:flex">
          <LanguageSwitch />
          <Link
            href={href('/otse')}
            className="flex h-10 skew-x-[-19deg] items-center bg-blue px-5 transition-colors hover:bg-white hover:text-black focus-visible:ring-offset-black"
          >
            <span className="flex skew-x-[19deg] items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
              </span>
              {t.common.live}
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-white focus-visible:ring-offset-black xl:hidden"
          aria-expanded={open}
          aria-controls="mobiilimenuu"
          aria-label={open ? t.common.closeMenu : t.common.openMenu}
        >
          {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </nav>

      {open ? (
        <div id="mobiilimenuu" className="border-t border-white/10 bg-black xl:hidden">
          <ul className="shell flex flex-col gap-[3px] py-4">
            {LINKS.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <li key={link.href} className="pl-3">
                  <Link
                    href={href(link.href)}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[52px] skew-x-[-19deg] items-center border border-white/15 px-5 focus-visible:ring-offset-black ${
                      active ? 'border-blue bg-blue' : ''
                    }`}
                  >
                    <span className="flex skew-x-[19deg] items-center gap-3 font-display text-xl font-bold uppercase tracking-[0.04em]">
                      <Icon size={20} weight="bold" aria-hidden="true" />
                      {link.label}
                    </span>
                  </Link>
                </li>
              )
            })}

            <li className="mt-4 border-t border-white/10 pt-3">
              <span className="block py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {t.common.more}
              </span>
            </li>
            {MORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={href(link.href)}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-bold uppercase tracking-[0.04em] text-white/85 focus-visible:ring-offset-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="py-3 pl-3">
              <Link
                href={href('/otse')}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] skew-x-[-19deg] items-center justify-center bg-blue px-4 focus-visible:ring-offset-black"
              >
                <span className="skew-x-[19deg] text-sm font-bold uppercase tracking-[0.1em] text-white">
                  {t.common.live}
                </span>
              </Link>
            </li>
            <li className="border-t border-white/10 py-3">
              <LanguageSwitch />
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}
