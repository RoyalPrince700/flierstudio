# Flier Design QA (mandatory)

Run this **after every new or revised flier**, before telling the user it is done.  
Do not skip. If anything fails, fix the code/CSS, then re-check.

---

## 0. Intent (answer the question)

Every flier answers one question for the viewer. Write it in one line, then verify the layout answers it.

Examples:

- “Which phone should I pick?” → three clear options + CTA
- “Who is speaking and why come?” → faces + title + time/place
- “What is the offer?” → offer + proof + shop action

If the flier could answer two different questions, cut until one remains.

---

## 1. Virtual inspection (required)

1. Open / render the flier at **native export size** (e.g. 1080×1350), not a tiny preview mental model.
2. If the studio is running, prefer a fresh look at the board; if you can capture or read export/preview images, **read the image** and inspect pixels — do not QA from JSX alone.
3. Scan in this order: **whole → zones → elements → type → color → edges**.

---

## 2. Unity checklist

| Check | Pass when |
| --- | --- |
| One composition | Reads as one poster, not a dashboard of widgets |
| One hero | Single focal point; nothing fights it |
| Brand locked | Logo/wordmark belongs; removing it would weaken the piece |
| Rhythm | Margins, gaps, and alignments feel intentional (shared grid / repeated spacing) |
| Chrome family | Header, body, footer feel like one system (radius, ink, weight language) |
| Every element earns its place | If you delete it, something important is lost — else remove it |
| Connected, not stuck-on | Badges, chips, seals, icons sit in the composition (overlap, align, or echo a color), not floating randomly |
| Sample fidelity | If using a sample, shared chrome + variation rules from `PRINCIPLES.md` still hold |

---

## 3. Detail checklist

| Check | Pass when |
| --- | --- |
| Type hierarchy | Headline clearly loudest; support quieter; meta quietest (≤4 sizes) |
| Weight / boldness | Display/headline heavy enough to hold at phone size; CTA readable |
| Contrast | Text and icons clear on their backgrounds |
| Safe inset | Critical copy/CTA inside safe padding; not clipped by edges or dock |
| Alignment | Columns/edges share lines; no accidental 2–4px drift |
| Image fit | Crops, object-fit, and shadows match the slot; no awkward letterboxing unless designed |
| Icon set | One family (`lucide-react`); consistent stroke weight |
| Footer / CTA | Dock or CTA bar matches the system; contacts not cramped or overflowing |
| Export root | Single capture node; no studio UI leaking into the artboard |

---

## 4. Relation test (how pieces work together)

Ask out loud (briefly):

1. **Lead** — What does the eye hit first? Is that what the brief wants?
2. **Path** — Does the eye move headline → hero → CTA (or the path the sample defines)?
3. **Echo** — Do accent colors, radii, and weights repeat at least twice so the piece feels united?
4. **Tension** — Is there useful contrast (light/dark, big/small) without chaos?
5. **Need** — Does each block support the intent question? Cut orphans.

---

## 5. Fix loop

For each failure:

1. Name the issue in one short phrase.
2. Adjust tokens / CSS / structure (prefer system fixes over one-off hacks).
3. Re-inspect the affected zone.
4. Only then continue.

Ship only when **Intent + Unity + Detail** all pass.

---

## 6. Hand-off note (to the user)

After QA, tell them briefly:

- The one question the flier answers
- That the QA pass was run
- How to preview (`npm run dev`) and download

Do not dump the full checklist unless they ask.
