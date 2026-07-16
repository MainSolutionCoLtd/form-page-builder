---
"form-page-builder": patch
---

Removed the `minHeight: 640` that could force the widget taller than a host container sized to exactly `100vh`/`100dvh`, causing both the host page and the widget's own internal panels to scroll at once. The viewport-height cap now lives in a `.fb-root` CSS class with a `100dvh` upgrade for mobile browsers (a single inline style can't express that vh→dvh fallback).
