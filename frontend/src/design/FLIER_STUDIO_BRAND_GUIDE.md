# Flier Studio — Brand Guidelines V1.0

Concise production guide for the product identity (“The Liftoff”). Full visual deck: studio project **Flier Studio** (21 boards).

## Purpose

Give anyone with something to announce the layout intelligence of a working design studio.

## Tagline

**Start with a template. Make it yours.**

Support (when needed): Thousands of layouts ready — change the words, photos, and colors.

## Positioning

A template-first creative studio in the browser — ready layouts with craft built in. Designers move faster; everyone else creates without knowing design principles.

## Audience

Creators, event teams, and small brands worldwide who publish to social — designers who need speed, and non-designers who just need a flier up.

## Personality & values

Precise · Confident · Craft-first · Quietly bold · Global  
Craft over clutter · Clarity wins attention · Access to good design · Momentum

## Narrative

Flier Studio exists for the moment an idea needs an audience. Start with a ready template — you change the words, photos, and colors; the studio already did the layout thinking — composition, hierarchy, rhythm — so every post leaves looking like it came from a design team.

## Logo — “The Liftoff”

An artboard tile whose top-right corner peels along a 45° diagonal at the moment a design is posted. Frame + movement + publishing in one gesture.

| Asset | Use |
| --- | --- |
| Symbol | Favicon, app icon, tool rail, tight UI |
| Wordmark | “Flier” 700 + “ Studio” 500, Space Grotesk |
| Horizontal | Default lockup |
| Stacked | Covers, merch, square contexts |

**Clear space:** height of the lifted corner (X) on all sides.  
**Minimums:** symbol ≥ 24px; horizontal lockup ≥ 120px wide.  
**Don’t:** stretch, rotate, recolor arbitrarily, add shadows/outlines, crowd the mark, use the mark as a UI icon.

Production SVGs: `public/assets/flier-studio/`.

## Color

| Token | Hex | Role |
| --- | --- | --- |
| Signal | `#FF4A1D` | Primary — accents, CTA, active |
| Signal Deep | `#C93007` | Pressed / small text on paper |
| Cobalt | `#2545D9` | Secondary — links, info (heir of legacy `#0d66d0`) |
| Ink | `#141310` | Text, dark grounds |
| Paper | `#F5F1E8` | Light grounds |
| Graphite / Stone / Mist | — | Surfaces, muted text, hairlines |

**Contrast:** Ink on Paper 15.9:1 · Signal on Ink ~5.5:1 AA · White on Cobalt ~7.2:1 · Signal on Paper display-only (≥24px bold).

**Audit note:** Legacy blue `#0d66d0` retired from live UI. Manrope retained as body/UI. Orbitron remains Emergence-only — not Flier Studio product chrome. Display is Space Grotesk (not Orbitron).

## Typography

- **Display:** Space Grotesk — tracking −0.03em, weights 500–700  
- **Body / UI:** Manrope — 400–800, line-height ~1.55  
- Scale uses ~1.333 ratio (Display 64 → Caption 15)

## Shape & chrome

Radius: tile 0.25 of mark · cards 20 · controls 12. Soft elevation only; no multi-layer glow. Graphic devices: peel corner, 45° hatch, corner constellation — nothing that doesn’t echo the diagonal.

## Iconography

`lucide-react` only. ~2px stroke at 24px. Ink/Paper neutrals; **Signal = active state only**. Never substitute the Liftoff mark for a tool icon.

## Motion

1.2s logo story: empty frame → tile lands → Signal slice → corner liftoff → wordmark. Product UI: 240ms ease-out-quint; hero 480ms. Enter/exit along the 45° axis. No bounce, no spin.

## Voice

Direct. Craft-literate. Encouraging, never gushing.  
Say: “Start with a template.” / “Make it yours.” / “Put something up.”  
Never: “Unleash your creativity!” / “Stunning designs in seconds!”

## Photography

Real work on real boards. Prefer full-bleed artboards and honest product UI. Avoid stock “creative desk” clichés, floating stickers, and purple SaaS gradients. Treat photos with the peel crop when framing.

## Tokens

`frontend/src/design/flierStudioTokens.js` — single source of truth for the identity boards and product accents.

## Presentation formats

| Format | Project | Size | Use |
| --- | --- | --- | --- |
| Portrait / Social | `Flier Studio · Portrait` | 1080×1350 | Instagram-oriented case study |
| Landscape / Editorial | `Flier Studio · Editorial` | 1600×1200 | Behance / Pinterest / portfolio |

Same identity (logo, color, type, voice). Do not mix formats on one board. Optional 16:9 scale noted as `boardWidescreen` (1920×1080) in tokens — primary editorial canvas remains 1600×1200.
