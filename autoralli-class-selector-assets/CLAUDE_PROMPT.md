# Claude Code brief — Autoralli.ee competition class selector

Work inside the existing Autoralli.ee codebase. First inspect the project structure, framework, routes, design tokens, typography, localization setup, and reusable components. Do not initialize a second project, replace the current architecture, or redesign the global navigation. Implement this feature with the project's existing conventions and dependencies.

## Goal

Create a premium, cinematic **Võistlusklassid / Competition Classes** experience that feels like a modern racing video game's car-selection screen.

The experience uses real rally-car cutout images layered over one fixed rally-service-park background. It is a polished **2.5D interface**, not a true rotatable 3D model. Do not imply that the cars can be viewed from angles that the supplied photographs do not contain.

The visitor must be able to switch between rally classes with:

- previous and next arrow buttons;
- the visible class selector rail;
- horizontal swipe/drag on touch screens;
- Left/Right arrow keys, plus Home and End when the selector has focus.

Changing the selected class updates the car, class name, description, specifications, and calls to action without navigating or reloading the page.

## Supplied assets

Copy the supplied files into the project's normal public asset directory, preferably `public/assets/rally-classes/`.

Use the WebP files in the live interface and retain the PNG files as lossless masters/fallbacks.

| Source | Runtime asset | Exact class name |
| --- | --- | --- |
| EMV2 photo | `car-emv2-cutout.webp` / `.png` | `[ADD CLASS]` |
| emv3 photo | `car-emv3-cutout.webp` / `.png` | `[ADD CLASS]` |
| EMV5 photo | `car-emv5-cutout.webp` / `.png` | `[ADD CLASS]` |
| EMV6 photo | `car-emv6-cutout.webp` / `.png` | `[ADD CLASS]` |

Background:

- production: `rally-selector-background.webp`
- lossless master: `rally-selector-background-master.png`

Never mirror, flip, repaint, stretch, crop through, or add generated parts to a car. The photos use different viewing angles; preserve them. Use `object-fit: contain` and per-item positioning values in the data model when visual alignment needs adjustment.

## Content integrity

Do not infer class names, technical rules, power figures, eligible cars, or championship regulations from the photos. Use the final content supplied by the site owner. Keep any missing value as an explicit `TODO` in the data file, not invented public-facing copy.

The UI must support Estonian and English through the project's existing localization method. If localization is not yet present, keep all copy in one data/config module so it can be localized later; do not scatter strings across components.

## Data model

Build the selector from one ordered data array. Do not hard-code four duplicated slides.

Use the equivalent of this shape in the project's language:

```ts
type RallyClass = {
  id: string;
  shortName: string;
  name: string;
  eyebrow?: string;
  description: string;
  imageWebp: string;
  imagePng: string;
  imageAlt: string;
  imagePosition?: { x: number; y: number; scale: number };
  facts: Array<{ label: string; value: string }>;
  eligibleCars?: string[];
  rulesUrl?: string;
  resultsUrl?: string;
};
```

Add all class copy, image mapping, URLs, and fine positioning in this array. The component should work when more classes are added later.

## Visual direction

- Cinematic, technical, energetic, and distinctly rally-focused.
- Let the supplied car liveries provide most of the color.
- Use the existing Autoralli.ee brand palette and fonts. Do not introduce unrelated neon colors, sci-fi chrome, or a second visual identity.
- Keep the generated background visible and atmospheric, but darken it locally with restrained gradients where text needs contrast.
- The car is the dominant object. Avoid large cards covering it.
- Use small motorsport details such as an index (`01 / 04`), thin rules, concise labels, and a restrained telemetry-inspired fact list.
- Do not put text, logos, or permanent interface elements into the background bitmap.

## Desktop layout

For widths at or above approximately 1024 px:

- Use a full-width section with `min-height: 100svh`, or the closest height that fits naturally beneath the existing site header.
- Place the background absolutely with `object-fit: cover` and a stable crop.
- Center the active car as the visual anchor. Target a rendered width around `clamp(620px, 60vw, 1120px)`, adjusted through the item data rather than one-off CSS selectors.
- Give the car enough bottom clearance to sit naturally on the wet floor.
- Add a soft elliptical contact shadow beneath the car in CSS; do not bake the shadow into each image.
- Place class identity and short description in a clear text zone on one side, with a compact facts group on the other when space allows.
- Put the class selector rail near the bottom, above safe-area spacing, without covering the car's wheels.
- Keep the page's existing global header and navigation functional and visually above the section.

## Mobile layout

For widths below approximately 700 px:

