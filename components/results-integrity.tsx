import { Reveal } from './reveal'
import { getDictionary, type Locale } from '@/lib/i18n'

/**
 * Sisu tuleb otse claude.md andmereeglitest: tulemuse staatus on alati nähtav
 * ja ametlikke tulemusi ei kirjutata vaikimisi üle. See on selle projekti
 * päris nõue, mitte täitesisu.
 *
 * Otseülekande ajad ja punktiseis tulevad ajavõtupartneri API-st adapteri
 * kaudu (claude.md: "Välised andmeallikad tuleb ühendada adapterite kaudu").
 * Selle komponent EI genereeri ega oletata elava katse positsioone —
 * live-tabel ehitatakse alles siis, kui adapter on olemas.
 */
const STATUS_CODES = ['unofficial', 'provisional', 'official', 'amended'] as const

export function ResultsIntegrity({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const statuses = STATUS_CODES.map((code) => ({ code, ...t.integrity[code] }))
  return (
    <section className="border-b border-line bg-mist py-20 lg:py-28">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
              {t.integrity.eyebrow}
            </p>
            <h2 className="mt-5 max-w-[18ch] font-display text-4xl font-bold uppercase leading-[1.02] text-black sm:text-5xl">
              {t.integrity.title}
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
            <p className="max-w-[58ch] text-lg leading-relaxed text-slate">
              {t.integrity.lead}
            </p>
            <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-slate">
              {t.integrity.note}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-16">
          <dl className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {statuses.map((status) => (
              <div key={status.code} className="bg-white p-7">
                <dt>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-blue">
                    {status.code}
                  </span>
                  <span className="mt-3 block font-display text-xl font-bold uppercase text-black">
                    {status.label}
                  </span>
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-slate">
                  {status.note}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
