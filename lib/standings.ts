/**
 * ============================================================================
 *  Punktiseisu andmemudel — /tulemused.
 * ============================================================================
 *  EAL avaldab punktiseisu praegu PDF-ina, mille automaatne tekstiväljavõte
 *  on ridade kokkujooksmise ja täpitähtede rikutuse tõttu ebausaldusväärne
 *  (vt claude.md "Live-andmete puudumisel ära genereeri oletatavaid
 *  positsioone" — sama põhimõte kehtib ka juba toimunud tulemuste kohta).
 *  Kuni ajavõtupartneri/EAL-i andmeallikas on adapteriga ühendatud, kasutab
 *  see fail ainult selgelt "näidis" märgistusega kohatäite ridu, mitte
 *  päris sõitjate nimesid ega punkte.
 * ============================================================================
 */

export type StandingsRow = {
  position: number
  driver: string
  entrant: string
  car: string
  points: Array<number | null>
  total: number
}

export type StandingsClass = {
  classId: string
  label: string
  rows: StandingsRow[]
}

/** Sama kuus etappi, samas järjekorras, mis kalendris (`lib/events.ts`). */
export const STANDINGS_EVENT_CODES = ['ALŪ', 'SAA', 'JYV', 'LÕU', 'PAI', 'SAR'] as const

function placeholderRows(count: number): StandingsRow[] {
  return Array.from({ length: count }, (_, i) => ({
    position: i + 1,
    driver: `Sõitja ${i + 1} / Kaardilugeja ${i + 1}`,
    entrant: '—',
    car: '—',
    points: STANDINGS_EVENT_CODES.map(() => null),
    total: 0,
  }))
}

/**
 * `null` iga klassi ridade asemel tähendab "andmed lisandumas" — leht
 * näitab siis ausat tühja seisundit, mitte väljamõeldud tabelit.
 * Kohatäite read (`placeholderRows`) on siin ainult kujunduse
 * demonstreerimiseks ja tuleb asendada päris andmetega.
 */
export const STANDINGS: StandingsClass[] = [
  { classId: 'emv-absoluut', label: 'EMV Absoluut', rows: placeholderRows(8) },
  { classId: 'emv1', label: 'EMV1', rows: [] },
  { classId: 'emv2', label: 'EMV2', rows: [] },
  { classId: 'emv3', label: 'EMV3', rows: [] },
  { classId: 'emv4', label: 'EMV4', rows: [] },
  { classId: 'emv5', label: 'EMV5', rows: [] },
  { classId: 'emv6', label: 'EMV6', rows: [] },
  { classId: 'emv7', label: 'EMV7', rows: [] },
  { classId: 'emv8', label: 'EMV8', rows: [] },
  { classId: 'emv-gaz', label: 'EMV GAZ', rows: [] },
  { classId: 'emv-lada', label: 'EMV Lada', rows: [] },
  { classId: 'ekv6', label: 'EKV6', rows: [] },
  { classId: 'gaz-open', label: 'GAZ Open', rows: [] },
  { classId: 'ejc', label: 'Estonian Junior Challenge', rows: [] },
]