- Use a single-column composition; do not squeeze the desktop panels into narrow columns.
- Keep the complete car visible with `object-fit: contain`, generally between `88vw` and `96vw`.
- Move the class copy and key facts below or immediately beside the car according to available height.
- Turn the class rail into an accessible horizontal scroll-snap row with the active item centered.
- Retain visible Previous and Next buttons, each with a minimum 44 × 44 px hit target.
- Respect `env(safe-area-inset-*)`.
- On short landscape phones, reduce decorative spacing before reducing legibility. Never crop the selector controls off-screen.

## Selector behavior

- The first supplied class is selected initially unless the existing route/query state specifies another valid class.
- Previous/Next wraps continuously from first to last and last to first.
- Clicking a class label selects that class directly.
- A horizontal pointer gesture changes class only after a deliberate threshold of approximately 40 px. Do not hijack normal vertical page scrolling.
- Prevent overlapping transitions and accidental multi-click queues with a synchronous transition lock.
- Update URL state only if that matches the existing site's routing pattern. If used, prefer a shareable query such as `?class=<id>` and preserve unrelated parameters.
- Preload the active, previous, and next car assets. Do not eagerly decode every future asset on a slow mobile connection.

## Motion

Make the change feel like a racing-game garage selection while remaining faithful to the flat source photos.

- Direction matters: moving Next sends the current car slightly left and brings the next car from the right; Previous reverses the direction.
- Animate with `transform`, `opacity`, and a restrained blur only. Aim for roughly 550–750 ms with a premium ease such as `cubic-bezier(0.22, 1, 0.36, 1)`.
- Use a subtle `translate3d`, scale from about `0.96` to `1`, and at most a very small perspective tilt. Never rotate the car as if a hidden 3D model exists.
- Fade/slide the copy on a shorter stagger so the class identity follows the car change.
- A restrained light sweep over the car and a very faint floor reflection made from the same cutout are allowed if they remain performant and believable.
- The background stays fixed through class changes. Do not flash or crossfade the whole scene.
- No autoplay video, audio, particles, custom cursor, scroll-jacking, canvas, WebGL, or Three.js for this version.

For `prefers-reduced-motion: reduce`, remove directional travel, blur, tilt, and reflection animation. Use an immediate or very short opacity change while preserving all controls.

## Accessibility

- Use real `<button>` elements for all selector actions.
- Give the control group an accessible name.
- The active class control uses `aria-current="true"` or `aria-selected="true"`, according to the final semantic pattern.
- Announce the newly selected class in a polite live region, but do not announce every animation frame.
- Give every car meaningful localized alt text. Decorative duplicates used for reflection must have empty alt text and be hidden from assistive technology.
- Keep focus visible and stable after a class transition.
- Ensure text contrast remains WCAG AA over every responsive crop of the background.

## Performance and image handling

- Reserve image dimensions/aspect ratio to prevent layout shifts.
- Use the WebP cutouts for normal rendering and the PNG versions as fallback/master assets.
- The initially visible car and background may load eagerly with high fetch priority; non-adjacent cars should load lazily.
- Do not convert the supplied cutouts to base64 or embed them in JavaScript/CSS.
- Keep animation work on the compositor. Do not run layout reads/writes continuously during animation.
- Avoid re-rendering the whole page on drag movement.

## Component quality

- Reuse existing buttons, typography, spacing, breakpoints, and theme tokens wherever possible.
- Keep class data separate from presentation logic.
- Avoid magic per-class CSS selectors. Store only necessary `x`, `y`, and `scale` alignment values in the class data.
- Do not add a new dependency unless the existing stack genuinely needs it. If the project already uses Framer Motion or an equivalent, it may be reused; otherwise CSS transitions and the existing framework are sufficient.
- Preserve existing pages, routes, analytics, SEO, and CMS behavior.

## Acceptance criteria

The work is complete when:

1. All four supplied cars can be selected by click, arrow buttons, keyboard, and touch swipe.
2. Every car remains fully visible, correctly proportioned, and never mirrored on desktop or mobile.
3. Car and copy transitions run in the requested direction without flicker, black frames, background flashes, or queued animation conflicts.
4. The selector remains usable at 1440 × 900, 1920 × 1080, 390 × 844, 320 × 568, and a short landscape viewport.
5. Reduced-motion behavior, keyboard focus, live announcements, alt text, and touch targets work correctly.
6. The layout introduces no avoidable cumulative layout shift and remains smooth on an average mobile device.
7. No class facts or regulations have been invented.
8. Existing site functionality and visual tokens remain intact.

## Deliverables

- The implemented responsive component/page in the existing project.
- The ordered class-data/config module.
- Any required styles using the project's current styling convention.
- A short implementation note listing changed files, where class content is edited, and any remaining `TODO` values.
- Browser verification results for the target viewport sizes.

Before coding final content, report any missing class mapping, copy, URLs, localization fields, or design tokens. Proceed with the component structure when those values are still pending, but keep the gaps explicit and centralized.
