import { fetchRallyPenalties } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/** Rakendatud karistused. */
export async function GET() {
  return handleRallyLynxRequest(fetchRallyPenalties, {
    headers: { 'Cache-Control': 'private, max-age=30' },
  })
}
