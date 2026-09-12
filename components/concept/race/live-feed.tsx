import { Timer, Warning, Info, XCircle, CloudSun, Wind, Drop } from '@phosphor-icons/react/dist/ssr'
import { LIVE_UPDATES, WEATHER } from '@/lib/concept/fixtures'
import { Rise } from '../motion'

const KIND_ICON = {
  aeg: Timer,
  hoiatus: Warning,
  info: Info,
  katkestus: XCircle,
} as const

/**
 * Viimased sündmused rajalt ja ilm/teeolud kõrvuti. Voog on ajaline nimekiri,
 * ilm on kolm suurt numbrit ja teeolud katsete kaupa.
 */
export function LiveFeed() {
  return (
    <section id="sundmused" className="scroll-mt-28 border-b border-line py-14 lg:py-20">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Rise className="lg:col-span-7">
          <h2 className="text-2xl font-bold tracking-headline sm:text-3xl">Rajalt</h2>
          <ol className="mt-6 border-t border-line" data-testid="live-feed">
            {LIVE_UPDATES.map((u) => {
              const Icon = KIND_ICON[u.kind]
              const warn = u.kind === 'hoiatus' || u.kind === 'katkestus'
              return (
                <li key={u.id} className="grid grid-cols-[3.25rem_1.5rem_1fr] items-start gap-3 border-b border-line py-4">
                  <span className="tnum font-mono text-sm text-muted">{u.time}</span>
                  <Icon size={18} weight={warn ? 'fill' : 'regular'} className={warn ? 'text-signal' : 'text-muted'} />
                  <span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{u.stage}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-chalk sm:text-base">{u.text}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </Rise>

        <Rise delay={0.08} className="lg:col-span-5">
          <h2 className="text-2xl font-bold tracking-headline sm:text-3xl">Ilm ja teeolud</h2>
          <dl className="mt-6 grid grid-cols-3 gap-px border border-line bg-line">
            <div className="bg-ink p-4">
              <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted"><CloudSun size={14} /> Õhk</dt>
              <dd className="tnum mt-3 font-mono text-3xl font-bold leading-none">{WEATHER.temp}°</dd>
              <dd className="mt-2 text-xs text-muted">{WEATHER.sky}</dd>
            </div>
            <div className="bg-ink p-4">
              <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted"><Wind size={14} /> Tuul</dt>
              <dd className="mt-3 font-mono text-lg font-bold leading-tight">{WEATHER.wind}</dd>
            </div>
            <div className="bg-ink p-4">
              <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted"><Drop size={14} /> Sadu</dt>
              <dd className="tnum mt-3 font-mono text-3xl font-bold leading-none">{WEATHER.rainChance}%</dd>
              <dd className="mt-2 text-xs text-muted">järgmise 3 h jooksul</dd>
            </div>
          </dl>
          <ul className="mt-6 border-t border-line">
            {WEATHER.road.map((r) => (
              <li key={r.area} className="flex items-start justify-between gap-4 border-b border-line py-3.5">
                <span>
                  <span className="block text-sm font-semibold">{r.area}</span>
                  <span className="block text-xs text-muted">{r.condition}</span>
                </span>
                <span className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] ${r.grip === 'muutlik' ? 'text-signal' : 'text-muted'}`}>
                  haare {r.grip}
                </span>
              </li>
            ))}
          </ul>
        </Rise>
      </div>
    </section>
  )
}
