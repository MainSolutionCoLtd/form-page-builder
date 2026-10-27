---
"form-page-builder": minor
---

- **Field-limit notice.** When `features.maxFields` is set, the palette shows a live "Fields: n / max" line and, at the limit, a "Field limit reached" message instead of silently greying out the buttons. New `chrome` strings: `fieldCount`, `fieldLimitReached`.
- **Smaller persisted documents.** Drafts and saved templates now omit props that equal their default (`hideLabel`, `width`, `verticalAlign`, `labelPosition`, `showIcon`, `required`, the type's default icon, empty placeholders/default values, empty section background/collapsed). `migrateDocument` restores them, so older full documents still load and nothing changes at runtime. Roughly a third smaller for a typical radio/select form. `compactDocument` also drops empty non-`en` translations and stamps `compact: 1` (a marker so a future change to a default can still read old documents correctly). New `compactDocument(doc)` export applies the same trimming to `getDocument()` output before a host stores it.
- **Fix: duplicate option values.** Adding an option after removing one could reuse an existing value (e.g. two `option_3`), so selecting or defaulting one affected both. New options now take the next unused value, and removing an option clears a default that pointed at it.
- **Note:** a document saved in the compact form is not fully understood by earlier package versions (they only restore `hideLabel` and `verticalAlign`). Upgrade every app that reads the stored documents together.
