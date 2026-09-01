# form-page-builder

## 2.2.0

### Minor Changes

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`dc7da44`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/dc7da4457096d9b4df3bed6afc5046b6c7bc9362) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - `features.templates` now accepts an object: `{ manage?: boolean; max?: number }`. `manage: false` keeps the Templates library visible but read-only — the user can apply a template as a starting point but can't create, overwrite, or delete one, and the toolbar "Save" button is hidden. `max` caps how many templates can be stored (default 5, previously a hard-coded constant). `templates: true` / `false` keep working unchanged.

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`135f42f`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/135f42f20f80c14f63bcd0a2331772e5ee4eae07) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - Add "Copy template" / "Paste template" — icon buttons next to "View JSON" (toggle with `features.templateClipboard`, default on) that move the current form between builder instances across pages, tabs, and reloads in the same browser. Copy writes a portable envelope to a localStorage key (`templateClipboardKey` prop, default `"form-page-builder:clipboard"`); every mounted builder watches the key so Paste enables as soon as something is copied. Paste confirms, then replaces the working document.

  New exports back the same flow programmatically: `serializeTemplate(document)` / `parseTemplate(str)` helpers (the latter also accepts bare "View JSON" output and returns `null` for anything that isn't a document), the `FormTemplate` type, and `getTemplate()` / `loadTemplate(input)` on the ref handle.

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`0f90826`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/0f90826e334ad3360605e8be084b5302093ea42e) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - Replace the native `window.confirm` (paste template) and `window.alert` (template limit reached) with in-widget modals styled like the rest of the builder — host apps no longer get browser chrome dialogs. New `chrome` strings: `confirm`, `cancel`, `dismiss`, `confirmReplace`, `templatesLimitTitle`. A `satisfies` guard now fails the build if the `en`/`ja` `chrome` or `strings` tables drift apart.

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`acdb3af`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/acdb3af1c14469a69bde4795cdb9c59a004beb8c) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - Add `features.sectionBackground` — gates only the per-section background-color swatches and custom-color picker in the section header, split out from `features.sections` (which now covers just the add/duplicate/move/delete controls and the "Add section" button). It defaults to whatever `sections` resolves to, so an existing `sections: false` keeps hiding the picker; set `sectionBackground: false` on its own to lock section backgrounds while keeping the structural controls.

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`b06efef`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/b06efef072962eb4186055f17108a11f54fbc3b3) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - Export the storage-key helpers a backend `StorageAdapter` needs — `DRAFT_KEY`, `INDEX_KEY`, `CLIPBOARD_KEY`, `formKey(id)`, and `savedFormId(key)` (the template id for a per-template key, else `null`). Adapters can now route the draft, the template index, and per-template records to their own endpoints without hardcoding the key strings. README's `StorageAdapter` example updated to use them.

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`e851fcb`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/e851fcbf18570cf3d9361a8f0af610c239323bfe) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - Template save/load now has its own status, separate from the draft autosave indicator: the Templates modal shows a spinner while a load is in flight and an inline error if the `StorageAdapter` throws or rejects (previously a blocking `alert()`), and the Save-as modal reflects a saving/failed state. The toolbar shows which template is currently being edited and an "Edited" flag once the document diverges from it. New `onTemplateChange` prop fires on create / overwrite / apply / delete with `{ id, title, source }` so a host can sync its own state or backend index. Modals now expose `role="dialog"`.

### Patch Changes

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`1db9022`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/1db902247557918d7e2fa7fc6cff0ee5b286e873) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - "Paste template" reads the clipboard key when the confirmation is accepted rather than snapshotting it when the prompt opens, so a template copied elsewhere while the prompt is open is applied correctly. "Copy template" no longer also writes to the OS clipboard — that copy was never read back; use "View JSON" to grab a form as text.

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`e673e97`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/e673e9783879ade5ea612d0d5fd3fbe3300f91ac) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - `useTheme`'s resolved theme and the internal JSON document are memoized, so the imperative handle (`getDocument`/`exportJson`) and root styles keep a stable identity between renders instead of being rebuilt every time.

