# Flier Studio Logo Film — Sound Production Board

**Composition:** `FlierStudioLogoFilm` / `FlierStudioLogoFilmReel`  
**Duration:** 28.8s @ 60fps (1728 frames)  
**Pack folder:** `remotion/src/effects/`  
**Wired in:** `src/lib/sfx.ts` → `src/components/FilmAudio.tsx`

---

## Download checklist

| Status | File to add | Character | Replaces / improves |
| --- | --- | --- | --- |
| **DOWNLOAD** | `tile-land.wav` | Soft artboard/card seat — warm low-mid, ~120–180ms | Temporary: `pop.wav` @ tile appear |
| **DOWNLOAD** | `signal-slice.wav` | Surgical cut / paper-metal “shick”, dry, 80–120ms | Temporary: tiny `sparkle.wav` accent |
| **DOWNLOAD** | `radius-arc.wav` | Soft compass / curve ticks ×4 cluster | Currently silent (gap) |
| **DOWNLOAD** | `mask-open.wav` | Aperture expand — air + soft swell, ~350–450ms | Temporary: `chime.wav` |
| **DOWNLOAD** | `morph-settle.wav` | Continuous morph whoosh → soft lock | Temporary: pitched-down `swoosh.wav` |
| **DOWNLOAD** | `whoosh-heavy.wav` | Bigger diagonal camera-cover swipe than `swoosh.wav` | Temporary: loud/slow `swoosh.wav` on T1/T4 |
| **DOWNLOAD** | `paper-rustle-soft.wav` | Optional construction atmosphere, very low | Optional bed under Act 1 |
| **NICE** | `cursor-move-soft.wav` | Quieter pointer travel than main swoosh | Temporary: quiet `swoosh.wav` |
| **NICE** | `ui-press-soft.wav` | Softer mockup press than hard click | Temporary: quiet `click.wav` |
| **NICE** | `tonal-swell-bed.wav` | 1–2s soft tonal under one hero wipe only | Optional; none now |
| **SKIP** | `fanfare.wav` | Too celebratory for this brand film | Do not wire |
| **SKIP / optional** | full `sparkle.wav` energy | Can feel “cute / SaaS” | Only micro accent at cut (vol 0.10) — drop if it reads cheap |

Drop downloads into `remotion/src/effects/`, then swap the `src` in `src/lib/sfx.ts` for the matching cue ids.

---

## Wired existing SFX → cue → timestamp

