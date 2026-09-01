---
"form-page-builder": minor
---

`features.templates` now accepts an object: `{ manage?: boolean; max?: number }`. `manage: false` keeps the Templates library visible but read-only — the user can apply a template as a starting point but can't create, overwrite, or delete one, and the toolbar "Save" button is hidden. `max` caps how many templates can be stored (default 5, previously a hard-coded constant). `templates: true` / `false` keep working unchanged.
