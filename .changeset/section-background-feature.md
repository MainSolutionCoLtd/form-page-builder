---
"form-page-builder": minor
---

Add `features.sectionBackground` — gates only the per-section background-color swatches and custom-color picker in the section header, split out from `features.sections` (which now covers just the add/duplicate/move/delete controls and the "Add section" button). It defaults to whatever `sections` resolves to, so an existing `sections: false` keeps hiding the picker; set `sectionBackground: false` on its own to lock section backgrounds while keeping the structural controls.
