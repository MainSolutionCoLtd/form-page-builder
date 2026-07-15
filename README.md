# form-page-builder

[![npm](https://img.shields.io/npm/v/form-page-builder.svg)](https://www.npmjs.com/package/form-page-builder)
[![CI](https://github.com/MainSolutionCoLtd/form-page-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/MainSolutionCoLtd/form-page-builder/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/form-page-builder.svg)](./LICENSE)

**[Live demo](https://mainsolutioncoltd.github.io/form-page-builder/)**

Embeddable, bilingual (EN/JA by default, extensible), drag-and-drop form builder widget for React. Ships a single `<FormBuilder />` component with a Build mode (drag/drop canvas, field inspector) and a Preview mode (responsive, validating runtime form), plus a JSON export of the resulting document.

**This is a builder + viewer, not a data handler.** It builds and previews a JSON *schema* describing a form's fields, sections, and layout blocks (including plain content blocks like paragraphs and images, not just inputs). It never receives or stores real end-user submissions — Preview mode's "Submit" just shows a mock "here's what would be sent to your backend" modal. The only thing this package persists on its own is the *builder's own* draft/library state (via the pluggable `StorageAdapter` below); wiring actual form submissions to a backend is up to the host app.

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

### Props

| Prop | Type | Description |
|---|---|---|
| `theme` | `Partial<Theme>` | Override default colors/layout spacing. |
| `themeEditable` | `boolean` | Show an in-app theme/spacing editor popover in the toolbar. |
| `language` | `string` | Initial builder language (defaults to the first entry in `languages`). |
| `languages` | `{ code: string; label: string }[]` | Language switcher options (default: EN/JA). |
| `strings` | partial override of runtime/validation strings, keyed by language code | |
| `chrome` | partial override of builder-UI strings, keyed by language code | |
| `storage` | `StorageAdapter` | Pluggable persistence backend for the builder's own draft/library — see below. |

### Persistence: `StorageAdapter`

By default the component autosaves a draft and a "saved forms" library to `window.localStorage`. To persist the builder's state to your own backend (a Next.js API route, a PHP endpoint, etc.) instead — for example to share drafts across devices — implement and pass a `StorageAdapter`:

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

This is separate from — and unrelated to — however you choose to handle real end-user form submissions in your own app; this package doesn't send or receive those.

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
