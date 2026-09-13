import { fetchRallyStageResults } from '@/lib/rallylynx/adapter'
import { handleRallyLynxRequest } from '@/lib/rallylynx/route-helpers'

/** Ühe kiiruskatse tulemus koos vahepunktidega. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ stageId: string }> },
) {
  const { stageId } = await params

  return handleRallyLynxRequest(
    (credentials) => fetchRallyStageResults(credentials, stageId),
    { headers: { 'Cache-Control': 'private, max-age=15' } },
  )
}
