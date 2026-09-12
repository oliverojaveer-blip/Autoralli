# Meedia, mida /concept prototüüp lõpplahenduseks vajab

Prototüüp kasutab nelja päris rallifotot kaustast `Fotod/` (kopeeritud
`public/concept/` alla) ja kaht päris logo. Kõik muu on ajutine. Allpool on
täpne nimekiri, mis tuleb asendada või juurde teha, koos kohaga, kus seda
kasutatakse.

## Praegu kasutuses (ajutiselt, mitme koha peal korduvad)

| Fail | Kus | Märkus |
|---|---|---|
| `public/concept/rally-pan.jpg` | Tavavaate hero, Race Mode'i otseülekande plakat (2 kohta) | Sama pilt kolmes kohas. Vajab eraldi hero-fotot ja eraldi ülekande-kaadrit. |
| `public/concept/rally-town.jpg` | Uudiste põhilugu, meediapaan | Sobib, aga on linnakatse; põhilugu räägib Saaremaast. |
| `public/concept/rally-rain.jpg` | Video-lugu, klasside sektsioon, meediapaan | OK |
| `public/concept/rally-crowd.jpg` | Race Mode'i hero taust (25 % läbipaistvusega), galerii-lugu, meediapaan | OK |
| `public/eal-logo.png`, `public/terminal-logo.png` | Partnerid, nav, jalus | Päris. ERC logo vajab läbipaistva taustaga versiooni. |

## Vaja juurde

### Tavavaade

1. **Hero foto või 6-10 s videolõik**, 2560×1440 või laiem, horisontaalne.
   Kompositsioon: auto pildi paremal kolmandikul, vasakul ruum pealkirjale.
   Vaikne taust (mets, kruusatee), mitte linnatänav. Video: ilma helita,
   loop, alla 4 MB, WebM + MP4. Reduced-motion korral näidatakse fotot.
2. **Järgmise võistluse foto** (Saaremaa): 1600×1000, kasutatakse tulevikus
   hero-paneelis ja kalendrikaardil.
3. **Uudiste fotod**: iga loo jaoks 1600×1000. Vähemalt 3 erinevat.
4. **Klasside fotod**: üks foto klassi kohta (Rally2, Rally3, Rally4, Rally5,
   rahvuslik), 1200×900, auto selgelt äratuntav.
5. **"Kuidas alustada" fotod** (valikuline): litsentsi/tehnilise kontrolli
   olustik, hooldusala, kaardilugeja legendiga. 1200×800.
6. **Partnerite logod**: SVG, ühevärviline valge versioon tumedale taustale.
   Praegu on väljamõeldud partneritel monogramm.

### Race Mode

7. **Otseülekande kaader**: 1920×1080 stoppkaader või YouTube'i embed
   (`STREAM.provider`). Praegu plakat.
8. **Katse kaart**: MapLibre + GPX-trass iga katse kohta, vahepunktide
   koordinaadid. Praegu SVG-skeem (`STAGE_ROUTE.path`), mis on märgitud
   "Skeem, mitte kaart".
9. **Päeva fotod**: 3-6 fotot päeva kohta, 1200×900, pealkirjaga
   (`MEDIA_TILES`). Fotograafi nimi, kui avaldame krediidiga.
10. **Ralliraadio**: audio-voo URL või embed.
11. **Ilmaikoonid**: praegu Phosphor. Kui vaja täpsemaid, siis ilmateenuse
    ikoonikomplekt.

## Formaadid ja piirid

- Fotod: JPEG kvaliteet 80-85, või AVIF/WebP. `next/image` teeb ülejäänu.
- Hero: LCP-kriitiline, hoia alla 350 kB 1440 px laiusel.
- Kõigil fotodel `alt` tekst eesti ja inglise keeles (CMS-i väli).
- Ära kasuta pilte, millel on äratuntavad pealtvaatajad ilma loata.
