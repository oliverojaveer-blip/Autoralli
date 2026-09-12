import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { CLASSES } from '@/lib/concept/fixtures'
import { Parallax, Rise } from '../motion'

/**
 * Klasside avastamine. Nimi on suur, sest uus külastaja otsib esmalt
 * sõna, mida ta on kuulnud (Rally2, Rally4), ja alles siis selgitust.
 */
export function Classes() {
  return (
    <section id="klassid" className="scroll-mt-16 border-b border-line">
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[18rem] lg:col-span-5 lg:min-h-0">
          <Parallax className="absolute inset-0" strength={30}>
            <Image
              src="/concept/rally-rain.jpg"
              alt="Rallauto vihmasel külakatsel"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-[45%_center]"
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink" />
        </div>

        <div className="shell py-16 lg:col-span-7 lg:py-24 lg:pl-16">
          <Rise>
            <h2 className="text-3xl font-bold leading-[1.02] tracking-headline sm:text-4xl lg:text-5xl">
              Viis klassi, üks stardijoon
            </h2>
            <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted">
              Samal rallil sõidavad tehase Rally2 ja kodus ehitatud rahvusliku klassi auto. Klass ütleb, kellega sind võrreldakse.
            </p>
          </Rise>

          <Rise delay={0.1} className="mt-10">
            <ul className="border-t border-line">
              {CLASSES.map((cls) => (
                <li key={cls.id} className="border-b border-line">
                  <a href={`/klassid/${cls.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 py-5 sm:grid-cols-[10rem_1fr_auto]">
                    <span className="text-2xl font-bold tracking-headline transition-colors duration-150 group-hover:text-signal sm:text-3xl">
                      {cls.name}
                    </span>
                    <span className="col-span-2 sm:col-span-1">
                      <span className="block text-sm text-chalk/90">{cls.note}</span>
                      <span className="mt-1 block font-mono text-xs text-muted">{cls.cars}</span>
                    </span>
                    <span className="col-start-2 row-start-1 flex items-center gap-3 sm:col-start-3">
                      <span className="tnum font-mono text-sm text-muted">{cls.entries} autot</span>
                      <ArrowRight size={16} weight="bold" className="text-muted transition-transform duration-150 group-hover:translate-x-1 group-hover:text-chalk" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Rise>
        </div>
      </div>
    </section>
  )
}
