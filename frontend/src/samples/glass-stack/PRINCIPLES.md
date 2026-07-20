# Sample: glass-stack

Reusable **frosted glass stack** event poster. Demo only — swap copy/assets when applying to a brand.

## Identity

| Field | Value |
| --- | --- |
| Id | `glass-stack` |
| Display name | Glass Stack |
| Format | Instagram Portrait · 1080×1350 |
| Tags | glass, frosted, stack, night, speakers |

## Mood

Cool night atmosphere, soft cyan/violet glows, floating frosted panels, calm tech-event energy.

## Canvas

- **Size:** 1080×1350
- **Safe inset:** 64px
- **Orientation:** portrait stack (header → hero title → glass info card → speaker row → CTA)

## Background

- Deep vertical wash: `#0b1b33` → `#163a5f`
- Two soft radial glows (cyan top-right, violet mid-left)
- No photographic hero — atmosphere is color + glow only
- Optional subtle noise not required for export

## Surface / morphism

- Primary content sits on **frosted glass** panels:
  - `background: rgba(255,255,255,0.12)`
  - `backdrop-filter: blur(18px)`
  - border `1px solid rgba(255,255,255,0.32)`
  - radius `28px`
  - soft drop shadow under panels
- Panels stack with 20–28px vertical gaps
- No heavy card chrome beyond glass

## Layout

1. **Top bar:** logo placeholder + small brand wordmark (left)
2. **Eyebrow:** uppercase tracking-wide event type
3. **Display headline:** 2–3 lines, large, tight leading
4. **Glass meta card:** date · time · place in one frosted block
5. **Speaker row:** 3 equal portrait placeholders
6. **Footer CTA:** frosted pill / bar

Vertical rhythm is top-weighted: headline owns the upper half; speakers + CTA anchor the bottom.

## Typography

| Role | Treatment |
| --- | --- |
| Brand | Body face, 18–20px, medium |
| Eyebrow | Body, 14px, uppercase, +0.18em tracking, accent color |
| Headline | Display (`Syne`), ~72–84px, weight 700–800, ink |
| Meta | Body, 22px, muted |
| Speaker name | Body, 14px, bold uppercase |
| Speaker title | Body, 12px, muted |
| CTA | Body, 18px, bold |

## Color

| Token | Hex / value |
| --- | --- |
| bgTop | `#0b1b33` |
| bgBottom | `#163a5f` |
| glow | `#3ec7ff` |
| glowAlt | `#7b5cff` |
| ink | `#f7fbff` |
| muted | `rgba(247,251,255,0.72)` |
| accent | `#7ef0ff` |
| glass | `rgba(255,255,255,0.12)` |
| glassBorder | `rgba(255,255,255,0.32)` |

Accent is for eyebrow + CTA highlight only — not large fills.

## Components

| Piece | Treatment | Placeholder |
| --- | --- | --- |
| Logo | 64×64 rounded glass tile | `LogoPlaceholder` |
| Speakers | 3× portrait, aspect 3/4, rounded 16, glass variant, cyan accent slab off | `PortraitPlaceholder` |
| Meta block | Single glass panel | CSS panel |
| CTA | Full-width glass bar | CSS |

## Demo copy rules

- Event name: generic (`Anniversary Summit`, `Horizon Night`) — never the reference brand
- Speakers: fictional names
- Venue: demo city meta

## Do

- Keep frost + glow as the signature
- Preserve stack order and generous gaps
- Use placeholders until real assets exist

## Don’t

- Add stat chips, sticker badges, or dense dashboards
- Replace glass with opaque solid cards
- Overpower accent into background fills
