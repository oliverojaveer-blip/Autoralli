import type { Locale } from './i18n'

/**
 * ============================================================================
 *  Privaatsusteade — sisu (et/en).
 * ============================================================================
 *  Kirjeldab ausalt seda, mida sait TEGELIKULT teeb: ei jälgimisküpsiseid,
 *  ei kasutajakontosid; isikuandmeid töödeldakse ainult otseblogi
 *  kaasautorite puhul (nõusolek) ja avalikel fotodel olevate inimeste
 *  puhul (ajakirjanduslik / õigustatud huvi). Kui saidile lisandub uus
 *  töötlus (nt analüütika, uudiskiri), tuleb see siia lisada ENNE käiku.
 *
 *  `CONTROLLER` täida päris andmetega, kui õiguslik haldaja on paigas —
 *  seni on see Autoralli.ee ja kontakt käib Kontakt-lehe kaudu.
 * ============================================================================
 */

export const PRIVACY_UPDATED = '2026-09-15'

export const CONTROLLER = {
  name: 'Autoralli.ee',
  /** Kuhu andmekaitsepäringud saata. Vaheta päris aadressi vastu, kui see on olemas. */
  email: null as string | null,
  contactPath: '/kontakt',
}

export type PrivacySection = {
  title: Record<Locale, string>
  paragraphs: Record<Locale, string[]>
  bullets?: Record<Locale, string[]>
}

