---
"form-page-builder": minor
---

Three changes to how a form renders and persists:

- **Submit buttons are never synthesized.** A form has a submit control only when a Button field was explicitly added. The old migration path that baked a legacy document-level `submitLabel`/`submitMode` into a Button field on load is gone, and every persisted document (drafts and saved templates) is now stamped with `version` so it can't be mistaken for loose/legacy JSON. This fixes a bug where saving a template through a `StorageAdapter` and reloading it appended a spurious "Submit" button each time. **Breaking:** a genuinely pre-v5 stored document that relied on the implicit submit will load without one — add a Button field.

- **New `features.formTitle` (default `false`).** Gates the form-title `<h2>` heading shown above the fields in Preview. **Breaking:** the heading is now hidden unless you opt in — hosts that render the form name in their own chrome no longer get a duplicate; pass `features={{ formTitle: true }}` to restore it.

- **Structural class hooks.** The rendered form now carries rule-free class names for host stylesheets to target: `.fb-form` on the Preview container, `.fb-section` (+ `data-section-id`) on section wrappers, and `.fb-field` / `.fb-field--<type>` / `.fb-field--<id>` (+ `data-field-id`) on every field wrapper in both Preview and the Build canvas. `DOCUMENT_VERSION` is also exported for `StorageAdapter` authors building records server-side.
