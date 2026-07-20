# Sample collection: malik-gadget

Retail gadget promo system reverse-engineered from `sample/inbox/malik-gadet/` (typo folder → id `malik-gadget`).  
Six Instagram-portrait variations that share one chrome system.  
Demo brand: **Orbit Gadgets** — swap for real copy/assets when applying to a project.

References live in `sample/references/malik-gadget/`.

## Identity

| Field | Value |
| --- | --- |
| Collection id | `malik-gadget` |
| Format | Instagram Portrait · 1080×1350 |
| Tags | retail, gadgets, product, lifestyle, footer-dock |
| Chat reuse | `use sample malik-gadget` or a template id below |

## Reference → template map

| Reference file | Template id | Layout role |
| --- | --- | --- |
| `1784480801686.jpeg` | `malik-gadget-flagship-tray` | Product tray, 3 phone slots |
| `1784480807201.jpeg` | `malik-gadget-upgrade-hero` | Lifestyle person + pink mark |
| `1784480807520.jpeg` | `malik-gadget-pocket-split` | Navy split + quality seal |
| `1784480813794.jpeg` | `malik-gadget-gadget-burst` | Black product burst |
| `1784480818929.jpeg` | `malik-gadget-box-stack` | Strike headline + box stack |
| `1784480822729.jpeg` | `malik-gadget-week-plans` | Two-tone headline + lifestyle |

---

## Shared system (all templates)

### Canvas & zones

| Zone | Approx. height | Notes |
| --- | --- | --- |
| Header | ~8% | Logo left · address right |
| Headline / hero | ~62–68% | Variation-specific |
| Footer dock | ~14% | Signature morphism bar |
| Safe padding | 48px | All edges |

### Header chrome

- **Left:** square brand mark (~64×64) in brand blue + uppercase wordmark beside it
- **Right:** map-pin icon + 2-line address, right-aligned, ~15px, weight 500
- On dark templates: invert wordmark + address to white / near-white

### Footer dock (signature — keep on every reuse)

1. Outer frame: `#0d0d0d`, border-radius ~32px, soft drop shadow
2. Inner panel: white → `#f2f3f5` gradient, radius ~24px, padding ~12–16px
3. **Left CTA:** blue vertical gradient pill (`#4d9bff` → `#0b5fff` → `#0847c7`), uppercase **SHOP NOW**, ~54px tall, ~168px min width
4. **Contacts:** WhatsApp + phone icons + number · Instagram/TikTok-style icons + `@handle`
5. Dock sits above bottom safe edge; never float as a detached sticker mid-artboard

### Typography

| Role | Size | Weight | Notes |
| --- | --- | --- | --- |
| Display headline | 58–64px | 800 | Manrope / DM Sans, tracking −0.03em, leading ~1.05 |
| Support | 22–24px | 400–500 | Muted grey or white@78% on dark |
| Wordmark | 22px | 800 | Uppercase, slight tracking |
| CTA | 18px | 800 | Uppercase, tracking 0.06em |

**Emphasis tricks used across the set**

- Pink highlight bar behind key words
- Yellow accent line / seal
- Strike-through second line
- Dual-tone headline (black + brand blue, or yellow + silver gradient)

### Color tokens

| Token | Hex | Use |
| --- | --- | --- |
| brand | `#0b5fff` | Logo tile, CTA, accents |
| brandSoft / brandDeep | `#4d9bff` / `#0847c7` | CTA gradient, tray gloss |
| accent yellow | `#ffe14a` | Seals, swooshes, highlight words |
| pink mark | `#ff2d7b` | Headline highlight bar |
| paper | `#f4f5f7` | Light template fields |
| navy / navyDeep | `#0a2a7a` / `#061433` | Pocket split field |
| black | `#0a0a0a` | Burst field + footer frame |
| ink / muted | `#111111` / `#6b6b6b` | Body on light |

### Shadow language

- Product / person: soft studio (`0 18–30px` blur, low opacity black)
- Tray: blue-tinted glow under shelf
- Footer: deeper black shadow (`0 18px 40px`)
- Bubbles / seals: medium circular shadow

### Placeholders

| Slot | Component |
| --- | --- |
| People | `PortraitPlaceholder` |
| Phones / boxes / lifestyle crops | `ImagePlaceholder` |
| Brand mark | `LogoPlaceholder` (demo mark `OG`) |

Never clone Malik photos, logo, phone number, or handle.

---

## Template variations

### 1. `malik-gadget-flagship-tray`

- **Mood:** clean retail studio, light paper vignette
- **Headline:** centered question (~64px) + short support
- **Hero (~45%):** glossy blue 3D tray (~860×420, radius 36) with **3 equal slots**; frosted brand chips float above each slot
- **Layout:** header → headline → tray stage → footer

### 2. `malik-gadget-upgrade-hero`

- **Mood:** bright lifestyle, soft white radial glow behind subject
- **Headline:** sentence with **pink highlight mark** on 1–2 key words
- **Hero:** centered person placeholder (~420 wide, 3:4 soft) + 2 floating circular gadget bubbles (pink / blue tints)
- **Layout:** header → headline → person stage → footer

### 3. `malik-gadget-pocket-split`

- **Mood:** deep navy full-bleed, confident outdoor tech
- **Layout zones:** 2-column mid (~1 : 1.05) — copy left, lifestyle crop right
- **Headline:** white, left-aligned; yellow curved swoosh under last word
- **Prop:** yellow circular **Quality pick** seal (~140px) over media
- Optional soft city/line art wash behind copy (low opacity)

### 4. `malik-gadget-gadget-burst`

- **Mood:** black premium, cool blue rim glow at center
- **Headline:** line 1 yellow · line 2 white→silver gradient
- **Hero:** floating product cluster (6+ placeholders: laptop, phones, watch, console, tablet) around a mid focal slot
- **Prop:** yellow quality seal left of cluster

### 5. `malik-gadget-box-stack`

- **Mood:** white/grey retail vignette
- **Headline:** brand-blue first line · black strike-through second line
- **Hero:** 3 stacked angled product-box cards (largest bottom, smallest top) + circular icon bubbles L/R
- Cards: white/grey, dark, brand-blue fills — label only (no real packaging art)

### 6. `malik-gadget-week-plans`

- **Mood:** motivational urban morning
- **Headline:** black line + brand-blue second line
- **Hero:** person placeholder over soft sky / city band
- Keep lifestyle energy; no product grid

---

## Do / Don’t

**Do**

- Keep footer dock + logo/address header on every reuse
- Match emphasis tricks (mark, strike, yellow seal, dual-tone)
- Swap Orbit demo copy for the brief; wire real assets from `public/assets/<brand>/`

**Don’t**

- Copy Malik slogans, photos, logo, phone, or social handle
- Drop the footer dock or turn the flier into a dashboard of chips/stats
- Mix this system with another brand’s chrome on the same board
