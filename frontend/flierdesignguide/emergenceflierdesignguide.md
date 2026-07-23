# Emergence Flier Design Guide — Cascade Stage (as shipped)

**Source of truth for how Cascade Stage was built in code.** Prefer this file over `frontend/emergencedesignguide.md` (legacy multi-template recreation brief) when implementing or extending Emergence templates.

| Field | Value |
| --- | --- |
| Template id | `cascade-stage` |
| Board id | `emergence-cascade-stage` |
| Component | `frontend/src/fliers/emergence/EmergenceCascadeStage.jsx` |
| Export size | **1080 × 1350** (Instagram portrait) |
| Edit kind | `emergence` |
| Project | `frontend/src/projects/emergence/project.js` |

**How to use this guide:** Read it fully, then implement a new template by copying the architecture (shared chrome + template-local midsection + `resolveEmergenceData` + CSS class reuse), not by inventing a parallel system.

---

## 1. Purpose & intent

**One question the flier answers:** *Who is on stage for this Emergence summit session, and where/when do I get a ticket?*

**Mood:** High-energy tech conference — royal navy sky, cyan card, scarce lime energy accents, amber portrait offset slabs. Optimistic, Lagos-scale, bold display type. Not a dashboard; not a collage of stickers.

**Composition strategy (as shipped):** Cascade **hero** (eyebrow + mega title + icon pills) stacked above an untilted Stage Grid **speaker card** (programme title + 3×2 people + tall convener + keyword strip), bookended by shared header chrome and logistics footer.

---

## 2. Canvas & export

| Item | Spec |
| --- | --- |
| Size | `emergence.size` → `width: 1080`, `height: 1350` |
| Root node | `<article className="e-flier e-flier--cascade-stage" style={rootStyle}>` |
| Capture | Single DOM article; studio export strips `[data-studio-chrome]` (edit menus, hints, brand chooser) |
| Preview scale | Only in `Studio.jsx` — never bake preview scale into the flier |

### Layer / z-index recipe (top → bottom of stack)

| Layer | Class / element | z-index | Notes |
| --- | --- | --- | --- |
| Background | `.e-bg` | `0` | Absolute `inset: 0`; grid + gradients + vignette |
| Cascade hero | `.e-cascade__hero` | `2` | Relative |
| Stage card | `.e-grid__stage` | `2` | Flex grow; card inside |
| Footer | `.e-footer` | `4` | Navy bar; QR overlaps upward |
| Header | `.e-header` | `5` | Above midsection |
| Brand chooser | `.e-header__brand-chooser` | `8` | Studio-only; stripped on export |

Root `.e-flier` is `position: relative; overflow: hidden; display: flex; flex-direction: column`.

---

## 3. Architecture / logic approach

### Single article, composed midsections

```
article.e-flier.e-flier--cascade-stage
  EmergenceBackground
  EmergenceHeader
  .e-cascade__hero          ← Cascade family hero (class reuse)
  .e-grid__stage
    .e-grid__card           ← Stage Grid card (class reuse)
      .e-grid__layout
        .e-grid__people-col (programme + 3×2 PortraitSlots)
        ConvenerSlot.e-grid__convener
      KeywordStrip
  EmergenceFooter
```

**Why class reuse:** Cascade Stage does **not** invent new hero/card BEM. It mounts the Cascade hero block (`.e-cascade__*`) and Stage Grid card (`.e-grid__*`) as-is, then applies **spacing/type overrides only** under `.e-flier--cascade-stage` so both regions fit one 1350 canvas without redesigning chrome.

### Data pipeline

1. Studio passes `content` (per-artboard draft) + `studioEdit` into the template.
2. `resolveEmergenceData(props)` (`shared/emergenceData.js`):
   - `mergeEmergenceDraft(props.content)` → full tree from `createEmergenceContent()` defaults
   - Builds `rootStyle`: fixed size + `--e-display` / `--e-body` + `emergenceThemeCssVars(colorTheme)`
   - Exposes `personProps(listKey, person, index)` so portrait edit paths stay consistent (`speakers.0.name`, etc.)
3. Each artboard stores its **own** draft (`editKind: 'emergence'`). Never share one draft across boards.

