---
"form-page-builder": minor
---

Replace the native `window.confirm` (paste template) and `window.alert` (template limit reached) with in-widget modals styled like the rest of the builder — host apps no longer get browser chrome dialogs. New `chrome` strings: `confirm`, `cancel`, `dismiss`, `confirmReplace`, `templatesLimitTitle`. A `satisfies` guard now fails the build if the `en`/`ja` `chrome` or `strings` tables drift apart.
