import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Võistlejale',
}

export default function VoistlejalePage() {
  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="border-b border-line py-24 lg:py-32">
          <div className="shell">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
              Estonian Rally Championship
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[1.02] text-black sm:text-6xl">
              Võistlejale
            </h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-slate">
              See leht on ehitamisel. Peagi leiad siit registreerimise, litsentsid ja
              tehnilise kontrolli info.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
