import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { StandingsTable } from '@/components/standings-table'
import { nextEvent } from '@/lib/events'

export const metadata: Metadata = {
  title: 'Tulemused',
  description: 'Eesti meistrivõistluste etappide ametlikud tulemused.',
}

/**
 * Eraldi tulemuste leht (mitte Live Center — vt `/otse`). Ajavõtupartneri
 * liidestust siin veel ei ole, seega ei näita me väljamõeldud kohti või
 * aegu (claude.md: "Live-andmete puudumisel ära genereeri oletatavaid
 * positsioone", ametlikke tulemusi ei tohi vaikimisi üle kirjutada).
 * Kui tulemuste andmeallikas (adapter) valmib, asendub see ausa
 * platshoidjaga tegelike tulemustabelitega, mis kannavad allikat ja
 * viimase uuenduse aega ning staatust (unofficial/provisional/official/amended).
 */
export default function TulemusedPage() {
  const event = nextEvent()

  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="border-b border-line py-20 lg:py-28">
          <div className="shell">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
              Tulemused
            </p>
            <h1 className="mt-5 max-w-[26ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
              Ametlikud tulemused
            </h1>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-slate">
              Järgmise etapi, {event.name}, tulemused ilmuvad siia kohe pärast
              ajavõtupartneriga liidestumist. Kuni selleni saad jälgida otse-eetrit
              Live Centeris.
            </p>
            <Link
              href="/otse"
              className="mt-8 inline-flex items-center bg-blue px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
            >
              Ava Live Center
            </Link>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="shell">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
              Punktiseis
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-black sm:text-4xl">
              Eesti meistrivõistluste ja karikavõistluste 2026 seis
            </h2>
            <div className="mt-10">
              <StandingsTable />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