### Why shared chrome vs template-local markup

| Shared (`EmergenceChrome`) | Template-local (`EmergenceCascadeStage`) |
| --- | --- |
| Background, Header (logo modes), Footer, KeywordStrip, ConvenerSlot | Cascade hero copy + icon pills |
| PortraitSlot | Stage Grid layout wiring (people-col + programme + maps) |
| Tokens / themes / draft merge | Root modifier class + import of `emergence-templates.css` |

**Rule for new templates:** Keep header/footer/background/keywords/portraits/convener shared unless the brief truly needs a different chrome language. Put layout experiments in template JSX + scoped CSS under a new `.e-flier--{id}` modifier.

### Critical layout decision — programme title

`event.programmeTitle` lives **inside** `.e-grid__people-col`, not as a full-card header. The people column is `max-width: 500px` and `justify-self: end`, so `text-align: center` on `.e-grid__programme` centers over the **three portrait columns**, not the cyan card (which also includes the tall convener). Do not move the title to span the full `.e-grid__layout` unless you intentionally change that optical rule.

### Independent copy bands

Header, Cascade hero, and programme title are **separate edit paths** (legacy drafts seed hero/programme from header until edited — see §13). Do not bind them to one field in new templates.

---

## 4. File map

| File | Role |
| --- | --- |
| `src/fliers/emergence/EmergenceCascadeStage.jsx` | Cascade Stage composition |
| `src/fliers/emergence/emergence-templates.css` | `.e-cascade__*`, `.e-grid__*`, `.e-flier--cascade-stage` overrides |
| `src/fliers/emergence/index.js` | Registry — only `cascade-stage` is active |
| `src/fliers/emergence/shared/EmergenceChrome.jsx` | Background, Header/BrandMark, Footer, KeywordStrip, ConvenerSlot |
| `src/fliers/emergence/shared/emergence-chrome.css` | Chrome + bg + keywords + footer + base convener |
| `src/fliers/emergence/shared/PortraitSlot.jsx` | Person frame + accent slab + name/title |
| `src/fliers/emergence/shared/portrait-slot.css` | Slot geometry (3:4), accents, type |
| `src/fliers/emergence/shared/emergenceData.js` | `resolveEmergenceData` + `personProps` |
| `src/design/emergenceTokens.js` | Default event/speakers/panelists/size/fonts/colors |
| `src/design/emergenceThemes.js` | Color themes → CSS vars on artboard root |
| `src/design/defaultBrandLogo.js` | Default Flier Studio logo path + `logoMode` helpers |
| `src/lib/logoLayout.js` | Logo scale/nudge clamps + CSS vars |
| `src/lib/imageFit.js` | Photo crop (`imageFits` paths) — not logo |
| `src/lib/flierDraft.js` | `createEmergenceContent`, `mergeEmergenceDraft`, path get/set |
| `src/lib/draftStorage.js` | Persist drafts (re-exported from flierDraft) |
| `src/lib/exportFlier.js` | Strips `[data-studio-chrome]` on export clone |
| `src/components/studio/EditableText.jsx` | Inline text edit |
| `src/components/studio/EditableImageSlot.jsx` | Image pick/clear/focus (+ logo chrome) |
| `src/components/studio/editableTextProps.js` | Wiring helper for text paths |
| `src/projects/emergence/project.js` | Project board registration |
| `public/assets/emergence/bg-grid.svg` | Background grid overlay |
| `public/assets/flier-studio/logo-horizontal-on-dark.png` | Default header logo |
| `flierdesignguide/emergenceflierdesignguide.md` | **This guide** |
| `emergencedesignguide.md` | Legacy mood/history brief (do not treat as code truth) |

Legacy JSX still present but **not** registered: `EmergenceClassic.jsx`, `EmergenceCascade.jsx` — ignore unless asked to revive.

---

## 5. Tokens & themes

### Size & fonts (`emergenceTokens.js`)

| Token | Value |
| --- | --- |
| Size | 1080 × 1350 |
| Display | `"Orbitron", sans-serif` → CSS `--e-display` |
| Body | `"Manrope", sans-serif` → CSS `--e-body` |

Applied on root via `resolveEmergenceData` → `rootStyle`.

