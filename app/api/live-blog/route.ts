import { NextResponse, type NextRequest } from 'next/server'
import { fetchLiveBlog } from '@/lib/live-blog/adapter'

/**
 * Otseblogi lugejate lõpp-punkt. Lugejad küsivad seda iga 30 s; vastus on
 * serva-vahemälus 30 s, nii et CMS näeb ühte päringut olenemata lugejate
 * arvust (vt "3000 telefoni × 30 s" arutelu). `?since=<ISO>` annab ainult
 * uuemad postitused, et poll oleks väike.
 *
 * Andmed tulevad Sanityst (`lib/live-blog/adapter.ts`); kui Sanity pole
 * seadistatud või ühelgi võistlusel pole blogi avatud, näidisandmed
 * (`sample: true`).
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const since = request.nextUrl.searchParams.get('since')
  const view = await fetchLiveBlog()
  const posts = since
    ? view.posts.filter((p) => new Date(p.publishedAt).getTime() > new Date(since).getTime())
    : view.posts

  return NextResponse.json(
    { ...view, posts, generatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
  )
}
