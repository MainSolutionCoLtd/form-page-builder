---
"form-page-builder": patch
---

Fix the Build-mode layout (fixed-width Palette + Inspector columns) clipping the Inspector off-screen on narrow viewports instead of scrolling — below ~720px wide, the three columns now stack vertically with a single scroll instead of overflowing hidden. Also fixes the JSON/Templates/Save-as-template/Submitted modals overflowing narrow viewports by capping them at `max-width` instead of a fixed pixel width.
