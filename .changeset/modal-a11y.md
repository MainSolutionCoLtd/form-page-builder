---
"form-page-builder": patch
---

Every dialog (templates, save-as, JSON view, confirm) now traps Tab focus, closes on Escape, and restores focus to the control that opened it. All modal buttons are explicitly `type="button"`.
