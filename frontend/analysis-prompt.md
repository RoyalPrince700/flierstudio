# Analysis prompts (copy & paste)

Paste a reference path or URL into the prompt below, then send.  
Cursor must **analyze the reference → build a standalone studio template** that matches **that** design’s look — not an Emergence / Kinesis restyle.

---

## Critical rules (read first)

### What went wrong before

Prompts that said “build an Emergence template” + “follow emergencedesignguide.md” caused Pinterest refs (`earn`, `learn`, `digital`, etc.) to be recreated **inside** `src/fliers/emergence/` with royal/cyan/lime Emergence chrome. That is wrong unless the brief is explicitly for the Emergence brand.

### Visual style = the reference

- Match the analyzed image: layout, hierarchy, type, color, spacing, mood.
- Do **not** restyle into Emergence navy/cyan/lime, Cascade hero, Stage Grid card, or Emergence tokens.
- Do **not** register under `EMERGENCE_TEMPLATES` or `src/projects/emergence/` unless the user says this is an Emergence / Kinesis board.

### Emergence files = architecture study only

Before implementing, skim how shipped studio fliers are built (editable slots, single export root, project registration). Use that **engineering pattern**, not the Emergence **look**.

| File | Use for | Do not use for |
| --- | --- | --- |
| `flierdesignguide/emergenceflierdesignguide.md` | Studio architecture ideas: one export `<article>`, `studioEdit` + `EditableText` / `EditableImageSlot`, per-artboard drafts, scoped CSS, register project → board | Colors, fonts, Cascade/Stage Grid chrome, Emergence BEM (`.e-*`) |
| `emergencedesignguide.md` | Only when the brief is **explicitly** Emergence / Kinesis | Default analysis of unrelated Pinterest/refs |
| `DESIGN_PRINCIPLES.md` | General composition, type, color, sizes | — |
| `DESIGN_QA.md` | Mandatory QA after the template exists | — |

### Where new work lands (standalone)

| Step | Location |
| --- | --- |
| Reference | Path/URL you paste; archive under `sample/references/{collection-id}/` if useful |
| Principles (from this ref) | `src/fliers/{id}/PRINCIPLES.md` and/or tokens beside the flier |
| Flier component | `src/fliers/{id}/` (own folder — **not** `src/fliers/emergence/`) |
| Project board | `src/projects/{id}/project.js` + register in `src/projects/registry.js` |
| Assets | `public/assets/{id}/` — placeholders until user provides files |
| Size | From the reference / brief via `src/lib/sizes.js` — do **not** force Emergence 1080×1350 if the ref is another format |

Photo/logo slots stay empty until assets exist. Wire studio editing. One DOM export root.

**Exception — Emergence only when asked:** If the user says “Emergence template” / “add to Kinesis / Emergence”, then use `emergencedesignguide.md` + `src/fliers/emergence/` + `EMERGENCE_TEMPLATES`. Otherwise standalone.

---

## Single design

```text
Analyze this flier reference and turn it into a new STANDALONE studio template (its own project/board).

REFERENCE: [paste path or URL — e.g. sample/references/pintrest/learn.png or https://…]

Before coding, skim flierdesignguide/emergenceflierdesignguide.md ONLY as an architecture reference (editable fields, export root, project registration). Do NOT copy Emergence visual language, tokens, or put this under src/fliers/emergence/.

Follow:
1. DESIGN_PRINCIPLES.md — composition and craft.
2. Match THIS reference’s layout, type, color, spacing, and mood (extract tokens from the image).
3. DESIGN_QA.md — full pass at the board’s native size before hand-off.

Do:
- Deep-analyze the reference; write short PRINCIPLES / tokens for THIS design.
- Propose a unique kebab-case id from the reference (technique or name, e.g. pill-arc-learn, offer-quintet-earn) — not an Emergence cascade-* id unless it truly fits AND user asked for Emergence.
- Implement under src/fliers/{id}/ with its own CSS (own BEM prefix — not .e-flier / EmergenceChrome unless Emergence brief).
- Create src/projects/{id}/project.js and register in src/projects/registry.js so it appears as its own template group/board in the studio.
- Pick width/height from sizes.js to match the reference/platform (do not default to Emergence size).
- Keep image slots empty (placeholders). Wire EditableText / EditableImageSlot + studioEdit.
- Do not modify existing Emergence boards.

Hand-off: intent question, project id, board id, size, confirm QA passed. Tell me which Templates group to open — not “open Emergence” unless it is Emergence.
```

---

## Folder of designs (one family, multiple templates)

```text
Analyze this folder of flier references as ONE standalone template family (shared system + variations).

REFERENCE FOLDER: [paste folder path — e.g. sample/references/pintrest/ or sample/references/YOUR-FOLDER/]

Architecture study only: flierdesignguide/emergenceflierdesignguide.md (patterns, not Emergence look).
Visual system: extract from the folder images — not emergencedesignguide.md.

Follow DESIGN_PRINCIPLES.md + DESIGN_QA.md.

Do:
- Shared chrome/tokens first; each image = its own template variation with a unique id.
- One project under src/projects/{collection-id}/ with multiple fliers, components under src/fliers/{collection-id}/ (or per-variation folders).
- Register the project in src/projects/registry.js.
- Do NOT dump variations into EMERGENCE_TEMPLATES or Emergence visual theme.
- Empty photo slots; studio-editable; don’t break other brands.

Hand-off: collection/project id, template ids → board ids, intent per board if they differ, QA note.
```

---

## Short version

```text
Analyze REFERENCE: [path or URL].
Build a STANDALONE template matching the reference look (not Emergence).
Architecture ideas from flierdesignguide/emergenceflierdesignguide.md only — no Emergence restyle.
src/fliers/{id}/ + src/projects/{id}/ + registry.js. DESIGN_QA.md. Empty photo slots.
```

---

## When it really is Emergence

```text
Analyze REFERENCE: [path or URL] as an Emergence / Kinesis template.
Follow emergencedesignguide.md + flierdesignguide/emergenceflierdesignguide.md.
Register in src/fliers/emergence/index.js (EMERGENCE_TEMPLATES). Run DESIGN_QA.md.
```

---

## Revise an existing template

```text
Revise template/project [ID] (board [board-id]):
[what to change]

Keep its own visual system (do not convert to Emergence unless I say so).
After edits, run DESIGN_QA.md and fix fails before hand-off.
```

---

## Tips

1. Only swap the `REFERENCE:` line (or folder path) — rest stays reusable.
2. Open the **new project’s** template in the studio — not the Emergence group — unless you used the Emergence-only prompt.
3. If a past analysis wrongly landed under Emergence (e.g. earn/learn/digital), fix by moving to a standalone project and matching the reference look — don’t keep restyling in `.e-*`.
4. Emergence guides teach *how* we wire studio fliers; the reference teaches *how it should look*.
5. Name size from the brief / `sizes.js`; never assume every board is 1080×1350.
