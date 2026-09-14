import { defineField, defineType } from 'sanity'

/**
 * ============================================================================
 *  Punktiseis — üks dokument klassi ja hooaja kohta.
 * ============================================================================
 *  Rida = ekipaaž; punktid on loend {võistlus → punktid}, nii et tabel
 *  joondub kalendri võistlustega (sama püsiv event ID). Allikas ja
 *  uuendusaeg on kohustuslikud (claude.md: tulemuse juures peab olema
 *  allikas ja viimase uuenduse aeg; ametlikku seisu ei tohi vaikimisi üle
 *  kirjutada — sellepärast on staatus eraldi väli, mida toimetaja teadlikult
 *  muudab).
 *
 *  Kuidas punktid siia jõuavad (käsitsi, PDF-import või partneri API),
 *  otsustatakse hiljem; skeem on sama.
 * ============================================================================
 */

export const standingsRow = defineType({
  name: 'standingsRow',
  title: 'Punktiseisu rida',
  type: 'object',
  fields: [
    defineField({ name: 'position', title: 'Koht', type: 'number', validation: (r) => r.required().min(1) }),
    defineField({ name: 'driver', title: 'Sõitja', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'coDriver', title: 'Kaardilugeja', type: 'string' }),
    defineField({ name: 'entrant', title: 'Võistkond / registreerija', type: 'string' }),
    defineField({ name: 'car', title: 'Auto', type: 'string' }),
    defineField({
      name: 'points',
      title: 'Punktid võistluste kaupa',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'eventPoints',
          fields: [
            defineField({ name: 'event', title: 'Võistlus', type: 'reference', to: [{ type: 'rallyEvent' }], validation: (r) => r.required() }),
            defineField({ name: 'points', title: 'Punktid', type: 'number', description: 'Tühi = ei osalenud / ei lõpetanud.' }),
          ],
          preview: { select: { title: 'event.name', subtitle: 'points' }, prepare: (v) => ({ title: v.title as string, subtitle: String(v.subtitle ?? '–') }) },
        },
      ],
    }),
    defineField({ name: 'total', title: 'Kokku', type: 'number', validation: (r) => r.required().min(0) }),
  ],
  preview: {
    select: { position: 'position', driver: 'driver', coDriver: 'coDriver', total: 'total' },
    prepare: (v) => ({ title: `${v.position}. ${v.driver}${v.coDriver ? ` / ${v.coDriver}` : ''}`, subtitle: `${v.total ?? 0} p` }),
  },
})

export const standingsTable = defineType({
  name: 'standingsTable',
  title: 'Punktiseis',
  type: 'document',
  fields: [
    defineField({ name: 'season', title: 'Hooaeg', type: 'number', validation: (r) => r.required().min(2000) }),
    defineField({
      name: 'classId',
      title: 'Klassi ID',
      type: 'string',
      description: 'Püsiv tähis, nt emv-absoluut, emv1, emv2, emv-lada. Ei muutu.',
      validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: 'classId' }),
    }),
    defineField({ name: 'label', title: 'Klassi nimi', type: 'string', description: 'nt EMV Absoluut, EMV1', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Järjekord', type: 'number', description: 'Väiksem number ees; absoluutarvestus on tavaliselt 0.', initialValue: 100 }),
    defineField({
      name: 'status',
      title: 'Staatus',
      type: 'string',
      options: {
        list: [
          { title: 'Mitteametlik', value: 'unofficial' },
          { title: 'Esialgne', value: 'provisional' },
          { title: 'Ametlik', value: 'official' },
          { title: 'Muudetud', value: 'amended' },
        ],
        layout: 'radio',
      },
      initialValue: 'provisional',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'source', title: 'Allikas', type: 'string', description: 'nt "EAL punktitabel pärast Paidet, v3 (PDF)"', validation: (r) => r.required() }),
    defineField({ name: 'sourceUrl', title: 'Allika link', type: 'url' }),
    defineField({ name: 'updatedAt', title: 'Seis kuupäevaga', type: 'datetime', description: 'Millise seisuga tabel on.', validation: (r) => r.required() }),
    defineField({
      name: 'afterEvent',
      title: 'Seis pärast võistlust',
      type: 'reference',
      to: [{ type: 'rallyEvent' }],
      description: 'Viimane võistlus, mille punktid on sees.',
    }),
    defineField({ name: 'rows', title: 'Read', type: 'array', of: [{ type: 'standingsRow' }] }),
  ],
  orderings: [{ title: 'Järjekorra järgi', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { label: 'label', season: 'season', status: 'status', rows: 'rows' },
    prepare: (v) => ({
      title: `${v.label} ${v.season}`,
      subtitle: `${Array.isArray(v.rows) ? v.rows.length : 0} rida · ${v.status}`,
    }),
  },
})

export const standingsSchemas = [standingsRow, standingsTable]
