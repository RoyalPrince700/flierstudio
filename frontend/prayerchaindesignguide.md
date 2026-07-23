# GraceLife Prayer Chain — Design Guide

Recreation brief for the **Prayer Chain** church flier (native **1500 × 1500**, print square **5 in × 5 in @ 300 DPI**).

Use this file + `src/samples/prayer-chain/tokens.js` + `src/fliers/gracelife/PrayerChainFlier.jsx` whenever prompting Cursor to rebuild or vary this look.

**Reference:** `sample/references/prayer-chain/prayerchainflier.jpg`  
**Source process:** Photoshop steps documented below → browser CSS/React equivalents.

---

## 1. Brand & concept

| Field | Value |
| --- | --- |
| Brand | **GraceLife Church** |
| Piece | **Prayer Chain** fasting season announcement |
| Intent question | What’s the GraceLife Prayer Chain fasting season and when is it? |
| Mood | Warm gold/yellow gospel energy, metallic chains, soft film grain, luminous center glow, city haze at the bottom |
| Depth model | Radial gold field → city fade → corner chains (DOF) → yellow light-leak bloom → centered logo + blackletter title → grain + global grade |
| Canvas | **1500 × 1500** (`print-square-5in` in `src/lib/sizes.js`) |

One composition, not a dashboard. Chains **frame** the title; they never cover the center.

---

## 2. Exact layout map (Y bands on 1500×1500)

| Band | Y range (approx) | Content |
| --- | --- | --- |
| Full field | 0–1500 | Radial yellow↔white + grain + grade overlays |
| Logo | 90–280 | GraceLife logo, top-center (~210×170) |
| Title block | 400–980 | “Prayer” / “Chain” stacked blackletter |
| Support | 990–1040 | “30 days fasting and prayer” (serif) |
| Date | 1055–1110 | “22nd to 31st of August 2026” (serif) |
| City plate | ~950–1500 | Bottom third cityscape, soft top fade |
| Chains | corners | Top-right (hero/sharp), bottom-left (blur), bottom-right (blur) |
| Glow leaks | top + bottom + soft mid | Screen-blended yellow abstract bloom |

Horizontal: everything critical is **centered**. Safe inset ≥ **72px** from edges for logo/type.

---

## 3. Color tokens

Sampled from `prayerchainflier.jpg` + PS grade notes:

| Token | Hex / value | Role |
| --- | --- | --- |
| `core` | `#FFF8E0` | Near-white luminous center |
| `glowMid` | `#FFE566` | Soft mid glow |
| `field` | `#F5C400` | Saturated yellow field |
| `fieldDeep` | `#E0A800` | Edge / vignette gold |
| `ink` | `#3D2808` | Display + logo deep chocolate-gold |
| `inkSoft` | `#4A3200` | Support / date |
| `sheen` | `#FFE566` | Lighten brush on type |
| `mapYellow` | `rgba(255,200,0,0.28)` | Soft-light yellow gradient map |
| `mapWarm` | `rgba(220,80,20,0.22)` | Soft-light red/amber map |
| `shadowCool` | `rgba(40,70,140,0.12)` | Color-balance shadows (blue) |
| `highlightWarm` | `rgba(255,90,40,0.1)` | Color-balance highlights (red) |

**Rules**

- Field stays in the warm yellow family — never flat white or purple.
- Type/logo stay deep brown-gold; never pure black or pure white on this board.
- Chains read as **metal** (grayscale + contrast) — ignore the source PNG’s red link; grade it away.
- City is gold-tinted haze, not a sharp photo plate.

---

## 4. Typography

| Role | Treatment | Notes |
| --- | --- | --- |
| Display `Prayer` / `Chain` | Blackletter, stacked, centered | Heavy visual weight; ~200–230px on 1500 canvas |
| Support | Classic serif, centered, tight tracking | “30 days fasting and prayer” ~28–32px |
| Date | Same serif family, slightly larger | “22nd to 31st of August 2026” ~34–38px |
| Logo wordmark | Built into `logo.png` | Recolor to `ink` — do not restyle the file’s letterforms |

**Font stack in studio**

- Display: **UnifrakturCook** (Google Fonts) — substitute for **American Trial** (not in repo). If the user later drops an American Trial `@font-face`, swap the token.
- Support / date: **Playfair Display** (already in `index.html`)

**PS note:** “66px / 14px” in the build notes likely referred to a smaller working size. **Match the reference JPG’s visual weight**, not those literal px values on a 1500 canvas.

**Display finish**

- Gold-brown fill (solid or subtle vertical gradient via `background-clip: text`)
- Soft yellow lighten/screen sheen clipped to glyphs (metallic top-edge highlight)

---

## 5. Asset map

Ship only user-provided files (no invented brand art):

```text
public/assets/gracelife/
  logo.png                      GraceLife mark (white-on-black → recolor)
  chain-with-red-link.png       Chain plate (metal grade; ignore red link)
  cityscape.jpg                 Bottom city (from beautiful-cityscape-…)
  yellow-abstract.jpeg          Soft glow / light-leak brush plate

sample/references/prayer-chain/
  prayerchainflier.jpg          Final visual target
  …                             Full resource set copy
```

