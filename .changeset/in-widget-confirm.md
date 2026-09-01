---
"form-page-builder": patch
---

Replace the native `window.confirm` (paste template) and `window.alert` (template limit reached) with in-widget modals styled like the rest of the builder, so host apps no longer get browser chrome dialogs. New `chrome` strings: `confirm`, `cancel`, `dismiss`, `confirmReplace`, `templatesLimitTitle`.
