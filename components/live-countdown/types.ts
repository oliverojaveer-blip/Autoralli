import type { Locale } from '@/lib/i18n'

export type LiveCountdownStatus = 'scheduled' | 'starting-soon' | 'live' | 'ended'

export type LiveCountdownProps = {
  eventName: string
  /** ISO 8601, nt "2026-10-09T18:00:00+03:00". */
  targetTime: string
  timeZone?: string
  status: LiveCountdownStatus
  youtubeVideoId?: string
  /** Vaikimisi eesti keel — vt `lib/i18n.ts`. */
  locale?: Locale
  /**
   * Kui true, ei joonista komponent oma välist kaarti/tausta — kasutamiseks
   * kohas, kus ümbritsev kaart on juba olemas (nt avalehe Hero).
   */
  bare?: boolean
  /** Kui false, jäetakse "Järgmine otseülekanne" + ürituse nimi päis ära. */
  showHeader?: boolean
  /** Millised ratad näidata. Vaikimisi kõik neli. */
  units?: ReadonlyArray<'days' | 'hours' | 'minutes' | 'seconds'>
  /** "compact" — väiksem versioon, nt avalehe Hero jaoks. */
  size?: 'default' | 'compact'
}
