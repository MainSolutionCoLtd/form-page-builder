import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import FormBuilder from "../src/FormBuilder";
import { DEFAULT_THEME } from "../src/theme/defaultTheme";
import type { FormDocument, StorageAdapter, SubmitPayload, Theme } from "../src/types";

/**
 * Each example below gets its own draft/template storage namespace so the
 * instances on this one page don't stomp each other's autosaved drafts —
 * a real embed (one `<FormBuilder />` per page) wouldn't need this.
 */
function namespacedStorage(namespace: string): StorageAdapter {
  const scopedKey = (key: string) => `form-page-builder:demo:${namespace}:${key}`;
  return {
    async get(key) {
      return window.localStorage.getItem(scopedKey(key));
    },
    async set(key, value) {
      window.localStorage.setItem(scopedKey(key), value);
    },
    async delete(key) {
      window.localStorage.removeItem(scopedKey(key));
    },
  };
}

function Example({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <section id={id} style={{ marginTop: 56, scrollMarginTop: 16 }}>
      <h2 style={{ marginBottom: 4, fontSize: 20 }}>{title}</h2>
      <p style={{ marginTop: 0, marginBottom: 16, maxWidth: 760, color: "#555", fontSize: 14, lineHeight: 1.5 }}>
        {description}
      </p>
      {children}
    </section>
  );
}

const brandTheme: Partial<Theme> = {
  primary: "#7c3aed",
  primarySoft: "#ede9fe",
  ink: "#1e1b2e",
  surface: "#ffffff",
  canvas: "#faf5ff",
  pageBackground: "#f5f3ff",
};

/**
 * A backend-provided document seeding a "restyle only" configurator — see
 * the "Locked-structure form" example below. Hand-built to the public
 * `FormDocument` shape, the same way a consumer's own API response would be.
 */
const jobApplicationDocument: FormDocument = {
  version: 5,
  title: { en: "Job Application" },
  themeOverrides: {},
  theme: DEFAULT_THEME,
  sections: [
    {
      id: "s1",
      title: { en: "Applicant details" },
      background: "",
      collapsed: false,
      fields: [
        {
          id: "f1", type: "paragraph", label: { en: "" }, hideLabel: true,
          width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type",
          content: { en: "Tell us a bit about yourself and the role you're applying for." },
          tag: "p", fontSize: "md", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "",
        },
        {
          id: "f2", type: "input", label: { en: "Full name" }, hideLabel: false,
          width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: true, displayIcon: "User",
          inputType: "text", placeholder: { en: "" }, defaultValue: "", required: true,
        },
        {
          id: "f3", type: "input", label: { en: "Email" }, hideLabel: false,
          width: "1/2", verticalAlign: "top", labelPosition: "top", showIcon: true, displayIcon: "Mail",
          inputType: "email", placeholder: { en: "" }, defaultValue: "", required: true,
        },
        {
          id: "f4", type: "select", label: { en: "Position" }, hideLabel: false,
          width: "1/2", verticalAlign: "top", labelPosition: "top", showIcon: true, displayIcon: "Briefcase",
          options: [
            { label: { en: "Engineering" }, value: "engineering" },
            { label: { en: "Design" }, value: "design" },
            { label: { en: "Support" }, value: "support" },
          ],
          defaultValue: "engineering", required: true,
        },
        {
          id: "f5", type: "button", label: { en: "Submit application" }, hideLabel: false,
          width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type",
          action: "submit", buttonStyle: { color: "", size: "md" }, href: "", target: "_self", submitScope: "form",
        },
      ],
    },
  ],
};

const container = document.getElementById("root");
if (!container) throw new Error("#root element not found");

