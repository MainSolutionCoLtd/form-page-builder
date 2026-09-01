---
"form-page-builder": minor
---

Add "Copy template" / "Paste template" — icon buttons next to "View JSON" (toggle with `features.templateClipboard`, default on) that move the current form between builder instances across pages, tabs, and reloads in the same browser. Copy writes a portable envelope to a localStorage key (`templateClipboardKey` prop, default `"form-page-builder:clipboard"`); every mounted builder watches the key so Paste enables as soon as something is copied. Paste confirms, then replaces the working document.

New exports back the same flow programmatically: `serializeTemplate(document)` / `parseTemplate(str)` helpers (the latter also accepts bare "View JSON" output and returns `null` for anything that isn't a document), the `FormTemplate` type, and `getTemplate()` / `loadTemplate(input)` on the ref handle.
