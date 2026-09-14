/**
 * ============================================================================
 *  Terminal Autoralli Eesti meistrivõistlused 2026 — hooaja kalender.
 * ============================================================================
 *  Kuupäevad ja ürituste nimed tulevad kasutajalt (päris 2026. aasta
 *  kalender). Kellaajad (09:00 algus / 17:00 lõpp, kus täpsemat pole antud)
 *  on kohatäide korralduslikuks ajaraamiks, mitte ametlik ajakava — need
 *  tuleb asendada, kui EAL avaldab täpse tunniplaani.
 *
 *  claude.md nõue: igal võistlusel on üks püsiv ID, mida kasutavad kalender,
 *  osalejad, tulemused ja uudised.
 *
 *  Nimed on pärisnimed (ei tõlgita); asukoht ja fotode alt-tekst on
 *  kakskeelsed (`LocalizedString`, vt lib/i18n.ts `pick`).
 * ============================================================================
 */

import type { LocalizedString } from './i18n'

export type EventStatus = 'tulemas' | 'live' | 'lopetatud'

export type RallyEvent = {
  /** Püsiv ID. Kalender, stardinimekiri, tulemused ja uudised viitavad sellele. */
  id: string
  name: string
  /** ISO 8601, sest sortimine ja countdown vajavad üheselt mõistetavat vormingut. */
  startsAt: string
  endsAt: string
  location: LocalizedString
  series: string
  status: EventStatus
  /**
   * Valikuline, ürituse enda ametlik embleem (nt rallikilp). Näidatakse
   * ainult siis, kui see on olemas — mitte iga võistlusel pole oma märki.
   */
  logo?: { src: string; alt: string; width: number; height: number }
  /** Päris EMV-etappide fotod (kaust `Fotod/`), kalendrikaardi taustaks. */
  photo: { src: string; alt: LocalizedString }
  /**
   * Valikuline, ürituse enda ametlik koduleht. Kui olemas, viib kalendri-
   * kaart otse sinna (uues aknas), mitte saidi enda platsihoidja lehele.
   */
  websiteUrl?: string
  /**
   * Valikuline, ajavõtupartneri (RallyLynx) leht, kus selle etapi
   * tulemused / registreerimine avaldatakse. /tulemused plaat viib siia;
   * kalender jääb korraldaja kodulehe (`websiteUrl`) juurde.
   */
  resultsUrl?: string
  /** Valikuline lühikood punktitabeli veerupäiseks (nt SAR); muidu tuletatakse nimest. */
  shortCode?: string
}

