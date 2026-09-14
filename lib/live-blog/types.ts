/**
 * Otseblogi vaatemudel — see, mida leht renderdab. Sanity dokumendid
 * (`sanity/schemas/live-blog.ts`) teisendatakse siia adapteris; ükski
 * komponent ei tohi CMS-i kuju otse kasutada (claude.md: välised
 * andmeallikad adapterite kaudu). Isikuandmeid (Telegrami ID jms) siin
 * pole — need ei jõua kunagi kliendini.
 */

export type LiveBlogEmbedProvider = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'x' | 'other'

export type LiveBlogPost = {
  id: string
  /** Sama püsiv ID, mis kalendris/tulemustes. */
  eventId: string
  kind: 'text' | 'photo' | 'video' | 'embed' | 'notice'
  author: { name: string; handle: string | null; areaLabel: string | null; role: 'trusted' | 'moderated' | 'moderator' }
  body: string | null
  /** Kiiruskatse kood, kui postitus on katsega seotud (nt "SS6"). */
  stageCode: string | null
  image: { src: string; width: number; height: number; alt: string } | null
  video: { src: string; poster: string | null } | null
  embed: { url: string; provider: LiveBlogEmbedProvider; handle: string | null } | null
  credit: string | null
  pinned: boolean
  publishedAt: string
}

export type LiveBlogView = {
  eventId: string
  eventName: string
  hashtags: string[]
  posts: LiveBlogPost[]
  /** Millal see vastus koostati; leht küsib `?since=` abil ainult uuemaid. */
  generatedAt: string
}

/** Tunneb URL-ist ära platvormi ja konto, et kaart saaks öelda "Instagram · @…" enne laadimist. */
export function detectEmbed(url: string): { provider: LiveBlogEmbedProvider; handle: string | null } {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    const seg = u.pathname.split('/').filter(Boolean)
    if (host.endsWith('instagram.com')) return { provider: 'instagram', handle: null }
    if (host.endsWith('facebook.com') || host === 'fb.watch') return { provider: 'facebook', handle: seg[0] ? `@${seg[0]}` : null }
    if (host.endsWith('tiktok.com')) return { provider: 'tiktok', handle: seg[0]?.startsWith('@') ? seg[0] : null }
    if (host.endsWith('youtube.com') || host === 'youtu.be') return { provider: 'youtube', handle: null }
    if (host === 'x.com' || host.endsWith('twitter.com')) return { provider: 'x', handle: seg[0] ? `@${seg[0]}` : null }
  } catch {
    /* vigane URL — käsitleme kui muud linki */
  }
  return { provider: 'other', handle: null }
}

/**
 * Embed'i iframe-aadress, mida laetakse alles klõpsu peale. Ainult avalikud
 * postitused; X-il pole lihtsat iframe'i, seal avatakse link.
 */
export function embedFrameUrl(embed: LiveBlogPost['embed']): string | null {
  if (!embed) return null
  try {
    const u = new URL(embed.url)
    const seg = u.pathname.split('/').filter(Boolean)
    switch (embed.provider) {
      case 'instagram': {
        const i = seg.findIndex((s) => s === 'p' || s === 'reel' || s === 'reels')
        return i >= 0 && seg[i + 1] ? `https://www.instagram.com/${seg[i]}/${seg[i + 1]}/embed/` : null
      }
      case 'facebook':
        return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(embed.url)}&show_text=true`
      case 'tiktok': {
        const i = seg.findIndex((s) => s === 'video')
        return i >= 0 && seg[i + 1] ? `https://www.tiktok.com/embed/v2/${seg[i + 1]}` : null
      }
      case 'youtube': {
        const id = u.hostname === 'youtu.be' ? seg[0] : u.searchParams.get('v') ?? (seg[0] === 'shorts' ? seg[1] : null)
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
      }
      default:
        return null
    }
  } catch {
    return null
  }
}
