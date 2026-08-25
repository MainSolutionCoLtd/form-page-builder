---
"form-page-builder": minor
---

Add `initialMode` prop and `features.maxFields`.

- `initialMode?: "build" | "preview"` sets which mode the widget mounts into (default `"build"`). Pair with `features.previewMode: false` to lock a consumer to a single mode with no tabs — including a fill-only embed that starts in Preview and never shows the Build canvas, which wasn't previously possible.
- `features.maxFields?: number` caps the number of input-type fields (not content blocks) addable across the whole document. Once reached, the Form Fields palette buttons disable until a field is removed.
