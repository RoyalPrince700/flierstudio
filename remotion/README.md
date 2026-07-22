# Flier Studio — Remotion Motion Pipeline

Cinematic + vertical brand films for **Flier Studio** (“The Liftoff”).  
Logo geometry is ported from the product identity — this package does **not** redesign the mark.

## Compositions

| ID | Size | Duration | Role |
| --- | --- | --- | --- |
| `FlierStudioLogoFilm` | **1920×1080** @ 60fps | **28.8s** (1728f) | Multi-act brand film (cinematic) |
| `FlierStudioLogoFilmReel` | **1080×1920** @ 60fps | **28.8s** (1728f) | Same story, Instagram Reel / Stories |
| `FlierStudioLogoReveal` | 1920×1080 | 4.0s | Original short reveal (kept) |
| `FlierStudioLogoRevealSquare` | 1080×1080 | 4.0s | Short reveal square |

Entry (film): `src/compositions/FlierStudioLogoFilm.tsx`

## Duration & beat sheet (28.8s)

| Block | Time | Frames | Content |
| --- | --- | --- | --- |
| **Act 1 Construction** | 0:00–0:15.0 | 0–900 | Cursor → sharp → radius → inside TR cut → logo hold 2.5s → fast slice exit |
| **T1 SwipeWipe** | 0:14.8–0:15.4 | 888–924 | Scaled Signal slice swipes / covers → Act 2 |
| **Act 2 Wordmark** | 0:15.1–0:18.8 | 906–1128 | Ink ground; Flier Studio craft + short type zoom |
| **T2 MaskReveal** | 0:18.5–0:19.1 | 1110–1146 | Next scene through slice aperture |
| **Act 3 Lockup** | 0:18.8–0:21.3 | 1128–1278 | Clear space + assemble horizontal / stacked |
| **T3 ShapeMorph** | 0:21.0–0:21.6 | 1260–1296 | Slice → mockup card corner language |
| **Act 4 Mockups** | 0:21.3–0:25.8 | 1278–1548 | Studio · Web · Social · App icon |
| **T4 SwipeWipe** | 0:25.5–0:26.1 | 1530–1566 | Slice swipe into close |
| **Act 5 Closing** | 0:25.8–0:28.8 | 1548–1728 | Slice rejoins mark; lockup + tagline; hold |

## Cursor action map

| Time | Action |
| --- | --- |
| 0:00.20 | Appear → travel to **center** |
| 0:00.70 | **Click** center → sharp square (no radius) |
| 0:02.92 | **Click** (slight up) → corner radii form; outline fades |
| 0:05.67–0:07.00 | **Direct** travel to **inside** upper-right Signal region (viewBox 69,24) |
| 0:07.13 | **Click** inside white TR → diagonal cut / settle to Liftoff rest |
| 0:09.33–0:11.83 | **Logo hold** — tile + Signal corner at brand rest (2.5s, no drift) |
| 0:11.83–0:12.83 | **Fast** slice exit → T1 |
| 0:16.0–0:17.5 | Brief return for type underline / zoom pause only |
| 0:18.3 | Exit again |
| 0:19.3–0:20.6 | One drag + press to settle lockup → exit |
| 0:21.8–0:25.3 | Sparse press / drag-scroll on mockups → exit |
| 0:27.1–0:27.9 | Final click → exit off-frame |

No idle dancing. Still when waiting; move only to act.

## Slice motif map

| Role | Where |
| --- | --- |
| Detach from mark | Act 1 end |
| Transition hero / swipe plane | T1, T4 |
| Aperture rim for mask reveal | T2 |
| Morph into card-corner language | T3 |
| Rejoin final lockup | Act 5 |

## Transition map

| From → To | Device |
| --- | --- |
| Act1 → Act2 | `SwipeWipe` (scaled slice, diagonal) |
| Act2 → Act3 | `MaskReveal` (slice aperture) |
| Act3 → Act4 | `ShapeMorph` (slice → card corner) |
| Act4 → Act5 | `SwipeWipe` (slice) |

## Audio

SFX pack: `src/effects/` · cue map: `src/lib/sfx.ts` · player: `src/components/FilmAudio.tsx`  
Production board (file → cue → timestamp): [`soundeffect.md`](./soundeffect.md)

Wired: `click` · `swoosh` · `scroll` · `pop` (tile proxy) · `ding` · `chime` (mask/close proxy) · micro `sparkle`  
Skipped: `fanfare.wav`  
Still download: `tile-land` · `signal-slice` · `radius-arc` · `mask-open` · `morph-settle` · `whoosh-heavy`

## Commands

```bash
cd remotion
npm run dev
npm run render          # 1920×1080 film + audio
npm run render:reel     # 1080×1920 film + audio
```

## Structure

```
src/
  effects/          click, swoosh, scroll, pop, ding, chime, sparkle (fanfare unused)
  components/       BrandCursor, ConstructionGuides, LiftoffMarkCraft, FilmAudio, transitions
  scenes/           Act1…Act5
  compositions/     FlierStudioLogoFilm, FlierStudioLogoReveal
  lib/              timeline (18s), filmCursor, cursorPath, format, easings, sfx
```

## Sound

See [`soundeffect.md`](./soundeffect.md) for the full production cue board and download checklist.
