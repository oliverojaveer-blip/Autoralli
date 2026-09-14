import { NextResponse, type NextRequest } from 'next/server'
import { LIVE_BLOG_FIXTURE } from '@/lib/live-blog/fixtures'
import type { LiveBlogView } from '@/lib/live-blog/types'

/**
 * Otseblogi lugejate lõpp-punkt. Lugejad küsivad seda iga 30 s; vastus on
 * serva-vahemälus 30 s, nii et CMS näeb ühte päringut olenemata lugejate
 * arvust (vt "3000 telefoni × 30 s" arutelu). `?since=<ISO>` annab ainult
 * uuemad postitused, et poll oleks väike.
 *
 * Praegu NÄIDISANDMED (`lib/live-blog/fixtures.ts`); Sanity adapter
 * asendab `load()` sisu, kuju jääb samaks.
 */
async function load(): Promise<LiveBlogView> {
  return LIVE_BLOG_FIXTURE
}

export async function GET(request: NextRequest) {
  const since = request.nextUrl.searchParams.get('since')
  const view = await load()
  const posts = since
    ? view.posts.filter((p) => new Date(p.publishedAt).getTime() > new Date(since).getTime())
    : view.posts

  return NextResponse.json(
    { ...view, posts, generatedAt: new Date().toISOString() } satisfies LiveBlogView,
    { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
  )
}
