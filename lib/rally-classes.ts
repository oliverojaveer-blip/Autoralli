/**
 * ============================================================================
 *  Võistlusklasside andmed — /klassid valija.
 * ============================================================================
 *  Klassikirjeldused, arvestused ja vanusepiirid on saidi omaniku poolt
 *  otse antud (EAL-i ametlik sisu). Ainult neljal klassil (EMV2, EMV3,
 *  EMV5, EMV6) on hetkel päris autofoto — ülejäänud ootavad fotot ja
 *  näidatakse valijas klassikoodi plakatina, mitte väljamõeldud pildiga.
 *
 *  Autopildid (public/assets/rally-classes/) on AI-abiga taustast eraldatud
 *  (vt autoralli-class-selector-assets/README.md "Production review note") —
 *  sponsorikirjad tuleb enne ametlikku avaldamist originaalfotoga üle
 *  kontrollida.
 * ============================================================================
 */

import {
  E_2WD_DOC,
  E_4WD_DOC,
  EMV_GAZ_DOC,
  EMV_LADA_DOC,
  GAZOPEN_DOC,
} from './rules-documents'

export type RallyClass = {
  id: string
  shortName: string
  name: string
  eyebrow?: string
  description: string
  imageWebp?: string
  imagePng?: string
  imageAlt?: string
  imagePosition?: { x: number; y: number; scale: number }
  facts: Array<{ label: string; value: string }>
  eligibleCars?: string[]
  rulesUrl?: string
  resultsUrl?: string
}

