# Sample Design Analysis Guide

Use this file whenever the user drops references into `sample/inbox/` (or attaches designs) and asks you to **analyze** or **sample** them.

Goal: reverse-engineer the design(s) into a reusable **sample collection** — not a pixel-for-pixel copy of brand assets or copy.

---

## Inbox shapes

| What you put in inbox | How AI treats it |
| --- | --- |
| Loose files in `sample/inbox/*.png` | Each file can be its own single-template collection (or ask user) |
| A **folder** of designs, e.g. `sample/inbox/malik-gadget/` | **One collection** — analyze all images together as template variations of the same system |

### Folder groups (important)

When multiple templates of the same brand/project live in one folder:

1. Treat the **folder name** as the collection id (normalize to kebab-case: `malik gadet` → `malik-gadget`).
2. Analyze **shared chrome first** (logo placement, footer bar, palette, type, CTA) — what stays constant across every file.
3. Then analyze **each image as a template variation** (hero type, layout, mood).
4. Recreate **every** variation under one collection so Samples shows one card → click → all templates.
5. Move the whole folder to `sample/references/{collection-id}/` after analysis.

```text
sample/inbox/malik-gadget/
  tray.jpeg
  hero.jpeg
  pocket.jpeg
  …
        ↓ analyze as one group
src/samples/malik-gadget/
  PRINCIPLES.md          # shared system + per-template notes
  tokens.js
  shared/                # logo header, footer dock, badge…
  templates/             # one component per variation
  meta.js                # collection with templates[]
```

---

## Naming convention

### A. Single style template

```text
{technique}-{composition}[-{mood}]
```

Examples: `glass-stack`, `neon-grid-night`, `editorial-split`

### B. Multi-template folder / brand pack

```text
{brand-or-theme}
```

Examples: `malik-gadget`, `kinesis-emergence`, `smipay-promo`

- Use the inbox **folder name** (kebab-case).
- Each variation inside gets a short template id: `malik-gadget-flagship-tray`, `malik-gadget-pocket-split`.

**Chat reference:** “use sample `malik-gadget`” (collection) or “use template `malik-gadget-flagship-tray`”.

---

## Workflow (AI checklist)

### 1. Intake

1. Scan `sample/inbox/` for folders and loose files.
2. If a **folder** has 2+ images → one grouped collection (see above).
3. Propose collection id (from folder name or technique naming).
4. Move references to `sample/references/{id}/` (keep originals).
5. Create `src/samples/{id}/`.

### 2. Deep analysis (write `PRINCIPLES.md`)

For a **folder group**, structure PRINCIPLES as:

1. **Shared system** (applies to all templates)
2. **Template variations** (one subsection each)

Document concrete values (hex, px, ratios).

#### Shared checklist

- Canvas size / orientation
- Header chrome (logo, address, icons)
- Footer / CTA dock (shape, morphism, button, contacts)
- Color tokens, fonts, spacing, shadow language
- Placeholder rules (people, products, logos)

#### Per-template checklist

- Background & mood
- Hero treatment (product tray, person, lifestyle crop, burst…)
- Headline pattern
- Unique badges / props
- Layout zones (% height)

### 3. Demo recreation (not a clone)

Build components with **demo brand + demo copy**:

| Reference | Demo |
| --- | --- |
| Malik Gadget / real brand | Orbit Gadgets / Northline Tech |
| Real slogans | Similar energy, different words |
| Real photos | `PortraitPlaceholder` / `ImagePlaceholder` |
| Real logos | `LogoPlaceholder` |

Match structure, type rhythm, color, morphism — not their words or assets.

### 4. Speakers / people / products → placeholders

Follow `sample/PLACEHOLDERS.md`. Tune props to slot geometry.

### 5. Register the collection

1. `meta.js` exports a **collection** (`templates: [...]`), not a single orphan flier.
2. Import in `src/samples/registry.js` via `ANALYZED_COLLECTIONS`.
3. Verify on Samples: one card for the group → open → all variations.

### 6. Reuse later

When the user says “make a flier like `malik-gadget`” or “like `malik-gadget-pocket-split`”:

1. Read that collection’s `PRINCIPLES.md` (+ specific template notes).
2. Implement under the **active brand project**.
3. Swap demo copy/placeholders for real brief assets.

---

## Files per collection

```text
sample/references/{id}/             # original inspiration set
src/samples/{id}/
  meta.js                           # collection registry entry
  PRINCIPLES.md                     # shared + per-template
  tokens.js
  shared/                           # optional shared chrome
  templates/{Name}.jsx              # each variation
  *.css
```

---

## Analysis depth bar

A collection is done when another agent can rebuild any variation from `PRINCIPLES.md` alone, and the Samples UI shows every template under one group card.
