# Sample inbox

Drop inspirational / reference fliers here, then ask Cursor to analyze them.

## Folders vs loose files

| Path | Role |
| --- | --- |
| `sample/inbox/my-design.png` | Single reference → usually one template |
| `sample/inbox/malik-gadget/` | **Group** — all images inside = one sample collection with multiple template variations |
| `sample/references/{id}/` | Originals kept after analysis |
| `sample/ANALYZE.md` | Full AI workflow |
| `src/samples/{id}/` | Recreated demos + principles |

## Grouped analysis (recommended for brand packs)

If you find several templates from the same brand/project:

1. Create a folder: `sample/inbox/malik-gadget/`
2. Put every variation inside that folder
3. Ask Cursor:

```text
Analyze the folder sample/inbox/malik-gadget/ as one sample collection.
Follow sample/ANALYZE.md — shared chrome first, then each template variation.
```

4. Open **Samples** in the studio → one card for the collection → click to see all templates.

## Naming

- Folder / collection: `malik-gadget` (kebab-case of the folder name)
- Single style: `glass-stack` (`technique-composition`)
