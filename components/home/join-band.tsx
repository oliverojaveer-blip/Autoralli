import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { getDictionary, localizedHref, type Locale } from '@/lib/i18n'
import { FlagLink } from './flag-link'

const PARTNERS = [
  { src: '/eal-logo.png', alt: 'Eesti Autospordi Liit', width: 40, height: 40 },
  { src: '/terminal-logo.png', alt: 'Terminal', width: 132, height: 33 },
]

/**
 * Lehe lõpp uuele fännile: publikufoto, üks selge kutse raja äärde ja
 * partnerite logod. Brändiraamat 11/Co-branding: partnerlogod eraldi,
 * vähemalt 1,5× vahega meistrivõistluse märgist.
 */
export function JoinBand({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/action-crowd.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[60%_40%] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" aria-hidden="true" />
      </div>

      <div className="shell relative py-20 lg:py-28">
        <div>
          <h2 className="max-w-[14ch] font-display text-5xl font-bold uppercase leading-[0.92] sm:text-6xl lg:text-7xl">
            {t.home.joinTitle}
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-white/80">{t.home.joinLead}</p>
          <div className="mt-8 flex flex-wrap gap-3 pl-3">
            <FlagLink href={localizedHref(locale, '/pealtvaatajale')} variant="solid">
              {t.home.joinCta}
              <ArrowRight
                size={14}
                weight="bold"
                className="transition-transform duration-200 ease-forward group-hover:translate-x-1"
                aria-hidden="true"
              />
            </FlagLink>
            <FlagLink href={localizedHref(locale, '/voistlejale')}>{t.home.joinCompete}</FlagLink>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/15 pt-8" aria-label={t.home.partnersAria}>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">{t.home.partnersLabel}</span>
          {PARTNERS.map((partner) => (
            <Image
              key={partner.src}
              src={partner.src}
              alt={partner.alt}
              width={partner.width}
              height={partner.height}
              className="h-8 w-auto opacity-90 transition-opacity hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
