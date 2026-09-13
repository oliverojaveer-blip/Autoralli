import { fetchRallyItinerary } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/** Täielik päevakava (TC-d, kiiruskatsed, transiidid, hooldused, regroup). */
export async function GET() {
  return handleRallyLynxRequest(fetchRallyItinerary, {
    headers: { 'Cache-Control': 'private, max-age=300' },
  })
}
