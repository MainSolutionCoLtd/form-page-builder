---
"form-page-builder": minor
---

Add full dark-theme support: every color in the widget (modals, toggles, badges, native inputs — not just the canvas/toolbar) now reads from the `theme` prop via CSS custom properties, instead of a couple dozen of them being hardcoded to light-theme hex values. Adds two new exports, `DARK_THEME` and `DEFAULT_THEME`, as ready-made `Theme` objects — pass `theme={DARK_THEME}` for a dark `<FormBuilder />`, or spread/tweak either one for a custom palette.