export const PRIVACY_INTRO: Record<Locale, string> = {
  et: 'See teade selgitab, milliseid andmeid autoralli.ee kogub, miks ja kui kaua, ning millised on sinu õigused. Lühidalt: tavakülastajalt ei kogu me isikuandmeid ega kasuta jälgimisküpsiseid; isikuandmeid töötleme ainult otseblogi kaasautorite puhul ja nendegi nõusolekul.',
  en: 'This notice explains what data autoralli.ee collects, why, and for how long, and what your rights are. In short: we collect no personal data from ordinary visitors and use no tracking cookies; the only personal data we process belongs to live-blog contributors, with their consent.',
}

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: { et: 'Vastutav töötleja', en: 'Data controller' },
    paragraphs: {
      et: [
        `Saidi autoralli.ee haldaja on ${CONTROLLER.name}. Andmekaitseküsimustes võta ühendust Kontakt-lehel toodud aadressil.`,
      ],
      en: [
        `autoralli.ee is operated by ${CONTROLLER.name}. For data-protection questions, use the address on the Contact page.`,
      ],
    },
  },
  {
    title: { et: 'Tavakülastaja', en: 'Ordinary visitors' },
    paragraphs: {
      et: [
        'Lehe lugemiseks ei ole vaja kontot ega registreerimist. Me ei kasuta analüütika- ega reklaamiküpsiseid ega jälgi sind üle teiste lehtede.',
        'Saidi majutaja (Vercel) hoiab tehnilisi serverilogisid (IP-aadress, ajahetk, küsitud leht) turvalisuse ja tõrgete lahendamise eesmärgil lühikest aega; neid ei seostata ühegi isikuga.',
      ],
      en: [
        'No account or registration is needed to read the site. We use no analytics or advertising cookies and do not track you across other sites.',
        'Our host (Vercel) keeps short-lived technical server logs (IP address, time, page requested) for security and troubleshooting; they are not linked to any person.',
      ],
    },
  },
  {
    title: { et: 'Kolmandate osapoolte sisu', en: 'Third-party content' },
    paragraphs: {
      et: [
        'Otseblogis võib olla Instagrami, Facebooki, TikToki või YouTube’i postitusi. Need laetakse alles siis, kui sa ise „Näita postitust“ vajutad — enne seda sinu seadmest nendele platvormidele midagi ei saadeta. Pärast klõpsu kehtivad vastava platvormi enda küpsised ja privaatsustingimused. Kui valid „Jah, alati“, jääb see eelistus sinu seadmesse (mitte meie serverisse) ja postitused laetakse edaspidi ise; valiku saab lehe jaluses tagasi keerata.',
        'Tulemused tulevad ajavõtupartnerilt RallyLynx ja uudised Eesti Autospordi Liidu lehelt autosport.ee. Need on avalikud võistlusandmed (võistlejate nimed, ajad, punktid), mida avaldab võistluse korraldaja.',
      ],
      en: [
        'The live blog may include Instagram, Facebook, TikTok or YouTube posts. They load only when you tap “Show post” — nothing is sent from your device to those platforms before that. After the tap, the platform’s own cookies and privacy terms apply. If you choose “Yes, always”, that preference is stored on your device (not on our server) and posts load by themselves from then on; you can switch it back in the page footer.',
        'Results come from the timing partner RallyLynx and news from the Estonian Autosport Union site autosport.ee. These are public competition data (crew names, times, points) published by the event organiser.',
      ],
    },
  },
  {
    title: { et: 'Otseblogi kaasautorid', en: 'Live-blog contributors' },
    paragraphs: {
      et: [
        'Otseblogisse postitavad võistluse ajaks kutsutud inimesed (pealtvaatajad, meedia, korraldaja). Nende kohta töötleme järgmisi andmeid nõusoleku alusel, mille nad annavad Telegrami botis enne esimest postitust:',
      ],
      en: [
        'Live-blog posts come from people invited for the duration of a rally (spectators, media, organisers). We process the following data about them on the basis of consent, given in the Telegram bot before their first post:',
      ],
    },
    bullets: {
      et: [
        'kuvatav nimi ja soovi korral sotsiaalmeedia konto — avalikud, postituse juures;',
        'Telegrami kasutaja ID ja kasutajanimi — ainult selleks, et bot tunneks sõnumi saatja ära; lehel ei näidata;',
        'postitused (tekst, fotod, videod, lingid) ja nende ajad — avalikud, jäävad võistluse arhiivi;',
        'nõusoleku andmise aeg ja tingimuste versioon — tõendina.',
        'Säilitame kaasautori andmeid hooaja lõpuni; postitused jäävad arhiivi. Nõusoleku saab igal ajal tagasi võtta, kirjutades botile „kustuta mind“ — siis peidame postitused ja kustutame/anonümiseerime autori andmed.',
      ],
      en: [
        'display name and, optionally, a social-media handle — public, next to the post;',
        'Telegram user ID and username — only so the bot can recognise the sender; never shown on the site;',
        'posts (text, photos, videos, links) and their timestamps — public, kept in the rally archive;',
        'time of consent and terms version — as evidence.',
        'Contributor data is kept until the end of the season; posts stay in the archive. Consent can be withdrawn at any time by sending “kustuta mind” to the bot — we then hide the posts and delete or anonymise the author record.',
      ],
    },
  },
  {
    title: { et: 'Inimesed fotodel ja videotes', en: 'People in photos and videos' },
    paragraphs: {
      et: [
        'Ralli on avalik spordisündmus ja selle kajastamine on ajakirjanduslik tegevus; fotod pealtvaatajaaladelt ja finišist võivad sisaldada äratuntavaid inimesi. Kaasautoritel on keelatud avaldada pilte õnnetustest, vigastustest ja lastest peategelasena.',
        'Kui oled fotol või videos ja soovid selle eemaldamist, võta ühendust Kontakt-lehel toodud aadressil — peidame või kärbime materjali mõistliku aja jooksul.',
      ],
      en: [
        'A rally is a public sporting event and reporting on it is journalistic activity; photos from spectator areas and the finish may show identifiable people. Contributors may not publish images of accidents, injuries, or children as the main subject.',
        'If you appear in a photo or video and want it removed, contact us via the Contact page — we will hide or crop the material within a reasonable time.',
      ],
    },
  },
  {
    title: { et: 'Kes andmeid meie nimel töötleb', en: 'Who processes data on our behalf' },
    paragraphs: {
      et: ['Kasutame järgmisi teenuseid; igaühega on andmetöötlusleping või kehtivad nende avalikud tingimused:'],
      en: ['We use the following services, each under a data-processing agreement or its public terms:'],
    },
    bullets: {
      et: [
        'Vercel — saidi majutus ja serverilogid;',
        'Sanity — sisu ja otseblogi postituste hoidmine (andmed Euroopa Liidus);',
        'Telegram — kaasautorite postitamise kanal (kaasautori enda valitud rakendus);',
        'RallyLynx — võistluste ajavõtt ja tulemused;',
        'autosport.ee — uudised.',
      ],
      en: [
        'Vercel — hosting and server logs;',
        'Sanity — content and live-blog storage (data in the EU);',
        'Telegram — the contributors’ posting channel (an app the contributor chose);',
        'RallyLynx — event timing and results;',
        'autosport.ee — news.',
      ],
    },
  },
  {
    title: { et: 'Sinu õigused', en: 'Your rights' },
    paragraphs: {
      et: [
        'Sul on õigus küsida, milliseid andmeid me sinu kohta hoiame, lasta need parandada või kustutada, nõusolek tagasi võtta ja töötlemisele vastu vaielda. Kirjuta Kontakt-lehel toodud aadressil; vastame hiljemalt ühe kuu jooksul.',
        'Kui leiad, et töötleme andmeid valesti, on sul õigus esitada kaebus Andmekaitse Inspektsioonile (aki.ee).',
      ],
      en: [
        'You have the right to know what data we hold about you, to have it corrected or deleted, to withdraw consent, and to object to processing. Write to the address on the Contact page; we answer within one month.',
        'If you believe we process data unlawfully, you may complain to the Estonian Data Protection Inspectorate (aki.ee).',
      ],
    },
  },
  {
    title: { et: 'Muudatused', en: 'Changes' },
    paragraphs: {
      et: ['Kui saidile lisandub uus andmetöötlus (nt uudiskiri või analüütika), uuendame seda teadet enne selle käivitamist. Viimane uuendus on märgitud lehe päises.'],
      en: ['If new processing is added (for example a newsletter or analytics), we update this notice before it starts. The last update is shown at the top of the page.'],
    },
  },
]
