import { defineQuery } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/sanity/client'
import { sanityConfigured } from '@/sanity/env'
import { EVENTS, byDate, type RallyEvent } from './events'

/**
 * ============================================================================
 *  Hooaja kalender Sanityst — serveripoolne allikas.
 * ============================================================================
 *  `rallyEvent` dokumendid -> `RallyEvent` (sama kuju, mida komponendid
 *  juba kasutavad). Kui Sanity pole seadistatud või valitud hooajal pole
 *  ühtki avaldatud võistlust, jääb kehtima `lib/events.ts` kood-kalender —
 *  nii ei kao kalender kunagi, ka värskel kloonil.
 *
 *  Serverikomponendid kutsuvad `getEvents()` ja annavad tulemuse
 *  klientkomponentidele propsina; klient Sanityt ise ei küsi.
 *  Vahemälu 10 min (`next.revalidate`), nagu uudistelgi.
 * ============================================================================
 */

const REVALIDATE_SECONDS = 600
const FALLBACK_PHOTO = { src: '/images/hero-rally.jpg', alt: { et: 'Rallisõiduk Eesti kiiruskatsel', en: 'Rally car on an Estonian special stage' } }

const builder = imageUrlBuilder(sanityClient)

const EVENTS_QUERY = defineQuery(`
  *[_type == "rallyEvent" && season == $season] | order(startsAt asc){
    eventId, name, series, startsAt, endsAt, locationEt, locationEn, websiteUrl, resultsUrl, shortCode,
    logo{ asset->{ url, metadata{ dimensions{ width, height } } } },
    photo{ asset->{ url } },
    photoAltEt, photoAltEn
  }
`)

type SanityEvent = {
  eventId: string
  name: string
  series: string | null
  startsAt: string
  endsAt: string
  locationEt: string | null
  locationEn: string | null
  websiteUrl: string | null
  resultsUrl: string | null
  shortCode: string | null
  logo: { asset: { url: string; metadata: { dimensions: { width: number; height: number } } } | null } | null
  photo: { asset: { url: string } | null } | null
  photoAltEt: string | null
  photoAltEn: string | null
}

function toEvent(doc: SanityEvent, now: number): RallyEvent {
  const start = new Date(doc.startsAt).getTime()
  const end = new Date(doc.endsAt).getTime()
  return {
    id: doc.eventId,
    name: doc.name,
    series: doc.series ?? 'EMV',
    startsAt: doc.startsAt,
    endsAt: doc.endsAt,
    location: { et: doc.locationEt ?? '', en: doc.locationEn ?? doc.locationEt ?? '' },
    // Staatus tuletatakse kuupäevadest: toimetaja ei pea seda käsitsi keerama.
    status: end < now ? 'lopetatud' : start <= now ? 'live' : 'tulemas',
    logo: doc.logo?.asset
      ? {
          src: builder.image(doc.logo.asset.url).width(800).auto('format').url(),
          alt: doc.name,
          width: doc.logo.asset.metadata.dimensions.width,
          height: doc.logo.asset.metadata.dimensions.height,
        }
      : undefined,
    photo: doc.photo?.asset
      ? {
          src: builder.image(doc.photo.asset.url).width(1600).auto('format').url(),
          alt: { et: doc.photoAltEt ?? doc.name, en: doc.photoAltEn ?? doc.photoAltEt ?? doc.name },
        }
      : FALLBACK_PHOTO,
    websiteUrl: doc.websiteUrl ?? undefined,
    resultsUrl: doc.resultsUrl ?? undefined,
    shortCode: doc.shortCode ?? undefined,
  }
}

/** Hooaja kalender kronoloogilises järjekorras. */
export async function getEvents(season = new Date().getFullYear()): Promise<RallyEvent[]> {
  if (!sanityConfigured) return byDate(EVENTS)
  try {
    const docs = await sanityClient.fetch<SanityEvent[]>(EVENTS_QUERY, { season }, { next: { revalidate: REVALIDATE_SECONDS } })
    if (docs.length === 0) return byDate(EVENTS)
    const now = Date.now()
    return docs.map((d) => toEvent(d, now))
  } catch (error) {
    console.error('[events] Sanity päring ebaõnnestus, kasutan kood-kalendrit', error)
    return byDate(EVENTS)
  }
}
