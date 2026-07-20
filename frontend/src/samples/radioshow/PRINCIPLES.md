# Sample collection: radioshow

Podcast / radio promo system reverse-engineered from `sample/references/radioshow/`.  
Three Instagram-portrait variations that share one neo-brutalist chrome language.  
Demo brand: **Signal Room** — swap for real copy/assets when applying to a project.

## Identity

| Field | Value |
| --- | --- |
| Collection id | `radioshow` |
| Format | Instagram Portrait · 1080×1350 |
| Tags | podcast, radio, grid, isometric, neo-brutal, CTA |
| Chat reuse | `use sample radioshow` or a template id below |

## Reference → template map

| Reference file | Template id | Layout role |
| --- | --- | --- |
| `1784491792568.jpeg` | `radioshow-on-air-slab` | Blue grid + black polygon slab + floating audio icons |
| `1784491801294.jpeg` | `radioshow-week-lineup` | Orange grid + stacked weekly guest schedule |
| `1784491801652.jpeg` | `radioshow-mic-hero` | Green grid + long-shadow title + mic hero |

---

## Shared system (all templates)

### Canvas & zones

| Zone | Approx. height | Notes |
| --- | --- | --- |
| Field | 100% | Solid color + light square grid |
| Content | ~70–78% | Variation-specific hero / slab / stack |
| CTA | ~6% | Orange pill, mid-lower |
| Brand footer | ~8% | Signal mark + wordmark, bottom-right (or bottom-left on mic-hero) |
| Safe padding | 56px | Outer edges |

### Field chrome (signature)

1. **Solid color field** — blue / orange / green (see tokens)
2. **Square grid** — ~48px cells, light white strokes @ ~18–22% opacity
3. Never flat empty color without the grid

### Shadow language (signature — keep on every reuse)

- **Solid black isometric extrusions** — no soft blur shadows
- Typical offset: `18–28px` on X and Y (direction varies by block)
- Used on: display type, schedule cards, stacked title plates, CTA
- Feel: neo-brutal / flat 3D sticker, not studio soft-light

### Typography

| Role | Size | Weight | Notes |
| --- | --- | --- | --- |
| Display mega | 96–120px | Black / Bebas | Bebas Neue, tracking −0.02em, leading ~0.92 |
| Stacked title plates | 52–64px | 800 | Black ink on green/blue plates |
| Body / support | 28–34px | 500–600 | White on dark slabs or green field |
| Schedule name | 28–32px | 700 | White on blue/green cards |
| Schedule meta | 18–20px | 500 | White @ 85% |
| CTA | 22–24px | 700 | White on orange |
| Wordmark | 22px | 700 | Beside signal mark |

### Color tokens

| Token | Hex | Use |
| --- | --- | --- |
| blue | `#2f6dff` | On-air field, schedule cards, title plate |
| orange | `#ff6a12` | Schedule field, display type, CTA |
| green | `#3dcc4a` | Mic-hero field, schedule cards, title plate |
| black | `#0a0a0a` | Slabs, shadows, ink |
| white | `#ffffff` | Support copy, icons, wordmark |

Accent rhythm across the set: **blue ↔ orange ↔ green** always present together (field + accents).

### CTA button (shared)

- Fill: orange `#ff6a12`
- Radius: ~12px
- Padding: ~18×36
- White label, weight 700
- Optional solid black offset shadow (~8–12px)
- Copy energy: listen / stream on Spotify (demo: “Listen today on Spotify”)

### Brand footer (shared)

- Left or right bottom: **signal-wave mark** (concentric arcs + center dot) + **Signal Room** wordmark
- Mark ~40–48px; wordmark ~22px
- Ink adapts to field (white on blue/orange; black on green)

### Placeholders

| Slot | Component |
| --- | --- |
| Retro mic / product hero | `ImagePlaceholder` |
| Brand mark (if not CSS icon) | `LogoPlaceholder` |
| Guest faces (if added later) | `PortraitPlaceholder` |

Never clone PodcastPRIME assets, Portuguese slogans, or the reference mic photo.

### Icons

Use `lucide-react` for floating audio props (`Mic`, `Volume2`, `Radio`) with thick stroke (~2.5–3) and solid black outline feel.

---

## Template variations

### 1. `radioshow-on-air-slab`

- **Mood:** loud station ID, blue studio grid
- **Field:** blue + grid
- **Hero (~55%):** large **irregular black polygon** (clip-path) from left, holding:
  - Mega orange display: “On air” (2 lines ok)
  - White support under it
  - Orange CTA near bottom of slab
- **Props:** 3 floating audio icons stacked on the right (speaker, green mic, white mic) with hard black outlines
- **Footer:** brand bottom-right, white ink
- **Eye path:** orange “On air” → icons → CTA → brand

### 2. `radioshow-week-lineup`

- **Mood:** weekly programming board, sticker stack
- **Field:** orange + grid
- **Header (~18%):** two overlapping titled plates, slightly rotated
  - Top green plate: “This week’s”
  - Under blue plate: “lineup”
  - Both with solid black isometric shadow (up-right)
- **Body (~55%):** **3 horizontal guest rows**, alternating blue / green / blue
  - Left black date cell (“13 JUN”)
  - Center: guest name + role
  - Right small orange time chip (“19H”)
  - Each row has solid black offset shadow (down-left)
- **CTA:** green plate with black shadow, centered lower
- **Footer:** brand bottom-right
- **Eye path:** title plates → date/name rows → CTA → brand

### 3. `radioshow-mic-hero`

- **Mood:** product hero for the show itself
- **Field:** green + grid
- **Left column (~48%):**
  - Blue mega title with long black isometric shadow up-right (“Best podcast” / stacked 2 lines)
  - White support line
  - Orange CTA
- **Right (~45%):** large mic / broadcast prop via `ImagePlaceholder` (tall aspect, soft corners)
- **Footer:** brand bottom-left, black ink
- **Eye path:** blue title → mic → CTA → brand

---

## Reuse notes

When the user says `use sample radioshow` or a template id:

1. Keep grid field + solid isometric shadows + orange CTA + signal footer.
2. Swap demo brand/copy; keep color triad (blue / orange / green).
3. Do not soften into glassmorphism or purple gradients — this system is hard-edge and loud.
