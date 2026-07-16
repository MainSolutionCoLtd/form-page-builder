---
"form-page-builder": patch
---

The default `localStorageAdapter` now compresses draft/template JSON before writing to `localStorage` (via `lz-string`), reducing how much of the browser's storage quota autosave uses. Reads transparently fall back to treating existing uncompressed values as legacy data, so upgrading doesn't lose current drafts or templates. Custom `StorageAdapter` implementations are unaffected.
