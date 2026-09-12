/**
 * ============================================================================
 *  KONTSEPTSIOONI NÄIDISANDMED. VÄLJAMÕELDUD. ASENDA ENNE AVALIKUSTAMIST.
 * ============================================================================
 *  Kõik siin olevad nimed, ajad, tulemused, uudised ja teated on välja
 *  mõeldud /concept prototüübi jaoks. Ükski sõitja, meeskond ega tulemus
 *  ei ole päris. Struktuur järgib claude.md andmereegleid (püsiv event ID,
 *  tulemuse staatus, allikas ja uuendusaeg), et hiljem saaks sama kuju
 *  Supabase'ist või CMS-ist ette anda.
 *
 *  Ainult see fail tuleb asendada, komponendid ei tea kust andmed tulevad.
 * ============================================================================
 */

export type ConceptMode = 'normal' | 'race'

export type ResultStatus = 'unofficial' | 'provisional' | 'official' | 'amended'

/* ------------------------------------------------------------------ */
/*  Ühine: hooaeg, kalender, meedia, punktiseis, klassid, partnerid    */
/* ------------------------------------------------------------------ */

export const SEASON = {
  title: 'Eesti meistrivõistlused autorallis',
  year: 2026,
  rounds: 7,
  roundsDone: 4,
}

export type CalendarEvent = {
  id: string
  name: string
  short: string
  town: string
  startsAt: string
  endsAt: string
  surface: 'kruus' | 'asfalt' | 'lumi'
  status: 'lopetatud' | 'jargmine' | 'tulemas' | 'live'
}

export const CALENDAR: CalendarEvent[] = [
  { id: 'ev-2026-01', name: 'Talveralli', short: 'Talveralli', town: 'Otepää', startsAt: '2026-02-07T09:00:00+02:00', endsAt: '2026-02-07T18:00:00+02:00', surface: 'lumi', status: 'lopetatud' },
  { id: 'ev-2026-02', name: 'Kevadralli', short: 'Kevadralli', town: 'Elva', startsAt: '2026-04-18T09:00:00+03:00', endsAt: '2026-04-18T18:00:00+03:00', surface: 'kruus', status: 'lopetatud' },
  { id: 'ev-2026-03', name: 'Lõuna-Eesti Ralli', short: 'Lõuna-Eesti', town: 'Võru', startsAt: '2026-06-12T09:00:00+03:00', endsAt: '2026-06-13T18:00:00+03:00', surface: 'kruus', status: 'lopetatud' },
  { id: 'ev-2026-04', name: 'Paide Ralli', short: 'Paide', town: 'Paide', startsAt: '2026-08-22T09:00:00+03:00', endsAt: '2026-08-22T18:00:00+03:00', surface: 'kruus', status: 'lopetatud' },
  { id: 'ev-2026-05', name: 'Saaremaa Ralli', short: 'Saaremaa', town: 'Kuressaare', startsAt: '2026-10-09T09:00:00+03:00', endsAt: '2026-10-10T17:00:00+03:00', surface: 'kruus', status: 'jargmine' },
  { id: 'ev-2026-06', name: 'Viru Ralli', short: 'Viru', town: 'Rakvere', startsAt: '2026-11-06T09:00:00+02:00', endsAt: '2026-11-07T17:00:00+02:00', surface: 'kruus', status: 'tulemas' },
  { id: 'ev-2026-07', name: 'Jõuluralli', short: 'Jõulu', town: 'Pärnu', startsAt: '2026-12-12T09:00:00+02:00', endsAt: '2026-12-12T17:00:00+02:00', surface: 'kruus', status: 'tulemas' },
]

export const NEXT_EVENT = CALENDAR.find((e) => e.status === 'jargmine')!

export type NewsItem = {
  id: string
  title: string
  summary: string
  date: string
  kind: 'uudis' | 'video' | 'galerii'
  image?: string
  minutes: number
}

