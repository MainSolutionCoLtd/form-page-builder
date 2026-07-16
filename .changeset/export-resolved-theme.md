---
"form-page-builder": minor
---

The exported/copied JSON (`FormDocument`) now includes a fully resolved `theme` object alongside `themeOverrides`, so a host rendering its own copy of the form from this JSON doesn't need to separately know and re-merge the package's default theme to get the real colors/spacing. `themeOverrides` is still what's used when the JSON is loaded back into this package (via the Templates library or, in a later release, `loadDocument`).
