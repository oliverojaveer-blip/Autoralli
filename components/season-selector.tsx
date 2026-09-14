/**
 * Hooaja valik. Praegu on saidil päris andmed ainult 2026. hooaja kohta,
 * seega on varasemad hooajad siin nähtaval, aga mitteklikitavad ja selge
 * "Andmed lisandumas" märkega — mitte väljamõeldud tühjade lehtedena
 * (claude.md: ära genereeri oletatavaid andmeid).
 */
import { getDictionary, type Locale } from '@/lib/i18n'

const SEASONS = [2026, 2025, 2024] as const
const ACTIVE_SEASON = 2026

export function SeasonSelector({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  return (
    <div role="tablist" aria-label={t.results.seasonAria} className="flex flex-wrap items-center gap-2">
      {SEASONS.map((year) => {
        const isActive = year === ACTIVE_SEASON
        return (
          <span
            key={year}
            role="tab"
            aria-selected={isActive}
            aria-disabled={!isActive}
            title={isActive ? undefined : t.common.dataComingSoon}
            className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-sm font-semibold tracking-wide ${
              isActive
                ? 'bg-blue text-white'
                : 'cursor-default border border-line text-slate/50'
            }`}
          >
            {year}
            {!isActive ? (
              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate/50">
                {t.common.soon}
              </span>
            ) : null}
          </span>
        )
      })}
    </div>
  )
}