### Default palette (tokens + Ocean theme)

| Role | Hex / var | Usage |
| --- | --- | --- |
| Navy deep | `#061433` / `--e-navy-deep` | Voids, footer base, filled photo frames |
| Navy | `#0B1E6E` / `--e-navy` | Footer gradient start |
| Royal | `#102E8D` / `--e-royal` | Root/bg base |
| Royal mid | `#1E42A3` / `--e-royal-mid` | Sky gradient |
| Card light / mid / deep | `#7EC8FF` / `#5EB6FF` / `#3A8DFF` | Cyan card gradient |
| Ink soft | `#D7E6FF` / `--e-ink-soft` | Series, soft chrome type |
| Lime | `#B6FF00` / `--e-lime` | Capsules, zap, accents |
| Lime ink | `#0A1400` / `--e-lime-ink` | Type on lime |
| Amber / orange | `#FFB800` / `#FF8A3D` | Portrait slabs, motifs |
| Ink dark | `#061433` / `--e-ink-dark` | Type on cyan card |

### Theme switching

- Draft field: `colorTheme` (default `'ocean'`).
- Themes: `ocean` | `verdant` | `violet` | `ember` | `teal` (`emergenceThemes.js`).
- `emergenceThemeCssVars(themeId)` paints chrome/background CSS vars only — **photos are untouched**.
- New templates must consume vars (`var(--e-card)`, etc.), not hardcode Ocean hex in midsection CSS.

---

## 6. Background

Implemented by `EmergenceBackground` → `.e-bg` > `.e-bg__image` + `.e-bg__vignette`.

### Build recipe (not “dark blue”)

1. **Base fill:** `.e-bg` → `background: var(--e-royal)`.
2. **`.e-bg__image` stack** (listed back → front in CSS `background-image`):
   - Vertical sky: `linear-gradient(180deg, var(--e-royal-mid) → var(--e-royal) → var(--e-navy-deep))`
   - Soft card-colored radial glow upper-right (~78% 28%)
   - Larger radial glow mid (~55% 48%)
   - **Grid asset on top:** `url('/assets/emergence/bg-grid.svg')` cover/center
   - `background-color: var(--e-navy-deep)` under the images
3. **`.e-bg__vignette`:** extra radial highlight + bottom fade into navy-deep.

Do not replace with flat black. Keep grid + dual glows + vignette as the atmosphere language.

---

## 7. Header

`EmergenceHeader` — 3-column CSS grid (`1.1fr 1.4fr 0.9fr`), padding `44px 48px 0`, z-index 5.

Brand uses `display: contents` so logo sits row 1 / series row 2 under column 1.

### Logo slot (`BrandMark`)

| `event.logoMode` | Behavior |
| --- | --- |
| `image` | Shows `resolveBrandLogoSrc(logoSrc)`; default src `DEFAULT_BRAND_LOGO_SRC` = `/assets/flier-studio/logo-horizontal-on-dark.png`. Editable via `EditableImageSlot` (`enableFit={false}`). Scale/nudge via `logoLayout`. |
| `text` | `EditableText` wordmark (`event.wordmark`, default `EMERGE`). Studio chrome can switch back to image / Flier Studio. |
| `none` | Empty “Add brand” hit target (edit only). Chooser: Upload / Flier Studio logo / Text. |

**Logo layout (not photo crop):**

- Draft: `event.logoLayout = { scale, offsetX, offsetY }`
- Defaults: scale `1`, offsets `0`
- Clamps: scale `0.55–1.75`; x `±40`; y `±16`
- Base box: **280 × 44** → CSS `--logo-w` / `--logo-h` = base × scale; translate via `--logo-x` / `--logo-y`
- Image: `object-fit: contain; object-position: left center` — transparent holder, no speaker-style plate

### Series under logo

- Path: `event.series` (default `EMERGE SUMMIT`)
- Class: `.e-header__series` — 11px, weight 700, tracking `0.14em`, color `--e-ink-soft`

### Theme + lime capsule + zap

- Paths: `event.theme`, `event.capsule`
- Theme text ~28px / 800; capsule pill `border-radius: 999px`, lime fill, lime-ink type, min-height 34px
- Optional `Zap` icon (`showZap`, default true) — lime, 22px

