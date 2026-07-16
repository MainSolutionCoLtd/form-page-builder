---
"form-page-builder": major
---

Replaced the implicit submit button (`submitLabel`/`submitMode`/`submitStyle` on the document, and per-section overrides) with a real, draggable **Button field** — placed anywhere in a section like any other field, with its own `action` ("Open link" or "Submit") and, for submit buttons, a `submitScope` of "This section" or "Whole form". This means:

- Any number of buttons per form/section is now possible (e.g. a per-section "Next" plus a final "Submit", or a plain link-style CTA that doesn't submit at all).
- `SubmitPayload` (the `onSubmit` callback argument) gains a required `buttonId` so a host app can tell which button fired, and its `scope` field is renamed from `"combined" | "section"` to `"form" | "section"` to match the button's own `submitScope`.
- The exported/persisted document JSON (`FormDocument`) bumps to `version: 5` and no longer has `submitLabel`/`submitMode`/`submitStyle` on the document or `submitStyle`/`submitLabel` on a section.

Existing saved drafts, templates, and any JSON passed to `loadDocument`/`initialDocument` migrate automatically on load — a button field is synthesized in the same position the old auto-rendered button used to occupy (end of each section for `"perSection"`, end of the form for `"combined"`), carrying over its label/color/size. Host apps that read `onSubmit`'s payload directly need to update for the `scope` rename and can start using `buttonId` to distinguish multiple submit buttons.
