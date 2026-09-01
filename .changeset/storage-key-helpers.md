---
"form-page-builder": minor
---

Export the storage-key helpers a backend `StorageAdapter` needs — `DRAFT_KEY`, `INDEX_KEY`, `CLIPBOARD_KEY`, `formKey(id)`, and `savedFormId(key)` (the template id for a per-template key, else `null`). Adapters can now route the draft, the template index, and per-template records to their own endpoints without hardcoding the key strings. README's `StorageAdapter` example updated to use them.