export const NEWS: NewsItem[] = [
  {
    id: 'n-1',
    title: 'Saaremaa Ralli stardinimekiri on avaldatud: 74 ekipaaži, neist 19 juunioride arvestuses',
    summary: 'Kaks Rally2 debütanti ja rekordarv Rally4 masinaid. Esimene katse startab reede õhtul Kuressaare linnakatsel.',
    date: '2026-09-10',
    kind: 'uudis',
    image: '/concept/rally-town.jpg',
    minutes: 4,
  },
  {
    id: 'n-2',
    title: 'Paide Ralli kokkuvõte: 12 minutit parimaid hetki',
    summary: 'Kiiruskatsete tipphetked, intervjuud finišis ja pealtvaatajate parimad kaadrid.',
    date: '2026-08-25',
    kind: 'video',
    image: '/concept/rally-rain.jpg',
    minutes: 12,
  },
  {
    id: 'n-3',
    title: 'Junior Challenge: neli sõitjat mahuvad enne viimast etappi 11 punkti sisse',
    summary: 'Saaremaa otsustab. Kes on kes ja mida igaüks tiitliks vajab.',
    date: '2026-09-04',
    kind: 'uudis',
    minutes: 6,
  },
  {
    id: 'n-4',
    title: 'Galerii: Paide Ralli publikualad fotograafi pilgu läbi',
    summary: '64 fotot ristmikelt, hüpetelt ja hooldusalast.',
    date: '2026-08-23',
    kind: 'galerii',
    image: '/concept/rally-crowd.jpg',
    minutes: 3,
  },
  {
    id: 'n-5',
    title: 'Ohutusjuhend pealtvaatajale: mida tähendab punane ala ja miks seda ei ületata',
    summary: 'Lühike selgitus koos rajakohtunike kommentaaridega.',
    date: '2026-08-30',
    kind: 'uudis',
    minutes: 3,
  },
]

export type StandingRow = {
  pos: number
  crew: string
  car: string
  points: number
  wins: number
}

export const STANDINGS: Record<'emv' | 'junior', StandingRow[]> = {
  emv: [
    { pos: 1, crew: 'M. Tammiste / K. Laane', car: 'Škoda Fabia RS Rally2', points: 118, wins: 2 },
    { pos: 2, crew: 'R. Ilves / T. Kõrb', car: 'Hyundai i20 N Rally2', points: 104, wins: 1 },
    { pos: 3, crew: 'S. Vahtra / M. Pärn', car: 'Ford Fiesta Rally2', points: 91, wins: 1 },
    { pos: 4, crew: 'J. Mänd / A. Sepp', car: 'Škoda Fabia R5', points: 77, wins: 0 },
    { pos: 5, crew: 'K. Rebane / L. Oja', car: 'Volkswagen Polo GTI R5', points: 63, wins: 0 },
  ],
  junior: [
    { pos: 1, crew: 'A. Kask / E. Lepik', car: 'Ford Fiesta Rally3', points: 96, wins: 2 },
    { pos: 2, crew: 'T. Nurm / R. Saar', car: 'Renault Clio Rally4', points: 92, wins: 1 },
    { pos: 3, crew: 'H. Kivi / M. Teder', car: 'Peugeot 208 Rally4', points: 88, wins: 1 },
    { pos: 4, crew: 'O. Lill / J. Raud', car: 'Ford Fiesta Rally4', points: 85, wins: 0 },
    { pos: 5, crew: 'E. Kuusk / P. Mets', car: 'Opel Corsa Rally4', points: 58, wins: 0 },
  ],
}

export type RallyClass = {
  id: string
  name: string
  cars: string
  note: string
  entries: number
}