createRoot(container).render(
  <StrictMode>
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 4 }}>form-page-builder — examples</h1>
      <p style={{ marginTop: 0, color: "#555", maxWidth: 760 }}>
        The same <code>&lt;FormBuilder /&gt;</code> component, configured a few different ways via its{" "}
        <code>features</code>, <code>theme</code>, <code>storage</code>, <code>initialDocument</code>, and{" "}
        <code>language</code>/<code>strings</code>/<code>chrome</code> props — see the README for the full prop
        reference.
      </p>

      <Example
        id="full-featured"
        title="Full-featured (default)"
        description="Every toolbar action, the Design tab, and all block/field types available — this is what <FormBuilder /> looks like with no props at all (aside from turning the Design tab on, since that one defaults to off)."
      >
        <FormBuilder features={{ design: true }} storage={namespacedStorage("full")} />
      </Example>

      <Example
        id="minimal"
        title="Minimal (forms-only embed)"
        description="Everything optional is switched off — no title editing, no templates/JSON/preview chrome, no theming UI, no sections or drag-reorder — leaving just a bare palette of three field types. A good starting point for embedding the builder inside a larger app that provides its own chrome."
      >
        <FormBuilder
          features={{
            naming: false,
            templates: false,
            newForm: false,
            autosave: false,
            jsonView: false,
            previewMode: false,
            languageSwitcher: false,
            design: false,
            blockStyling: false,
            contentBlocks: false,
            fieldTypes: ["input", "select", "checkbox"],
            sections: false,
            dragReorder: false,
          }}
        />
      </Example>

      <Example
        id="branded"
        title="Branded, theme locked"
        description="A fixed brand theme is passed via `theme`, and `features.design`/`features.blockStyling` are both off — so whoever builds forms here can't touch a single color, they inherit the brand automatically. `theme` and `features` are independent: this is the 'lock the look, keep the rest' combination called out in the README's Features vs. theming section."
      >
        <FormBuilder theme={brandTheme} features={{ design: false, blockStyling: false }} storage={namespacedStorage("branded")} />
      </Example>

      <Example
        id="survey"
        title="Survey builder"
        description="`fieldTypes` is restricted to question-style inputs, `contentBlocks` allows only a Button (for the Submit action, no decorative paragraphs/images), and sections/drag-reorder/templates are all off — every survey built here has the same one-section shape. `onSubmit` logs the submitted answers to the console instead of just showing the built-in confirmation."
      >
        <FormBuilder
          features={{
            templates: false,
            newForm: false,
            jsonView: false,
            design: false,
            contentBlocks: ["button"],
            fieldTypes: ["input", "textarea", "select", "radio", "checkboxGroup"],
            sections: false,
            dragReorder: false,
          }}
          onSubmit={(payload: SubmitPayload) => console.log("[survey] submitted", payload)}
          storage={namespacedStorage("survey")}
        />
      </Example>

      <Example
        id="locked-structure"
        title="Locked-structure form (initialDocument)"
        description="Seeded via `initialDocument` with a fixed set of fields — as if fetched from your own backend — and `contentBlocks`/`fieldTypes`/`sections`/`dragReorder`/`naming`/`templates`/`newForm` are all off, so the structure can't change. `blockStyling` stays on, so this is purely a 'restyle the fields you were given' configurator; pair with the ref's `getDocument()`/`exportJson()` (see README 'Programmatic integration') to save changes back."
      >
        <FormBuilder
          initialDocument={jobApplicationDocument}
          features={{
            naming: false,
            templates: false,
            newForm: false,
            design: false,
            contentBlocks: false,
            fieldTypes: false,
            sections: false,
            dragReorder: false,
          }}
          storage={namespacedStorage("job-application")}
        />
      </Example>

      <Example
        id="localized"
        title="Localized (French)"
        description="`language`/`languages` set the initial and available UI languages beyond the built-in EN/JA, and `strings`/`chrome` supply French text for the bits shown here — anything left untranslated quietly falls back to English rather than breaking, so a partial translation is enough to get started."
      >
        <FormBuilder
          language="fr"
          languages={[{ code: "en", label: "EN" }, { code: "fr", label: "FR" }]}
          chrome={{
            fr: {
              build: "Créer", preview: "Aperçu", newForm: "Nouveau", templates: "Modèles", save: "Enregistrer",
              viewJson: "Voir le JSON", label: "Étiquette", required: "requis", addSection: "Ajouter une section",
              properties: "Propriétés", selectFieldHint: "Sélectionnez un champ pour modifier ses propriétés.",
            },
          }}
          strings={{
            fr: {
              submit: "Envoyer", selectPlaceholder: "Sélectionner...", requiredError: "Ce champ est requis.",
              close: "Fermer",
            },
          }}
          storage={namespacedStorage("fr")}
        />
      </Example>
    </div>
  </StrictMode>,
);
