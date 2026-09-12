import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { ClassSelector } from '@/components/class-selector'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Võistlusklassid',
  description: 'Estonian Rally Championship võistlusklassid ja tehnilised nõuded.',
}

export default function KlassidPage() {
  return (
    <>
      <SiteNav />
      <main id="sisu">
        <Suspense fallback={null}>
          <ClassSelector />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  )
}
