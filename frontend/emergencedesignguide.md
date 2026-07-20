# Emergence / Kinesis Design Guide

Recreation brief extracted from `designsamples/emergenceflier.webp` (native **1080 × 1355**, treat as Instagram portrait **1080 × 1350**).

Use this file + `src/design/emergenceTokens.js` whenever prompting Cursor to design in this visual language.

---

## 1. Brand & concept

| Field | Value |
| --- | --- |
| Event | **KINESIS '26** |
| Series | Cloudde Growth Conference (CGC) |
| Theme line | **Emergence** + accent capsule **Beyond Limit** |
| Mood | High-energy tech conference, bold, optimistic, Lagos-scale ambition |
| Depth model | Background grid → glowing architecture → tilted content card → overlapping convener cutout → solid logistics footer |

---

## 2. Exact layout map (top → bottom)

Approximate Y bands on a 1355-tall canvas:

| Band | Y range (approx) | Content |
| --- | --- | --- |
| Header | 0–140 | Logo left · theme center · partner marks right |
| Atmosphere | full bleed | Grid + cyan architectural glow + floating shapes |
| Gallery card | 160–880 | Tilted light-blue panel (speakers + panelists + keyword strip) |
| Convener | 820–1180 | Large cutout portrait overlapping card + footer (right) |
| Footer | 1120–1355 | Dark logistics bar: city, venue, time, date, motif block, QR |

---

## 3. Color system

Sampled / matched from the reference:

| Token | Hex | Role |
| --- | --- | --- |
| `navyDeep` | `#061433` | Deepest voids, footer base |
| `navy` | `#0B1E6E` | Footer / dark panels |
| `royal` | `#102E8D` | Main background |
| `royalMid` | `#1E42A3` | Mid sky / gradients |
| `cyanCard` | `#5EB6FF` | Central tilted gallery card |
| `cyanCardDeep` | `#3A8DFF` | Card gradient end / inner strip |
| `ink` | `#FFFFFF` | Primary type |
| `inkSoft` | `#D7E6FF` | Secondary type on blue |
| `lime` | `#B6FF00` | Theme capsule, triangles, energy accents |
| `limeInk` | `#0A1400` | Text on lime |
| `amber` | `#FFB800` | Portrait offset blocks, plus marks |
| `orange` | `#FF8A3D` | Alternate portrait backs |
| `motifBlue` | `#4DA1FF` | Soft cloud / petal shapes |
| `grid` | `rgba(255,255,255,0.08)` | Technical grid lines |

**Rules**

- Background stays in the royal/navy family — never flat black.
- Lime is scarce: capsule, small triangles, 1–2 motifs max in a cluster.
- Amber/orange only behind portrait frames or in the motif cluster — not large fills.
- White type on navy/royal; black/near-black type on lime only.

---

## 4. Typography

| Role | Treatment | Notes |
| --- | --- | --- |
| Wordmark `KINESIS '26` | Heavy geometric sans, tight tracking, uppercase | Optional horizontal cut stripes through letters (esp. S) |
| Series line | Small caps / uppercase, wide tracking | Under wordmark: `CLOUDDE GROWTH CONFERENCE` |
| Theme `Emergence` | Bold title case or uppercase, high contrast white | Sits left of lime capsule |
| Capsule `Beyond Limit` | Bold, lime fill, dark text, pill/rounded rect | Same line as Emergence |
| Section labels `SPEAKERS` / `PANELISTS` | Thin–medium uppercase, often **vertical** (rotate -90°) | Left edge of gallery card |
| Person name | Bold uppercase, small | Under each portrait |
| Person title | Regular / light, smaller | Under name |
| City `LAGOS` | Extra-bold display, very large | Footer left |
| Venue / time / date | Bold uppercase | Footer mid |
| Keywords strip | Bold uppercase, bullet/dot separated | Inside card bottom |
| URL under QR | Tiny mono-ish or sans | `cgc.thecloudde.com/kinesis/` |

**Font stack in studio**

- Display / wordmark: `Orbitron` (geometric tech)
- UI / body: `Manrope`
- Optional condensed labels: `Manrope` weight 700–800

---

## 5. Geometry & effects

### Background

1. Base vertical gradient: `#102E8D` → `#0B1E6E` → `#061433`
2. Fine square grid (~40–48px), low opacity white
3. Large soft cyan “bridge / tower” glow (blurred architectural silhouette), mid-canvas
4. Floating motifs (sparse):
   - Lime triangles (filled)
   - Concentric circle rings (stroke only, cyan/white)
   - Soft cloud/petal blobs (blue–white)
   - Amber `+` marks
   - Occasional lightning / spark icon (line style)

### Central gallery card

- Fill: linear gradient `#7EC8FF` → `#3A8DFF`
- Soft outer glow (`box-shadow` cyan)
- **Rotation ≈ -3deg to -4deg** (signature of the reference)
- Inner padding generous (~36–48px)
- Bottom inner strip darker blue for keywords: `DISRUPTION · 1M+ GRANT · GROWTH · NETWORKING`

