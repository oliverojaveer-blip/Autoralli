import { defineField, defineType } from 'sanity'

/**
 * ============================================================================
 *  Otseblogi (rally live blog) — Sanity skeemid.
 * ============================================================================
 *  Kolm dokumenditüüpi:
 *
 *  - `rallyEvent`     hooaja võistlus; `eventId` on sama püsiv ID, mida
 *                     kasutavad kalender, tulemused ja uudised
 *                     (claude.md: igal võistlusel üks püsiv ID).
 *  - `blogAuthor`     inimene, kes tohib postitada. Telegrami ID on siin,
 *                     mitte kunagi renderdatud lehel.
 *  - `eventContributor` autori õigus ÜHEL võistlusel: roll (usaldatud /
 *                     modereeritav), alad, nõusoleku aeg, aktiivsus. Bot
 *                     kontrollib iga sõnumit selle dokumendi vastu.
 *  - `livePost`       üks postitus: tekst, foto, video või sotsiaalmeedia
 *                     embed; staatus draft/published/hidden; katse kood.
 *
 *  Kirjutab ainult bot (serveripoolne token, ainult nende tüüpide õigus)
 *  ja Studio kasutajad (admin/toimetaja). Kaasautorid Studiosse ei logi.
 * ============================================================================
 */

export const rallyEvent = defineType({
  name: 'rallyEvent',
  title: 'Võistlus',
  type: 'document',
  fields: [
    defineField({
      name: 'eventId',
      title: 'Võistluse ID',
      type: 'string',
      description: 'Sama ID, mis lib/events.ts (nt ev-2026-06). Ei muutu kunagi.',
      validation: (r) => r.required().regex(/^ev-\d{4}-\d{2}$/, { name: 'eventId' }),
    }),
    defineField({ name: 'name', title: 'Nimi', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'startsAt', title: 'Algus', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'endsAt', title: 'Lõpp', type: 'datetime', validation: (r) => r.required() }),
    defineField({
      name: 'hashtags',
      title: 'Hashtagid',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ilma #-ta, nt EMV2026, SaaremaaRalli. Näidatakse blogi päises üleskutsena.',
    }),
    defineField({
      name: 'broadcastUrl',
      title: 'Otseülekande YouTube link',
      type: 'url',
      description: 'YouTube’i otseülekande või video link (nt https://www.youtube.com/watch?v=…). Näidatakse /otse → Otseülekanne. Tühi = „ülekannet ei ole“.',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'blogEnabled',
      title: 'Otseblogi on avatud',
      type: 'boolean',
      initialValue: false,
      description: 'Kui väljas, ei võta bot postitusi vastu ja /otse blogi vahekaart on peidus.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'eventId' } },
})

export const blogAuthor = defineType({
  name: 'blogAuthor',
  title: 'Blogi autor',
  type: 'document',
  fields: [
    defineField({
      name: 'displayName',
      title: 'Kuvatav nimi',
      type: 'string',
      description: 'See on avalik. Võib olla ka "SS6 pealtvaataja", kui inimene ei soovi nime.',
      validation: (r) => r.required().max(60),
    }),
    defineField({ name: 'handle', title: 'Sotsiaalmeedia konto (avalik)', type: 'string', description: 'nt @kati.kask, valikuline.' }),
    defineField({ name: 'avatar', title: 'Pilt', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'telegramId',
      title: 'Telegrami kasutaja ID',
      type: 'string',
      description: 'Isikuandmed. Seob boti vestluse selle autoriga. Ei jõua kunagi lehele.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'telegramUsername', title: 'Telegrami kasutajanimi', type: 'string', description: 'Isikuandmed, ainult admini jaoks.' }),
    defineField({ name: 'contactEmail', title: 'E-post', type: 'string', description: 'Isikuandmed. Kustutamis- ja õigustepäringute jaoks.' }),
  ],
  preview: { select: { title: 'displayName', subtitle: 'handle', media: 'avatar' } },
})

export const eventContributor = defineType({
  name: 'eventContributor',
  title: 'Kaasautor võistlusel',
  type: 'document',
  description: 'Ühe autori õigus postitada ühel võistlusel.',
  fields: [
    defineField({ name: 'author', title: 'Autor', type: 'reference', to: [{ type: 'blogAuthor' }], validation: (r) => r.required() }),
    defineField({ name: 'event', title: 'Võistlus', type: 'reference', to: [{ type: 'rallyEvent' }], validation: (r) => r.required() }),
    defineField({
      name: 'role',
      title: 'Roll',
      type: 'string',
      options: {
        list: [
          { title: 'Usaldatud — avaldatakse kohe', value: 'trusted' },
          { title: 'Modereeritav — läheb ootejärjekorda', value: 'moderated' },
          { title: 'Moderaator — avaldab, peidab ja kinnitab', value: 'moderator' },
        ],
        layout: 'radio',
      },
      initialValue: 'moderated',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'areas',
      title: 'Alad',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Kust inimene postitab, nt SS3, SS6, Hooldus. Näidatakse bylines.',
    }),
    defineField({ name: 'active', title: 'Aktiivne', type: 'boolean', initialValue: true }),
    defineField({
      name: 'inviteCode',
      title: 'Kutse kood',
      type: 'string',
      description: 'Bot genereerib; osa kutselingist t.me/AutoralliBot?start=<kood>. Ühekordne.',
      readOnly: true,
    }),
    defineField({
      name: 'consentAt',
      title: 'Nõusolek antud',
      type: 'datetime',
      description: 'Millal inimene kinnitas botis kaasautori tingimused ja privaatsusteate. GDPR tõend.',
      readOnly: true,
    }),
    defineField({ name: 'consentVersion', title: 'Tingimuste versioon', type: 'string', readOnly: true }),
    defineField({ name: 'invitedBy', title: 'Kutsus', type: 'string', description: 'Admini nimi või Telegrami kasutajanimi.', readOnly: true }),
  ],
  preview: {
    select: { name: 'author.displayName', event: 'event.name', role: 'role', active: 'active' },
    prepare: (v) => ({
      title: `${v.name ?? '—'} · ${v.event ?? '—'}`,
      subtitle: `${v.role ?? ''}${v.active === false ? ' · MITTEAKTIIVNE' : ''}`,
    }),
  },
})

export const livePost = defineType({
  name: 'livePost',
  title: 'Otseblogi postitus',
  type: 'document',
  fields: [
    defineField({ name: 'event', title: 'Võistlus', type: 'reference', to: [{ type: 'rallyEvent' }], validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Autor', type: 'reference', to: [{ type: 'blogAuthor' }], validation: (r) => r.required() }),
    defineField({
      name: 'kind',
      title: 'Liik',
      type: 'string',
      options: {
        list: [
          { title: 'Tekst', value: 'text' },
          { title: 'Foto', value: 'photo' },
          { title: 'Video', value: 'video' },
          { title: 'Sotsiaalmeedia postitus (embed)', value: 'embed' },
          { title: 'Korraldaja teade', value: 'notice' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Staatus',
      type: 'string',
      options: {
        list: [
          { title: 'Ootel (modereerimata)', value: 'draft' },
          { title: 'Avaldatud', value: 'published' },
          { title: 'Peidetud', value: 'hidden' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', title: 'Tekst', type: 'text', validation: (r) => r.max(1000) }),
    defineField({
      name: 'stageCode',
      title: 'Kiiruskatse',
      type: 'string',
      description: 'nt SS6. Bot loeb selle sõnumist; seob postituse tulemuste vaatega.',
      validation: (r) => r.regex(/^(SS\d{1,2}|SD|HOOLDUS|SERVICE)?$/i, { name: 'stageCode' }),
    }),
    defineField({ name: 'image', title: 'Foto', type: 'image', options: { hotspot: true }, hidden: false }),
    defineField({ name: 'imageAlt', title: 'Foto kirjeldus (alt)', type: 'string', description: 'Ligipääsetavus. Bot täidab captioniga, toimetaja võib parandada.' }),
    defineField({ name: 'video', title: 'Video', type: 'file', options: { accept: 'video/*' } }),
    defineField({ name: 'videoPoster', title: 'Video kaader', type: 'image' }),
    defineField({
      name: 'embedUrl',
      title: 'Sotsiaalmeedia postituse URL',
      type: 'url',
      description: 'Avalik Instagrami / Facebooki / TikToki / YouTube’i / X-i postitus. Lehel laetakse klõpsuga.',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({ name: 'credit', title: 'Foto/video autor', type: 'string', description: 'Kui erineb postitajast, nt "Foto: Kati Kask".' }),
    defineField({ name: 'pinned', title: 'Kinnitatud', type: 'boolean', initialValue: false, description: 'Näidatakse võistluse ribal. Hoia ühte korraga.' }),
    defineField({ name: 'publishedAt', title: 'Avaldatud', type: 'datetime' }),
    defineField({ name: 'capturedAt', title: 'Jäädvustatud', type: 'datetime', description: 'Millal sõnum botile saadeti (võib olla varasem kui avaldamine, kui levi puudus).' }),
    defineField({ name: 'source', title: 'Allikas', type: 'string', options: { list: ['telegram', 'studio', 'web-form'] }, readOnly: true }),
    defineField({ name: 'moderatedBy', title: 'Modereeris', type: 'string', readOnly: true }),
    defineField({ name: 'telegramMessageId', title: 'Telegrami sõnumi ID', type: 'string', description: 'Ainult "paranda/kustuta" vastuste sidumiseks. Ei renderdata.', readOnly: true }),
  ],
  orderings: [{ title: 'Uuemad ees', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { body: 'body', kind: 'kind', status: 'status', stage: 'stageCode', author: 'author.displayName', media: 'image' },
    prepare: (v) => ({
      title: `${v.stage ? `${v.stage} · ` : ''}${(v.body as string | undefined)?.slice(0, 60) ?? v.kind}`,
      subtitle: `${v.author ?? '—'} · ${v.status}`,
    }),
  },
})

export const liveBlogSchemas = [rallyEvent, blogAuthor, eventContributor, livePost]
