/**
 * Reeglite ja juhendite dokumendid. Lingid viivad Eesti Autospordi Liidu
 * (autosport.ee) serverisse — need failid EI ole selle saidi hallata,
 * nii et siin ei hoita koopiaid ega genereerita sisu, ainult viited.
 *
 * Iga tehniline dokument on eraldi eksporditud, et /klassid valija saaks
 * viidata samale allikale, ilma URL-i teist korda kirjutamata.
 */

import type { LocalizedString } from './i18n'

export type RuleDocument = {
  label: LocalizedString
  href: string
  fileType: 'pdf' | 'docx'
}

export const RULE_DOCUMENTS: RuleDocument[] = [
  {
    label: { et: 'Võistlusmäärus 2026', en: 'Sporting Regulations 2026' },
    href: 'https://autosport.ee/wp-content/uploads/2026/04/Eesti-Ralli-voistlusmaarus-2026.pdf',
    fileType: 'pdf',
  },
  {
    label: { et: 'Võistlusmäärus LISA I, II, IV', en: 'Sporting Regulations Appendix I, II, IV' },
    href: 'https://autosport.ee/wp-content/uploads/2025/04/Eesti-Ralli-Voistlusmaarus-2025-Lisad-I_II_IV.pdf',
    fileType: 'pdf',
  },
  {
    label: { et: 'Võistlusmäärus LISA III', en: 'Sporting Regulations Appendix III' },
    href: 'https://autosport.ee/wp-content/uploads/2025/04/Eesti-Ralli-Voistlusmaarus-2025-Lisa-III_14.04.pdf',
    fileType: 'pdf',
  },
  {
    label: { et: 'Üldjuhend 2026', en: 'General Guide 2026' },
    href: 'https://autosport.ee/wp-content/uploads/2026/05/Autoralli-EMV-Uldjuhend-2026_amended-06.05.2026.pdf',
    fileType: 'pdf',
  },
  {
    label: { et: 'Estonian Junior Challenge', en: 'Estonian Junior Challenge' },
    href: 'https://autosport.ee/wp-content/uploads/2026/01/Estonian-Junior-Challenge-2026-juhis-kinnitatud.pdf',
    fileType: 'pdf',
  },
]

export const E_4WD_DOC: RuleDocument = {
  label: { et: 'E-4WD tehnilised tingimused', en: 'E-4WD technical regulations' },
  href: 'https://autosport.ee/wp-content/uploads/2024/12/E-4WD-tehnilised-tingimused-2025.pdf?_gl=1*kur8r0*_ga*MjA1MDY1Mjk4OS4xNzQ1MDAwNTc4*_ga_41ERGCHDJ1*czE3ODkyMTE4NTMkbzQ1MSRnMSR0MTc4OTIxMzg0MiRqNTckbDAkaDA.',
  fileType: 'pdf',
}

export const E_2WD_DOC: RuleDocument = {
  label: { et: 'E-2WD tehnilised tingimused', en: 'E-2WD technical regulations' },
  href: 'https://autosport.ee/wp-content/uploads/2026/06/E-2WD-tehnilised-tingimused-2026.pdf',
  fileType: 'pdf',
}

export const EMV_LADA_DOC: RuleDocument = {
  label: { et: 'EMV LADA tehnilised tingimused', en: 'EMV LADA technical regulations' },
  href: 'https://uus.autosport.ee/wp-content/uploads/2022/02/Lada-Classic-tehnilised-tingimused-2022-.-2-1.docx?_gl=1*19yfm8r*_ga*MjA1MDY1Mjk4OS4xNzQ1MDAwNTc4*_ga_41ERGCHDJ1*czE3ODkyMTE4NTMkbzQ1MSRnMSR0MTc4OTIxMzkyNyRqNTEkbDAkaDA.',
  fileType: 'docx',
}

export const EMV_GAZ_DOC: RuleDocument = {
  label: { et: 'EMV GAZ tehnilised tingimused', en: 'EMV GAZ technical regulations' },
  href: 'https://autosport.ee/wp-content/uploads/2024/12/Veoautoralli-tehnilised-tingimused-2025.pdf?_gl=1*qwwne8*_ga*MjA1MDY1Mjk4OS4xNzQ1MDAwNTc4*_ga_41ERGCHDJ1*czE3ODkyMTE4NTMkbzQ1MSRnMSR0MTc4OTIxMzg0OCRqNTEkbDAkaDA.',
  fileType: 'pdf',
}

export const GAZOPEN_DOC: RuleDocument = {
  label: { et: 'GAZOPEN tehnilised tingimused', en: 'GAZ Open technical regulations' },
  href: 'https://autosport.ee/wp-content/uploads/2026/05/Gaz-Open-tehnilised-tingimused-2026.pdf',
  fileType: 'pdf',
}

export const TECHNICAL_DOCUMENTS: RuleDocument[] = [
  E_4WD_DOC,
  E_2WD_DOC,
  EMV_LADA_DOC,
  EMV_GAZ_DOC,
  GAZOPEN_DOC,
]
