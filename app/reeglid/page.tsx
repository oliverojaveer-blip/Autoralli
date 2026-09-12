import type { Metadata } from 'next'
import Image from 'next/image'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { RulesList } from '@/components/rules-list'
import { RULE_DOCUMENTS, TECHNICAL_DOCUMENTS } from '@/lib/rules-documents'

export const metadata: Metadata = {
  title: 'Reeglid',
  description:
    'Estonian Rally Championship võistlusmäärus, üldjuhend ja klasside tehnilised tingimused.',
}

export default function ReeglidPage() {
  return (
    <>
      <SiteNav />
      <main id="sisu">
        <section className="relative overflow-hidden border-b border-line bg-mist">
          <Image
            src="/eal-logo.png"
            alt=""
            width={399}
            height={400}
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-1/2 h-[320px] w-[320px] -translate-y-1/2 opacity-[0.14] sm:-right-6 sm:h-[440px] sm:w-[440px]"
          />
          <div className="shell relative py-20 lg:py-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue">
              Estonian Rally Championship
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[1.02] text-black sm:text-6xl">
              Reeglid
            </h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-slate">
              Võistlusmäärus, üldjuhend ja klasside tehnilised tingimused. Dokumendid
              avanevad Eesti Autospordi Liidu (autosport.ee) lehel uues aknas.
            </p>
          </div>
        </section>

        <section className="border-b border-line py-16 lg:py-20">
          <div className="shell">
            <h2 className="font-display text-3xl font-bold uppercase text-black sm:text-4xl">
              Dokumendid
            </h2>
            <div className="mt-8">
              <RulesList documents={RULE_DOCUMENTS} />
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="shell">
            <h2 className="font-display text-3xl font-bold uppercase text-black sm:text-4xl">
              Tehnilised tingimused
            </h2>
            <div className="mt-8">
              <RulesList documents={TECHNICAL_DOCUMENTS} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
