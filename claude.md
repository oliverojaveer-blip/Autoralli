\# Autoralli.ee



\## Projekti eesmärk



Autoralli.ee on Eesti autoralli keskne digitaalne platvorm.



Veeb peab koondama:

\- kalendri ja võistlused;

\- live-ülekanded ja ralliraadio;

\- stardinimekirjad, tulemused ja punktiseisu;

\- uudised, fotod ja videod;

\- Estonian Junior Challenge'i;

\- dokumendid, partnerid ja kontaktid.



\## Peamised põhimõtted



\- Arenda alati mobile-first põhimõttel.

\- Veeb peab töötama telefonis, tahvlis ja arvutis.

\- Oluline võistlusinfo peab töötama ka aeglase internetiga.

\- Kõik olulised funktsioonid peavad töötama ilma 3D-ta.

\- 3D on täiendav kogemus, mitte navigatsiooni alus.

\- Kasutajaliides peab vastama WCAG 2.2 AA nõuetele.

\- Veeb peab toetama eesti ja inglise keelt.

\- Ärge lisage sõltuvust ilma selge põhjenduseta.



\## Planeeritud arhitektuur



\- Next.js App Router

\- React ja TypeScript

\- Sanity CMS toimetuse sisu jaoks

\- Supabase/PostgreSQL ralliandmete jaoks

\- Supabase Realtime live-tulemuste jaoks

\- Three.js ja React Three Fiber 3D-funktsioonide jaoks

\- MapLibre kaartide jaoks

\- YouTube live-ülekannete jaoks

\- Sentry vigade jälgimiseks



\## Andmete reeglid



\- Igal võistlusel peab olema üks püsiv ID.

\- Kalender, osalejad, tulemused ja uudised peavad kasutama sama event ID-d.

\- Tulemuse juures peab olema allikas ja viimase uuenduse aeg.

\- Tulemuste staatus võib olla: unofficial, provisional, official või amended.

\- Ametlikke tulemusi ei tohi vaikimisi üle kirjutada.

\- Välised andmeallikad tuleb ühendada adapterite kaudu.

\- Ära scrape'i veebilehti ilma loa ja dokumenteeritud vajaduseta.

\- Live-andmete puudumisel ära genereeri oletatavaid positsioone.



\## UI ja UX



\- Live-võistluse ajal on avalehe prioriteet live-info.

\- Telefonis kasuta suuri vajutusalasid ja tugevat kontrasti.

\- Tulemuste tabelitel peab olema mobiilne kaardivaade.

\- Animatsioonid peavad austama prefers-reduced-motion seadistust.

\- 3D tuleb laadida dünaamiliselt pärast põhisisu.

\- Kõikidel 3D-vaadetel peab olema 2D või tekstiline alternatiiv.

\- Fondid: ainult Barlow Condensed (display) ja Barlow (kehatekst, sildid, ajad). Ära kasuta Interit ega IBM Plex Monot, kuigi brändiraamat neid nimetab — see otsus on tehtud teadlikult.



\## Koodi kvaliteet



Enne töö lõpetamist käivita:



\- lint;

\- TypeScript typecheck;

\- unit-testid;

\- Playwrighti põhilised kasutajateekonnad;

\- production build.



Ära märgi tööd lõpetatuks, kui build või testid ebaõnnestuvad.



\## Turvalisus



\- Ära kirjuta paroole, tokeneid ega API võtmeid koodi.

\- Saladused peavad asuma .env.local failis või majutusteenuse seadetes.

\- .env faile ei tohi GitHubi commit'ida.

\- Kontrolli kõiki väliseid sisendeid.

\- Küsi kinnitust enne andmebaasis destruktiivsete migratsioonide tegemist.



\## Claude'i töökorraldus



\- Enne suuremat muudatust koosta lühike plaan.

\- Kontrolli olemasolevat koodi enne uue lahenduse loomist.

\- Väldi sama funktsionaalsuse dubleerimist.

\- Ära muuda arhitektuuri ilma muudatust põhjendamata.

\- Hoia muudatused väikeste ja kontrollitavate sammudena.

\- Kirjelda töö lõpus, mida muudeti ja kuidas seda testiti.