export const CLASSES: RallyClass[] = [
  { id: 'rally2', name: 'Rally2', cars: 'Škoda Fabia RS, Hyundai i20 N, Ford Fiesta', note: 'Absoluutarvestuse tipp. Nelikvedu, umbes 290 hj.', entries: 14 },
  { id: 'rally3', name: 'Rally3', cars: 'Ford Fiesta Rally3', note: 'Nelikveo esimene aste. Juniorite põhiklass.', entries: 9 },
  { id: 'rally4', name: 'Rally4', cars: 'Peugeot 208, Renault Clio, Opel Corsa', note: 'Esivedu, turbo. Kõige tihedam konkurents.', entries: 21 },
  { id: 'rally5', name: 'Rally5', cars: 'Renault Clio Rally5, Ford Fiesta Rally5', note: 'Soodsaim tehasemasin. Sisenemisklass.', entries: 12 },
  { id: 'nat', name: 'Rahvuslikud klassid', cars: 'E11, E12, E13', note: 'Eesti reeglid, laiem valik autosid. Siit alustab enamik.', entries: 18 },
]

export type StartStep = {
  id: string
  title: string
  body: string
  link: string
}

export const START_PATH: StartStep[] = [
  { id: 'litsents', title: 'Hangi litsents', body: 'EAL-i sõitjalitsents ja tervisekontroll. Menetlus võtab umbes kaks nädalat.', link: '/alusta/litsents' },
  { id: 'auto', title: 'Vali auto ja klass', body: 'Rahvuslik klass või Rally5. Rendimasin on esimeseks hooajaks mõistlik.', link: '/alusta/auto' },
  { id: 'kaardilugeja', title: 'Leia kaardilugeja', body: 'Legendi lugemine on omaette oskus. Klubid aitavad paari kokku viia.', link: '/alusta/kaardilugeja' },
  { id: 'registreeru', title: 'Registreeru võistlusele', body: 'Esimeseks stardiks sobib ühepäevane ralli. Registreerumine sulgub 10 päeva enne.', link: '/alusta/registreerumine' },
]

export type Partner = {
  id: string
  name: string
  tier: 'pea' | 'ametlik'
  logo?: string
  width?: number
  height?: number
}

export const PARTNERS: Partner[] = [
  { id: 'eal', name: 'Eesti Autospordi Liit', tier: 'pea', logo: '/eal-logo.png', width: 160, height: 160 },
  { id: 'terminal', name: 'Terminal', tier: 'pea', logo: '/terminal-logo.png', width: 528, height: 132 },
  { id: 'p1', name: 'Kuressaare Rehvikeskus', tier: 'ametlik' },
  { id: 'p2', name: 'Läänemaa Kütus', tier: 'ametlik' },
  { id: 'p3', name: 'Nord Kindlustus', tier: 'ametlik' },
  { id: 'p4', name: 'Raadio Ralli', tier: 'ametlik' },
]

/* ------------------------------------------------------------------ */
/*  Race Mode: üks väljamõeldud live-ralli                             */
/* ------------------------------------------------------------------ */

export type StageStatus = 'lopetatud' | 'kaimas' | 'tulemas' | 'katkestatud'

export type Stage = {
  id: string
  no: number
  name: string
  km: number
  day: 'reede' | 'laupäev'
  start: string
  status: StageStatus
  /** Katse võitja, kui katse on lõpetatud. */
  winner?: string
  time?: string
}

export const LIVE_EVENT = {
  id: NEXT_EVENT.id,
  name: 'Saaremaa Ralli',
  year: 2026,
  town: 'Kuressaare',
  day: 2,
  dayLabel: 'laupäev',
  /** Andmete kellaaeg. Fikseeritud, et server ja klient renderdaks sama. */
  clock: '14:12',
  status: 'Ralli kestab',
  source: 'Ajavõtt: Saaremaa Ralli korraldaja (näidis)',
  resultStatus: 'unofficial' as ResultStatus,
  updatedAgoSeconds: 41,
}

