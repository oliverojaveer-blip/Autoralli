import Image from 'next/image'
import { Snowflake } from '@phosphor-icons/react/dist/ssr'
import { SnapScroller, SNAP_ITEM_CLASS } from './snap-scroller'
import {
  RALLY_TYRES,
  TYRE_DISTRIBUTOR,
  TYRE_SEASON_LABEL,
  type RallyTyre,
} from '@/lib/rally-tyres'

function formatVariants(tyre: RallyTyre): string {
  return tyre.variants.join(' · ')
}

/** Kruusa ikoon — Phosphoril pole sobivat, seega väike "kivikeste" glüüf. */
function GravelIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3.2 6.4a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8Z" />
      <path d="M8.3 3.1a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4Z" />
      <path d="M12.6 7.2a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4Z" />
      <path d="M7.6 10.2a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z" />
    </svg>
  )
}

function SeasonBadge({ tyre }: { tyre: RallyTyre }) {
  const season = TYRE_SEASON_LABEL[tyre.season]
  const winter = tyre.season === 'talv'
  return (
    <span
      role="img"
      aria-label={`${season.title} · ${season.type}`}
      title={`${season.title} · ${season.type}`}
      className={`absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border ${
        winter
          ? 'border-blue bg-gradient-to-b from-blue/[0.06] to-blue/[0.18] text-blue'
          : 'border-caution bg-gradient-to-b from-caution/[0.08] to-caution/[0.24] text-black'
      }`}
    >
      {winter ? <Snowflake size={18} weight="bold" /> : <GravelIcon size={18} />}
    </span>
  )
}

function TyreCard({ tyre }: { tyre: RallyTyre }) {
  return (
    <li className={SNAP_ITEM_CLASS}>
      <article className="group flex h-full flex-col overflow-hidden rounded-md border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
        {/* Rehvifotod on valge taustaga, seega valge "lava" ka tumedas sektsioonis. */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <Image
            src={tyre.image.angled}
            alt={tyre.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 82vw"
            className="object-contain p-4 transition-opacity duration-300 group-hover:opacity-0"
          />
          <Image
            src={tyre.image.tread}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 82vw"
            className="object-contain p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <SeasonBadge tyre={tyre} />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
            {formatVariants(tyre)}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-none text-white">
            {tyre.model}
          </h3>
          <p className="mt-1 font-mono text-lg text-white">{tyre.size}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4">
            {tyre.studLengthMm ? (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Nael</dt>
                <dd className="mt-0.5 font-mono text-sm text-white">{tyre.studLengthMm} mm</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Hind / rehv</dt>
              <dd className="mt-0.5 font-mono text-sm text-white">
                {tyre.priceEur} € <span className="text-white/50">+ km</span>
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </li>
  )
}

/**
 * Lubatud võistlusrehvide slider /klassid lehel klassivalija all.
 * Sisu tuleb `lib/rally-tyres.ts`-ist; komponent ei tea ühtegi mudelit.
 */
export function TyreSection() {
  return (
    <section className="border-t border-white/10 bg-midnight py-20 text-white lg:py-28" id="rehvid">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">Rehvid</p>
            <h2 className="mt-5 max-w-[20ch] font-display text-4xl font-bold uppercase leading-[1.02] sm:text-5xl">
              Lubatud võistlusrehvid
            </h2>
            <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-white/70">
              Talvel on lubatud piikrehvid, suvel kruusarehvid. Hinnad on ühe rehvi kohta ilma
              käibemaksuta.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              Rehvide tarnija
            </span>
            <Image
              src={TYRE_DISTRIBUTOR.logo.src}
              alt={TYRE_DISTRIBUTOR.name}
              width={TYRE_DISTRIBUTOR.logo.width}
              height={TYRE_DISTRIBUTOR.logo.height}
              className="h-7 w-auto"
            />
          </div>
        </div>

        <SnapScroller ariaLabel="Lubatud rehvid" tone="dark" className="mt-14">
          {RALLY_TYRES.map((tyre) => (
            <TyreCard key={tyre.id} tyre={tyre} />
          ))}
        </SnapScroller>
      </div>
    </section>
  )
}
