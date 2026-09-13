import { fetchRallyRetirements } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/** Katkestanud võistkonnad. */
export async function GET() {
  return handleRallyLynxRequest(fetchRallyRetirements, {
    headers: { 'Cache-Control': 'private, max-age=30' },
  })
}
