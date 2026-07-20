# Sample: void-profile-ask

Reusable **black void + profile ask** CTA poster. Demo only — swap copy/assets when applying to a brand.

## Identity

| Field | Value |
| --- | --- |
| Id | `void-profile-ask` |
| Display name | Void Profile Ask |
| Format | Instagram Portrait · 1080×1350 |
| Tags | void, black, profile, ask, cta, minimal, mono |

## Mood

High-contrast monochrome, premium designer portfolio energy. Generous black negative space. Calm, direct, sales-soft — one question, one action.

## Canvas

- **Size:** 1080×1350
- **Safe inset:** 72px horizontal · 84px vertical
- **Orientation:** portrait stack — header → void → display ask → footer dock
- **Background:** pure black `#000000` only (no gradient, no texture, no photo hero)

## Intent

Answers: **“Want a project like this? Here’s who to ask — and how.”**

## Layout zones (% height)

| Zone | Approx. | Content |
| --- | --- | --- |
| Header | 0–18% | Circular avatar + name + role (left cluster) |
| Void | 18–38% | Empty black — breathing room |
| Hero ask | 38–72% | 3-line display headline, left-aligned |
| Void | 72–84% | Empty black |
| Footer | 84–100% | Bio CTA copy (left) + dual circles (right) |

Left edge of header text, headline, and footer copy share one vertical alignment (~72px from left). Circles sit on the right safe edge.

## Header chrome

- **Avatar:** 92px circle, `PortraitPlaceholder` shape `circle`
  - Thin white ring (`1.5–2px`, near-opaque)
  - Soft outer ring (~6px outside, ~28% white) — double-ring identity
  - B&W / mono feel preferred when a real photo is supplied
- **Name:** body/display face, ~26px, weight 700–800, pure white, tight to avatar
- **Role:** ~17px, weight 500; base line in muted gray; 1–2 key words in white for emphasis
- Horizontal gap avatar → text: ~20px
- Vertically center name+role against avatar

## Hero ask (display)

Three short lines, large geometric sans (~92px), weight 700–800, line-height ~0.96, letter-spacing slightly negative (−0.03em).

Pattern:

1. Line 1 — ink white (hook verb)
2. Line 2 — mix: short connector in white + **key noun in mid-gray** (`#7a7a7a`)
3. Line 3 — ink white (closer / question)

The mid-gray word is the signature accent — color contrast only, not weight/size change. Keep lines short; no supporting paragraph under the ask.

## Footer / CTA dock

No bar, no card — open footer on black.

| Piece | Treatment |
| --- | --- |
| CTA copy | Left, 2 lines, ~20px, weight 500, soft white `#d6d6d6`, max-width ~440px |
| Dual circles | Right, 68px diameter, 16px gap, horizontally paired |
| Left circle | Solid light gray `#d8d8d8` (brand mark / secondary action slot — keep empty or logo mark) |
| Right circle | Mid-gray `#5c5c5c` + thin white `ArrowUpRight` (lucide), stroke ~2 |

Circles are the action affordance; copy explains the ask. Do not add pills, buttons with labels, or extra icons.

## Typography

| Role | Treatment |
| --- | --- |
| Name | Manrope, 26px, 800, ink |
| Role | Manrope, 17px, 500, muted + ink accents |
| Ask | Manrope, 92px, 800, lh 0.96 |
| Ask accent word | Same size/weight, color `#7a7a7a` |
| Footer CTA | Manrope, 20px, 500, `#d6d6d6`, lh 1.35 |

One family only. Hierarchy = size + color, not decorative faces.

## Color

| Token | Hex / value |
| --- | --- |
| bg | `#000000` |
| ink | `#ffffff` |
| muted | `#9a9a9a` |
| accentWord | `#7a7a7a` |
| circleLight | `#d8d8d8` |
| circleDark | `#5c5c5c` |
| ring | `rgba(255,255,255,0.92)` |
| ringOuter | `rgba(255,255,255,0.28)` |

No brand color fills. Gray is the only accent language.

## Components

| Piece | Treatment | Placeholder |
| --- | --- | --- |
| Avatar | 92 circle, flat, double ring via CSS | `PortraitPlaceholder` |
| Name / role | Text beside avatar | demo strings |
| Dual circles | Pure CSS + lucide arrow | no image |

## Demo copy rules

- Person: fictional (`Morgan Vale`, `Alex Rivera`) — never the reference name
- Role: generic specialist line with 1–2 words emphasized
- Ask: English (or target locale) with the same 3-line rhythm and one muted noun
- Footer: “request via bio / link” energy, different wording

## Do

- Keep the void — do not fill mid-canvas with badges, stats, or product shots
- Preserve left rail alignment and dual-circle footer
- Use the gray noun as the only color “pop”

## Don’t

- Add gradients, glow, cards, or frosted panels
- Stack more than one avatar or add social icon rows
- Put labels inside the light circle unless applying a real brand mark
- Crowds the ask with a subhead under the three lines
