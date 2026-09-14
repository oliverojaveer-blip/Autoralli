---
target: homepage
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\AUTOSPORT\\Autoralli.ee\\Veebileht\\app\\[locale]\\page.tsx"
target_fingerprint: "sha256:2f7cd023811a5353bbcf77cb2f9d167666199ba2ddf3625a212e4aeb581e8cab"
target_path: "C:\\AUTOSPORT\\Autoralli.ee\\Veebileht\\app\\[locale]\\page.tsx"
timestamp: 2026-09-14T11-29-39Z
slug: app-locale-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | pre-hydration strip shows `--` with no loading cue |
| 2 | Match System / Real World | 3 | "R6", 10px P/T/M/S unit letters are insider shorthand |
| 3 | User Control and Freedom | 3 | 10 of 46 links open a new tab with only ↗ as warning |
| 4 | Consistency and Standards | 2 | three button grammars in 250px: flag-cut tabs, rounded-full pills, square outline CTAs |
| 5 | Error Prevention | 3 | news-feed failure silently removes the hero |
| 6 | Recognition Rather Than Recall | 2 | mobile season carousel opens on R1 (past); next round 5 swipes away |
| 7 | Flexibility and Efficiency | n/a | Persuade surface |
| 8 | Aesthetic and Minimalist Design | 3 | motion vocabulary wider than "one reveal" |
| 9 | Error Recovery | 3 | missing sections never explain themselves |
| 10 | Help and Documentation | n/a | quick link + Join band cover it |
| Total | | 22/32 (69%) | Acceptable |

## Design Specificity Verdict
Authored in the first ~700px (flag-cut tabs, round strip, blue seconds); category-interchangeable below: three repetitions of [h2 left][outline button right] → grid. 19° cut on ~4 elements. Largest type is a borrowed WRC Chile headline.
Deterministic scan: CLI detect 0 findings. In-page detector: image-hover-transform ×14 (news-hero.tsx:113,222; news-grid.tsx:53; season-strip.tsx:58), cramped-padding ×1 (season-strip.tsx:78, borderline). Overlay injection succeeded (5 nodes), live server stopped.

## Priority Issues
- [P0] Content below the hero invisible until motion hydrates: Reveal SSRs opacity:0 (components/reveal.tsx); season strip, standings, news grid, Join wrapped. Fix: visible by default, fade only after mount / CSS-only / drop reveals. → /impeccable harden
- [P1] Mobile season carousel starts on R1 (past) while strip says R6 (components/home/season-strip.tsx). Fix: next round first on mobile, past rounds as compact chips, or scroll next into view. → /impeccable adapt
- [P1] Sample standings styled as real (components/home/standings-brief.tsx): rank-1 blue, display numerals, full viewport, 4xl plate. Fix: compress, dim rows while isSample, label above table, add source/updated line, shrink plate. → /impeccable layout
- [P2] Three button grammars in first 250px (site-nav.tsx tabs vs quick-links.tsx rounded-full pills vs square CTAs). Fix: flag-cut quick links and CTAs, or drop quick row on desktop. → /impeccable polish
- [P2] Newcomer invitation off-screen on mobile (quick-links.tsx item 5 at x≈522) and 5000px down on desktop. Fix: reorder, right-edge mask, newcomer line under strip. → /impeccable onboard

## Persona Red Flags
Jordan: R6/EMV unexplained; no h1; Chile headline biggest; "Uus rallis?" off-screen. Riley: JS blocked → black page below hero; feed failure silent; standings plate corners clip at 390px; strip name truncates. Casey: countdown side of strip not tappable; hero 438px tall on mobile; every news tap opens new tab. Roadside 3G: Reveal gate; external 768px hero JPEG upscaled; ~10 photos in first 2000px; `--` countdown for 3–8s.

## Minor Observations
ET/EN hit area px-1; aside card title reaches gradient top / date on road surface; "9. KUNI 10. OKT" should be en dash; white/45–55 labels borderline contrast; next vs future rounds barely differ; cut-tl invisible on black; bg-checker fallback reads dead; hover-scale on 14 images = motion clutter.

## Questions
1. Standings: full viewport + 4xl plate for placeholders, or a 56px "Punktiseis: pärast Paidet · allikas EAL" strip?
2. What if Saaremaa Ralli's plate/emblem/date were the 48px object and news the supporting column?
3. Which single navigation surface survives above the hero?