### Decorative header mark (column 3)

Pure CSS abstract (no image asset), `.e-header__mark` 92×72:

| Child | Role |
| --- | --- |
| `__mark-orbit` | Soft card-colored oval ring |
| `__mark-wing--a` | Cyan card gradient wing (clip-path) |
| `__mark-wing--b` | Lime wing |
| `__mark-core` | Cyan radial “planet” |
| `__mark-slash` | Lime→amber vector bar |
| `__mark-spark` | Lime 8-point spark |

Preserve this geometry language when adding header ornaments.

---

## 8. Hero (Cascade block)

Markup in `EmergenceCascadeStage.jsx` under `.e-cascade__hero`.

### Fields (independent of header)

| UI | Draft path | Default |
| --- | --- | --- |
| Eyebrow | `event.heroSeries` | `EMERGE SUMMIT` |
| Title | `event.heroTheme` | `Emergence` |
| Capsule inside title | `event.heroCapsule` | `Beyond Limit` |

Eyebrow: lime, 13px, weight 800, tracking `0.14em`, inline `Zap` (18px, stroke 2.4) + editable span.

Title: display font; **Cascade Stage override** → **64px** (base Cascade class is 78px), line-height `0.92`, max-width 720px. Capsule is `<em>` → lime pill, body font, ~18px on cascade-stage (22px base).

### Icon pills (static labels in shipped JSX)

Not draft-backed in Cascade Stage — hard-coded:

| Pill | Icon (`lucide-react`) |
| --- | --- |
| NETWORK | `Network` |
| GRANT | `Gem` |
| DISRUPT | `Zap` |

Style: outline pills, white 35% border, radius 999, 11–12px bold caps. To make them editable in a new template, add draft fields + `EditableText` — do not invent a second pill system.

### Cascade Stage spacing overrides

Under `.e-flier--cascade-stage`: tighter hero padding (`4px 48px 0`), title margin `8px`, icons gap/margin reduced so hero + card + footer fit 1350.

---

## 9. Speaker card (Stage Grid block)

### Cyan card surface

`.e-grid__card`:

- Radius **28px**
- Gradient `145deg`: `--e-card-light` → `--e-card` → `--e-card-deep`
- Shadow: `0 26px 70px rgba(0,0,0,0.32)` + inset white ring
- Cascade Stage padding: `22px 28px 18px`, gap `14px`

Stage wrapper `.e-grid__stage`: flex `1`, cascade-stage padding `14px 48px 16px`, `align-items: flex-start`.

### Layout grid

```
.e-grid__layout
  columns: minmax(0,1fr) minmax(300px, 320px)
  gap: 24px
  max-width: 900px; margin auto
  padding-right: 10px   ← room for amber convener slab
```

### Programme title

- Path: `event.programmeTitle` (default `Emergence`)
- Inside `.e-grid__people-col` only
- Display, uppercase, cascade-stage **28px**, centered over people slots
- Ink: `--e-ink-dark`

### People grid

- 3 speakers + 3 panelists via `PortraitSlot` + `personProps('speakers'|'panelists', …)`
- CSS: `grid-template-columns: repeat(3, 1fr)`; two auto rows
- Gap `14px 12px`
- **Equal size** — no `size` override passed (default `md`); cascade CSS forces name 12px / title 10px inside this grid

Default accents from tokens: speakers amber/orange/amber; panelists cyan/amber/orange.

### PortraitSlot

| Spec | Value |
| --- | --- |
| Aspect | **3 / 4** (`.e-slot__stack`) |
| Accent slab | Absolute offset `10px -8px -8px 10px`, radius 4px; classes `amber` \| `orange` \| `cyan` (`--e-card-deep` for cyan) |
| Frame | Radius 4px; empty = translucent white→navy gradient + white border; filled image `object-fit: cover` |
| Empty icon | `UserRound` ~42% |
| Ink on card | default `ink="dark"` → `--e-ink-dark` |
| Edit paths | `{list}.{i}.name`, `.title`, `.photoSrc` |
| Image fit | `imageFits` via `getImageFit` / `applyImageFitStyle` (cover + pan/scale) |

### Tall convener