export const EVENTS: RallyEvent[] = [
  {
    id: 'ev-2026-01',
    name: 'Alūksnes Rallijs',
    startsAt: '2026-01-23T09:00:00+02:00',
    endsAt: '2026-01-24T17:00:00+02:00',
    location: { et: 'Alūksne, Läti', en: 'Alūksne, Latvia' },
    series: 'EMV',
    status: 'lopetatud',
    photo: { src: '/images/action-speed.jpg', alt: { et: 'Rallisõiduk kiirel läbisõidul', en: 'Rally car at full speed' } },
  },
  {
    id: 'ev-2026-02',
    name: 'Saaremaa Sprintralli',
    startsAt: '2026-05-09T09:00:00+03:00',
    endsAt: '2026-05-09T18:00:00+03:00',
    location: { et: 'Pihtla, Saaremaa', en: 'Pihtla, Saaremaa' },
    series: 'EMV',
    status: 'lopetatud',
    logo: {
      src: '/images/logo-saaremaa-sprint.png',
      alt: 'Saaremaa Sprintralli 2026',
      width: 292,
      height: 182,
    },
    photo: { src: '/images/hero-rally.jpg', alt: { et: 'Rallisõiduk Eesti kiiruskatsel', en: 'Rally car on an Estonian special stage' } },
  },
  {
    id: 'ev-2026-03',
    name: 'Jyväskylä Ralli',
    startsAt: '2026-06-12T09:00:00+03:00',
    endsAt: '2026-06-13T17:00:00+03:00',
    location: { et: 'Jyväskylä, Soome', en: 'Jyväskylä, Finland' },
    series: 'EMV',
    status: 'lopetatud',
    logo: {
      src: '/images/logo-jyvaskyla.png',
      alt: 'SM Jyväskylä Ralli 2026',
      width: 812,
      height: 606,
    },
    photo: { src: '/images/action-rain.jpg', alt: { et: 'Rallisõiduk vihmases kiiruskatses', en: 'Rally car on a rainy special stage' } },
  },
  {
    id: 'ev-2026-04',
    name: 'Lõuna-Eesti Ralli',
    startsAt: '2026-07-03T09:00:00+03:00',
    endsAt: '2026-07-04T17:00:00+03:00',
    location: { et: 'Võru', en: 'Võru' },
    series: 'EMV',
    status: 'lopetatud',
    logo: {
      src: '/images/logo-louna-eesti.png',
      alt: 'Lõuna-Eesti Ralli 2026',
      width: 1998,
      height: 1248,
    },
    photo: { src: '/images/action-crowd.jpg', alt: { et: 'Pealtvaatajad jälgimas rallisõidukit', en: 'Spectators watching a rally car' } },
    websiteUrl: 'https://lounaeestirally.ee/',
    resultsUrl: 'https://rallylynx.com/e/louna-eesti-ralli-26/results',
  },
  {
    id: 'ev-2026-05',
    name: 'Paide Rally',
    startsAt: '2026-08-21T09:00:00+03:00',
    endsAt: '2026-08-22T17:00:00+03:00',
    location: { et: 'Paide', en: 'Paide' },
    series: 'EMV',
    status: 'lopetatud',
    logo: {
      src: '/images/logo-paide.png',
      alt: 'Paide Rally 2026',
      width: 1011,
      height: 375,
    },
    photo: { src: '/images/action-speed.jpg', alt: { et: 'Rallisõiduk kiirel läbisõidul', en: 'Rally car at full speed' } },
    websiteUrl: 'https://paiderally.ee/',
    resultsUrl: 'https://rallylynx.com/e/humus-paide-rally-2026/results',
  },
  {
    id: 'ev-2026-06',
    name: 'Saaremaa Ralli',
    startsAt: '2026-10-09T09:00:00+03:00',
    endsAt: '2026-10-10T17:00:00+03:00',
    location: { et: 'Kuressaare', en: 'Kuressaare' },
    series: 'EMV',
    status: 'tulemas',
    logo: {
      src: '/images/saaremaa-rally-plate.png',
      alt: 'Saaremaa Ralli 2026, 59. korraldus',
      width: 1996,
      height: 964,
    },
    photo: { src: '/images/hero-rally.jpg', alt: { et: 'Rallisõiduk Eesti kiiruskatsel', en: 'Rally car on an Estonian special stage' } },
    websiteUrl: 'https://saaremaarally.eu/',
    resultsUrl: 'https://rallylynx.com/e/saaremaa-rally-2026/registrations',
  },
]

/**
 * Lähim tulevane (või parasjagu käimasolev) võistlus. Kui hooaeg on läbi,
 * langeb tagasi viimasele toimunud võistlusele — nii ei jää hero kunagi
 * ilma sisuta ja ei näita ekslikult juba möödunud etappi "järgmisena".
 */
export function nextEvent(events: RallyEvent[] = EVENTS): RallyEvent {
  const now = Date.now()
  const upcoming = events
    .filter((e) => new Date(e.endsAt).getTime() >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())

  if (upcoming.length > 0) return upcoming[0]

  return [...events].sort(
    (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
  )[0]
}

/** Kalendrivaate järjekord: kronoloogiline. */
export function byDate(events: RallyEvent[] = EVENTS): RallyEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )
}
