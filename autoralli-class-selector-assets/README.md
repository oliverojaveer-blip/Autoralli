# Autoralli.ee class-selector asset pack

This pack contains four rally-car cutouts, one shared cinematic background, optimized WebP files, lossless PNG masters, and a Claude Code implementation brief.

## Files

| File | Purpose |
| --- | --- |
| `CLAUDE_PROMPT.md` | Copy/paste build brief for Claude Code |
| `car-emv2-cutout.webp` | Optimized web asset |
| `car-emv2-cutout.png` | Lossless transparent master |
| `car-emv3-cutout.webp` | Optimized web asset |
| `car-emv3-cutout.png` | Lossless transparent master |
| `car-emv5-cutout.webp` | Optimized web asset |
| `car-emv5-cutout.png` | Lossless transparent master |
| `car-emv6-cutout.webp` | Optimized web asset |
| `car-emv6-cutout.png` | Lossless transparent master |
| `rally-selector-background.webp` | Optimized website background |
| `rally-selector-background-master.png` | Lossless background master |
| `selector-composite-preview.jpg` | Visual QA preview only; do not use in the site |

## Recommended project location

Place the runtime assets in:

```text
public/assets/rally-classes/
```

Prefer the WebP files in production. Keep the PNG files available as source masters/fallbacks.

## Information still required

1. The exact championship class represented by each image.
2. The full ordered list of classes if the final selector will contain more than these four examples.
3. Estonian and English class names, short descriptions, and approved technical facts.
4. Links for regulations, results, registration, or any other class-specific calls to action.
5. Whether this is the homepage feature, a section of the competition-classes page, or the entire page.
6. The current project framework/repository and the final Autoralli.ee design tokens or brand guide.

## Production review note

These cutouts were AI-assisted. Fine sponsor text and tiny livery details can change during generative extraction, even when the overall car is preserved. Compare every cutout with the licensed source photograph before official publication. For sponsor-critical production use, replace any affected cutout with a manually masked version of the original photograph while retaining the same filename and transparent canvas behavior.
