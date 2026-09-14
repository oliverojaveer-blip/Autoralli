import { defineQuery } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/sanity/client'
import { sanityConfigured } from '@/sanity/env'
import { LIVE_BLOG_FIXTURE } from './fixtures'
import { detectEmbed, type LiveBlogPost, type LiveBlogView } from './types'

/**
 * ============================================================================
 *  Otseblogi adapter: Sanity `livePost` dokumendid -> `LiveBlogView`.
 * ============================================================================
 *  Ükski komponent ei näe Sanity kuju. Ainult `status == "published"`
 *  postitused; autori isikuandmed (Telegrami ID jm) jäetakse projektsioonist
 *  välja, nii et need ei jõua kunagi API vastusesse.
 *
 *  Kui Sanity pole seadistatud (NEXT_PUBLIC_SANITY_PROJECT_ID puudub) või
 *  ühelgi võistlusel pole blogi avatud, tagastab adapter näidisandmed —
 *  nii püsib /otse Blogi vahekaart kujunduse ajal töökorras. Näidis on
 *  vastuses märgitud (`sample: true`), et leht saaks seda öelda.
 * ============================================================================
 */

const builder = imageUrlBuilder(sanityClient)

/** Võistlus, mille blogi on avatud — eelistatult käimasolev/viimane. */
const EVENT_QUERY = defineQuery(`
  *[_type == "rallyEvent" && blogEnabled == true] | order(startsAt desc)[0]{
    _id, eventId, name, hashtags
  }
`)

const POSTS_QUERY = defineQuery(`
  *[_type == "livePost" && status == "published" && event._ref == $eventRef]
    | order(pinned desc, publishedAt desc)[0...$limit]{
    _id, kind, body, stageCode, pinned, publishedAt, credit, embedUrl,
    image{ asset->{ url, metadata{ dimensions{ width, height } } } },
    imageAlt,
    video{ asset->{ url } },
    videoPoster{ asset->{ url } },
    author->{ displayName, handle },
    "contributor": *[_type == "eventContributor" && author._ref == ^.author._ref && event._ref == ^.event._ref][0]{ role, areas }
  }
`)

type SanityPost = {
  _id: string
  kind: LiveBlogPost['kind']
  body: string | null
  stageCode: string | null
  pinned: boolean | null
  publishedAt: string | null
  credit: string | null
  embedUrl: string | null
  image: { asset: { url: string; metadata: { dimensions: { width: number; height: number } } } | null } | null
  imageAlt: string | null
  video: { asset: { url: string } | null } | null
  videoPoster: { asset: { url: string } | null } | null
  author: { displayName: string; handle: string | null } | null
  contributor: { role: LiveBlogPost['author']['role'] | null; areas: string[] | null } | null
}

const POST_LIMIT = 60
const IMAGE_WIDTH = 1280

function toPost(doc: SanityPost, eventId: string): LiveBlogPost {
  const image = doc.image?.asset
    ? {
        src: builder.image(doc.image.asset.url).width(IMAGE_WIDTH).auto('format').url(),
        width: IMAGE_WIDTH,
        height: Math.round((IMAGE_WIDTH * doc.image.asset.metadata.dimensions.height) / doc.image.asset.metadata.dimensions.width),
        alt: doc.imageAlt ?? doc.body?.slice(0, 120) ?? '',
      }
    : null
  const embed = doc.embedUrl ? { url: doc.embedUrl, ...detectEmbed(doc.embedUrl) } : null

  return {
    id: doc._id,
    eventId,
    kind: doc.kind,
    author: {
      name: doc.author?.displayName ?? '—',
      handle: doc.author?.handle ?? null,
      areaLabel: doc.contributor?.areas?.join(', ') || null,
      role: doc.contributor?.role ?? 'moderated',
    },
    body: doc.body ?? null,
    stageCode: doc.stageCode ? doc.stageCode.toUpperCase() : null,
    image,
    video: doc.video?.asset ? { src: doc.video.asset.url, poster: doc.videoPoster?.asset?.url ?? null } : null,
    embed,
    credit: doc.credit ?? null,
    pinned: doc.pinned ?? false,
    publishedAt: doc.publishedAt ?? new Date(0).toISOString(),
  }
}

export async function fetchLiveBlog(): Promise<LiveBlogView & { sample: boolean }> {
  if (!sanityConfigured) return { ...LIVE_BLOG_FIXTURE, sample: true }

  const event = await sanityClient.fetch(EVENT_QUERY)
  if (!event) return { ...LIVE_BLOG_FIXTURE, sample: true }

  const docs = await sanityClient.fetch<SanityPost[]>(POSTS_QUERY, { eventRef: event._id, limit: POST_LIMIT })
  return {
    eventId: event.eventId,
    eventName: event.name,
    hashtags: event.hashtags ?? [],
    posts: docs.map((d) => toPost(d, event.eventId)),
    generatedAt: new Date().toISOString(),
    sample: false,
  }
}
