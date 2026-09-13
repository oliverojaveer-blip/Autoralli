import { fetchRallyEventOverview } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/** Võistluse üldandmed + sarjade/klasside puu (filtrite jaoks). */
export async function GET() {
  return handleRallyLynxRequest(fetchRallyEventOverview, {
    headers: { 'Cache-Control': 'private, max-age=300' },
  })
}
