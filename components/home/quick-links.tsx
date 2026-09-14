import Image from 'next/image'
import Link from 'next/link'
import { getDictionary, localizedHref, type Locale } from '@/lib/i18n'

/**
 * Kiirlingid nagu F1.com-i "News · Videos · Live Timing" rida, aga sama
 * lipulõikega kujus kui päise vahekaardid — avalehel on üks interaktiivne
 * kuju. Iga plaadi ees on ERC lipumärk (valge sinisel, värviline mustal).
 * "Uus rallis?" on teisel kohal, et see ka telefonis kohe paistaks; rea
 * parem serv hajub, et kerimine oleks nähtav.
 */
export function QuickLinks({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  // `headerDuplicate`: laial ekraanil on sama sihtkoht juba päise
  // vahekaardina 100 px kõrgemal, seal jääb pill ära.
  const links: Array<{ label: string; href: string; live?: boolean; headerDuplicate?: boolean }> = [
    { label: t.home.quickLive, href: '/otse', live: true },
    { label: t.home.quickNewFans, href: '/pealtvaatajale' },
    { label: t.home.quickCalendar, href: '/kalender', headerDuplicate: true },
    { label: t.home.quickResults, href: '/tulemused', headerDuplicate: true },
    { label: t.home.quickClasses, href: '/klassid', headerDuplicate: true },
  ]

  return (
    <nav aria-label={t.home.quickLinksAria} className="bg-black">
      <div className="shell py-4">
        <ul className="scrollbar-none -mx-5 flex gap-[3px] overflow-x-auto px-6 [mask-image:linear-gradient(to_right,black_calc(100%-40px),transparent)] sm:-mx-8 sm:px-9 lg:mx-0 lg:px-1 lg:[mask-image:none]">
          {links.map((link) => {
            return (
              <li key={link.href} className={`shrink-0 last:pr-6 lg:last:pr-0 ${link.headerDuplicate ? 'xl:hidden' : ''}`}>
                <Link
                  href={localizedHref(locale, link.href)}
                  className={`flex min-h-[44px] skew-x-[-19deg] items-center border px-4 transition-colors duration-200 ease-forward focus-visible:ring-offset-black ${
                    link.live
                      ? 'border-blue bg-blue text-white hover:bg-midnight'
                      : 'border-white/15 text-white/85 hover:border-blue hover:bg-blue hover:text-white'
                  }`}
                >
                  <span className="flex skew-x-[19deg] items-center gap-2.5 whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.1em]">
                    <Image
                      src={link.live ? '/images/erc-flag-white.png' : '/images/erc-flag-color.png'}
                      alt=""
                      width={560}
                      height={476}
                      className="h-3.5 w-auto"
                    />
                    {link.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