export const STAGES: Stage[] = [
  { id: 'kk1', no: 1, name: 'Kuressaare linnakatse', km: 2.1, day: 'reede', start: '19:05', status: 'lopetatud', winner: 'Tammiste', time: '1:41.8' },
  { id: 'kk2', no: 2, name: 'Kaarma', km: 14.6, day: 'laupäev', start: '08:33', status: 'lopetatud', winner: 'Ilves', time: '8:02.4' },
  { id: 'kk3', no: 3, name: 'Pihtla', km: 9.8, day: 'laupäev', start: '09:11', status: 'lopetatud', winner: 'Tammiste', time: '5:36.9' },
  { id: 'kk4', no: 4, name: 'Valjala', km: 18.2, day: 'laupäev', start: '09:54', status: 'lopetatud', winner: 'Tammiste', time: '9:48.1' },
  { id: 'kk5', no: 5, name: 'Kaarma 2', km: 14.6, day: 'laupäev', start: '11:26', status: 'lopetatud', winner: 'Vahtra', time: '7:58.7' },
  { id: 'kk6', no: 6, name: 'Pihtla 2', km: 9.8, day: 'laupäev', start: '12:04', status: 'lopetatud', winner: 'Ilves', time: '5:34.2' },
  { id: 'kk7', no: 7, name: 'Valjala 2', km: 18.2, day: 'laupäev', start: '12:47', status: 'lopetatud', winner: 'Tammiste', time: '9:44.6' },
  { id: 'kk8', no: 8, name: 'Kärla', km: 12.3, day: 'laupäev', start: '13:41', status: 'kaimas' },
  { id: 'kk9', no: 9, name: 'Lümanda', km: 21.7, day: 'laupäev', start: '14:32', status: 'tulemas' },
  { id: 'kk10', no: 10, name: 'Kihelkonna', km: 8.4, day: 'laupäev', start: '15:20', status: 'tulemas' },
  { id: 'kk11', no: 11, name: 'Kärla 2', km: 12.3, day: 'laupäev', start: '16:15', status: 'tulemas' },
  { id: 'kk12', no: 12, name: 'Lümanda 2', km: 21.7, day: 'laupäev', start: '17:06', status: 'tulemas' },
]

export const CURRENT_STAGE = STAGES.find((s) => s.status === 'kaimas')!
export const NEXT_STAGE = STAGES.find((s) => s.status === 'tulemas')!
export const LAST_STAGE = [...STAGES].reverse().find((s) => s.status === 'lopetatud')!

export type LeaderboardRow = {
  pos: number
  no: number
  crew: string
  car: string
  cls: string
  time: string
  gap: string
  /** Muutus võrreldes eelmise katsega: + tõus, - langus, 0 sama. */
  delta: number
}

