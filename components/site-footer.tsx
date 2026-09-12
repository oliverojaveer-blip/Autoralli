import Image from 'next/image'
import Link from 'next/link'

const COLUMNS = [
  {
    title: 'Võistlused',
    links: [
      { label: 'Kalender', href: '/kalender' },
      { label: 'Stardinimekirjad', href: '/stardinimekirjad' },
      { label: 'Tulemused', href: '/tulemused' },
      { label: 'Punktiseis', href: '/punktiseis' },
    ],
  },
  {
    title: 'Meedia',
    links: [
      { label: 'Uudised', href: '/uudised' },
      { label: 'Ralliraadio', href: '/raadio' },
      { label: 'Fotod', href: '/galerii' },
      { label: 'Videod', href: '/videod' },
    ],
  },
  {
    title: 'Info',
    links: [
      { label: 'Dokumendid', href: '/dokumendid' },
      { label: 'Estonian Junior Challenge', href: '/ejc' },
      { label: 'Partnerid', href: '/partnerid' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
  },
]

export function SiteFooter() {
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
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-white/60">
              Eesti autoralli kalender, tulemused ja uudised ühes kohas.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav
              key={column.title}
              className="lg:col-span-2 lg:col-start-auto"
              aria-label={column.title}
            >
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/85 transition-colors hover:text-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-white/50">
            &copy; {new Date().getFullYear()} Autoralli.ee
          </p>
          <p className="font-mono text-xs text-white/50">
            Eesti keeles ja inglise keeles
          </p>
        </div>
      </div>
    </footer>
  )
}
