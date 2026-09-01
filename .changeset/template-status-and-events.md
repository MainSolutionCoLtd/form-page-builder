---
"form-page-builder": minor
---

Template save/load now has its own status, separate from the draft autosave indicator: the Templates modal shows a spinner while a load is in flight and an inline error if the `StorageAdapter` throws or rejects (previously a blocking `alert()`), and the Save-as modal reflects a saving/failed state. The toolbar shows which template is currently being edited and an "Edited" flag once the document diverges from it. New `onTemplateChange` prop fires on create / overwrite / apply / delete with `{ id, title, source }` so a host can sync its own state or backend index. Modals now expose `role="dialog"`.
