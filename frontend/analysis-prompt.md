# Analysis prompts (copy & paste)

Paste a reference path or URL into the prompt below, then send.  
Cursor must **analyze → build an Emergence studio template** (not a Samples-page sample).

**Guides (required reading for the model)**

| File | Role |
| --- | --- |
| `emergencedesignguide.md` | Brand language: color, type, mood, chrome, do/don’t |
| `flierdesignguide/emergenceflierdesignguide.md` | How shipped templates are built: shared chrome, data, CSS reuse, registration |
| `DESIGN_QA.md` | Mandatory pass after the template exists |

**Where work lands**

| Step | Location |
| --- | --- |
| Reference (optional archive) | `sample/references/` or keep the link/path you pasted |
| Template component | `src/fliers/emergence/Emergence{Name}.jsx` |
| Template CSS | `src/fliers/emergence/emergence-templates.css` (scoped under `.e-flier--{id}`) |
| Register | `src/fliers/emergence/index.js` → `EMERGENCE_TEMPLATES` |
| Studio board | Auto via `src/projects/emergence/project.js` → board id `emergence-{template-id}` |

Speaker / convener photos stay empty until assets exist. Prefer shared `EmergenceChrome` + `PortraitSlot` + `resolveEmergenceData`; only invent new BEM when the layout truly needs it.

---

## Single design

```text
Analyze this flier reference and turn it into a new Emergence studio template:

REFERENCE: [paste path or URL — e.g. sample/references/pintrest/inspire.png or https://…]

Follow:
1. emergencedesignguide.md — match Emergence / Kinesis visual language (tokens, mood, chrome rules).
2. flierdesignguide/emergenceflierdesignguide.md — architecture: shared chrome + template-local midsection, resolveEmergenceData, studio-editable paths, root modifier class.
3. DESIGN_QA.md — full pass at native 1080×1350 before hand-off.

Do:
- Deep-analyze layout, hierarchy, type, color, spacing, and mood from the reference.
- Propose a unique kebab-case template id (composition-led, e.g. cascade-stage, ribbon-row) — do not collide with existing EMERGENCE_TEMPLATES ids.
- Implement a new template component under src/fliers/emergence/, scoped CSS under .e-flier--{id}, register in index.js so it appears as its own Emergence board in the studio.
- Reuse shared header/footer/background/keywords/portraits/convener unless the reference requires a different chrome language.
- Keep speaker/convener image slots empty (placeholders). Wire EditableText / EditableImageSlot paths.
- Leave fixed templates (e.g. cascade-stage) unchanged unless the brief says to revise one.

Hand-off: intent question, template id + board id, and confirm QA passed. Tell me to open the Emergence project in studio and select the new template.
```

---

## Folder of designs (one family, multiple templates)

```text
Analyze this folder of flier references as one Emergence template family:

REFERENCE FOLDER: [paste folder path — e.g. sample/references/YOUR-FOLDER/]

Follow emergencedesignguide.md + flierdesignguide/emergenceflierdesignguide.md + DESIGN_QA.md.

Do:
- Extract shared chrome first (what stays constant across every file).
- Treat each image as its own template variation with a unique kebab-case id.
- Implement each variation under src/fliers/emergence/, register every id in EMERGENCE_TEMPLATES, each as its own studio board (emergence-{id}).
- Prefer one shared CSS family + per-template root modifiers over copy-paste systems.
- Empty photo slots; studio-editable copy/images; do not break existing boards.

Hand-off: list template ids → board ids, intent per board if they differ, QA note.
```

---

## Short version

```text
Analyze REFERENCE: [path or URL].
Build a new Emergence template per emergencedesignguide.md + flierdesignguide/emergenceflierdesignguide.md.
Register in src/fliers/emergence/index.js. Run DESIGN_QA.md. Empty photo slots.
```

---

## Revise / extend an existing template

```text
Revise Emergence template [TEMPLATE-ID] (board emergence-[TEMPLATE-ID]):
[what to change — layout, count, sizing, copy bands, etc.]

Keep shared chrome + editKind emergence unless I say otherwise.
Re-read flierdesignguide/emergenceflierdesignguide.md for architecture.
After edits, run DESIGN_QA.md and fix fails before hand-off.
```

---

## Tips

1. Only swap the `REFERENCE:` line (or folder path) — the rest of the prompt stays reusable.
2. Open **Emergence** in the studio (not Samples) and select the new template board.
3. New templates must get a unique id in `EMERGENCE_TEMPLATES`; `project.js` already maps them to boards.
4. Prefer class reuse from Cascade / Stage Grid patterns; scope overrides under `.e-flier--{id}` only.
5. Export size stays Emergence native (`emergence.size` → 1080×1350) unless the reference clearly demands another format from `sizes.js`.
