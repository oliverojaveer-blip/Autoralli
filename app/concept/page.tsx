import type { Metadata } from 'next'
import { ConceptShell } from '@/components/concept/concept-shell'
import type { ConceptMode } from '@/lib/concept/fixtures'

export const metadata: Metadata = {
  title: 'Kontseptsioon',
  robots: { index: false, follow: false },
}

/**
 * Isoleeritud kontseptsiooniprototüüp: /concept (tavavaade) ja
 * /concept?mode=race (Race Mode). Avaleht ja muu rakendus ei sõltu sellest.
 * Sisu tuleb lib/concept/fixtures.ts failist, kõik on näidisandmed.
 */
export default async function ConceptPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode } = await searchParams
  const initialMode: ConceptMode = mode === 'race' ? 'race' : 'normal'

  return <ConceptShell initialMode={initialMode} />
}
