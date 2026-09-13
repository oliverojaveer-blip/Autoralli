/**
 * ============================================================================
 *  autosport.ee (Eesti Autospordi Liit) uudiste adapter.
 * ============================================================================
 *  autosport.ee on WordPress ja pakub avalikku REST API-t
 *  (`/wp-json/wp/v2/posts`). Loeme sealt "Ralli" kategooria postitused ja
 *  teisendame need saidi enda `NewsArticleView` kujule — ükski komponent ei
 *  tohi WordPressi vastuse kuju otse kasutada (claude.md: välised
 *  andmeallikad ainult adapterite kaudu). Täisartiklid jäävad autosport.ee-sse,
 *  meie näitame pealkirja, kokkuvõtet ja pilti ning lingime edasi.
 * ============================================================================
 */

const BASE_URL = 'https://autosport.ee'
/** WordPressi kategooria "Ralli" (`/wp-json/wp/v2/categories?search=ralli`). */
const RALLY_CATEGORY_ID = 50
/** Kui tihti Next'i fetch-vahemälu uuesti küsib (sekundites). */
const REVALIDATE_SECONDS = 600

export type NewsArticleView = {
  id: number
  title: string
  excerpt: string
  publishedAt: string
  url: string
  image: { src: string; width: number; height: number; alt: string } | null
}

export type NewsPageView = {
  articles: NewsArticleView[]
  page: number
  totalPages: number
  sourceUrl: string
}

type WpRendered = { rendered: string }

type WpMediaSize = { source_url: string; width: number; height: number }

type WpMedia = {
  source_url?: string
  alt_text?: string
  media_details?: {
    width?: number
    height?: number
    sizes?: Record<string, WpMediaSize>
  }
}

type WpPost = {
  id: number
  date_gmt: string
  link: string
  title: WpRendered
  excerpt: WpRendered
  _embedded?: { 'wp:featuredmedia'?: WpMedia[] }
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  laquo: '«',
  raquo: '»',
  bdquo: '„',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
}

function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name: string) => ENTITIES[name.toLowerCase()] ?? match)
}

/** WordPressi `excerpt.rendered` on HTML koos "[…]" sabaga — teeme puhtaks tekstiks. */
function toPlainExcerpt(html: string): string {
  const text = decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .replace(/\s*\[…\]\s*$/, '…')
    .trim()
  return text
}

function pickImage(post: WpPost): NewsArticleView['image'] {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null

  const sizes = media.media_details?.sizes ?? {}
  const preferred = sizes.medium_large ?? sizes.large ?? sizes.medium
  const src = preferred?.source_url ?? media.source_url
  if (!src) return null

  return {
    src,
    width: preferred?.width ?? media.media_details?.width ?? 768,
    height: preferred?.height ?? media.media_details?.height ?? 512,
    alt: media.alt_text?.trim() || '',
  }
}

export async function fetchRallyNews(options: { page?: number; perPage?: number } = {}): Promise<NewsPageView> {
  const page = Math.max(1, options.page ?? 1)
  const perPage = options.perPage ?? 12

  const url = new URL(`${BASE_URL}/wp-json/wp/v2/posts`)
  url.searchParams.set('categories', String(RALLY_CATEGORY_ID))
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('page', String(page))
  url.searchParams.set('_embed', 'wp:featuredmedia')
  url.searchParams.set('_fields', 'id,date_gmt,link,title,excerpt,_links,_embedded')

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!res.ok) {
    throw new Error(`autosport.ee vastas ${res.status}-ga`)
  }

  const posts = (await res.json()) as WpPost[]
  const totalPages = Number(res.headers.get('x-wp-totalpages') ?? '1') || 1

  return {
    page,
    totalPages,
    sourceUrl: `${BASE_URL}/category/ralli/`,
    articles: posts.map((post) => ({
      id: post.id,
      title: decodeEntities(post.title.rendered).trim(),
      excerpt: toPlainExcerpt(post.excerpt.rendered),
      publishedAt: `${post.date_gmt}Z`,
      url: post.link,
      image: pickImage(post),
    })),
  }
}
