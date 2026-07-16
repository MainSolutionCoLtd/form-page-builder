---
"form-page-builder": minor
---

Renamed the "My forms" library to "Templates" throughout the UI (EN/JA), and capped it at 5 saved templates (`saveAs` now shows a message instead of writing past the limit). Documented that a host-provided `StorageAdapter` is the mechanism for a backend to populate templates and receive create/update/delete events, since its `set`/`delete` calls run directly.
