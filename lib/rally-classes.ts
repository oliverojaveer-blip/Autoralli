/**
 * ============================================================================
 *  Võistlusklasside andmed — /klassid valija.
 * ============================================================================
 *  Klassikirjeldused, arvestused ja vanusepiirid on saidi omaniku poolt
 *  otse antud (EAL-i ametlik sisu); ingliskeelsed tõlked on sellest
 *  tuletatud. Klassidel, millel päris autofotot pole, näidatakse valijas
 *  klassikoodi plakatina, mitte väljamõeldud pildiga.
 *
 *  Autopildid (public/assets/rally-classes/) on AI-abiga taustast eraldatud
 *  (vt autoralli-class-selector-assets/README.md "Production review note") —
 *  sponsorikirjad tuleb enne ametlikku avaldamist originaalfotoga üle
 *  kontrollida.
 *
 *  Faktide sildid on võtmed sõnastikku (`t.classes.fact*`), väärtused on
 *  kas pärisnimed (string) või kakskeelsed (`LocalizedString`).
 * ============================================================================
 */

import type { LocalizedString } from './i18n'
import {
  E_2WD_DOC,
  E_4WD_DOC,
  EMV_GAZ_DOC,
  EMV_LADA_DOC,
  GAZOPEN_DOC,
} from './rules-documents'

export type ClassFactLabel =
  | 'factIncludes'
  | 'factMinAge'
  | 'factLicence'
  | 'factTechnicalBasis'
  | 'factException'
  | 'factSeries'

export type ClassFact =
  | { label: ClassFactLabel; value: LocalizedString | string }
  | { label: 'factMinAge'; years: number }

export type RallyClass = {
  id: string
  shortName: string
  name: LocalizedString | string
  series: 'emv' | 'cup'
  description: LocalizedString
  imageWebp?: string
  imagePng?: string
  imageAlt?: LocalizedString
  facts: ClassFact[]
  rulesUrl?: string
  resultsUrl?: string
}

const LICENCE_C: LocalizedString = { et: 'C1- või C-kategooria', en: 'Category C1 or C' }

