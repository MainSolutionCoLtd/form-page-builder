---
"form-page-builder": minor
---

- **`language` now follows the host.** The builder used to read `language` only on mount; it now adopts it whenever the prop changes, so an app with its own language toggle stays in sync with the builder.
- **One switcher, not two.** When you pass `language`, the builder's own switcher is hidden by default (the host owns the language). Set `features.languageSwitcher: true` to show it anyway. Without a `language` prop nothing changes.
- **New `onLanguageChange(code)` prop**, called when the user picks a language with the builder's own switcher.
- **Upgrade note:** if you pass `language` and relied on the builder's switcher, add `features={{ languageSwitcher: true }}`.
