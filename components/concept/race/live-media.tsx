import Image from 'next/image'
import Link from 'next/link'
import { Play, Radio, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { MEDIA_TILES, STREAM } from '@/lib/concept/fixtures'
import { LiveDot, Rise } from '../motion'

/**
 * Otseülekanne suurelt, ralliraadio kõrval, päeva fotod all. Video mängija
 * asemel on prototüübis plakat, lõpplahenduses YouTube'i embed.
 */
export function LiveMedia() {
  return (
    <section id="meedia" className="scroll-mt-28 border-b border-line py-14 lg:py-20">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Rise className="lg:col-span-8">
            <Link href="/otse" className="group relative block aspect-video overflow-hidden border border-line bg-surface">
              <Image src={STREAM.poster} alt="" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-signal text-ink transition-transform duration-200 group-hover:scale-105 sm:h-20 sm:w-20">
                <Play size={26} weight="fill" />
              </span>
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5">
                <span>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-signal"><LiveDot /> Otseülekanne</span>
                  <span className="mt-1 block text-xl font-bold tracking-headline sm:text-2xl">{STREAM.title}</span>
                </span>
                <span className="tnum font-mono text-xs text-muted">{STREAM.viewers} vaatajat · {STREAM.provider}</span>
              </div>
            </Link>
          </Rise>

          <Rise delay={0.08} className="lg:col-span-4">
            <Link href="/raadio" className="group flex h-full flex-col justify-between border border-line bg-surface p-6 transition-colors duration-200 hover:border-chalk/40">
              <Radio size={28} weight="regular" className="text-signal" />
              <span className="mt-10">
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted">Ralliraadio</span>
                <span className="mt-2 block text-2xl font-bold leading-tight tracking-headline">Katsete ajad ja intervjuud otse-eetris</span>
                <span className="mt-3 block font-mono text-sm text-muted">98,4 MHz ja veebis</span>
              </span>
              <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-chalk">
                Kuula <ArrowUpRight size={14} weight="bold" className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Rise>
        </div>

        <Rise delay={0.1} className="mt-6 lg:mt-8">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {MEDIA_TILES.map((m) => (
              <li key={m.id}>
                <Link href="/fotod" className="group block">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-surface">
                    <Image src={m.src} alt={m.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" />
                  </span>
                  <span className="mt-2 block text-sm text-muted transition-colors duration-150 group-hover:text-chalk">{m.caption}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Rise>
      </div>
    </section>
  )
}
