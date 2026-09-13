import { fetchRallyStageWinners } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/** Iga kiiruskatse võitja. */
export async function GET() {
  return handleRallyLynxRequest(fetchRallyStageWinners, {
    headers: { 'Cache-Control': 'private, max-age=30' },
  })
}
