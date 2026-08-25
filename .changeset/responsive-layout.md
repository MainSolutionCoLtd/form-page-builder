---
"form-page-builder": patch
---

Fix the Build-mode layout (fixed-width Palette + Inspector columns) clipping the Inspector off-screen on narrow viewports instead of scrolling. Below ~720px wide, Canvas is now the full-width primary view and Palette/Inspector become full-bleed drawers toggled by a small "Blocks"/"Properties" bar, instead of the previous fixed-width columns overflowing hidden — tapping a block adds it and returns to Canvas, and tapping a field in Canvas opens its Properties automatically. Also fixes the JSON/Templates/Save-as-template/Submitted modals overflowing narrow viewports by capping them at `max-width` instead of a fixed pixel width.