export const LEADERBOARD: Record<'emv' | 'junior', LeaderboardRow[]> = {
  emv: [
    { pos: 1, no: 1, crew: 'M. Tammiste / K. Laane', car: 'Škoda Fabia RS Rally2', cls: 'Rally2', time: '48:07.3', gap: '', delta: 0 },
    { pos: 2, no: 3, crew: 'R. Ilves / T. Kõrb', car: 'Hyundai i20 N Rally2', cls: 'Rally2', time: '48:19.1', gap: '+11.8', delta: 0 },
    { pos: 3, no: 5, crew: 'S. Vahtra / M. Pärn', car: 'Ford Fiesta Rally2', cls: 'Rally2', time: '48:33.6', gap: '+26.3', delta: 1 },
    { pos: 4, no: 2, crew: 'J. Mänd / A. Sepp', car: 'Škoda Fabia R5', cls: 'Rally2', time: '48:35.0', gap: '+27.7', delta: -1 },
    { pos: 5, no: 8, crew: 'K. Rebane / L. Oja', car: 'Volkswagen Polo GTI R5', cls: 'Rally2', time: '49:12.4', gap: '+1:05.1', delta: 0 },
    { pos: 6, no: 11, crew: 'P. Kallas / H. Roos', car: 'Škoda Fabia R5', cls: 'Rally2', time: '49:40.9', gap: '+1:33.6', delta: 2 },
    { pos: 7, no: 21, crew: 'A. Kask / E. Lepik', car: 'Ford Fiesta Rally3', cls: 'Rally3', time: '50:58.2', gap: '+2:50.9', delta: 0 },
    { pos: 8, no: 14, crew: 'D. Sild / K. Kivistik', car: 'Hyundai i20 R5', cls: 'Rally2', time: '51:04.7', gap: '+2:57.4', delta: -2 },
    { pos: 9, no: 24, crew: 'T. Nurm / R. Saar', car: 'Renault Clio Rally4', cls: 'Rally4', time: '52:11.0', gap: '+4:03.7', delta: 1 },
    { pos: 10, no: 27, crew: 'H. Kivi / M. Teder', car: 'Peugeot 208 Rally4', cls: 'Rally4', time: '52:18.5', gap: '+4:11.2', delta: -1 },
  ],
  junior: [
    { pos: 1, no: 21, crew: 'A. Kask / E. Lepik', car: 'Ford Fiesta Rally3', cls: 'Rally3', time: '50:58.2', gap: '', delta: 0 },
    { pos: 2, no: 24, crew: 'T. Nurm / R. Saar', car: 'Renault Clio Rally4', cls: 'Rally4', time: '52:11.0', gap: '+1:12.8', delta: 1 },
    { pos: 3, no: 27, crew: 'H. Kivi / M. Teder', car: 'Peugeot 208 Rally4', cls: 'Rally4', time: '52:18.5', gap: '+1:20.3', delta: -1 },
    { pos: 4, no: 31, crew: 'O. Lill / J. Raud', car: 'Ford Fiesta Rally4', cls: 'Rally4', time: '52:44.9', gap: '+1:46.7', delta: 0 },
    { pos: 5, no: 35, crew: 'E. Kuusk / P. Mets', car: 'Opel Corsa Rally4', cls: 'Rally4', time: '53:30.1', gap: '+2:31.9', delta: 0 },
    { pos: 6, no: 38, crew: 'L. Aas / S. Vares', car: 'Renault Clio Rally5', cls: 'Rally5', time: '55:02.6', gap: '+4:04.4', delta: 2 },
  ],
}

export type LiveUpdate = {
  id: string
  time: string
  stage: string
  kind: 'info' | 'aeg' | 'hoiatus' | 'katkestus'
  text: string
}

export const LIVE_UPDATES: LiveUpdate[] = [
  { id: 'u-1', time: '14:09', stage: 'KK8', kind: 'aeg', text: 'Tammiste vahepunktis 7,4 km: kiireim, 2,1 s Ilvese ees.' },
  { id: 'u-2', time: '14:03', stage: 'KK8', kind: 'hoiatus', text: 'Auto nr 14 (Sild) seisab 4,2 km peal teel ohutult. Ekipaaž korras, katse jätkub.' },
  { id: 'u-3', time: '13:52', stage: 'KK8', kind: 'info', text: 'Esimene auto stardis. Tee on kuiv, kruus hakkab lahti kiskuma hilisematele startijatele.' },
  { id: 'u-4', time: '13:30', stage: 'KK7', kind: 'aeg', text: 'Katse võit Tammistele, 9:44.6. Vahtra tõuseb kolmandaks.' },
  { id: 'u-5', time: '13:12', stage: 'KK7', kind: 'katkestus', text: 'Auto nr 19 (Lember) katkestas, tehniline rike. Ekipaaž korras.' },
  { id: 'u-6', time: '12:40', stage: 'Hooldus', kind: 'info', text: 'Keskpäevane hooldus lõppes. Kõik esikümne autod väljusid õigel ajal.' },
]

export const ORGANIZER_NOTICE = {
  active: true,
  title: 'Korraldaja teade',
  text: 'KK9 Lümanda pealtvaatajaala nr 2 on suletud. Kasutage ala nr 3 (Lümanda kool). Parkla avatud kuni 14:20.',
  time: '13:58',
}