### Portrait frames

- Rectangular photos (not circles)
- Solid color slab **offset behind** each photo (amber or blue), ~8–12px down-right
- Name + title stacked under frame
- Empty state (this studio): keep the frame + offset slab, show icon placeholder, no face photo

### Speakers vs panelists

- **Speakers row:** 3 columns
- **Panelists row:** 4 columns (slightly smaller frames)
- Vertical labels on the left of each row group

### Convener

- Large cutout-style portrait, bottom-right, overlaps card + footer
- Name plate: dark rounded/rect label, white type: `NAME — Convener CGC`
- Empty state: silhouette-sized empty frame in the same position

### Footer logistics bar

- Height ~180–220px, solid navy
- Left: `LAGOS` mega type + venue under
- Mid: `9 AM PROMPT` · `15TH AUGUST 2026`
- Motif square: clustered abstract shapes (lime / amber / cyan)
- Far right: white QR block + URL

---

## 6. Spacing & safe areas

| Measure | Value |
| --- | --- |
| Outer margin | 40–56px |
| Header gap | 16–24px |
| Card inset | 36–48px |
| Portrait gap | 16–24px |
| Footer pad | 28–40px |
| Safe text from edges | ≥ 40px (QR/URL ≥ 28px) |

Instagram UI chrome is less critical on feed posts; still keep QR and CTA clear of the extreme bottom-right corner.

---

## 7. Iconography

Use **one** line-icon set across all Emergence templates: **`lucide-react`**.

Suggested icons:

| Use | Icon |
| --- | --- |
| Empty speaker slot | `UserRound` |
| Empty convener | `UserRound` (larger) |
| Time | `Clock` |
| Date | `CalendarDays` |
| Location | `MapPin` |
| Energy / spark | `Zap` |
| Network / growth | `Orbit`, `Sparkles` |
| Grant / value | `BadgeDollarSign` or `Gem` |

Stroke width: **2** for UI chrome, **1.75–2** inside the flier. Keep icons monochrome (white or lime), never multicolor random fills.

---

## 8. Copy deck (from reference)

```text
Wordmark: KINESIS '26
Series: CLOUDDE GROWTH CONFERENCE
Theme: Emergence
Capsule: Beyond Limit

Keywords: DISRUPTION · 1M+ GRANT · GROWTH · NETWORKING

City: LAGOS
Venue: UNILAG MAIN AUDITORIUM
Time: 9 AM PROMPT
Date: 15TH AUGUST 2026
URL: cgc.thecloudde.com/kinesis/

Convener label pattern: {NAME} — Convener CGC
```

Speaker/panelist names in the reference are replaced by empty slots in studio templates until assets are provided.

---

## 9. Layer / z-index recipe

1. `z-0` Background gradient + grid  
2. `z-1` Architectural glow + floating motifs  
3. `z-2` Gallery card (tilted or flat per template)  
4. `z-3` Convener slot (overlaps card/footer)  
5. `z-4` Footer bar + logistics type + QR  
6. `z-5` Header wordmark / partners (always readable)

---

## 10. Four studio templates (own versions)

Same design language, different composition — all leave speaker/convener image areas empty.

| ID | Name | Idea |
| --- | --- | --- |
| `classic` | Classic Tilt | Closest to reference: tilted cyan card, 3+4 grid, footer bar |
| `ribbon` | Flat Ribbon | No tilt; horizontal lime ribbon; speakers in a single showcase row + panelist strip |
| `split` | Split Stage | Left theme column + right portrait grid; footer compact |
| `cascade` | Cascade Hero | Oversized theme hero; cascading offset frames; motif-heavy footer |

---

## 11. Assets checklist

Drop into `public/assets/emergence/` when ready:

```text
logo-kinesis.svg|png
logo-cgc.png
logo-cloudde.png
speaker-01.jpg … speaker-03.jpg
panelist-01.jpg … panelist-04.jpg
convener.png          (cutout with transparency preferred)
qr.png
bg-architecture.png   (optional; CSS/SVG bg ships by default)
```

---

## 12. Prompt recipes

```text
Rebuild using emergencedesignguide.md — template classic.
Keep speaker slots empty. Copy: [paste]. Assets in public/assets/emergence/.
```

```text
Switch to Emergence split template, keep tokens, swap venue to [x].
```

```text
Match the lime capsule + tilted card from the Emergence guide on a new event flier.
```

---

## 13. Do / Don’t

**Do**

- Keep the royal blue + lime + amber triad
- Use offset color slabs behind portraits
- Preserve strong footer logistics hierarchy
- Export at native 1080×1350 (or 1080×1355)

**Don’t**

- Replace the system with purple gradients or cream editorial looks
- Use circular avatars (reference is rectangular frames)
- Crowd the header with more than logo + theme + 2 partner marks
- Fill speaker slots with stock faces unless the user provides photos
