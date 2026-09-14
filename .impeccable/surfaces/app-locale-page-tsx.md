---
version: 1
slug: "app-locale-page-tsx"
primary_target: "app/[locale]/page.tsx"
related_targets: ["components/site-nav.tsx"]
---

# Surface: homepage `app/[locale]/page.tsx` (+ shared header `components/site-nav.tsx`)

Mode: Persuade. Audience: rally fan on a phone wanting next event/countdown, standings, news in seconds; newcomer who should feel invited. Action: open Live / calendar / full standings / a news article. Proof/content: real calendar (`lib/events.ts`), real autosport.ee news (adapter), placeholder standings labelled as sample (confirmed). Constraints: dark homepage throughout (confirmed), sub-pages stay light; one shared header on all pages (confirmed); Barlow only; single blue accent; slow-connection first; no eyebrow labels above headings.

## Direction contract

THESIS: The homepage is a broadcast grid: a round strip with the countdown, then news as the scene, then the season and the table. It refuses the marketing hero (slogan + two buttons + stock photo) that this category ships.

OWN-WORLD: Track black and midnight fields, championship blue as the only accent, white type; Barlow Condensed uppercase display, Barlow tabular numerals for every time and point. The 19° flag cut is the component grammar: nav tabs, active states, the strip's end, the standings link plate are all parallelograms; hairlines are white at 12% on dark; checkered module only as a compact marker (past rounds, sample label).

STORY: The visitor sees which rally is next and how long until it, sees what is happening in Estonian rally right now, sees where the season stands, and either goes Live/Calendar or reads on. Newcomer: understands "this is the Estonian Rally Championship, next round X, join here".

FIRST VIEWPORT: Dark header with flag-cut tabs. Under it a 56 px round strip: ERC flag mark · "R6 · 9–10 OKT" · SAAREMAA RALLI · countdown (DD TT MM SS tabular) · Live button. Under it quick-link pills with Phosphor icons. Then the news grid: 8/12 large rotating card (three latest articles, 6 s, progress bars, pause on hover/focus, no auto-rotate under reduced motion) and 4/12 two static cards. Primary action: Live/countdown strip → /otse; secondary: the large news card.

FORM: Broadcast Grid, rank 1 of my grounded list (presented as IMPECCABLE'S PICK; the roll led with rank 7 Paddock Screen). Seed key 5c83ff1b, kind pick. Code-led (no image generation in this harness).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Signature interaction
The news rotation: the large card's photo cross-fades with a 19° wipe (clip-path) while three progress bars fill over 6 s; hovering/focusing holds the bar (teletext HOLD donation). Under reduced motion: instant swap, no auto-rotation, dots remain as controls.

## Unresolved
- Standings: placeholder rows until an EAL/RallyLynx adapter exists.
- Partner strip and results-integrity block: partner strip kept small in dark; results-integrity dropped from homepage (lives in /tulemused context).