`ConvenerSlot` with `className="e-grid__convener"`:

- In-grid (not absolute float) — Stage Grid CSS overrides base `.e-convener` absolute positioning
- Spans people rows visually: `align-self: stretch`, frame `flex: 1`
- Amber `::before` slab (same offset language as portrait slabs)
- Empty frame: translucent gradient **over** solid amber slab so cyan card never shows through
- Filled: `--e-navy-deep` + white border
- Label path: `convener.label`; photo: `convener.photoSrc` (+ `imageFits`)
- Empty copy: `SPEAKER / CONVENER IMAGE`

---

## 10. Abstract elements / shapes

### Geometry language (reuse, don’t invent)

| Motif | Where | Traits |
| --- | --- | --- |
| Orbit / wings / core / slash / spark | Header mark | Organic clip-paths, card + lime gradients |
| Accent slabs | Portraits + convener | Small offset rectangles, amber/orange/cyan |
| Lime pills / capsules | Header theme, hero `<em>`, icon outline pills | Radius 999 |
| Footer clover / plus / bloom / arc | Footer motif cluster | Lime petals, amber+orange plus, soft card bloom, lime D-arc |
| Soft radials | Background | Card-tinted glows, never flat |

**Rule:** Scarce lime; amber/orange for offset slabs and motif cluster only; white type on navy; dark type on lime only.

---

## 11. Keyword strip

`KeywordStrip` inside the card (below layout).

- Paths: `event.keywords.{i}` (default `DISRUPTION`, `1M+ GRANT`, `GROWTH`, `NETWORKING`)
- Separators: middot `·` between items
- Style: centered flex wrap, navy-deep translucent bar, radius 10px, 15px / 800 / tracking `0.08em`

---

## 12. Footer

`EmergenceFooter` — grid `1fr auto auto`, min-height 168px, navy → navy-deep gradient, padding `28px 36px 26px`, z-index 4.

| Region | Paths / content |
| --- | --- |
| City | `event.city` — display ~52px |
| Venue | `event.venue` — 11px uppercase |
| Separator | Cyan card-colored dot |
| Time stack | `event.time` + `event.timeNote` (default `PROMPT`) |
| Date stack | `event.date` + `event.dateNote` (default `AUGUST 2026`) |
| Motif | CSS shapes (non-editable) |
| QR | `event.qrSrc` — white 118px box, dashed empty state; `EditableImageSlot`, **no** imageFit |
| Ticket line | `event.ticketLabel` + `event.url` (URL in lime) |

QR box uses negative top margin (`-36px`) to overlap the card/footer seam — keep that when cloning footer chrome.

`compact` prop exists for denser footers; Cascade Stage uses the default (non-compact).

---

## 13. Studio edit contract

### Text / image draft paths (Cascade Stage)

| Path | Type |
| --- | --- |
| `event.logoSrc` | image (+ `logoMode` / `logoLayout`) |
| `event.wordmark` | text (when `logoMode === 'text'`) |
| `event.logoMode` | `image` \| `text` \| `none` |
| `event.logoLayout` | `{ scale, offsetX, offsetY }` |
| `event.series` | text |
| `event.theme` | text |
| `event.capsule` | text |
| `event.heroSeries` | text |
| `event.heroTheme` | text |
| `event.heroCapsule` | text |
| `event.programmeTitle` | text |
| `event.keywords.0…n` | text |
| `event.city` / `venue` | text |
| `event.time` / `timeNote` | text |
| `event.date` / `dateNote` | text |
| `event.ticketLabel` / `url` | text |
| `event.qrSrc` | image |
| `speakers.{i}.name` / `.title` / `.photoSrc` | text / text / image |
| `panelists.{i}.name` / `.title` / `.photoSrc` | text / text / image |
| `convener.label` / `convener.photoSrc` | text / image |
| `fonts.display` / `fonts.body` | CSS font stacks on root |
| `colorTheme` | theme id |
| `imageFits.<photoPath…>` | photo crop only |
| `alignments.<textPath>` | optional text align |

Wire text with:

```js
{...editableTextProps(studioEdit, 'event.heroTheme')}
```

### `logoMode` vs `imageFits` vs `logoLayout`