export const RALLY_CLASSES: RallyClass[] = [
  {
    id: 'emv1',
    shortName: 'EMV1',
    name: 'Rally1',
    series: 'emv',
    description: {
      et: 'Rallispordi tipptehnika klass, kus võistlevad Rally1-, WRC- ja Proto-autod.',
      en: 'The top-tier class of rallying, contested by Rally1, WRC and Proto cars.',
    },
    imageWebp: '/assets/rally-classes/car-emv1-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv1-cutout.png',
    imageAlt: { et: 'Toyota GR Yaris Rally1 võistlusauto', en: 'Toyota GR Yaris Rally1 rally car' },
    facts: [
      { label: 'factIncludes', value: 'Rally1, WRC, Proto' },
      { label: 'factMinAge', years: 17 },
    ],
  },
  {
    id: 'emv2',
    shortName: 'EMV2',
    name: 'Rally2',
    series: 'emv',
    description: {
      et: 'Rally2-autode arvestusklass, kuhu kuuluvad ka Rally2 Kit, suurema mootorimahuga NR4 ning vabalthingavad S2000 autod.',
      en: 'The Rally2 class, which also includes Rally2 Kit cars, larger-capacity NR4 cars and naturally aspirated S2000 cars.',
    },
    imageWebp: '/assets/rally-classes/car-emv2-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv2-cutout.png',
    imageAlt: { et: 'Škoda Fabia RS Rally2 võistlusauto', en: 'Škoda Fabia RS Rally2 rally car' },
    facts: [
      {
        label: 'factIncludes',
        value: {
          et: 'Rally2, Rally2 Kit (VR4K), NR4 üle 2000 cm³, S2000 2.0',
          en: 'Rally2, Rally2 Kit (VR4K), NR4 over 2000 cm³, S2000 2.0',
        },
      },
      { label: 'factMinAge', years: 17 },
    ],
  },
  {
    id: 'emv3',
    shortName: 'EMV3',
    name: 'Rally3',
    series: 'emv',
    description: {
      et: 'Rally3-autode klass, kus võistlevad 1390-2000 cm³ vabalthingava või 927-1620 cm³ turbomootoriga autod.',
      en: 'The Rally3 class for cars with a 1390–2000 cm³ naturally aspirated or 927–1620 cm³ turbocharged engine.',
    },
    imageWebp: '/assets/rally-classes/car-emv3-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv3-cutout.png',
    imageAlt: { et: 'Rally3 klassi võistlusauto', en: 'Rally3 class rally car' },
    facts: [
      { label: 'factIncludes', value: 'Rally3' },
      { label: 'factMinAge', years: 17 },
    ],
  },
  {
    id: 'emv4',
    shortName: 'EMV4',
    name: { et: 'Rally4, R3 ja Rally5', en: 'Rally4, R3 and Rally5' },
    series: 'emv',
    description: {
      et: 'Mitmekesine arvestusklass, mis ühendab Rally4-, R3-, Rally5-, Rally5-Kit ja kuni 2000 cm³ A-rühma autod.',
      en: 'A varied class bringing together Rally4, R3, Rally5, Rally5-Kit and Group A cars up to 2000 cm³.',
    },
    imageWebp: '/assets/rally-classes/car-emv4-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv4-cutout.png',
    imageAlt: { et: 'Ford Fiesta Rally4 klassi võistlusauto', en: 'Ford Fiesta Rally4 class rally car' },
    facts: [
      {
        label: 'factIncludes',
        value: {
          et: 'Rally4, R3, Rally5, Rally5-Kit, A-rühm kuni 2000 cm³',
          en: 'Rally4, R3, Rally5, Rally5-Kit, Group A up to 2000 cm³',
        },
      },
      { label: 'factMinAge', years: 16 },
    ],
  },
  {
    id: 'emv5',
    shortName: 'EMV5',
    name: '4WD',
    series: 'emv',
    description: {
      et: 'Nelikveoliste rahvusliku rühma ralliautode klass, kus võistlevad kuni 3500 cm³ mootorimahuga E12 ja N4 autod.',
      en: 'The national-group four-wheel-drive class for E12 and N4 cars with engines up to 3500 cm³.',
    },
    imageWebp: '/assets/rally-classes/car-emv5-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv5-cutout.png',
    imageAlt: { et: 'BMW nelikveoline rallisõiduk', en: 'BMW four-wheel-drive rally car' },
    facts: [
      { label: 'factIncludes', value: { et: '4WD kuni 3500 cm³, E12, N4', en: '4WD up to 3500 cm³, E12, N4' } },
      { label: 'factMinAge', years: 17 },
    ],
    rulesUrl: E_4WD_DOC.href,
  },
  {
    id: 'emv6',
    shortName: 'EMV6',
    name: 'RWD',
    series: 'emv',
    description: {
      et: 'Võimsate tagaveoliste ralliautode klass kuni 3500 cm³. Selles arvestuses võivad osaleda ka EMV7 ja EMV8 tingimustele vastavad tagaveolised autod.',
      en: 'The class for powerful rear-wheel-drive rally cars up to 3500 cm³. Rear-wheel-drive cars meeting EMV7 and EMV8 requirements may also compete here.',
    },
    imageWebp: '/assets/rally-classes/car-emv6-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv6-cutout.png',
    imageAlt: { et: 'Mitsubishi Lancer Evo tagaveoline rallisõiduk', en: 'Mitsubishi Lancer Evo rear-wheel-drive rally car' },
    facts: [
      {
        label: 'factIncludes',
        value: { et: 'Tagaveolised 2WD kuni 3500 cm³, E11 RWD', en: 'Rear-wheel-drive 2WD up to 3500 cm³, E11 RWD' },
      },
      { label: 'factMinAge', years: 16 },
    ],
    rulesUrl: E_2WD_DOC.href,
  },
  {
    id: 'emv7',
    shortName: 'EMV7',
    name: '2WD 1600-2000',
    series: 'emv',
    description: {
      et: 'Kaheveoliste 1600-2000 cm³ ralliautode klass, kuhu kuuluvad R3-, A7-, N3- ja E10-autod.',
      en: 'The two-wheel-drive 1600–2000 cm³ class, made up of R3, A7, N3 and E10 cars.',
    },
    imageWebp: '/assets/rally-classes/car-emv7-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv7-cutout.png',
    imageAlt: { et: 'Honda Civic Type R kaheveoline võistlusauto', en: 'Honda Civic Type R two-wheel-drive rally car' },
    facts: [
      {
        label: 'factIncludes',
        value: {
          et: 'R3, A7, N3, E10 (sh aegunud homologeeringuga R3 turbo)',
          en: 'R3, A7, N3, E10 (incl. R3 turbo with expired homologation)',
        },
      },
      { label: 'factMinAge', years: 16 },
    ],
    rulesUrl: E_2WD_DOC.href,
  },
  {
    id: 'emv8',
    shortName: 'EMV8',
    name: { et: '2WD kuni 1600', en: '2WD up to 1600' },
    series: 'emv',
    description: {
      et: 'Kaheveoliste kuni 1600 cm³ ralliautode arvestusklass, kus on kesksel kohal E9 tehnilistele tingimustele vastavad autod.',
      en: 'The two-wheel-drive class for cars up to 1600 cm³, centred on cars built to the E9 technical regulations.',
    },
    facts: [
      { label: 'factIncludes', value: { et: '2WD kuni 1600 cm³, E9', en: '2WD up to 1600 cm³, E9' } },
      { label: 'factMinAge', years: 16 },
    ],
    rulesUrl: E_2WD_DOC.href,
  },
  {
    id: 'emv-gaz',
    shortName: 'EMV GAZ',
    name: 'EMV GAZ',
    series: 'emv',
    description: {
      et: 'GAZ veoautode meistrivõistluste klass, mis toob rallirajale kuni 4400 cm³ mootoriga võistlusveokid.',
      en: 'The GAZ truck championship class, bringing competition trucks with engines up to 4400 cm³ to the rally stages.',
    },
    imageWebp: '/assets/rally-classes/car-emv-gaz-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv-gaz-cutout.png',
    imageAlt: { et: 'GAZ võistlusveok', en: 'GAZ competition truck' },
    facts: [
      { label: 'factIncludes', value: { et: 'GAZ veoautod kuni 4400 cm³, E13', en: 'GAZ trucks up to 4400 cm³, E13' } },
      { label: 'factMinAge', years: 18 },
      { label: 'factLicence', value: LICENCE_C },
    ],
    rulesUrl: EMV_GAZ_DOC.href,
  },
  {
    id: 'emv-lada',
    shortName: 'EMV Lada',
    name: 'EMV Lada',
    series: 'emv',
    description: {
      et: 'Klassikaliste Lada ralliautode arvestus, kus võisteldakse Lada Classic 2022 tehniliste tingimuste alusel.',
      en: 'The classic Lada rally car class, run to the Lada Classic 2022 technical regulations.',
    },
    imageWebp: '/assets/rally-classes/car-emv-lada-cutout.webp',
    imagePng: '/assets/rally-classes/car-emv-lada-cutout.png',
    imageAlt: { et: 'Lada Classic võistlusauto', en: 'Lada Classic rally car' },
    facts: [
      { label: 'factTechnicalBasis', value: 'Lada Classic 2022' },
      { label: 'factMinAge', years: 16 },
    ],
    rulesUrl: EMV_LADA_DOC.href,
  },
  {
    id: 'ekv6',
    shortName: 'EKV6',
    name: 'RWD',
    series: 'cup',
    description: {
      et: 'Tagaveoliste kuni 3050 cm³ ralliautode karikavõistluste klass. Tegemist on EMV-välise arvestusega.',
      en: 'The Estonian Cup class for rear-wheel-drive rally cars up to 3050 cm³. Scored separately from the championship.',
    },
    facts: [
      { label: 'factIncludes', value: { et: '2WD kuni 3050 cm³, E11 RWD', en: '2WD up to 3050 cm³, E11 RWD' } },
      {
        label: 'factException',
        value: {
          et: 'BMW S50, S52 ja S54 mootorikoodid pole lubatud',
          en: 'BMW S50, S52 and S54 engine codes are not permitted',
        },
      },
      { label: 'factMinAge', years: 16 },
    ],
    rulesUrl: E_2WD_DOC.href,
  },
  {
    id: 'gaz-open',
    shortName: 'GAZ Open',
    name: 'GAZ Open',
    series: 'cup',
    description: {
      et: 'Avatud GAZ veoautode karikavõistluste klass, kus võisteldakse GAZ Open tehniliste tingimuste järgi. EMV-väline lisaarvestus — autasustatakse iga etapi kolme parimat ning hooaja kokkuvõttes esikolmikut.',
      en: 'The open GAZ truck cup class, run to the GAZ Open technical regulations. Scored separately from the championship — the top three of each round and of the season are awarded.',
    },
    facts: [
      { label: 'factSeries', value: { et: 'Eesti karikavõistlused', en: 'Estonian Cup' } },
      { label: 'factMinAge', years: 18 },
      { label: 'factLicence', value: LICENCE_C },
    ],
    rulesUrl: GAZOPEN_DOC.href,
  },
]
