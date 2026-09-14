import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import type { StandingsView } from '@/lib/standings-source'
import { formatLongDate } from '@/lib/dates'
import { getDictionary, localizedHref, type Locale } from '@/lib/i18n'
import { FlagLink } from './flag-link'

const TOP = 6

function formatPoints(value: number) {
  return value.toString().replace('.', ',')
}

/**
 * Punktiseisu lühivaade: EMV absoluutarvestuse esikuuik ja plaat kogu
 * tabeli juurde (/tulemused). Read tulevad `lib/standings.ts` failist.
 * Kuni EAL-i andmeallikat pole liidestatud, on need näidisread: sektsioon
 * ütleb seda enne tabelit, read on tuhmid ja ilma esikoha rõhutuseta,
 * allika- ja uuendusrida on paigas, et päris andmed sama mustrit jätkaksid
 * (claude.md: tulemuse juures peab olema allikas ja viimase uuenduse aeg).
 */
export function StandingsBrief({ locale, view }: { locale: Locale; view: StandingsView }) {
  const t = getDictionary(locale)
  const cls = view.classes[0]
  const rows = cls?.rows.slice(0, TOP) ?? []
  const isSample = view.sample

  return (
    <section
      className={`border-t border-white/10 bg-midnight text-white ${isSample ? 'py-10 lg:py-14' : 'py-14 lg:py-20'}`}
      aria-labelledby="punktiseis"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <h2 id="punktiseis" className="font-display text-4xl font-bold uppercase leading-[0.96] sm:text-5xl">
                {t.home.standingsTitle}
              </h2>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">
                <span>{cls?.label ?? t.home.standingsClass}</span>
                <span className="text-white/25" aria-hidden="true">
                  ·
                </span>
                <span>{view.source ? `${t.common.source}: ${view.source}` : t.home.standingsSource}</span>
                <span className="text-white/25" aria-hidden="true">
                  ·
                </span>
                <span>
                  {t.home.standingsUpdated}: {view.updatedAt ? formatLongDate(view.updatedAt, locale) : t.home.standingsPending}
                </span>
              </p>
            </div>
            <FlagLink href={localizedHref(locale, '/tulemused')} size="sm" className="mr-2">
              {t.home.standingsFull}
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </FlagLink>
        </div>

        <div className="mt-6 lg:mt-8">
          {isSample ? (
            <p className="mb-3 flex items-center gap-3 text-[13px] leading-snug text-white/70">
              <span className="bg-checker h-4 w-4 shrink-0 text-caution" aria-hidden="true" />
              <span>
                <strong className="font-bold uppercase tracking-[0.1em] text-caution">{t.home.standingsSample}:</strong>{' '}
                {t.home.standingsSampleNote}
              </span>
            </p>
          ) : null}

          {rows.length === 0 ? (
            <p className="border border-white/10 px-6 py-12 text-center text-sm text-white/60">
              {t.results.classPending(cls?.label ?? t.home.standingsClass)}
            </p>
          ) : (
            <ol
              className={`divide-y divide-white/10 border-y border-white/10 lg:max-w-[820px] ${isSample ? 'text-white/65' : ''}`}
              aria-label={cls?.label}
            >
              {rows.map((row) => (
                <li
                  key={row.position}
                  className={`grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 sm:grid-cols-[3rem_1fr_1fr_auto] sm:gap-6 ${
                    isSample ? 'py-2' : 'py-3'
                  }`}
                >
                  <span
                    className={`font-display font-bold leading-none tnum ${
                      isSample ? 'text-lg' : row.position === 1 ? 'text-2xl text-blue' : 'text-2xl text-white/70'
                    }`}
                  >
                    {row.position}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate font-display font-bold uppercase leading-tight ${
                        isSample ? 'text-base' : 'text-lg sm:text-xl'
                      }`}
                    >
                      {row.driver}
                    </span>
                    {row.car !== '—' ? (
                      <span className="block truncate text-[13px] text-white/55 sm:hidden">{row.car}</span>
                    ) : null}
                  </span>
                  <span className="hidden min-w-0 truncate text-sm text-white/60 sm:block">
                    {[row.entrant, row.car].filter((v) => v !== '—').join(' · ')}
                  </span>
                  <span
                    className={`flex items-baseline gap-1 font-display font-bold leading-none tnum ${
                      isSample ? 'text-lg' : 'text-2xl'
                    }`}
                  >
                    {formatPoints(row.total)}
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
                      {t.home.standingsPoints}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