export const WEATHER = {
  temp: 11,
  wind: 'Loode 8 m/s',
  sky: 'Muutlik pilvisus',
  rainChance: 35,
  road: [
    { area: 'Kärla', condition: 'Kuiv kruus, lahti kiskunud', grip: 'hea' },
    { area: 'Lümanda', condition: 'Niiske, metsalõigud varjus', grip: 'muutlik' },
    { area: 'Kihelkonna', condition: 'Kuiv, kõva pinnas', grip: 'hea' },
  ],
}

export const SPECTATOR = [
  { id: 's-1', title: 'Pealtvaatajaalad', text: 'Kolm ametlikku ala KK9 ja KK10 peal. Sissepääs võistluspassiga.', link: '/pealtvaatajale' },
  { id: 's-2', title: 'Parkimine', text: 'Lümanda kooli juures ja Kihelkonna keskuses. Alad suletakse 30 min enne esimest autot.', link: '/pealtvaatajale/parkimine' },
  { id: 's-3', title: 'Ohutus', text: 'Punane lint tähendab keelatud ala. Rajakohtuniku korraldus on lõplik.', link: '/pealtvaatajale/ohutus' },
  { id: 's-4', title: 'Ralliraadio', text: 'Otse-eeter 98,4 MHz ja veebis. Katsete tulemused mõne minuti jooksul.', link: '/raadio' },
]

export const DOCUMENTS = [
  { id: 'd-1', title: 'Bülletään nr 3: KK9 pealtvaatajaala muudatus', time: '13:58', kind: 'Bülletään' },
  { id: 'd-2', title: 'Esialgsed tulemused pärast KK7', time: '13:35', kind: 'Tulemused' },
  { id: 'd-3', title: 'Žürii otsus nr 2', time: '12:20', kind: 'Otsus' },
  { id: 'd-4', title: 'Võistlusjuhend ja lisad', time: 'reede', kind: 'Juhend' },
]

export const STREAM = {
  title: 'Otseülekanne: KK8 Kärla',
  viewers: '3 412',
  provider: 'YouTube',
  poster: '/concept/rally-pan.jpg',
}

/**
 * Katse skemaatiline trajektoor (0..100 koordinaadid) ja vahepunktid.
 * Prototüübis joonistatakse see SVG-ga. Lõpplahenduses tuleb MapLibre kaart
 * päris GPX-trassiga, vt ASSET_REQUIREMENTS.md.
 */
export type SplitSide = 'right' | 'left' | 'above' | 'below'

export const STAGE_ROUTE: {
  stage: Stage
  path: string
  splits: { at: number; label: string; km: number; x: number; y: number; side: SplitSide }[]
  leaderPassed: number
} = {
  stage: CURRENT_STAGE,
  path: 'M 6 78 C 14 70, 18 52, 27 48 S 40 60, 48 50 C 56 40, 58 26, 70 24 S 84 34, 93 18',
  splits: [
    { at: 0, label: 'Start', km: 0, x: 6, y: 78, side: 'right' },
    { at: 1, label: 'VP1', km: 4.2, x: 27, y: 48, side: 'above' },
    { at: 2, label: 'VP2', km: 7.4, x: 48, y: 50, side: 'below' },
    { at: 3, label: 'VP3', km: 10.1, x: 70, y: 24, side: 'above' },
    { at: 4, label: 'Finiš', km: 12.3, x: 93, y: 18, side: 'left' },
  ],
  /** Mitu vahepunkti liider on läbinud. Mõjutab joone „täidetud" osa. */
  leaderPassed: 2,
}

export const MEDIA_TILES = [
  { id: 'm-1', src: '/concept/rally-rain.jpg', alt: 'Sinine rallauto vihmases külakurvis', caption: 'KK6 Pihtla, vihmalõik' },
  { id: 'm-2', src: '/concept/rally-crowd.jpg', alt: 'Rallauto publikuala ees', caption: 'Kuressaare linnakatse publik' },
  { id: 'm-3', src: '/concept/rally-town.jpg', alt: 'Valge rallauto linnatänaval', caption: 'KK1 Kuressaare' },
]
