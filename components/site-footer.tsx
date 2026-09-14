import Image from 'next/image'
import Link from 'next/link'
import { getDictionary, localizedHref, type Locale } from '@/lib/i18n'

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const href = (path: string) => localizedHref(locale, path)

  const columns = [
    {
      title: t.footer.competitions,
      links: [
        { label: t.nav.calendar, href: '/kalender' },
        { label: t.footer.startLists, href: '/stardinimekirjad' },
        { label: t.nav.results, href: '/tulemused' },
        { label: t.footer.standings, href: '/punktiseis' },
      ],
    },
    {
      title: t.footer.media,
      links: [
        { label: t.nav.news, href: '/uudised' },
        { label: t.footer.radio, href: '/raadio' },
        { label: t.footer.photos, href: '/galerii' },
        { label: t.footer.videos, href: '/videod' },
      ],
    },
    {
      title: t.footer.info,
      links: [
        { label: t.footer.documents, href: '/dokumendid' },
        { label: t.footer.ejc, href: '/ejc' },
        { label: t.footer.partners, href: '/partnerid' },
        { label: t.nav.contact, href: '/kontakt' },
        { label: t.footer.privacy, href: '/privaatsus' },
      ],
    },
  ]

  return (
    <footer className="bg-midnight py-16 lg:py-20">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image
              src="/images/erc-logo-white.png"
              alt="Estonian Rally Championship"
              width={280}
              height={33}
              className="h-8 w-auto"
            />
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-white/60">{t.footer.tagline}</p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} className="lg:col-span-2 lg:col-start-auto" aria-label={column.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={href(link.href)} className="text-sm text-white/85 transition-colors hover:text-blue">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-white/50">&copy; {new Date().getFullYear()} Autoralli.ee</p>
          <p className="font-mono text-xs text-white/50">{t.footer.languages}</p>
        </div>
      </div>
    </footer>
  )
}
