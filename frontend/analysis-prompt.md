# Analysis prompts (copy & paste)

Cursor follows `sample/ANALYZE.md` when you use these. Replace the path / name, then send.

---

## Single design

```text
Analyze sample/inbox/reference/YOUR-FILE.png following sample/ANALYZE.md.
Create a reusable sample with demo copy and placeholders.
Give it a unique kebab-case id (technique-composition, e.g. glass-stack).
Register it in src/samples/registry.js so it shows on the Samples page.
```

---

## Folder of designs (one collection, multiple templates)

```text
Analyze the folder sample/reference/YOUR-FOLDER/ as one sample collection.
Follow sample/ANALYZE.md — shared chrome first, then each template variation.
Use collection id YOUR-FOLDER (or suggest a better unique kebab-case id).
Create demo recreations + PRINCIPLES.md, register under ANALYZED_COLLECTIONS, and show it as one Samples card with all templates inside.
```

---

## Short version

```text
Analyze sample/inbox/YOUR-FILE-OR-FOLDER per sample/ANALYZE.md and add it to Samples.
```

---

## Reuse a sample later

```text
Build an Instagram portrait flier for [brand] using sample YOUR-SAMPLE-ID.
Copy: …
Assets in public/assets/[brand]/
```

---

## Tips

1. Put files in `sample/inbox/` (or a subfolder for grouped templates).
2. Name the folder what you want the collection id to be (`malik-gadget`).
3. After analysis, open **Samples** in the studio to confirm the card / templates.
4. Full rules live in `sample/ANALYZE.md` and `sample/PLACEHOLDERS.md`.
