import { fetchRallyStages } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/** Kiiruskatsete nimekiri (valiku jaoks) järjestuses, nagu need sõidetakse. */
export async function GET() {
  return handleRallyLynxRequest(fetchRallyStages, {
    headers: { 'Cache-Control': 'private, max-age=300' },
  })
}
