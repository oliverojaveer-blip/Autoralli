/**
 * Kannab kood-kalendri (lib/events.ts) Sanity `rallyEvent` dokumentideks —
 * ühekordne alglaadimine, et toimetaja ei peaks midagi ümber trükkima.
 *
 *   node scripts/seed-sanity-events.mts
 *
 * - Olemasolev dokument (sama eventId) UUENDATAKSE (patch), mitte ei
 *   asendata: blogi postitused ja kaasautorid viitavad selle _id-le.
 * - Uued dokumendid saavad deterministliku _id "rallyEvent-<eventId>" (punkt ID-s teeks dokumendi privaatseks).
 * - Logod ja fotod laetakse public/ kaustast Sanity varadesse; olemasolevat
 *   pilti üle ei kirjutata (toimetaja võib olla parema pannud).
 * Loeb SANITY_WRITE_TOKEN ja projekti .env.local failist. Node 24 jooksutab
 * .ts importe ilma lisatööriistata.
 */
import { readFileSync } from 'node:fs'
import { createClient } from 'next-sanity'
import { EVENTS } from '../lib/events.ts'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const [k, ...v] = l.split('=')
      return [k.trim(), v.join('=').trim()]
    }),
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2026-09-01',
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function uploadImage(publicPath: string) {
  const file = readFileSync(`public${publicPath}`)
  const asset = await client.assets.upload('image', file, { filename: publicPath.split('/').pop() })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

for (const ev of EVENTS) {
  const existing = await client.fetch<{ _id: string; logo?: unknown; photo?: unknown } | null>(
    `*[_type == "rallyEvent" && eventId == $id][0]{ _id, logo, photo }`,
    { id: ev.id },
  )
  const season = new Date(ev.startsAt).getFullYear()
  const fields: Record<string, unknown> = {
    eventId: ev.id,
    name: ev.name,
    season,
    series: ev.series,
    startsAt: ev.startsAt,
    endsAt: ev.endsAt,
    locationEt: ev.location.et,
    locationEn: ev.location.en,
    photoAltEt: ev.photo.alt.et,
    photoAltEn: ev.photo.alt.en,
    websiteUrl: ev.websiteUrl ?? null,
    resultsUrl: ev.resultsUrl ?? null,
  }
  if (ev.logo && !existing?.logo) fields.logo = await uploadImage(ev.logo.src)
  if (!existing?.photo) fields.photo = await uploadImage(ev.photo.src)

  if (existing) {
    await client.patch(existing._id).set(fields).commit()
    console.log('uuendatud', ev.id, ev.name)
  } else {
    await client.createIfNotExists({ _id: `rallyEvent-${ev.id}`, _type: 'rallyEvent', hashtags: ['EMV2026'], blogEnabled: false, ...fields })
    console.log('loodud   ', ev.id, ev.name)
  }
}
console.log('valmis')
