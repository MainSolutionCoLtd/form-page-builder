import { StrictMode, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import FormBuilder from "../src/FormBuilder";
import { DEFAULT_THEME } from "../src/theme/defaultTheme";
import { DARK_THEME } from "../src/theme/darkTheme";
import type { FormDocument, StorageAdapter, SubmitPayload, Theme } from "../src/types";

type UiLang = "en" | "ja";

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

const DEMO_STRINGS = {
  en: {
    title: "form-page-builder — examples",
    intro:
      "The same <FormBuilder /> component, configured a few different ways via its features, theme, storage, initialDocument, and language/strings/chrome props — see the README for the full prop reference.",
    dark: "Dark", light: "Light",
    examples: {
      full: {
        title: "Full-featured (default)",
        description:
          "Every toolbar action, the Design tab, and all block/field types available — this is what <FormBuilder /> looks like with no props at all (aside from turning the Design tab on, since that one defaults to off).",
      },
      minimal: {
        title: "Minimal (forms-only embed)",
        description:
          "Everything optional is switched off — no title editing, no templates/JSON/preview chrome, no theming UI, no sections or drag-reorder — leaving just a bare palette of three field types. A good starting point for embedding the builder inside a larger app that provides its own chrome.",
      },
      branded: {
        title: "Branded, theme locked",
        description:
          "A fixed brand theme is passed via `theme`, and `features.design`/`features.blockStyling` are both off — so whoever builds forms here can't touch a single color, they inherit the brand automatically. `theme` and `features` are independent: this is the 'lock the look, keep the rest' combination called out in the README's Features vs. theming section. This one's theme is intentionally fixed, so it ignores the page's dark-mode toggle above.",
      },
      survey: {
        title: "Survey builder",
        description:
          "`fieldTypes` is restricted to question-style inputs, `contentBlocks` allows only a Button (for the Submit action, no decorative paragraphs/images), and sections/drag-reorder/templates are all off — every survey built here has the same one-section shape. `onSubmit` logs the submitted answers to the console instead of just showing the built-in confirmation.",
      },
      locked: {
        title: "Locked-structure form (initialDocument)",
        description:
          "Seeded via `initialDocument` with a fixed set of fields — as if fetched from your own backend — and `contentBlocks`/`fieldTypes`/`sections`/`dragReorder`/`naming`/`templates`/`newForm` are all off, so the structure can't change. `blockStyling` stays on, so this is purely a 'restyle the fields you were given' configurator; pair with the ref's `getDocument()`/`exportJson()` (see README 'Programmatic integration') to save changes back.",
      },
      localized: {
        title: "Localized (French)",
        description:
          "`language`/`languages` set the initial and available UI languages beyond the built-in EN/JA, and `strings`/`chrome` supply French text for the bits shown here — anything left untranslated quietly falls back to English rather than breaking, so a partial translation is enough to get started.",
      },
    },
  },
  ja: {
    title: "form-page-builder — 使用例",
    intro:
      "同じ <FormBuilder /> コンポーネントを、features・theme・storage・initialDocument・language/strings/chrome の各propで様々な形に設定した例です — propの全リファレンスはREADMEを参照してください。",
    dark: "ダーク", light: "ライト",
    examples: {
      full: {
        title: "フル機能（デフォルト）",
        description:
          "すべてのツールバー操作、Designタブ、すべてのブロック/フィールドタイプが利用可能です — propsを一切渡さない場合の <FormBuilder /> はこの状態になります（Designタブはデフォルトで無効なので、そこだけ design: true で有効化しています）。",
      },
      minimal: {
        title: "ミニマル（フォーム専用埋め込み）",
        description:
          "オプション機能をすべて無効化しています — タイトル編集なし、テンプレート/JSON/プレビューのUIなし、テーマ編集UIなし、セクションやドラッグ並べ替えもなし — 残るのは3種類のフィールドだけのシンプルなパレットです。独自のUIを持つ大きなアプリにビルダーを埋め込む際の出発点として最適です。",
      },
      branded: {
        title: "ブランド固定テーマ",
        description:
          "theme で固定のブランドテーマを渡し、features.design / features.blockStyling を両方オフにしています — フォームを作成するユーザーは色を一切変更できず、自動的にブランドカラーを継承します。theme と features は独立した仕組みで、これはREADMEの「Features vs. theming」で紹介されている『見た目を固定し、それ以外は自由に』という組み合わせです。このテーマは意図的に固定されているため、上のダーク切り替えの影響を受けません。",
      },
      survey: {
        title: "アンケートビルダー",
        description:
          "fieldTypes を質問向けの入力タイプに制限し、contentBlocks はSubmit用のButtonのみ許可（装飾用の段落や画像は不可）、セクション/ドラッグ並べ替え/テンプレートもすべてオフにしています — ここで作られるアンケートは常に同じ1セクション構成になります。onSubmit は、組み込みの確認表示の代わりに送信内容をコンソールへログ出力します。",
      },
      locked: {
        title: "構造固定フォーム（initialDocument）",
        description:
          "自社バックエンドから取得したかのような固定フィールド構成を initialDocument で読み込み、contentBlocks / fieldTypes / sections / dragReorder / naming / templates / newForm をすべてオフにして構造を変更できないようにしています。blockStyling はオンのままなので、これは『与えられたフィールドのスタイルだけを調整できる』構成です。変更内容を保存するには refの getDocument() / exportJson()（READMEの「Programmatic integration」参照）と組み合わせてください。",
      },
      localized: {
        title: "多言語対応（フランス語）",
        description:
          "language / languages で、標準搭載のEN/JA以外の言語を初期言語・選択可能言語として設定できます。strings / chrome でここに表示される部分のフランス語訳を渡していますが、未翻訳の項目は静かに英語へフォールバックするため、壊れることなく部分的な翻訳から始められます。",
      },
    },
  },
} as const;

function Example({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <section id={id} style={{ marginTop: 56, scrollMarginTop: 16 }}>
      <h2 style={{ marginBottom: 4, fontSize: 20 }}>{title}</h2>
      <p style={{ marginTop: 0, marginBottom: 16, maxWidth: 760, color: "var(--demo-muted)", fontSize: 14, lineHeight: 1.5 }}>
        {description}
      </p>
      {children}
    </section>
  );
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: `1px solid ${active ? "#7c7fee" : "var(--demo-border)"}`,
        background: active ? "#7c7fee" : "transparent",
        color: active ? "#fff" : "var(--demo-ink)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function DemoApp() {
  const [uiLang, setUiLang] = useState<UiLang>("en");
  const [dark, setDark] = useState(false);
  const s = DEMO_STRINGS[uiLang];
  const theme = dark ? DARK_THEME : undefined;

  return (
    <div
      style={{
        "--demo-bg": dark ? "#0f1015" : "#ffffff",
        "--demo-ink": dark ? "#e8e9ee" : "#111111",
        "--demo-muted": dark ? "#9096a8" : "#555555",
        "--demo-border": dark ? "#2e313d" : "#dddddd",
        background: "var(--demo-bg)",
        color: "var(--demo-ink)",
        minHeight: "100vh",
      } as React.CSSProperties}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>{s.title}</h1>
            <p style={{ marginTop: 0, color: "var(--demo-muted)", maxWidth: 760 }}>{s.intro}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <ToggleButton active={uiLang === "en"} onClick={() => setUiLang("en")}>EN</ToggleButton>
            <ToggleButton active={uiLang === "ja"} onClick={() => setUiLang("ja")}>日本語</ToggleButton>
            <span style={{ width: 1, background: "var(--demo-border)", margin: "0 4px" }} />
            <ToggleButton active={!dark} onClick={() => setDark(false)}>{s.light}</ToggleButton>
            <ToggleButton active={dark} onClick={() => setDark(true)}>{s.dark}</ToggleButton>
          </div>
        </div>

        <Example id="full-featured" title={s.examples.full.title} description={s.examples.full.description}>
          <FormBuilder features={{ design: true }} theme={theme} storage={namespacedStorage("full")} />
        </Example>

        <Example id="minimal" title={s.examples.minimal.title} description={s.examples.minimal.description}>
          <FormBuilder
            theme={theme}
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

        <Example id="branded" title={s.examples.branded.title} description={s.examples.branded.description}>
          <FormBuilder theme={brandTheme} features={{ design: false, blockStyling: false }} storage={namespacedStorage("branded")} />
        </Example>

        <Example id="survey" title={s.examples.survey.title} description={s.examples.survey.description}>
          <FormBuilder
            theme={theme}
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

        <Example id="locked-structure" title={s.examples.locked.title} description={s.examples.locked.description}>
          <FormBuilder
            theme={theme}
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

        <Example id="localized" title={s.examples.localized.title} description={s.examples.localized.description}>
          <FormBuilder
            theme={theme}
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
    </div>
  );
}

const container = document.getElementById("root");
if (!container) throw new Error("#root element not found");

createRoot(container).render(
  <StrictMode>
    <DemoApp />
  </StrictMode>,
);