Reference paths in code: `/assets/gracelife/...`

---

## 6. Photoshop → code translation table

For each PS step: **goal**, **PS values**, **code technique**, **fidelity / fallback**.

### STEP 1 — Base gradient + noise

| | |
| --- | --- |
| **Goal** | Luminous yellow gospel field with film grain |
| **PS** | Radial yellow↔white; scale gradient up (large soft core); Smart Object; Filter → Noise ~15% |
| **Code** | Full-bleed `radial-gradient(circle at 50% 42%, core → glowMid → field → fieldDeep)`. Large core radius (~70–90% of canvas). Grain: SVG `feTurbulence` overlay (or repeating noise PNG) at ~**15%** opacity, `mix-blend-mode: overlay` or soft-light |
| **Fallback** | If SVG noise is heavy on export, use a tiny tiled noise PNG at same opacity |

### STEP 2 — City plate (bottom)

| | |
| --- | --- |
| **Goal** | Hazy urban base that melts into yellow |
| **PS** | Place city at bottom; soft brush layer mask into yellow; reduce opacity |
| **Code** | Absolutely position city in bottom ~40%; `mask-image: linear-gradient(to top, #000 0%, #000 35%, transparent 100%)`; opacity ~0.45–0.6; `filter: sepia(0.55) saturate(1.2) brightness(0.95)` or `mix-blend-mode: multiply` / soft-light |
| **Fallback** | Without mask support, use a tall gradient fade div over the city top edge |

### STEP 3 — Three chains

| | |
| --- | --- |
| **Goal** | Corner metallic framing; clear center for title |
| **PS** | Import chain; flip/rotate → top-right; duplicate → bottom-left; duplicate → bottom-right; group |
| **Code** | Three `<img>` instances of the same chain asset with distinct `transform: rotate / scale / scaleX(-1)`. Corner framing only — never cover the title block |
| **Fallback** | Two chains (TR + BL) if BR feels crowded — keep TR as hero |

### STEP 4 — Chain group grading (clipping-mask stack)

| | |
| --- | --- |
| **Goal** | High-contrast metal; kill red link color |
| **PS** | B&W adjustment clipped to chain group; Curves S-curve clipped for contrast |
| **Code** | Wrap chains; per-chain or group `filter: grayscale(1) contrast(1.35–1.55) brightness(1.05)`. Black bg of PNG: `mix-blend-mode: screen` (or lighten) so black drops out on yellow |
| **Fallback** | If screen washes too much, use `lighten` or a luminance mask |

### STEP 5 — Per-chain focus

| | |
| --- | --- |
| **Goal** | Depth of field: sharp hero TR, soft BL/BR |
| **PS** | Gaussian Blur **1.6** on individual chains; Camera Raw on **top-right only**: Clarity **+500** (max texture push), Blacks **−20 / −30** |
| **Code** | BL + BR: `filter: … blur(1.6px)`. TR: **no blur**; stronger `contrast` + slight sharpen (`contrast(1.45)` + optional SVG unsharp). |
| **Fallback** | **Clarity +500 has no true CSS equivalent.** Document the gap; approximate with higher local contrast. Prefer matching the JPG’s “sharp metal TR” over chasing the slider number |

### STEP 6 — Yellow abstract glow plate

| | |
| --- | --- |
| **Goal** | Soft light leaks top/bottom (and soft mid) without washing the title flat |
| **PS** | Yellow FG; place yellow abstract; Gaussian Blur **~135**; blend **Screen**; invert mask then brush glow onto top, bottom, some middle |
| **Code** | Overlay `yellow-abstract.jpeg` with `filter: blur(80–135px)`, `mix-blend-mode: screen`, opacity ~0.55–0.85. Restrict with CSS `mask-image` radial/linear so center title retains readable contrast |
| **Fallback** | Pure CSS radial yellow blobs at screen/soft-light if the plate is too noisy |

### STEP 7 — Gradient maps

| | |
| --- | --- |
| **Goal** | Warm unified grade |
| **PS** | Gradient Map yellow→transparent, **Soft Light**, opacity **~28%**; duplicate; change yellow stop to red for warm blend |
| **Code** | Pseudo overlays: yellow→transparent and red/amber→transparent at `mix-blend-mode: soft-light`, opacity ~28% |
| **Fallback** | Single warm soft-light radial if dual maps muddy the field |

### STEP 8 — Typography

| | |
| --- | --- |
| **Goal** | Stacked blackletter title + serif support/date |
| **PS** | American Trial ~66px (see §4); deep gold/brown; serif support ~14px tracking VA −5; date slightly larger |
| **Code** | UnifrakturCook display; Playfair support; centered stack; gold fill + lighten sheen (Step 10) |
| **Fallback** | `MedievalSharp` or local American Trial `@font-face` if UnifrakturCook feels wrong |

### STEP 9 — Logo

