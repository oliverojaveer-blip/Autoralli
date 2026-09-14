# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Estonian rally fans on a phone, often at the roadside or in a car between stages, wanting the next event, the countdown, latest results/standings and news in seconds. Secondary: people new to rallying who land here from social media or a news link and should quickly understand what the Estonian Rally Championship is and be drawn to follow it. Also competitors, organisers and media who use the sub-pages (/voistlejale, /korraldajale, /reeglid).

## Product Purpose

Autoralli.ee is the central digital platform of Estonian rally: calendar, live coverage (Live Center, rally radio), start lists, results and standings, news, photos/videos, Estonian Junior Challenge, documents, partners and contacts. Success: a fan finds the next event and the current state of the championship without hunting; a newcomer leaves knowing when and where to watch.

## Positioning

The only place that unifies the whole Estonian Rally Championship season (every event uses one persistent event ID across calendar, entries, results and news) with a live layer during events. Official-results integrity is a product rule: results carry source and last-updated time, status unofficial/provisional/official/amended, official results are never silently overwritten, no positions are invented when live data is missing.

## Operating Context

- Season 2026 has six EMV events (`lib/events.ts`): Alūksne, Saaremaa Sprint, Jyväskylä, Lõuna-Eesti, Paide, Saaremaa Ralli (9–10 Oct 2026, the next event as of Sept 2026).
- News comes from autosport.ee (EAL) WordPress REST API via `lib/autosport/adapter.ts`; full articles stay on autosport.ee.
- Live timing comes from RallyLynx via adapters (`lib/rallylynx`), shown in `/otse` Live Center.
- Standings are published by EAL as PDF; `lib/standings.ts` currently holds clearly-labelled placeholder rows only (confirmed 2026-09-14: keep placeholder rows on the homepage top-6, labelled as sample).
- Bilingual: Estonian default (no prefix), English under `/en`.
- Must work on slow mobile connections at roadside; 3D is optional, never navigation.

## Capabilities and Constraints

- Next.js 15 App Router, React 19, TypeScript, Tailwind v3, motion, Phosphor icons. No new dependency without a clear reason.
- WCAG 2.2 AA; animations honour prefers-reduced-motion; large touch targets on phone.
- Results tables need a mobile card view.
- Fonts are locked: Barlow Condensed (display) and Barlow (body, labels, times). Inter / IBM Plex Mono are deliberately rejected.
- Homepage nav (UUDISED / KALENDER / TULEMUSED / VÕISTLUSKLASSID / KONTAKT) is shared site-wide via `components/site-nav.tsx` (confirmed 2026-09-14: one header for all pages).

## Brand Commitments

- Estonian Rally Championship identity: `Autoralli_Brand_Guidelines_v1.pdf`. Championship blue #0D71B8 is the single accent; track black #0A0A0A; midnight #06121C for dark surfaces; 19° cut (`--erc-cut`) and checkered flag module are the brand marks. Logos in `public/images/erc-*.png` (full logo desktop, flag mark alone below 260 px).
- Confirmed 2026-09-14 for the homepage: dark surface throughout (midnight/black, F1-style), sub-pages remain light Standard Mode for now.
- Reference feel (user-supplied screenshots 2026-09-14): F1.com header/next-round strip, sports-club sites with a next-event countdown band and diagonal cuts. Match the feel, not the content.
- Partners: EAL, Terminal (title partner: "Terminal Autoralli Eesti meistrivõistlused"), RallyLynx, Pirelli tyre section.

## Evidence on Hand

- Real photos: `public/images/hero-rally.jpg`, `action-speed.jpg`, `action-rain.jpg`, `action-crowd.jpg`; event emblems for Saaremaa Sprint, Jyväskylä, Lõuna-Eesti, Paide, Saaremaa Ralli plate.
- Real news with images from autosport.ee (live fetch, 10-min revalidate).
- No real standings data in code; no testimonials; do not invent driver names or points.

## Product Principles

1. During a live event, live info is the homepage priority; otherwise the next event and countdown lead.
2. Every number on the page has a source and a timestamp; no invented positions.
3. Fast on a slow connection first, spectacle second.
4. One championship, one event ID, one place.
5. Speak to the fan and the newcomer in the same breath: quick info, obvious invitation.
