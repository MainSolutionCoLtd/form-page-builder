---
"form-page-builder": minor
---

**Viewer and Preview**
- **`FormViewer` no longer hides buttons.** A button with a label is always drawn. Submit buttons (the default for a new button) and link buttons with no URL show as inert blocks styled like Preview; link buttons with a safe URL stay links. A button with no label, or whose URL `sanitizeUrl` rejects, is still not drawn.
- **`FormViewer` survives malformed stored data** (null or non-array sections and fields) instead of throwing.
- **Preview** opens only URLs allowed by `defaultSanitizeUrl` (no `javascript:` links), and a field's validation message clears as soon as the field is edited.
- **`submitButtons: false`.** A leftover submit button acts as a link in Preview, and editing its URL in the inspector switches it to the link action, so the saved document and `FormViewer` agree with the editor.

**Languages**
- **Content no longer disappears when the language changes.** Labels, option names, placeholders, section and form titles and alt text use the same fallback as `FormViewer` (current language, then `en`, then any translation with text) in the Build canvas, Preview and the submitted summary. Previously text that existed only in another language showed as blank, "Untitled field" or "...".
- **Editing a default clears the untouched default in other languages.** A new field's name ("Input"), an option's ("Option 1") and the form title ("Untitled form") are cleared in every other language once the author types their own text in one; text the author wrote is never touched. The inspector now shows each language's own stored text, with the fallback as a grey hint.
- **Yes/No in the submitted summary** follows the language (new `strings` keys `yes` and `no`; add them to a custom `strings` language if you have one).

**Other fixes**
- An edit made just before the builder unmounts is saved instead of lost to the 600 ms autosave debounce.
- Saving over a template while editing in another language no longer blanks its title in the Templates list.
- The error / selected / drag-over borders no longer trigger React's mixed `border`/`borderColor` style warning.
- The `theme` prop accepts a partial `layout`, e.g. `theme={{ layout: { imageMaxWidth: 640 } }}`.

**Docs**
- README: how the builder, `storage` and `FormViewer` fit together, that a form has no Submit button until you add one, what the viewer draws for each block, how missing translations behave, and the `strings`/`chrome` props.
