import { ArrowRight, FilePdf } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { DOCUMENTS, SPECTATOR } from '@/lib/concept/fixtures'
import { Rise } from '../motion'

/**
 * Pealtvaataja praktiline info ja ametlike dokumentide sisenemispunkt.
 * Kaks erineva kaaluga veergu: info on lugemiseks, dokumendid on failid.
 */
export function SpectatorDocs() {
  return (
    <section className="border-b border-line py-14 lg:py-20">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Rise className="lg:col-span-7">
          <div id="pealtvaatajale" className="scroll-mt-28">
            <h2 className="text-2xl font-bold tracking-headline sm:text-3xl">Pealtvaatajale</h2>
            <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
              {SPECTATOR.map((s) => (
                <li key={s.id} className="bg-ink">
                  <a href={s.link} className="group flex h-full flex-col justify-between gap-6 p-5 transition-colors duration-200 hover:bg-surface">
                    <span>
                      <span className="block text-lg font-bold tracking-headline">{s.title}</span>
                      <span className="mt-2 block text-sm leading-relaxed text-muted">{s.text}</span>
                    </span>
                    <ArrowRight size={16} weight="bold" className="text-muted transition-transform duration-150 group-hover:translate-x-1 group-hover:text-chalk" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Rise>

        <Rise delay={0.08} className="lg:col-span-5">
          <div id="dokumendid" className="scroll-mt-28">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-headline sm:text-3xl">Ametlikud dokumendid</h2>
              <Link href="/dokumendid" className="shrink-0 text-sm font-semibold text-muted transition-colors duration-150 hover:text-chalk">Kõik</Link>
            </div>
            <ol className="mt-6 border-t border-line">
              {DOCUMENTS.map((d) => (
                <li key={d.id} className="border-b border-line">
                  <a href={`/dokumendid/${d.id}`} className="group flex items-start gap-4 py-4">
                    <FilePdf size={22} weight="regular" className="mt-0.5 shrink-0 text-signal" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-snug transition-colors duration-150 group-hover:text-signal">{d.title}</span>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{d.kind}</span>
                    </span>
                    <span className="tnum shrink-0 font-mono text-xs text-muted">{d.time}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </Rise>
      </div>
    </section>
  )
}
