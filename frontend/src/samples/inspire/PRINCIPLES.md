# Sample: inspire

Reusable **dark conference poster** with mega headline, 2×2 speaker grid, mint logistics slab, and sponsor row. Demo only — swap copy/assets when applying to a brand.

Reference: `sample/references/inspire/inspire.png` (also kept at `sample/references/pintrest/inspire.png`).

## Identity

| Field | Value |
| --- | --- |
| Id | `inspire` |
| Display name | Inspire |
| Template id | `inspire-poster` |
| Format | Instagram Portrait · 1080×1350 |
| Tags | conference, speakers, dark, purple, mint, logistics, qr, sponsors |

## Mood

Premium growth-conference energy. Charcoal void, lavender speaker frames, mint logistics punch. Structured but not dashboard-y — one vertical story: brand → title → faces → when/where → sponsors.

## Canvas

- **Measured reference:** 1199×1466 (~4:5 portrait)
- **Sample export size:** **1080×1350** (Instagram portrait — same orientation family; ratio matches closely enough to standardize)
- **Safe inset:** ~48–56px horizontal · ~40–48px top · logistics/sponsors flush to side rhythm of the grid
- **Background:** charcoal `#121214` with subtle low-opacity grid + faint geometric outlines (triangle, square) and soft organic blobs — never flat pure black alone

## Intent

Answers: **“Who’s speaking and how do I register for this growth conference?”**

## Layout map (top → bottom)

| Zone | Approx. % | Content |
| --- | --- | --- |
| Header logos | 0–8% | Left organic blob mark · right partner wordmark cluster |
| Headline stack | 8–28% | Mega line 1 · slanted “without” badge · mega line 2 · subhead |
| Speakers | 28–68% | Vertical **SPEAKERS** rail (left) + **2×2** portrait cards |
| Logistics | 68–86% | Full-width **mint slab**: date · time · venue/CTA · QR |
| Sponsors | 86–97% | “Sponsors:” label + monochrome logo row |
| Bottom accent | 97–100% | Thin mint bar edge-to-edge |

## Header chrome

- **Left mark:** soft lavender/purple organic blob (~72–88px) with short dark initials (`LogoPlaceholder` or blob CSS + mark). Demo: **AG** (Apex Guild) — never copy NDG.
- **Right mark:** small geometric cluster (2×2 shapes) + uppercase wordmark below. Demo: **SUMMITLINE** — never copy NORTHBRIDGE.
- Marks sit on the outer safe edges; generous gap between them.

## Typography roles

| Role | Treatment |
| --- | --- |
| Mega headline | Montserrat / Syne, ~92–110px, weight 800, white, uppercase, tight lh (~0.9), slight negative tracking |
| “without” badge | Small rounded lavender pill, rotated ~−8° to −12°, dark ink, ~18–22px, weight 700, tucked between the two mega lines |
| Subhead | Manrope/DM Sans, ~22–26px, weight 500, white, sentence case under headline |
| Vertical SPEAKERS | Large (~56–72px), weight 700–800, dark gray / low-opacity white, letter-spacing wide, rotated −90°, reading bottom→top along left of grid |
| Nameplates | Name ~16–18px bold white; title ~12–13px muted white on dark overlay |
| Logistics date | Bold mixed black/white on mint (~20–24px) |
| Logistics time / venue | Dark charcoal on mint, compact |
| Sponsors label | Small muted white ~14px |
| Sponsor marks | Monochrome white/light gray wordmarks |

One geometric sans family for display (Montserrat or Syne); body/UI in Manrope or DM Sans.

## Color tokens

| Token | Hex / value | Use |
| --- | --- | --- |
| bg | `#121214` | Canvas ground |
| bgElevated | `#1a1a1e` | Subtle lifts |
| ink | `#ffffff` | Primary type |
| inkMuted | `rgba(255,255,255,0.55)` | Titles under names, SPEAKERS rail |
| purple | `#9B86FF` | Frames, badge, arrow chips, blobs |
| purpleDeep | `#6E5AD6` | Blob shadow / darker frame edge |
| purpleSoft | `#C4B5FD` | Soft blob fills |
| mint | `#A7F3D0` | Logistics slab + bottom bar |
| mintInk | `#0B1F18` | Type on mint |
| nameplate | `rgba(10,10,12,0.78)` | Speaker overlay bar |
| gridLine | `rgba(255,255,255,0.04)` | Background grid |
| geoStroke | `rgba(255,255,255,0.12)` | Triangle / square outlines |

## Speaker card anatomy

Each of 4 cards (2×2, equal gaps ~18–24px):

1. **Frame** — large squircle / soft rounded square (~28–36px radius), ~2–3px purple border or purple outer glow edge
2. **Blob back** — organic lavender shape behind the portrait (CSS blob, not a photo)
3. **Portrait** — headshot fill; sample uses `PortraitPlaceholder` / editable image slot until user assets exist
4. **Nameplate overlay** — dark semi-transparent bar across bottom of frame (not below it)
5. **Type** — name bold white; role/org smaller muted line under name
6. **Corner arrow chip** — small purple rounded square at outer bottom corner of nameplate with white `ArrowUpRight` (lucide)

Do not put names outside the frame. Do not use real faces from the reference.

## Footer logistics (mint slab)

Horizontal mint bar (~140–180px tall at 1080 width), rounded lightly or square corners matching reference (~12–16px if rounded).

| Column | Content |
| --- | --- |
| Date | e.g. weekday + day + month + year; first word can weight heavier |
| Divider | Thin vertical rule |
| Time | Short timezone string (`9AM WAT`) |
| Venue + CTA | Venue line + “tickets / scan QR to register” energy |
| QR | Large square black-on-white / white plate (~110–130px) — `ImagePlaceholder` or editable QR slot |

## Sponsor row + bottom accent

- Label **Sponsors:** left-aligned, muted
- 4–5 monochrome logo slots (`LogoPlaceholder` marks) evenly spaced
- **Bottom mint bar:** ~8–12px tall, full bleed, same mint as logistics

## Abstract / background devices

- Subtle square grid across the field
- Thin outlined triangle (mid-left) and square (lower field) at low contrast
- Soft purple organic blobs near speaker area / header — atmospheric, not competing with type

## Placeholder rules

Follow `sample/PLACEHOLDERS.md`:

| Slot | Component |
| --- | --- |
| Header / partner logos | `LogoPlaceholder` |
| Speakers | `PortraitPlaceholder` (+ editable image when studio-backed) |
| QR | `ImagePlaceholder` label `QR` |
| Sponsors | `LogoPlaceholder` monochrome |

Demo names only. Never embed NDG, NORTHBRIDGE, or reference headshots.

## Demo copy rules

| Reference energy | Demo |
| --- | --- |
| NDG / NORTHBRIDGE | Apex Guild / Summitline |
| GROWTH WITHOUT BORDERS | SCALE WITHOUT LIMITS |
| Real speakers | Avery Quinn, Jordan Blake, Sam Okoye, Riley Chen |
| Real sponsors | Orion, Pulse, Crest, Nova |

## Do

- Keep the vertical SPEAKERS rail + 2×2 grid as the hero block
- Preserve mint logistics as the registration punch
- Match purple + mint + charcoal language

## Don’t

- Steal logos/faces from the PNG
- Flatten into a dashboard of chips/stats
- Mix Emergence / Kinesis chrome into this system
- Drop the “without” badge or QR — both are signature
