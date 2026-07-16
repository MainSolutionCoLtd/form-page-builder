# form-page-builder

## 1.0.0

### Major Changes

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`d2b18df`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/d2b18df51f2f14115d045e5d66dfdd5555622f44) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Replaced the implicit submit button (`submitLabel`/`submitMode`/`submitStyle` on the document, and per-section overrides) with a real, draggable **Button field** — placed anywhere in a section like any other field, with its own `action` ("Open link" or "Submit") and, for submit buttons, a `submitScope` of "This section" or "Whole form". This means:

  - Any number of buttons per form/section is now possible (e.g. a per-section "Next" plus a final "Submit", or a plain link-style CTA that doesn't submit at all).
  - `SubmitPayload` (the `onSubmit` callback argument) gains a required `buttonId` so a host app can tell which button fired, and its `scope` field is renamed from `"combined" | "section"` to `"form" | "section"` to match the button's own `submitScope`.
  - The exported/persisted document JSON (`FormDocument`) bumps to `version: 5` and no longer has `submitLabel`/`submitMode`/`submitStyle` on the document or `submitStyle`/`submitLabel` on a section.

  Existing saved drafts, templates, and any JSON passed to `loadDocument`/`initialDocument` migrate automatically on load — a button field is synthesized in the same position the old auto-rendered button used to occupy (end of each section for `"perSection"`, end of the form for `"combined"`), carrying over its label/color/size. Host apps that read `onSubmit`'s payload directly need to update for the `scope` rename and can start using `buttonId` to distinguish multiple submit buttons.

### Minor Changes

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`48cecdc`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/48cecdc7d68fac45cdc248c7dfd733b038cd35de) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Increased the default `theme.layout.maxWidth` from 640 to 1200 for a more usable full-width layout out of the box. Consumers who already set `theme.layout.maxWidth` (directly or via `themeOverrides`) are unaffected.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`9328152`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/9328152a11bd2ef7bd4a542b42e23d30b37fa73c) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Moved theme, spacing, and submit-button style controls from the toolbar's popover/settings-modal into a new "Design" tab in the left sidebar (next to "Blocks"), shown whenever `themeEditable` is set — easier to reach and edit alongside the canvas instead of an overlay. The Form settings modal now only holds submit label/mode.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`d6b82e3`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/d6b82e36c7882a34d69999e31014d75e68ed3a0e) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - The exported/copied JSON (`FormDocument`) now includes a fully resolved `theme` object alongside `themeOverrides`, so a host rendering its own copy of the form from this JSON doesn't need to separately know and re-merge the package's default theme to get the real colors/spacing. `themeOverrides` is still what's used when the JSON is loaded back into this package (via the Templates library or, in a later release, `loadDocument`).

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`e980b18`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/e980b18a6c82e48a924a98cfd5071e13a0c91b1c) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Replaced the toolbar's language segmented-control with a compact pill-style `LanguageToggle` for switching between configured languages.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`f4c9fec`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/f4c9fec7f7b2fe67369038ef9696020338f92783) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Added an `onSubmit` prop, called when Preview mode's Submit button (combined or per-section) passes validation. The payload includes the submitted scope's raw values, a section-wise breakdown of the whole form, and a flattened map of every field — additive alongside the existing mock "here's what would be sent" confirmation modal.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`e980b18`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/e980b18a6c82e48a924a98cfd5071e13a0c91b1c) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Sections can now override the submit button's text, not just its color/size — editable from the same per-section submit controls in the canvas. Falls back to the form's global submit label when unset.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`c108b2a`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/c108b2a790fb2cf44bd2fb4b1dcf2f3ac180a275) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Added programmatic integration for hosts that want to load/save forms through their own backend instead of copy-pasting JSON: an `initialDocument` prop to seed the builder on mount, and a `ref` exposing `FormBuilderHandle` (`getDocument()`, `loadDocument()`, `exportJson()`) for on-demand pull/push independent of the `storage` autosave path.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`2bcfaaf`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/2bcfaafdafc6c4813c207aeaf377d90cd90aaaa5) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Renamed the "My forms" library to "Templates" throughout the UI (EN/JA), and capped it at 5 saved templates (`saveAs` now shows a message instead of writing past the limit). Documented that a host-provided `StorageAdapter` is the mechanism for a backend to populate templates and receive create/update/delete events, since its `set`/`delete` calls run directly.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`e980b18`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/e980b18a6c82e48a924a98cfd5071e13a0c91b1c) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Removed the settings modal (the toolbar's gear icon) — submit button label and mode now live in the sidebar's "Design" tab alongside theme, spacing, and button-style controls, so all form-level configuration is in one place. That submit section, and the choice between combined/per-section submit buttons, is now hidden entirely for documents that have no fillable fields (e.g. pure display/landing pages) or where only one section actually has fields.

### Patch Changes

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`4dd65d1`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/4dd65d16187a01093de22b5e2dec0e63a2d9948a) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - The default `localStorageAdapter` now compresses draft/template JSON before writing to `localStorage` (via `lz-string`), reducing how much of the browser's storage quota autosave uses. Reads transparently fall back to treating existing uncompressed values as legacy data, so upgrading doesn't lose current drafts or templates. Custom `StorageAdapter` implementations are unaffected.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`a7a7fc1`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/a7a7fc1c66a97348e3ffa0378930fc1ed8e387f9) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Final documentation pass covering the Templates rename/cap, the sidebar Design tab, `onSubmit`, and the programmatic ref API. Also de-duplicated the "Save as template" modal's title/button text, which had become identical after the Templates rename.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`5012eca`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/5012eca0938f06c0d92d9720112afca1c84b07a0) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Removed the `minHeight: 640` that could force the widget taller than a host container sized to exactly `100vh`/`100dvh`, causing both the host page and the widget's own internal panels to scroll at once. The viewport-height cap now lives in a `.fb-root` CSS class with a `100dvh` upgrade for mobile browsers (a single inline style can't express that vh→dvh fallback).

- [#2](https://github.com/MainSolutionCoLtd/form-page-builder/pull/2) [`26059c0`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/26059c082db5a193f5851f28702c159c4e39f80e) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - Cap the app container at `maxHeight: 100vh` so the Palette/Canvas/Inspector panels scroll internally instead of the whole page growing unbounded.

- [#4](https://github.com/MainSolutionCoLtd/form-page-builder/pull/4) [`e901a48`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/e901a48522a4b65626787afff87b67e0f41c6c40) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - The Design tab's Spacing section now only exposes the knobs that actually affect the rendered form (page padding, section gap, field gap). Canvas/toolbar/panel/ticket padding were builder-only chrome — editing them had no visible effect in Preview or the exported form — so they've been dropped from the editable list.

## 0.1.0

Initial release.
