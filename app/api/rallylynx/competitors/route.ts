import { fetchRallyCompetitors } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/** Osalejate nimekiri (stardinumbri järgi). */
export async function GET() {
  return handleRallyLynxRequest(fetchRallyCompetitors, {
    headers: { 'Cache-Control': 'private, max-age=300' },
  })
}