| Cue id | Time | Frame | Visual beat | **USE EXISTING** | Vol | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `cursor-enter` | 0:00.20 | 12 | Cursor appears → center | `swoosh.wav` | 0.22 | rate 1.08 |
| `click-center` | 0:00.70 | 42 | Center click → sharp square | `click.wav` | 0.48 | |
| `tile-appear` | 0:01.17 | 70 | Artboard tile lands (sharp) | `pop.wav` | 0.26 | **proxy** for `tile-land.wav` |
| `click-radius` | 0:02.92 | 175 | Click → radii form | `click.wav` | 0.46 | |
| `cursor-move-cut` | 0:05.75 | 345 | Direct travel → inside TR cut | `swoosh.wav` | 0.20 | rate 1.12 |
| `click-cut` | 0:07.13 | 428 | Inside white TR click | `click.wav` | 0.52 | viewBox (69,24) |
| `signal-cut-accent` | 0:07.33 | 440 | Diagonal Signal cut starts | `sparkle.wav` | 0.10 | **proxy** · very subtle |
| `liftoff-peel` | 0:08.00 | 480 | Settle to Liftoff rest | `swoosh.wav` | 0.50 | rate 0.90 |
| `cursor-exit-act1` | 0:09.25 | 555 | Cursor exits for logo hold | `swoosh.wav` | 0.16 | rate 1.20 |
| *(logo hold)* | 0:09.33–0:11.83 | 560–710 | Silence — mark reads | — | — | 2.5s true logo pose |
| `slice-exit-fast` | 0:11.87 | 712 | Fast cut-out transition exit | `swoosh.wav` | 0.62 | rate 1.05 · snappy |
| `swipe-t1` | 0:14.83 | 890 | T1 SwipeWipe cover | `swoosh.wav` | 0.72 | rate 0.82 · **proxy** heavy |
| `type-point` | 0:16.22 | 973 | Cursor type / underline point | `ding.wav` | 0.14 | |
| `type-zoom` | 0:16.93 | 1016 | Optical type zoom | `swoosh.wav` | 0.24 | rate 1.05 |
| `wordmark-lock` | 0:17.93 | 1076 | Wordmark settles | `ding.wav` | 0.20 | |
| `mask-open` | 0:18.57 | 1114 | T2 MaskReveal aperture | `chime.wav` | 0.28 | **proxy** |
| `clearspace-tick` | 0:19.00 | 1140 | Clear-space guide | `ding.wav` | 0.12 | |
| `lockup-assemble` | 0:19.60 | 1176 | Mark + word assemble | `swoosh.wav` | 0.28 | |
| `hero-lock` | 0:20.38 | 1223 | Lockup press / settle | `click.wav` | 0.44 | |
| `morph` | 0:21.07 | 1264 | T3 ShapeMorph | `swoosh.wav` | 0.34 | **proxy** |
| `mock-press-1` | 0:22.05 | 1323 | Mockup press | `click.wav` | 0.28 | |
| `mock-scroll-1` | 0:22.30 | 1338 | Mockup scroll | `scroll.wav` | 0.38 | |
| `mock-press-2` | 0:23.38 | 1403 | Mockup press | `click.wav` | 0.28 | |
| `mock-scroll-2` | 0:23.63 | 1418 | Mockup scroll | `scroll.wav` | 0.38 | |
| `mock-scroll-3` | 0:24.33 | 1460 | Mockup scroll | `scroll.wav` | 0.36 | |
| `mock-press-3` | 0:24.63 | 1478 | Mockup press | `click.wav` | 0.28 | |
| `swipe-t4` | 0:25.57 | 1534 | T4 SwipeWipe | `swoosh.wav` | 0.62 | rate 0.85 |
| `slice-rejoin` | 0:26.60 | 1596 | Slice returns to mark | `swoosh.wav` | 0.36 | |
| `closing-resolve` | 0:27.10 | 1626 | Premium settle | `chime.wav` | 0.24 | rate 0.90 |
| `final-click` | 0:27.30 | 1638 | Final cursor click | `click.wav` | 0.42 | |
| `cursor-exit-final` | 0:27.88 | 1673 | Cursor exits | `swoosh.wav` | 0.18 | |
| *(hold)* | 0:28.05–0:28.80 | 1683–1728 | Silence | — | — | Brand owns the hold |

### File usage summary

| File | Wired? | Role |
| --- | --- | --- |
| `click.wav` | **YES** | Center / radius / cut / hero / mock presses / final |
| `swoosh.wav` | **YES** | Moves, peel, wipes, zoom, assemble, morph, rejoin, exits |
| `scroll.wav` | **YES** | Act 4 mockup scrolls |
| `pop.wav` | **YES** (proxy) | Tile appear until `tile-land.wav` |
| `ding.wav` | **YES** | Type point, wordmark lock, clear-space |
| `chime.wav` | **YES** (proxy) | Mask open + closing resolve |
| `sparkle.wav` | **YES** (micro) | Optional Signal cut accent @ 0.10 |
| `fanfare.wav` | **SKIP** | Unused |

---

## Gaps still silent (need downloads)

| Beat | Time | **DOWNLOAD** |
| --- | --- | --- |
| Radius construction arcs | ~0:02.92–0:04.67 | `radius-arc.wav` |
| True Signal slice | ~0:07.33 | `signal-slice.wav` |
| Heavy wipe body | T1 / T4 | `whoosh-heavy.wav` |
| True aperture | T2 | `mask-open.wav` |
| Morph lock | T3 | `morph-settle.wav` |
| Warmer tile seat | 0:01.17 | `tile-land.wav` |

---

## Mixing notes

1. Peak hierarchy: `liftoff-peel` ≈ `swipe-t1` > `swipe-t4` > scrolls > clicks > dings.
2. Cursor moves stay under the action they cause (−6 to −10 dB relative).
3. ~200ms silence before first enter (frame 0–11).
4. After final exit, hold is true silence.
5. When downloads land, keep the same cue `id`s in `sfx.ts` — only swap `src` / trim volume.
6. Act 1 peel is long (~3.67s) — keep `liftoff-peel` rate low so it covers the beauty beat.

## Music bed

**None** wired. Optional later: `tonal-swell-bed.wav` under T1 only, ducked −5 dB under swipe peak.
