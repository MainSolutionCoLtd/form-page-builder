---
"form-page-builder": major
---

Add a `features` prop for independently toggling every UI surface on/off — form-title editing, the Templates library, "New Form", autosave, JSON view, Build/Preview mode, the language switcher, the global Design tab, per-field styling (paragraph typography, button color), and allowlists for which content blocks and field types can be added. Everything defaults to on (full-featured, matching current behavior) except `design`, which defaults to off exactly as `themeEditable` did.

**Breaking:** the `themeEditable` prop is removed — use `features={{ design: true }}` instead.