| Mechanism | Use for | Notes |
| --- | --- | --- |
| `logoMode` + `logoSrc` / `wordmark` | Brand mark presence | Image / text / none |
| `logoLayout` | Logo **size + nudge** | Uniform scale; `enableFit={false}` on logo slot |
| `imageFits` | Portrait / convener **crop** | Cover + pan; never use for logo or QR |

### Export / studio DOM

- Elements with `data-studio-chrome` (brand chooser, wordmark chrome, edit hints) are **removed** on export (`exportFlier.js`).
- Do not put required artwork inside `data-studio-chrome` nodes.

### Legacy draft seeding (`mergeEmergenceDraft`)

If old drafts lack new keys:

- Missing `programmeTitle` → seed from `event.theme`
- Missing `heroSeries` / `heroTheme` / `heroCapsule` → seed from header `series` / `theme` / `capsule`
- Empty `logoSrc` in image mode → coerce to `logoMode: 'none'`

New templates should keep independent paths from day one.

---

## 14. CSS / layout recipes

### Key classnames

| Class | Region |
| --- | --- |
| `.e-flier` / `.e-flier--cascade-stage` | Root + modifier |
| `.e-bg`, `.e-bg__image`, `.e-bg__vignette` | Atmosphere |
| `.e-header*` | Header chrome |
| `.e-cascade__hero`, `__eyebrow`, `__title`, `__icons` | Hero |
| `.e-grid__stage`, `__card`, `__layout`, `__people-col`, `__people`, `__programme`, `__convener` | Card |
| `.e-slot*`, `.e-convener*` | People |
| `.e-keywords*` | Keyword bar |
| `.e-footer*` | Logistics |

### Cascade Stage override pattern

```css
/* Shared base in .e-cascade__* / .e-grid__* */
/* Density only under the template root: */
.e-flier--cascade-stage .e-cascade__title { font-size: 64px; }
.e-flier--cascade-stage .e-grid__stage { padding: 14px 48px 16px; }
/* … */
```

**Do not** fork base class values for one template — override under the modifier so Classic/Cascade leftovers (if revived) stay coherent.

### Safe horizontal inset

Primary content padding aligns to **48px** (header, hero, stage). Footer uses **36px** with QR overhang.

### People-col centering recipe

```
.e-grid__people-col { max-width: 500px; justify-self: end; }
.e-grid__programme { text-align: center; }  /* centers over 3 slots */
```

---

## 15. Do / Don’t (new templates in this language)

### Do

- Register in `fliers/emergence/index.js` + let `project.js` map boards from the registry.
- Reuse `EmergenceBackground`, `EmergenceHeader`, `EmergenceFooter`, `KeywordStrip`, `PortraitSlot`, `ConvenerSlot`, `resolveEmergenceData`.
- Put midsection experiments in a new component + `.e-flier--{id}` CSS overrides.
- Keep export size 1080×1350 unless the brief explicitly changes platform/size.
- Keep programme/hero/header copy on **independent** draft paths.
- Leave speaker/convener photos empty until assets exist; use slot empty states.
- Theme via CSS vars; consume `colorTheme`.
- Strip studio chrome only via `data-studio-chrome` (don’t invent a second export hack).

### Don’t

- Mix other brands onto an Emergence board.
- Flat black backgrounds or purple-default AI aesthetics.
- Cards-on-cards, floating stickers, or dashboard chips unless the brief has them.
- Absolute-float the convener over the card in Stage Grid language (Cascade Stage uses in-grid stretch).
- Share one draft across artboards.
- Bind logo crop to `imageFits`.
- Hardcode Ocean hex in new CSS when a var exists.
- Redesign Flier Studio identity assets/tokens for brand experiments.

---

## 16. Prompt recipes

### Build another template in this system

```text
Read frontend/flierdesignguide/emergenceflierdesignguide.md and the live Cascade Stage
files it points to. Build a new Emergence template that reuses shared chrome
(Background, Header, Footer, KeywordStrip, PortraitSlot, ConvenerSlot) and
resolveEmergenceData. Add a new midsection composition + .e-flier--{id} CSS overrides
in emergence-templates.css. Register it in fliers/emergence/index.js. Keep 1080×1350,
independent draft paths, and studio EditableText/EditableImageSlot contracts.
Do not rewrite emergencedesignguide.md or Flier Studio identity files.
```

