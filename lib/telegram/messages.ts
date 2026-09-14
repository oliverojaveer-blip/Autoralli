/**
 * Boti tekstid (eesti keeles — kaasautorid on eestikeelsed; inglise keel
 * lisandub, kui vaja). HTML-vorming, Telegrami parse_mode=HTML.
 */

export const CONSENT_VERSION = 'v1-2026-09'

/**
 * Saidi avalik aadress linkide jaoks. Enne domeeni on see Verceli aadress
 * (NEXT_PUBLIC_SITE_URL Verceli seadetes); kui seda pole, Verceli enda
 * VERCEL_URL; viimane varuvariant autoralli.ee.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://autoralli.ee')
).replace(/\/$/, '')

export const msg = {
  notPaired:
    'See vestlus ei ole veel ühegi võistlusega seotud. Postitamiseks on vaja kutselinki — küsi seda võistluse moderaatorilt.',
  noEvent: 'Ühelgi võistlusel ei ole otseblogi praegu avatud.',
  inactive: (event: string) => `Su õigus postitada võistlusel <b>${event}</b> on lõppenud. Aitäh kaasa löömast!`,
  inviteInvalid: 'See kutselink ei kehti (kasutatud või tühistatud). Küsi moderaatorilt uus.',
  inviteAlreadyPaired: (event: string) => `Oled juba <b>${event}</b> kaasautor. Saada foto, video või tekst — see läheb otseblogisse.`,

  consent: (event: string, name: string) =>
    [
      `Tere, ${name}! Sind on kutsutud <b>${event}</b> otseblogi kaasautoriks autoralli.ee lehel.`,
      '',
      '<b>Enne alustamist — lühidalt tingimused:</b>',
      '• Sinu kuvatav nimi, konto (kui lisad) ja postitused on avalikud ja jäävad võistluse arhiivi.',
      '• Sinu Telegrami ID-d hoiame ainult selleks, et bot su sõnumid ära tunneks. Seda lehel ei näidata.',
      '• Annad EAL-ile / autoralli.ee-le õiguse su postitusi avaldada. Autoriõigus jääb sulle.',
      '• Ära postita pilte õnnetustest, vigastustest ega lastest peategelasena. Ära filmi keelualadelt. Ohutus enne pilti.',
      '• Moderaator võib postituse peita. Soovi korral kustutame su andmed: kirjuta botile <code>kustuta mind</code>.',
      '',
      `Privaatsusteade: ${SITE_URL}/privaatsus`,
    ].join('\n'),
  consentButton: 'Nõustun ja alustan',
  consentDeclined: 'Selge. Kui mõtled ümber, ava kutselink uuesti.',

  welcome: (event: string, role: string, areas: string) =>
    [
      `✅ Oled nüüd <b>${event}</b> kaasautor${areas ? ` (${areas})` : ''}.`,
      '',
      'Saada mulle <b>foto, video või tekst</b> — see läheb otseblogisse.',
      'Lisa sõnumisse katse kood, nt <b>SS6</b>, et postitus läheks õige katse alla.',
      'Instagrami/Facebooki postituse jagamiseks kleebi lihtsalt link.',
      '',
      role === 'moderated'
        ? 'Sinu postitused vaatab moderaator enne avaldamist üle.'
        : 'Sinu postitused avaldatakse kohe.',
      '',
      'Pärast postitamist saad vastata oma sõnumile: <code>paranda …</code>, <code>kustuta</code>' +
        (role === 'moderator' ? ', <code>kinnita</code>' : '') +
        '.',
    ].join('\n'),

  posted: (stage: string | null, url: string) =>
    `✅ Avaldatud${stage ? ` <b>${stage}</b> all` : ''} · <a href="${url}">vaata blogis</a>\nVasta sellele sõnumile <code>paranda …</code> või <code>kustuta</code>, kui vaja.`,
  queued: (stage: string | null) =>
    `📨 Saadetud moderaatorile${stage ? ` (<b>${stage}</b>)` : ''}. Avaldame, kui see on üle vaadatud.`,
  edited: '✏️ Parandatud.',
  deleted: '🗑 Peidetud.',
  pinnedOk: '📌 Kinnitatud võistluse ribale.',
  unpinnedOk: 'Kinnitus eemaldatud.',
  replyTargetUnknown: 'Ei leia postitust, millele vastad. Vasta oma algsele sõnumile.',
  notAllowed: 'Selleks pole sul õigust.',
  unsupported: 'Saada foto, video, tekst või link. Muud failid otseblogisse ei lähe.',
  tooLarge: 'Fail on liiga suur (Telegrami boti piir on 20 MB). Saada lühem video või väiksem foto.',
  rateLimited: 'Liiga palju postitusi järjest — oota paar minutit.',
  error: 'Midagi läks valesti. Proovi uuesti; kui viga kordub, kirjuta moderaatorile.',
  dataDeleted: 'Sinu autoriandmed ja postitused on peidetud/kustutatud. Aitäh!',

  // Moderaatorile
  review: (author: string, stage: string | null, body: string | null, kind: string) =>
    [
      `🆕 <b>${author}</b>${stage ? ` · ${stage}` : ''} · ${kind}`,
      body ? body : '<i>(ilma tekstita)</i>',
    ].join('\n'),
  reviewApprove: '✅ Avalda',
  reviewPin: '📌 Avalda ja kinnita',
  reviewHide: '❌ Peida',
  reviewDone: (action: string, by: string) => `${action} — ${by}`,

  inviteCreated: (link: string, role: string, areas: string) =>
    `Kutse loodud (${role}${areas ? `, ${areas}` : ''}). Saada see link inimesele:\n${link}\n\nLink kehtib ühe korra.`,
  inviteUsage: [
    'Kellele kutse teha? Lisa roll ja soovi korral ala:',
    '',
    '<code>/kutse moderated SS3</code> — pealtvaataja, sina kinnitad postitused enne avaldamist',
    '<code>/kutse trusted Hooldus</code> — usaldatud autor (meedia, korraldaja), avaldatakse kohe',
    '<code>/kutse moderator</code> — teine moderaator samade õigustega',
    '',
    'Vastuseks saad ühekordse lingi, mille saadad inimesele edasi.',
  ].join('\n'),
  contributorsHeader: (event: string) => `<b>${event}</b> kaasautorid:`,
  contributorLine: (name: string, role: string, active: boolean, areas: string) =>
    `• ${name} — ${role}${areas ? ` (${areas})` : ''}${active ? '' : ' — mitteaktiivne'}`,
  removed: (name: string) => `${name} ei saa enam postitada.`,
  trusted: (name: string) => `${name} postitused avaldatakse nüüd kohe.`,
  userNotFound: 'Sellist kaasautorit ei leia. Vaata nimekirja: /kaasautorid',
  help: [
    '<b>Käsud</b>',
    '/kutse &lt;moderated|trusted|moderator&gt; [alad] — loo kutselink',
    '/kaasautorid — nimekiri',
    '/eemalda &lt;nimi&gt; — võta postitusõigus ära',
    '/usalda &lt;nimi&gt; — avalda kohe, ilma modereerimata',
    '/minu_id — näita oma Telegrami ID-d',
    '',
    'Postitamiseks saada foto/video/tekst/link; katse kood sõnumisse (SS6).',
  ].join('\n'),
}
