# Design prompts (copy & paste)

Cursor follows `DESIGN_PRINCIPLES.md`, project rules, and **must** finish with `DESIGN_QA.md` when you use these. Replace the bracketed bits, then send.

Name the **platform + size** every time (see `src/lib/sizes.js`). Do not assume 1080×1350.

---

## New flier (full)

```text
Design a [platform / format] flier for [brand].

Intent question (one only): [e.g. Which phone fits you? / Who is speaking tonight?]
Size: [instagram-post 1080×1080 | instagram-portrait 1080×1350 | instagram-story 1080×1920 | x-post 1600×900 | linkedin-post 1200×627 | youtube-thumbnail 1280×720 | custom W×H]
Mood: [e.g. bold retail, clean night, warm lifestyle]
Copy:
- Headline: …
- Support: …
- CTA: …
Assets in public/assets/[brand]/ …

Follow DESIGN_PRINCIPLES.md. Put the board under src/projects/[brand]/ and register it.
Wire width/height from sizes.js (boardSize / getFlierSize) — match the size I named.
When the layout is built, run the full DESIGN_QA.md pass (intent, virtual inspection, unity, detail, relation). Fix every failure, re-check, then hand off only when it passes. In the hand-off, state the intent question and that QA was run.
```

---

## New flier using a sample

```text
Build a [platform / format] flier for [brand] using sample [SAMPLE-ID]
(or template [TEMPLATE-ID], e.g. malik-gadget-flagship-tray).

Size: [id or W×H from sizes.js]
Intent question: …
Copy: …
Assets in public/assets/[brand]/ …

Read that sample’s PRINCIPLES.md and match shared chrome + the chosen variation.
Adapt the layout to the size I named (do not keep a sample’s portrait size if I asked for square/story/etc.).
Then run DESIGN_QA.md end-to-end — unity, bold type, connected elements, fix loop — before you say it’s done.
```

---

## Short version

```text
Design a [size id or W×H] flier for [brand]. Intent: [one question]. Copy: …. Assets: public/assets/[brand]/.
Follow DESIGN_PRINCIPLES.md, then mandatory DESIGN_QA.md (inspect, fix, re-check) before hand-off.
```

---

## Revise an existing flier

```text
Revise the [project / board id] flier: [what to change].
Keep the same intent question unless I change it.
After edits, re-run DESIGN_QA.md and fix anything that fails.
```

---

## QA only (already designed)

```text
Run DESIGN_QA.md on [project / board id].
Virtually inspect at native size, list fails, fix them, re-check, then confirm pass + intent question.
```

---

## Tips

1. Always give **one intent question** — the flier should answer only that.
2. Always name **platform + size** (or a size id from `sizes.js`); Cursor should not default every board to portrait.
3. Prefer real assets in `public/assets/[brand]/`; otherwise Cursor uses placeholders.
4. Name the brand/project so boards stay under `src/projects/<brand>/`.
5. After hand-off: `npm run dev` → open the project → download from the studio panel.
6. Full checklists: `DESIGN_QA.md` · principles: `DESIGN_PRINCIPLES.md` · samples: `analysis-prompt.md`.