### Variant: same Cascade Stage stack, different mid copy density

```text
Follow emergenceflierdesignguide.md. Clone Cascade Stage density overrides under a new
modifier. Keep .e-cascade__* hero + .e-grid__* card structure; only adjust type scale
and padding so a longer heroTheme still fits above the speaker card.
```

### Variant: new card layout, same chrome

```text
Follow emergenceflierdesignguide.md. Keep EmergenceHeader/Footer/Background. Replace only
the Stage Grid midsection with a new card layout that still uses PortraitSlot +
ConvenerSlot, cyan card gradient language, amber offset slabs, and KeywordStrip.
Wire all copy/images to emergence draft paths.
```

---

## 17. Assets checklist

| Asset | Path | Required? |
| --- | --- | --- |
| Background grid | `/assets/emergence/bg-grid.svg` | Yes (referenced in CSS) |
| Default header logo | `/assets/flier-studio/logo-horizontal-on-dark.png` | Default for new drafts |
| Brand logo (custom) | User upload → stored in draft `event.logoSrc` | Optional |
| Speaker / panelist photos | Draft `speakers|panelists.*.photoSrc` | Optional (empty slots OK) |
| Convener photo | `convener.photoSrc` | Optional |
| QR image | `event.qrSrc` | Optional (dashed placeholder) |
| Brand media folder | `frontend/public/assets/emergence/` | Place new Emergence-only media here |

Placeholders: `UserRound` (portraits), dashed QR box + `QrCode` icon, convener empty label, brand “Add brand” dashed control (edit-only).

---

## Quick rebuild checklist

1. Tokens/themes present; size 1080×1350 on root.
2. Shared chrome imported; template only owns midsection.
3. `resolveEmergenceData` + `personProps` used.
4. Cascade hero + Stage Grid classes (or deliberate new BEM) + root modifier overrides.
5. Programme title inside people-col.
6. Equal 3×2 portraits + tall in-grid convener with amber slab.
7. All studio paths wired; `logoLayout` ≠ `imageFits`.
8. Registered in `index.js`; board appears under Emergence project.
9. Export: no studio chrome; single article root.

---

## Appendix — Cascade Stage Flex (dynamic people)

**Separate board.** Original Cascade Stage (`cascade-stage` / `emergence-cascade-stage`) stays fixed 3 speakers + 3 panelists. Flex does not replace it.

| Field | Value |
| --- | --- |
| Template id | `cascade-stage-flex` |
| Board id | `emergence-cascade-stage-flex` |
| Component | `EmergenceCascadeStageFlex.jsx` |
| Helpers | `stagePeopleLayout.js` |
| Inspector | Edit panel → **People on stage** (1–10) + **Include convener column** |

### Data (Flex only)

| Path | Notes |
| --- | --- |
| `stagePeopleCount` | `1…10` |
| `stagePeople[i].{name,title,accent,photoSrc}` | Length for render === count; draft may keep extras when count shrinks |
| `includeConvener` | Default `true`; when `false`, people use full card width |

Classic `speakers[]` / `panelists[]` remain for Cascade Stage and other templates.

### Layout recipes (convener ON)

| N | People rows | Notes |
| --- | --- | --- |
| 1 | 1 | Large centered in people-col |
| 2 | 1×2 | Equal pair |
| 3 | 1×3 | Single row |
| 4 | 2×2 | Quad |
| 5 | 3 + 2 | Last row centered |
| 6 | 3×2 | Same balance as shipped Cascade Stage |
| 7 | 4 + 3 | Last row centered |
| 8 | 4×2 | Smaller slots |
| 9 | 3×3 | Compact |
| 10 | 5×2 | Compact; hero/card padding reduced |

Incomplete rows use `justify-content: center` on `.e-flex-people__row`. Slot size scales via `[data-people-count]` under `.e-flier--cascade-stage-flex` only.

Programme title stays in `.e-grid__people-col` (centers over people, not convener).

---

*Documents Cascade Stage as shipped in the Emergence flier codebase. Prefer live JSX/CSS over older multi-template notes when they conflict.*
