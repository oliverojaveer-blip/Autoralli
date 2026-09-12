import { ArrowRight, FileText, ListNumbers, ClipboardText, Timer } from '@phosphor-icons/react/dist/ssr'
import { START_PATH } from '@/lib/concept/fixtures'
import { Rise } from '../motion'

const COMPETITOR_LINKS = [
  { label: 'Registreeru Saaremaale', href: '/registreerumine', icon: ClipboardText, note: 'sulgub 29. sept' },
  { label: 'Stardinimekirjad', href: '/stardinimekirjad', icon: ListNumbers, note: '74 ekipaaži' },
  { label: 'Dokumendid', href: '/dokumendid', icon: FileText, note: 'juhend, bülletäänid' },
  { label: 'Ajakava', href: '/ajakava', icon: Timer, note: 'tehniline, start, hooldus' },
]

/**
 * Uue sõitja tee neljas sammus ja võistleja kiirlingid. Sammud on
 * horisontaalne rada (arvutis), vertikaalne (telefonis).
 */
export function StartPath() {
  return (
    <section id="alusta" className="scroll-mt-16 border-b border-line py-16 lg:py-24">
      <div className="shell">
        <Rise>
          <h2 className="max-w-[16ch] text-3xl font-bold leading-[1.02] tracking-headline sm:text-4xl lg:text-5xl">
            Kuidas rallit sõitma hakata
          </h2>
          <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-muted">
            Esimesest stardist lahutab sind neli sammu. Enamik alustab rahvuslikus klassis renditud autoga.
          </p>
        </Rise>

        <Rise delay={0.1} className="mt-12 lg:mt-16">
          <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {START_PATH.map((step, i) => (
              <li key={step.id} className="group relative bg-ink p-6 transition-colors duration-200 hover:bg-surface lg:p-7">
                <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-signal transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" aria-hidden />
                <span className="tnum font-mono text-sm text-muted">{i + 1} / {START_PATH.length}</span>
                <h3 className="mt-8 text-2xl font-bold leading-tight tracking-headline">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
                <a href={step.link} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-chalk">
                  Loe lähemalt <ArrowRight size={14} weight="bold" className="transition-transform duration-150 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ol>
        </Rise>

        <Rise delay={0.12} className="mt-16 lg:mt-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-3">
              <h3 className="text-2xl font-bold leading-tight tracking-headline">Juba võistled?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">Kõik, mida ralli nädalal vaja läheb.</p>
            </div>
            <ul className="grid grid-cols-2 gap-px bg-line lg:col-span-9 lg:grid-cols-4">
              {COMPETITOR_LINKS.map((link) => (
                <li key={link.href} className="bg-ink">
                  <a href={link.href} className="group flex h-full flex-col justify-between gap-6 p-5 transition-colors duration-200 hover:bg-surface">
                    <link.icon size={22} weight="regular" className="text-signal" />
                    <span>
                      <span className="block text-sm font-semibold leading-snug">{link.label}</span>
                      <span className="mt-1 block font-mono text-[11px] text-muted">{link.note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Rise>
      </div>
    </section>
  )
}
