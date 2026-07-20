# Placeholder rules for samples

Whenever a reference design includes **people, logos, product shots, or other real media**, the recreated sample must use reusable placeholders — never invent or copy those assets.

## Components

| Slot type | Component | Import |
| --- | --- | --- |
| Person / speaker / host | `PortraitPlaceholder` | `src/components/placeholders` |
| Brand mark / logo | `LogoPlaceholder` | same |
| Hero / venue / product image | `ImagePlaceholder` | same |

```jsx
import {
  PortraitPlaceholder,
  LogoPlaceholder,
  ImagePlaceholder,
} from '../../components/placeholders'
```

## When to use what

- **PortraitPlaceholder** — headshots, speaker grids, host cards, circular avatars.
- **LogoPlaceholder** — brand marks in header/footer when no demo SVG exists.
- **ImagePlaceholder** — wide hero bands, venue photos, product frames, map thumbnails.

If the reference shows a photo **and** a caption (name + title), keep the caption as **demo text** and only replace the image area with a placeholder.

## Flexibility knobs

Tune placeholders to the sample context instead of forking new components:

| Prop | Purpose |
| --- | --- |
| `width` / `height` / `size` | Match slot geometry on the artboard |
| `aspect` | e.g. `3/4`, `1/1`, `16/9` |
| `shape` | `rounded`, `circle`, `rect`, `soft` |
| `accent` | Hex or CSS color for slab / ring / tint |
| `label` | Optional short hint (`Speaker`, `Logo`) |
| `name` / `title` | Demo identity under portraits |
| `showLabel` | Hide chrome when the layout already labels the slot |
| `variant` | `glass`, `flat`, `outline`, `slab` (visual family) |

Prefer adjusting props + sample CSS over creating one-off placeholder files.

## Do / Don’t

**Do**

- Match the reference’s crop ratio and corner radius.
- Use fictional demo names.
- Leave real brand slots empty/placeholder until the user supplies `public/assets/<brand>/…`.

**Don’t**

- Hotlink or embed the reference’s real photos.
- Generate fake “AI faces” as permanent assets.
- Hardcode a single placeholder style that only fits one sample.