| | |
| --- | --- |
| **Goal** | Brand lockup above title in display ink |
| **PS** | Place logo **W204 × H166** (scale for 1500 if needed); Color Overlay = deep Prayer Chain text color |
| **Code** | Top-center `EditableImageSlot` / img ~210×170. White-on-black PNG → **luminance mask** with `background: ink`, or invert + multiply/sepia filter to deep gold-brown |
| **Fallback** | If mask fails in export, use a pre-tinted asset (only if user provides one) |

### STEP 10 — Text lighten brush

| | |
| --- | --- |
| **Goal** | Metallic sheen on Prayer / Chain |
| **PS** | New layers clipped to text; yellow brush; blend **Lighten** |
| **Code** | Soft yellow radial overlays with `background-clip` / mask on title, `mix-blend-mode: lighten` or `screen`, low opacity |
| **Fallback** | Lighter gradient stop on `background-clip: text` only |

### STEP 11 — Global finish (stamp + Camera Raw)

| | |
| --- | --- |
| **Goal** | Final punch: dehaze, texture, warm contrast |
| **PS** | Stamp (Ctrl+Alt+Shift+E); Smart Object; ACR: Dehaze **+43**, Texture **+56**, Blacks **−25**, Shadows **−11**, Clarity **+1**, Temp **+2**, Contrast **+5** |
| **Code** | Final grade wrapper: slight `contrast` + `saturate` boost; subtle warm overlay; optional micro-sharpen; slight shadow deepen via dark soft-light vignette |
| **Fallback** | **No true Camera Raw in CSS.** Closest browser equivalent is this grade wrapper — prioritize matching the JPG atmosphere |

### STEP 12 — Color Balance

| | |
| --- | --- |
| **Goal** | Cool shadows, warm highlights, slight mid yellow trim |
| **PS** | Midtones Yellow **−6**; Shadows Blue **+20**; Highlights Red **+20** |
| **Code** | Low-opacity overlays: cool blue toward corners/shadows; red/warm toward highlight core; soft midtone map |
| **Fallback** | Skip midtone yellow trim if the field already reads warm enough |

---

## 7. Layer / z-index recipe

1. `z-0` Base radial gradient  
2. `z-1` City plate (masked, bottom)  
3. `z-2` Soft chains (BL, BR — blurred)  
4. `z-3` Hero chain (TR — sharp)  
5. `z-4` Yellow abstract glow (screen)  
6. `z-5` Soft-light gradient maps  
7. `z-6` Logo + typography + text sheen  
8. `z-7` Grain  
9. `z-8` Global grade + color-balance overlays  

Export root: single `<article class="pc-flier">` capture node.

---

## 8. Spacing & safe areas

| Measure | Value |
| --- | --- |
| Outer safe inset | ≥ 72px |
| Logo top | ~96px from top |
| Logo size | ~210 × 170 (from PS 204×166, nudged for 1500) |
| Title block center | optically mid-canvas (slightly above geometric center) |
| Support → date gap | ~20–28px |
| Chain clear zone | Keep ~320px radius around title free of opaque chain links |

---

## 9. Copy deck

```text
Logo: GraceLife Church (asset)
Display line 1: Prayer
Display line 2: Chain
Support: 30 days fasting and prayer
Date: 22nd to 31st of August 2026
```

**Date authority:** Prefer the finished reference JPG (**August**) over conflicting PS notes that said September.

Studio-editable paths: `logoSrc`, `line1`, `line2`, `support`, `date`.

---

## 10. Do / Don’t

**Do**

- Keep one luminous gold composition with a clear center title
- Frame with metal chains; grade them grayscale/high-contrast
- Soft-mask the city into the yellow field
- Use UnifrakturCook (or American Trial if provided) + Playfair
- Leave the collection **draft/unpublished** until an admin publishes it

**Don’t**

- Invent extra logos, stickers, schedule chips, or dashboard widgets
- Cover the title with chains or heavy glow
- Default this board to Instagram portrait (1080×1350)
- Mix other brands on this artboard
- Claim 1:1 Camera Raw Clarity +500 fidelity — approximate and match the JPG

---

## 11. Prompt recipes

```text
Rebuild using prayerchaindesignguide.md + src/samples/prayer-chain/tokens.js.
Canvas 1500×1500. Assets in public/assets/gracelife/. Match prayerchainflier.jpg mood.
```

```text
Adjust Prayer Chain glow — stronger top light leak, keep title contrast.
Keep collection prayer-chain as draft.
```

```text
Swap Prayer Chain date copy only; preserve grade, chains, and city mask.
```

---

## Related files

| File | Role |
| --- | --- |
| `frontend/prayerchaindesignguide.md` | This guide |
| `src/samples/prayer-chain/tokens.js` | Tokens |
| `src/samples/prayer-chain/PRINCIPLES.md` | Sample shortform |
| `src/samples/prayer-chain/meta.js` | Template collection registry entry |
| `src/fliers/gracelife/PrayerChainFlier.jsx` | React implementation |
| `src/fliers/gracelife/prayer-chain.css` | Styles |
| `src/lib/sizes.js` → `print-square-5in` | Size entry |
