# Flier Design Principles

Use these when prompting Cursor to create or revise fliers. When you send a reference flier, we extract its system into `src/design/tokens.js` and the matching template under `src/fliers/`.

## Workflow

1. Drop assets into `public/assets/` (logo, photos, icons, fonts if self-hosted).
2. Prompt with: platform, size, copy, mood, and any reference image.
3. Design the flier, then run the mandatory QA pass in `DESIGN_QA.md` (intent, unity, detail, relation — fix until it passes).
4. Run `npm run dev`, preview, download PNG or JPG from the studio panel.
5. Iterate by prompting deltas (“make headline larger”, “match this palette”) — each revision re-runs QA.

## Composition

- One clear focal point. Do not compete with multiple heroes.
- Brand first: logo / brand name readable in the first glance.
- One headline, one short support line, one CTA (unless the brief needs more).
- Keep critical text inside the safe inset (`tokens.spacing.safe`, default 72px).
- Prefer full-bleed imagery over inset photo cards.
- Avoid clutter: no pill clusters, stat strips, or floating stickers unless the reference uses them.

## Typography

- Pair one display face + one body face (see `tokens.fonts`).
- Display for brand/headline; body for support/meta.
- Strong hierarchy: headline dominates, support is secondary, meta is quiet.
- Prefer fewer type sizes (3–4 levels max).

## Color

- Define a tight palette in `tokens.colors` (bg, ink, muted, accent, optional accentAlt).
- High contrast for headline and CTA.
- Accent color is for emphasis only — not large background fills unless the brand requires it.

## Export sizes

Size comes from the **brief / platform** — look up (or add) an entry in `src/lib/sizes.js`. Do **not** force every design to Instagram portrait (1080×1350).

| Format | Size | Notes |
| --- | --- | --- |
| Instagram Post | 1080×1080 | Neutral default when format is unclear |
| Instagram Portrait | 1080×1350 | Feed portrait / 4:5 |
| Instagram Story | 1080×1920 | Stories / Reels covers — extra top/bottom chrome |
| Facebook Post | 1200×630 | Link / feed share |
| X Post | 1600×900 | Timeline image |
| LinkedIn Post | 1200×627 | Feed share |
| YouTube Thumbnail | 1280×720 | 16:9 |
| Pinterest Pin | 1000×1500 | Tall pin |
| Brand Editorial | 1600×1200 | Portfolio / identity boards |
| Brand Widescreen | 1920×1080 | Portfolio / identity boards |

Custom sizes are fine: add them to `FLIER_SIZES` or pass raw `{ width, height }` via `boardSize(...)`.

## Export

- Design at 1× native pixels for the chosen size, not CSS-scaled “looking big”.
- Export from the studio: PNG (transparency-friendly) or JPG (smaller, solid background).
- Preview can be scaled in the UI; export always uses the true pixel size.

## Prompting Cursor (examples)

```text
Analyze this reference flier and rebuild the Instagram post template to match.
Assets are in public/assets: logo.png, hero.jpg.
Copy: headline "...", support "...", CTA "..."
```

```text
Create an Instagram story flier for [event] using our tokens.
Mood: bold, night, high contrast. Keep brand top-left.
```

```text
Analyze sample/inbox/my-ref.png following sample/ANALYZE.md.
Create a reusable sample with demo copy and placeholders.
```

```text
Build an Emergence portrait flier using sample glass-stack.
Copy: … Assets in public/assets/emergence/
```

## File map

- `src/design/tokens.js` — brand/colors/fonts/spacing
- `src/fliers/instagram/` — Instagram layouts
- `src/lib/exportFlier.js` — PNG/JPG download
- `public/assets/` — your images and logos
