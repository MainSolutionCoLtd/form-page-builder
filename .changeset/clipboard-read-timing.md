---
"form-page-builder": patch
---

"Paste template" reads the clipboard key when the confirmation is accepted rather than snapshotting it when the prompt opens, so a template copied elsewhere while the prompt is open is applied correctly. "Copy template" no longer also writes to the OS clipboard — that copy was never read back; use "View JSON" to grab a form as text.