export const RALLY_CLASSES: RallyClass[] = [
  {
    id: 'emv1',
    shortName: 'EMV1',
    name: 'Rally1',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Rallispordi tipptehnika klass, kus võistlevad Rally1-, WRC- ja Proto-autod.',
    imageWebp: '/assets/rally-classes/car-emv1-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv1-cutout.png',
    imageAlt: 'Toyota GR Yaris Rally1 võistlusauto',
    facts: [
      { label: 'Klassi kuuluvad', value: 'Rally1, WRC, Proto' },
      { label: 'Vanuse alampiir', value: '17 aastat' },
    ],
  },
  {
    id: 'emv2',
    shortName: 'EMV2',
    name: 'Rally2',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Rally2-autode arvestusklass, kuhu kuuluvad ka Rally2 Kit, suurema mootorimahuga NR4 ning vabalthingavad S2000 autod.',
    imageWebp: '/assets/rally-classes/car-emv2-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv2-cutout.png',
    imageAlt: 'Škoda Fabia RS Rally2 võistlusauto',
    facts: [
      {
        label: 'Klassi kuuluvad',
        value: 'Rally2, Rally2 Kit (VR4K), NR4 üle 2000 cm³, S2000 2.0',
      },
      { label: 'Vanuse alampiir', value: '17 aastat' },
    ],
  },
  {
    id: 'emv3',
    shortName: 'EMV3',
    name: 'Rally3',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Rally3-autode klass, kus võistlevad 1390-2000 cm³ vabalthingava või 927-1620 cm³ turbomootoriga autod.',
    imageWebp: '/assets/rally-classes/car-emv3-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv3-cutout.png',
    imageAlt: 'Rally3 klassi võistlusauto',
    facts: [
      { label: 'Klassi kuuluvad', value: 'Rally3' },
      { label: 'Vanuse alampiir', value: '17 aastat' },
    ],
  },
  {
    id: 'emv4',
    shortName: 'EMV4',
    name: 'Rally4, R3 ja Rally5',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Mitmekesine arvestusklass, mis ühendab Rally4-, R3-, Rally5-, Rally5-Kit ja kuni 2000 cm³ A-rühma autod.',
    imageWebp: '/assets/rally-classes/car-emv4-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv4-cutout.png',
    imageAlt: 'Ford Fiesta Rally4 klassi võistlusauto',
    facts: [
      {
        label: 'Klassi kuuluvad',
        value: 'Rally4, R3, Rally5, Rally5-Kit, A-rühm kuni 2000 cm³',
      },
      { label: 'Vanuse alampiir', value: '16 aastat' },
    ],
  },
  {
    id: 'emv5',
    shortName: 'EMV5',
    name: '4WD',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Nelikveoliste rahvusliku rühma ralliautode klass, kus võistlevad kuni 3500 cm³ mootorimahuga E12 ja N4 autod.',
    imageWebp: '/assets/rally-classes/car-emv5-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv5-cutout.png',
    imageAlt: 'BMW nelikveoline rallisõiduk',
    facts: [
      { label: 'Klassi kuuluvad', value: '4WD kuni 3500 cm³, E12, N4' },
      { label: 'Vanuse alampiir', value: '17 aastat' },
    ],
    rulesUrl: E_4WD_DOC.href,
  },
  {
    id: 'emv6',
    shortName: 'EMV6',
    name: 'RWD',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Võimsate tagaveoliste ralliautode klass kuni 3500 cm³. Selles arvestuses võivad osaleda ka EMV7 ja EMV8 tingimustele vastavad tagaveolised autod.',
    imageWebp: '/assets/rally-classes/car-emv6-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv6-cutout.png',
    imageAlt: 'Mitsubishi Lancer Evo tagaveoline rallisõiduk',
    facts: [
      { label: 'Klassi kuuluvad', value: 'Tagaveolised 2WD kuni 3500 cm³, E11 RWD' },
      { label: 'Vanuse alampiir', value: '16 aastat' },
    ],
    rulesUrl: E_2WD_DOC.href,
  },
  {
    id: 'emv7',
    shortName: 'EMV7',
    name: '2WD 1600-2000',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Kaheveoliste 1600-2000 cm³ ralliautode klass, kuhu kuuluvad R3-, A7-, N3- ja E10-autod.',
    imageWebp: '/assets/rally-classes/car-emv7-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv7-cutout.png',
    imageAlt: 'Honda Civic Type R kaheveoline võistlusauto',
    facts: [
      {
        label: 'Klassi kuuluvad',
        value: 'R3, A7, N3, E10 (sh aegunud homologeeringuga R3 turbo)',
      },
      { label: 'Vanuse alampiir', value: '16 aastat' },
    ],
    rulesUrl: E_2WD_DOC.href,
  },
  {
    id: 'emv8',
    shortName: 'EMV8',
    name: '2WD kuni 1600',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Kaheveoliste kuni 1600 cm³ ralliautode arvestusklass, kus on kesksel kohal E9 tehnilistele tingimustele vastavad autod.',
    facts: [
      { label: 'Klassi kuuluvad', value: '2WD kuni 1600 cm³, E9' },
      { label: 'Vanuse alampiir', value: '16 aastat' },
    ],
    rulesUrl: E_2WD_DOC.href,
  },
  {
    id: 'emv-gaz',
    shortName: 'EMV GAZ',
    name: 'EMV GAZ',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'GAZ veoautode meistrivõistluste klass, mis toob rallirajale kuni 4400 cm³ mootoriga võistlusveokid.',
    imageWebp: '/assets/rally-classes/car-emv-gaz-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv-gaz-cutout.png',
    imageAlt: 'GAZ võistlusveok',
    facts: [
      { label: 'Klassi kuuluvad', value: 'GAZ veoautod kuni 4400 cm³, E13' },
      { label: 'Vanuse alampiir', value: '18 aastat' },
      { label: 'Juhiluba', value: 'C1- või C-kategooria' },
    ],
    rulesUrl: EMV_GAZ_DOC.href,
  },
  {
    id: 'emv-lada',
    shortName: 'EMV Lada',
    name: 'EMV Lada',
    eyebrow: 'Eesti meistrivõistlused',
    description:
      'Klassikaliste Lada ralliautode arvestus, kus võisteldakse Lada Classic 2022 tehniliste tingimuste alusel.',
    imageWebp: '/assets/rally-classes/car-emv-lada-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv-lada-cutout.png',
    imageAlt: 'Lada Classic võistlusauto',
    facts: [
      { label: 'Tehniline alus', value: 'Lada Classic 2022' },
      { label: 'Vanuse alampiir', value: '16 aastat' },
    ],
    rulesUrl: EMV_LADA_DOC.href,
  },
  {
    id: 'ekv6',
    shortName: 'EKV6',
    name: 'RWD',
    eyebrow: 'Karikavõistlused',
    description:
      'Tagaveoliste kuni 3050 cm³ ralliautode karikavõistluste klass. Tegemist on EMV-välise arvestusega.',
    facts: [
      { label: 'Klassi kuuluvad', value: '2WD kuni 3050 cm³, E11 RWD' },
      { label: 'Erand', value: 'BMW S50, S52 ja S54 mootorikoodid pole lubatud' },
      { label: 'Vanuse alampiir', value: '16 aastat' },
    ],
    rulesUrl: E_2WD_DOC.href,
  },
  {
    id: 'gaz-open',
    shortName: 'GAZ Open',
    name: 'GAZ Open',
    eyebrow: 'Karikavõistlused',
    description:
      'Avatud GAZ veoautode karikavõistluste klass, kus võisteldakse GAZ Open tehniliste tingimuste järgi. EMV-väline lisaarvestus — autasustatakse iga etapi kolme parimat ning hooaja kokkuvõttes esikolmikut.',
    facts: [
      { label: 'Arvestus', value: 'Eesti karikavõistlused' },
      { label: 'Vanuse alampiir', value: '18 aastat' },
      { label: 'Juhiluba', value: 'C1- või C-kategooria' },
    ],
    rulesUrl: GAZOPEN_DOC.href,
  },
]
