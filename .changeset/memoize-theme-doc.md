---
"form-page-builder": patch
---

`useTheme`'s resolved theme and the internal JSON document are memoized, so the imperative handle (`getDocument`/`exportJson`) and root styles keep a stable identity between renders instead of being rebuilt every time.
