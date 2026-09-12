import Image from 'next/image'
import Link from 'next/link'
import { PARTNERS } from '@/lib/concept/fixtures'
import { Rise } from '../motion'

/**
 * Partnerid kahes astmes. Peapartnerid saavad ruumi ja suuruse,
 * ametlikud partnerid ühe vaikse rea. Ilma kategooriasiltideta.
 *
 * Väljamõeldud partneritel pole logo, nende asemel on monogramm.
 * Päris logo tuleb PARTNERS massiivi `logo` väljale.
 */
function Monogram({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <span
      className="flex h-11 w-11 items-center justify-center border border-line text-sm font-bold tracking-headline text-muted"
      aria-hidden
    >
      {initials}
    </span>
  )
}

export function Partners() {
  const main = PARTNERS.filter((p) => p.tier === 'pea')
  const official = PARTNERS.filter((p) => p.tier === 'ametlik')

  return (
    <section id="partnerid" className="scroll-mt-16 border-b border-line py-16 lg:py-24">
      <div className="shell">
        <Rise>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold leading-[1.02] tracking-headline sm:text-4xl">
                Koos meiega rajal
              </h2>
              <Link href="/partnerid" className="mt-4 inline-block text-sm font-semibold text-muted transition-colors duration-150 hover:text-chalk">
                Partneriks saamine
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-px bg-line lg:col-span-8">
              {main.map((p) => (
                <li key={p.id} className="flex min-h-[9rem] items-center justify-center bg-ink px-6 py-8 transition-colors duration-200 hover:bg-surface">
                  <Image
                    src={p.logo!}
                    alt={p.name}
                    width={p.width}
                    height={p.height}
                    className={`w-auto opacity-90 ${p.id === 'eal' ? 'h-16 sm:h-20' : 'h-8 sm:h-10'}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Rise>

        <Rise delay={0.08} className="mt-10 border-t border-line pt-8">
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
            {official.map((p) => (
              <li key={p.id} className="flex items-center gap-3 opacity-70 transition-opacity duration-200 hover:opacity-100">
                <Monogram name={p.name} />
                <span className="text-sm font-medium text-chalk">{p.name}</span>
              </li>
            ))}
          </ul>
        </Rise>
      </div>
    </section>
  )
}
