---
"form-page-builder": minor
---

Added an `onSubmit` prop, called when Preview mode's Submit button (combined or per-section) passes validation. The payload includes the submitted scope's raw values, a section-wise breakdown of the whole form, and a flattened map of every field — additive alongside the existing mock "here's what would be sent" confirmation modal.
