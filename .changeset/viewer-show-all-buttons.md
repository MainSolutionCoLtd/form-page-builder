---
"form-page-builder": patch
---

- **Fix: `FormViewer` no longer hides buttons.** A button with a label is always drawn. Submit buttons (the default for a new button) and link buttons with no URL show as inert blocks with the same styling as Preview; link buttons with a safe URL stay links. A button with no label, or whose URL `sanitizeUrl` rejects, is still not drawn.
- **Fix: `submitButtons: false`.** A leftover submit button now acts as a link in Preview, and editing its URL in the inspector switches it to the link action, so the saved document and `FormViewer` agree with what the editor showed.
- **Fix: Preview** opens only URLs allowed by `defaultSanitizeUrl` (no `javascript:` links), and a field's validation message clears as soon as the field is edited.
- **Fix:** saving over a template while editing in another language no longer blanks its title in the Templates list.
- **Fix:** switching the error / selected / drag-over border no longer triggers React's mixed `border`/`borderColor` style warning.
- **Fix: Yes/No in the submitted summary** follows the language (new `strings` keys `yes` and `no`; `formatValue` takes `strings` as a third argument).
- **Fix:** an edit made just before the builder unmounts is now saved instead of lost to the 600 ms autosave debounce.
- **Fix:** a text or button block written in only one language shows that text in Preview, as `FormViewer` already did, instead of a blank.
- **Docs:** README now explains how the builder, `storage` and `FormViewer` fit together, that a form has no Submit button until you add one, what the viewer draws for each block, and the `strings`/`chrome` props.
- **Fix: content disappearing when the language changes.** Field labels, option names, placeholders, section and form titles and alt text now use the same fallback as `FormViewer` (current language, then `en`, then any translation with text) in the Build canvas, Preview and the submitted summary. Previously text that existed only in another language showed as blank, "Untitled field" or "...". The inspector shows the inherited text as a hint on empty inputs.
- **Editing a default text in one language clears the untouched default in the others.** A new field's name ("Input"), an option's ("Option 1") and the form title ("Untitled form") are cleared in every other language once the author types their own text in one, so a leftover default never sits beside the author's wording; text the author wrote is never touched. The inspector now shows each language's own stored text (the fallback appears as a grey hint) instead of the fallback as if it were the value.
