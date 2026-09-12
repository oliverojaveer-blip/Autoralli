# Autoralli.ee, tööpäevik

Viimati uuendatud: 12.09.2026

## Kus me oleme

Avaleht on olemas ja disainitud `design-taste-frontend` skilli reeglite järgi.
Andmed on veel näidisandmed, CMS-i ja andmebaasi pole.

## Disainiotsused (ära muuda neid juhuslikult)

| Otsus | Väärtus | Miks |
|---|---|---|
| Teema | lukus tume | ajavõtutabloo, õhtused kiiruskatsed |
| Aktsentvärv | `signal` #FFB800 | ainus aktsent kogu lehel, hoiatuslipp |
| Nurgaraadius | 0, kõik teravad | üks kuju kogu lehel |
| Display font | Archivo | Inter on skillis vaikimisi keelatud |
| Mono font | JetBrains Mono | ajad ja kuupäevad, `tabular-nums` |
| Liikumine | tase 5/10 | üks ilmumisanimatsioon, `prefers-reduced-motion` austatud |
| Ikoonid | Phosphor | käsitsi joonistatud SVG ja emoji on keelatud |

Värvid on defineeritud ainult failis `tailwind.config.ts`. Ära kirjuta
komponentidesse hex-koode.

## Failid

```
app/            layout.tsx (fondid), page.tsx (server), globals.css
components/     site-nav, hero, partner-strip, calendar-list,
                results-integrity, site-footer, reveal
lib/events.ts   NÄIDISANDMED, vajab asendamist
public/         eal-logo.png, terminal-logo.png
tests/          home.spec.ts, screenshot.spec.ts
```

## Tehtud

- Next.js 15 + React 19 + TypeScript, App Router
- Tailwind v3 tööle saadud (`postcss.config.js` oli puudu)
- Fondid `next/font` kaudu, `latin-ext` subset, muidu õ ä ö ü ei renderdu
- Hero, countdown järgmise võistluseni
- Kalendri nimekiri, kronoloogiline
- Tulemuse staatuste sektsioon, sisu tuleb claude.md andmereeglitest
- Päris EAL ja Terminal logod, PDF-ist PNG-ks
- 9 Playwright testi, sh kontroll et Tailwind on tegelikult rakendunud
- Pildistamise skript, `npm run shots`

## Kontseptsioon /concept (12.09.2026)

Isoleeritud kahe režiimiga prototüüp, avaleht on puutumata.

- `/concept` tavavaade, `/concept?mode=race` Race Mode
- Lüliti all paremal on ajutine: kustuta `components/concept/mode-switch.tsx`
  ja üks rida `concept-shell.tsx` failis
- Kõik sisu on `lib/concept/fixtures.ts` failis, kõik on väljamõeldud
- Fotod `public/concept/` (kopeeritud `Fotod/` kaustast)
- Puuduv meedia: `ASSET_REQUIREMENTS.md`
- Pildid: `npm run shots:concept`, testid: `tests/concept.spec.ts`
- Liikumissüsteem: `components/concept/motion.tsx` (üks kõver, kolm kestust)

## Järgmisena

1. Asenda `lib/events.ts` päris kalendriga
2. ERC logo vajab valgel taustal versiooni asemel läbipaistvat, praegu välja jäetud
3. Hero vajab päris rallifotot
4. Alamlehed: /kalender, /tulemused, /uudised, /kontakt
5. Inglise keel, claude.md nõuab kahte keelt
6. Alles siis Sanity ja Supabase

## Käsud

```bash
npm run dev          # arendusserver
npm run shots        # pildistab avalehe, pildid kausta screenshots/
npm run shots:concept # pildistab /concept mõlemad režiimid, 3 suurust
npm test             # Playwright testid
npm run type-check   # TypeScript
npm run build        # tootmisbuild
```

## Tööviis Claude'iga

Pildista (`npm run shots`), saada pilt vestlusesse, siis näeb Claude sama mis
sina. Ilma pildita on disainitagasiside pime oletamine.
