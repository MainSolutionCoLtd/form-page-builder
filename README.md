# form-page-builder

[![npm](https://img.shields.io/npm/v/form-page-builder.svg)](https://www.npmjs.com/package/form-page-builder)
[![CI](https://github.com/MainSolutionCoLtd/form-page-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/MainSolutionCoLtd/form-page-builder/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/form-page-builder.svg)](./LICENSE)

**[Live demo](https://mainsolutioncoltd.github.io/form-page-builder/)**

Embeddable, bilingual (EN/JA by default, extensible), drag-and-drop form builder widget for React. Ships a single `<FormBuilder />` component with a Build mode (drag/drop canvas, field inspector) and a Preview mode (responsive, validating runtime form), plus a JSON export of the resulting document.

**This is a builder + viewer, not a data handler.** It builds and previews a JSON *schema* describing a form's fields, sections, and layout blocks (including plain content blocks like paragraphs and images, not just inputs). Preview mode's "Submit" validates and shows a mock "here's what would be sent to your backend" modal, and — if you pass `onSubmit` — hands you the entered values too; either way, this package never sends or stores them itself. The only thing it persists on its own is the *builder's own* draft/Templates state (via the pluggable `StorageAdapter` below); actually delivering submissions to a backend is up to the host app.

## Install

```bash
npm install form-page-builder
# or, from a private GitHub repo:
npm install git+ssh://git@github.com/yourorg/form-page-builder.git
```

`react` and `react-dom` (>=18) are peer dependencies — install them in the consuming app if not already present.

## Usage (React / Next.js)

```tsx
import { FormBuilder } from "form-page-builder";

export default function BuilderPage() {
  return <FormBuilder />;
}
```

In Next.js App Router, the package's entry already carries a `"use client"` directive, so it can be imported directly from a Server Component tree without you adding the directive yourself.

### Sizing

The widget caps itself at the viewport height (`100vh`, upgrading to `100dvh` on browsers that support it) and scrolls its own Palette/Canvas/Inspector panels internally past that — it never grows taller than the space available. Give its wrapping container an explicit height (e.g. `height: "100dvh"` for a full-height layout on mobile, or any fixed/`%` height) if you want it to fill that space; without one, it just sizes to its content and the page scrolls normally, either way with a single scrollbar.

If you *do* size a wrapper to exactly `100vh`/`100dvh` and still see the page itself scroll by a few extra pixels, that's almost always the browser's default `<body>` margin (commonly `8px`) adding to that full-viewport height — reset it yourself (`body { margin: 0; }`), same as you would for any other full-height layout; this package doesn't touch your page's global styles.

### Props

| Prop | Type | Description |
|---|---|---|
| `theme` | `Partial<Theme>` | Override default colors/layout spacing. |
| `themeEditable` | `boolean` | Show the in-app "Design" tab (theme/spacing/submit-button controls) in the left sidebar. |
| `language` | `string` | Initial builder language (defaults to the first entry in `languages`). |
| `languages` | `{ code: string; label: string }[]` | Language switcher options (default: EN/JA). |
| `strings` | partial override of runtime/validation strings, keyed by language code | |
| `chrome` | partial override of builder-UI strings, keyed by language code | |
| `storage` | `StorageAdapter` | Pluggable persistence backend for the builder's own draft/Templates library — see below. |
| `onSubmit` | `(payload: SubmitPayload) => void` | Called when Preview mode's Submit button is clicked and validation passes — see below. |
| `initialDocument` | `FormDocument` | Seeds the builder with this document on mount instead of the autosaved draft — see "Programmatic integration" below. |

A `ref` on `<FormBuilder />` gives you a `FormBuilderHandle` (`getDocument()` / `loadDocument()` / `exportJson()`) — see "Programmatic integration" below.

### Persistence: `StorageAdapter`

By default the component autosaves a draft, plus a "Templates" library (up to 5 saved forms, shown via the toolbar's Templates button), to `window.localStorage`. Being local-storage-only means neither persists across devices or browsers. To persist the builder's state to your own backend (a Next.js API route, a PHP endpoint, etc.) instead — so drafts and templates are shared across devices, and your backend can populate/manage the template list itself — implement and pass a `StorageAdapter`. Its `get`/`set`/`delete` calls *are* the create/update/delete hooks: whatever your implementation does inside them (write to a database, call your API) runs on every template save/update/delete, so no separate event callbacks are needed.

```ts
interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}
```

```tsx
import { FormBuilder, type StorageAdapter } from "form-page-builder";

const apiStorage: StorageAdapter = {
  async get(key) {
    const res = await fetch(`/api/form-page-builder/${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    return (await res.json()).value ?? null;
  },
  async set(key, value) {
    await fetch(`/api/form-page-builder/${encodeURIComponent(key)}`, {
      method: "PUT",
      body: value,
    });
  },
  async delete(key) {
    await fetch(`/api/form-page-builder/${encodeURIComponent(key)}`, { method: "DELETE" });
  },
};

<FormBuilder storage={apiStorage} />;
```

This is separate from — and unrelated to — however you choose to handle real end-user form submissions in your own app; this package doesn't send or receive those on its own (see `onSubmit` below if you want Preview mode's Submit button to hand you the entered values).

### Handling submissions: `onSubmit`

A submit action lives on a **Button field** — drag one into a section from the palette (next to Paragraph/Image) and set its "When clicked" mode to Submit, with a scope of either "This section" or "Whole form". There's no document-level submit setting anymore; you can place as many buttons as you like (e.g. a per-section "Next" alongside a final "Submit", or a plain "Open link" CTA button that doesn't submit at all).

Clicking a submit-action button validates the fields in its scope and, once they pass, calls `onSubmit` with the entered values — pass this if you want to do something with them (send to your backend, log them, etc.) instead of just seeing the built-in "here's what would be sent" confirmation:

```tsx
import { FormBuilder, type SubmitPayload } from "form-page-builder";

function handleSubmit(payload: SubmitPayload) {
  // payload.buttonId: id of the button field that triggered this — use it to
  //   branch when a form has more than one submit button (e.g. "save draft" vs "submit")
  // payload.scope: "form" | "section", matching that button's own scope setting
  // payload.all: every field's raw value across the whole form, keyed by field id
  // payload.sections: the same values, broken down section by section
  // payload.values: just whatever was submitted (the whole form, or one section if scope is "section")
  console.log(payload);
}

<FormBuilder onSubmit={handleSubmit} />;
```

### Programmatic integration

Copying and pasting the "View JSON" output is fine for development, but a production integration usually wants to load and save forms through its own backend in the background instead. Two props/APIs cover that:

- `initialDocument` seeds the builder with a document (e.g. one your backend just fetched) instead of the autosaved draft.
- A ref exposes `getDocument()`, `loadDocument(doc)`, and `exportJson()` so you can pull the current document out (to save it yourself, on whatever schedule/event you choose) or push a new one in, independent of the `storage` autosave path:

```tsx
import { useEffect, useRef, useState } from "react";
import { FormBuilder, type FormBuilderHandle, type FormDocument } from "form-page-builder";

function BuilderPage() {
  const ref = useRef<FormBuilderHandle>(null);
  const [initialDocument, setInitialDocument] = useState<FormDocument>();

  useEffect(() => {
    fetch("/api/forms/123").then((r) => r.json()).then(setInitialDocument);
  }, []);

  async function saveNow() {
    if (!ref.current) return;
    await fetch("/api/forms/123", { method: "PUT", body: ref.current.exportJson() });
  }

  if (!initialDocument) return null;
  return <FormBuilder ref={ref} initialDocument={initialDocument} />;
}
```

## Using in a plain HTML page (no bundler)

There's intentionally no UMD/IIFE global-script build (see below), but you don't need a bundler to use this package — a browser-native ES module setup works too, via an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) and a CDN like [esm.sh](https://esm.sh/):

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@18",
          "react-dom/client": "https://esm.sh/react-dom@18/client",
          "form-page-builder": "https://esm.sh/form-page-builder?external=react,react-dom"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import React from "react";
      import { createRoot } from "react-dom/client";
      import { FormBuilder } from "form-page-builder";

      createRoot(document.getElementById("root")).render(
        React.createElement(FormBuilder, {})
      );
    </script>
  </body>
</html>
```

The `?external=react,react-dom` query on the `form-page-builder` import tells esm.sh to reuse the same `react`/`react-dom` module the page already imports, instead of bundling its own copy — so there's no duplicate-React problem, and no build step (Vite/Webpack/etc.) required. Since there's no JSX here, components are created with `React.createElement(...)` instead of `<FormBuilder />`; everything else (props, `storage` adapter, etc.) works the same as in the React/Next.js example above.

## Using this in a PHP app

There's no build target for raw PHP output — a React component tree still needs a JS bundler (Vite, Laravel Mix, Webpack Encore, `@wordpress/scripts`, etc.) to resolve `react`/`react-dom`/`lucide-react` and mount into a DOM node. If your PHP app already runs one of those pipelines (e.g. a Laravel + Vite or WordPress block setup), install this package the same way you would in Next.js, mount `<FormBuilder />` into a container element, and pass a `storage` adapter that calls your PHP API endpoints. There is intentionally no UMD/IIFE global-script build, since bundling React itself would risk duplicate React instances on pages that already load their own.

## Local development

```bash
npm install
npm run dev        # Vite dev harness at http://localhost:5173, imports FormBuilder from src/
npm run typecheck
npm run build       # tsup -> dist/ (ESM + CJS + .d.ts), the published package
npm run build:demo  # vite build -> pages-dist/, the GitHub Pages demo site
```

## Releasing

Versioning and the changelog are managed by [Changesets](https://github.com/changesets/changesets); publishing to npm is a separate, deliberate step.

1. On your PR, describe the change for consumers: `npx changeset` (pick patch/minor/major, write a summary, commit the generated file in `.changeset/`).
2. Once merged to `main`, a bot opens/updates a **"Version Packages"** PR that bumps `package.json` and writes `CHANGELOG.md` from the accumulated changesets ([.github/workflows/version.yml](.github/workflows/version.yml)).
3. Merge that PR when you're ready to ship.
4. Cut a [GitHub Release](https://github.com/MainSolutionCoLtd/form-page-builder/releases/new) tagged `vX.Y.Z` matching the new version — this triggers [.github/workflows/release.yml](.github/workflows/release.yml), which builds and runs `npm publish` (requires the `NPM_TOKEN` repo secret).

Pushes to `main` also rebuild and redeploy the [live demo](https://mainsolutioncoltd.github.io/form-page-builder/) via [.github/workflows/pages.yml](.github/workflows/pages.yml).