- [#12](https://github.com/MainSolutionCoLtd/form-page-builder/pull/12) [`84a6e19`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/84a6e19f22baff32856a1e29db364e6191dd2050) Thanks [@MainSolutionCoLtd](https://github.com/MainSolutionCoLtd)! - Every dialog (templates, save-as, JSON view, confirm) now traps Tab focus, closes on Escape, and restores focus to the control that opened it. All modal buttons are explicitly `type="button"`.

## 2.1.0

### Minor Changes

- [#9](https://github.com/MainSolutionCoLtd/form-page-builder/pull/9) [`60ec700`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/60ec700d017ecfb4708771a8240de3f2115bf7d3) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Add `onModeChange` prop, firing on mount and on every Build/Preview toggle — lets a host mirror the widget's current mode (e.g. to show its own Save button only in Build mode) without building a separate tab UI around it.

- [#9](https://github.com/MainSolutionCoLtd/form-page-builder/pull/9) [`3c320dd`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/3c320dd673668093827e898fd6911d9fb255a812) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Add `initialMode` prop and `features.maxFields`.

  - `initialMode?: "build" | "preview"` sets which mode the widget mounts into (default `"build"`). Pair with `features.previewMode: false` to lock a consumer to a single mode with no tabs — including a fill-only embed that starts in Preview and never shows the Build canvas, which wasn't previously possible.
  - `features.maxFields?: number` caps the number of input-type fields (not content blocks) addable across the whole document. Once reached, the Form Fields palette buttons disable until a field is removed.

- [#9](https://github.com/MainSolutionCoLtd/form-page-builder/pull/9) [`8cc01a7`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/8cc01a7d698c3058ca2fe87f7ba1f424f2957e55) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Add `features.deviceToggle` — hides the Laptop/Tablet/Mobile width switcher above the Preview canvas for embeds that don't need it, while it stays available (and defaults to on) for consumers that do. Preview renders at the Laptop (full) width when hidden.

## 2.0.0

### Major Changes

- [#7](https://github.com/MainSolutionCoLtd/form-page-builder/pull/7) [`b91b5ac`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/b91b5ac3659060076d3c26916239de293d327d24) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Add a `features` prop for independently toggling every UI surface on/off — form-title editing, the Templates library, "New Form", autosave, JSON view, Build/Preview mode, the language switcher, the global Design tab, per-field styling (paragraph typography, button color), and allowlists for which content blocks and field types can be added. Everything defaults to on (full-featured, matching current behavior) except `design`, which defaults to off exactly as `themeEditable` did.

  **Breaking:** the `themeEditable` prop is removed — use `features={{ design: true }}` instead.

### Minor Changes

- [#7](https://github.com/MainSolutionCoLtd/form-page-builder/pull/7) [`67e25d5`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/67e25d5956862c1c954d1b4b0339d198b875c065) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Add full dark-theme support: every color in the widget (modals, toggles, badges, native inputs — not just the canvas/toolbar) now reads from the `theme` prop via CSS custom properties, instead of a couple dozen of them being hardcoded to light-theme hex values. Adds two new exports, `DARK_THEME` and `DEFAULT_THEME`, as ready-made `Theme` objects — pass `theme={DARK_THEME}` for a dark `<FormBuilder />`, or spread/tweak either one for a custom palette.

### Patch Changes

- [#7](https://github.com/MainSolutionCoLtd/form-page-builder/pull/7) [`b52f24e`](https://github.com/MainSolutionCoLtd/form-page-builder/commit/b52f24e5344e610ce848f2f126f35610cc114117) Thanks [@sabalpoudel](https://github.com/sabalpoudel)! - Fix the Build-mode layout (fixed-width Palette + Inspector columns) clipping the Inspector off-screen on narrow viewports instead of scrolling. Below ~720px wide, Canvas is now the full-width primary view and Palette/Inspector become full-bleed drawers toggled by a small "Blocks"/"Properties" bar, instead of the previous fixed-width columns overflowing hidden — tapping a block adds it and returns to Canvas, and tapping a field in Canvas opens its Properties automatically. Also fixes the JSON/Templates/Save-as-template/Submitted modals overflowing narrow viewports by capping them at `max-width` instead of a fixed pixel width.

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
