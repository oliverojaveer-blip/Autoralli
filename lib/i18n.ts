/**
 * ============================================================================
 *  Minimaalne tõlkesõnastik.
 * ============================================================================
 *  Projektis ei ole veel ühtki tõlkelahendust (vt PROGRESS.md "Järgmisena":
 *  "Inglise keel, claude.md nõuab kahte keelt" — pole tehtud). See fail on
 *  tahtlikult väike, keskne sõnastik ilma uue sõltuvuseta (claude.md: "Ärge
 *  lisage sõltuvust ilma selge põhjenduseta"), mille saab hiljem üle kanda
 *  päris i18n-raamistikku (nt next-intl), kui saidil on rohkem tõlgitavat
 *  sisu. Esitluskomponendid EI tohi tõlgitud stringe ise sisaldada — kõik
 *  käib selle sõnastiku kaudu.
 * ============================================================================
 */

export type Locale = 'et' | 'en'

export const DEFAULT_LOCALE: Locale = 'et'

const dictionaries = {
  et: {
    liveCountdown: {
      days: 'PÄEVA',
      hours: 'TUNDI',
      minutes: 'MINUTIT',
      seconds: 'SEKUNDIT',
      nextLiveBroadcast: 'Järgmine otseülekanne',
      startingSoon: 'ÜLEKANNE ALGAB PEAGI',
      liveNow: 'OTSE-EETER',
      watchReplay: 'VAATA KORDUST',
      noReplay: 'Kordust ei ole veel saadaval.',
      noStream: 'Otseülekande link lisatakse enne starti.',
      announceStartingSoon: 'Ülekanne algab kohe.',
      announceLive: 'Ülekanne on nüüd otse-eetris.',
      remainingTimeLabel: (d: number, h: number, m: number, s: number) =>
        `${d} päeva, ${h} tundi, ${m} minutit ja ${s} sekundit järgmise otseülekandeni`,
    },
  },
  en: {
    liveCountdown: {
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS',
      nextLiveBroadcast: 'Next live broadcast',
      startingSoon: 'STARTING SOON',
      liveNow: 'LIVE NOW',
      watchReplay: 'WATCH REPLAY',
      noReplay: 'Replay is not available yet.',
      noStream: 'The live stream link will be added before the start.',
      announceStartingSoon: 'The broadcast is starting soon.',
      announceLive: 'The broadcast is live now.',
      remainingTimeLabel: (d: number, h: number, m: number, s: number) =>
        `${d} days, ${h} hours, ${m} minutes and ${s} seconds until the next live broadcast`,
    },
  },
} as const

export type Dictionary = (typeof dictionaries)[Locale]

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]
}
