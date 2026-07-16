---
"form-page-builder": minor
---

Added programmatic integration for hosts that want to load/save forms through their own backend instead of copy-pasting JSON: an `initialDocument` prop to seed the builder on mount, and a `ref` exposing `FormBuilderHandle` (`getDocument()`, `loadDocument()`, `exportJson()`) for on-demand pull/push independent of the `storage` autosave path.
