/**
 * ============================================================================
 *  Lubatud võistlusrehvid — /klassid rehvide sektsioon.
 * ============================================================================
 *  Mudelid, mõõdud, naela pikkus ja hinnad on saidi omaniku antud ametlik
 *  sisu. Rehvipildid (public/images/tyres/) ja maaletooja logo tulevad
 *  kaustast `Pirelli/`. Hinnad on ilma käibemaksuta.
 * ============================================================================
 */

export type TyreSeason = 'talv' | 'suvi'

export type RallyTyre = {
  id: string
  season: TyreSeason
  /** Nt "WJ" — kuvatakse suurelt. */
  model: string
  /** Lubatud variandid täpselt eeskirja sõnastuses. */
  variants: string[]
  size: string
  studLengthMm?: number
  /** Hind ühe rehvi kohta eurodes, ilma käibemaksuta. */
  priceEur: number
  image: { angled: string; tread: string; alt: string }
}

export const TYRE_SEASON_LABEL: Record<TyreSeason, { title: string; type: string }> = {
  talv: { title: 'Talv', type: 'Piikrehvid' },
  suvi: { title: 'Suvi', type: 'Kruusarehvid' },
}

export const RALLY_TYRES: RallyTyre[] = [
  {
    id: 'wj-185',
    season: 'talv',
    model: 'Pirelli WJ',
    variants: ['WJ', 'WJA', 'WJB', 'WJC'],
    size: '185/65R15',
    studLengthMm: 7,
    priceEur: 340,
    image: {
      angled: '/images/tyres/pirelli-wj.webp',
      tread: '/images/tyres/pirelli-wj-tread.webp',
      alt: 'Pirelli WJ piikrehv 185/65R15',
    },
  },
  {
    id: 'j1-205',
    season: 'talv',
    model: 'Pirelli J1',
    variants: ['J1', 'J1A', 'J1B', 'J1C'],
    size: '205/65R15',
    studLengthMm: 7,
    priceEur: 370,
    image: {
      angled: '/images/tyres/pirelli-j1.webp',
      tread: '/images/tyres/pirelli-j1-tread.webp',
      alt: 'Pirelli J1 piikrehv 205/65R15',
    },
  },
  {
    id: 'k6-175',
    season: 'suvi',
    model: 'Pirelli Scorpion K6',
    variants: ['K6', 'K6A'],
    size: '175/70R15',
    priceEur: 200,
    image: {
      angled: '/images/tyres/pirelli-k6.webp',
      tread: '/images/tyres/pirelli-k6-tread.webp',
      alt: 'Pirelli Scorpion K6 kruusarehv 175/70R15',
    },
  },
  {
    id: 'k6-185',
    season: 'suvi',
    model: 'Pirelli Scorpion K6',
    variants: ['K6', 'K6A'],
    size: '185/70R15',
    priceEur: 210,
    image: {
      angled: '/images/tyres/pirelli-k6.webp',
      tread: '/images/tyres/pirelli-k6-tread.webp',
      alt: 'Pirelli Scorpion K6 kruusarehv 185/70R15',
    },
  },
  {
    id: 'k6-195',
    season: 'suvi',
    model: 'Pirelli Scorpion K6',
    variants: ['K6', 'K6A'],
    size: '195/70R15',
    priceEur: 220,
    image: {
      angled: '/images/tyres/pirelli-k6.webp',
      tread: '/images/tyres/pirelli-k6-tread.webp',
      alt: 'Pirelli Scorpion K6 kruusarehv 195/70R15',
    },
  },
]

export const TYRE_DISTRIBUTOR = {
  name: 'black & round',
  logo: { src: '/images/partners/black-and-round-white.png', width: 992, height: 178 },
}
