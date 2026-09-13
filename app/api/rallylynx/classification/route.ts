import type { NextRequest } from 'next/server'
import { fetchRallyClassification } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/**
 * Praeguse Live Center'i võistluse üldine punktiseis. `?afterStage=<id>`
 * annab "koondseis pärast SSx" vaate — RallyLynx arvutab selle ise ümber.
 */
export async function GET(request: NextRequest) {
  const afterStage = request.nextUrl.searchParams.get('afterStage') ?? undefined

  return handleRallyLynxRequest(
    (credentials) => fetchRallyClassification(credentials, { afterStage }),
    { headers: { 'Cache-Control': 'private, max-age=30' } },
  )
}
