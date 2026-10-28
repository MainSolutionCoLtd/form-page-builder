import type { CSSProperties, ElementType, ReactNode } from "react";
import type { FieldPatch, LocalizedString, SubmitStyle, ThemeOverrides } from "./types";
import { ALIGN_MAP } from "./constants/widths";
import { TAG_TO_ELEMENT } from "./constants/typographyScale";
import { buttonStyle, imageStyle, paragraphStyle } from "./lib/blockStyle";
import { resolveTheme, themeVars } from "./lib/resolveTheme";
import { defaultSanitizeUrl, safeColor, type UrlKind } from "./lib/safeUrl";

// Read-only, server-renderable view of a document: no hooks, no state, no icons, no editor chrome.
// Only content blocks (paragraph, image, link button) are drawn; form inputs and submit buttons are skipped.

/** A stored field: any subset of the field props (compacted documents omit defaults). */
export type ViewerField = Omit<FieldPatch, "buttonStyle"> & { id?: string; type: string; buttonStyle?: Partial<SubmitStyle> };
export interface ViewerSection {
  id?: string;
  title?: LocalizedString | string;
  background?: string;
  fields?: ViewerField[];
}
/** What `getDocument()` returns, or what you stored (compacted or not). Extra keys are ignored. */
export interface ViewerDocument {
  title?: LocalizedString | string;
  themeOverrides?: ThemeOverrides;
  sections?: ViewerSection[];
}

export interface FormViewerProps {
  document: ViewerDocument | null | undefined;
  /** Language code to read translations in. Falls back to `en`, then to any translation that has text. Default `en`. */
  language?: string;
  /** Base theme, under the document's own `themeOverrides`. Values may be `var(--x)` references. */
  theme?: ThemeOverrides;
  /** Max width of the page: a number is px, a string is any CSS length. Defaults to the theme's `layout.maxWidth`. */
  maxWidth?: number | string;
  /** `none` (default) draws no title; `visible` draws it as an h1; `auto` draws a visually hidden h1 only when the document has no h1 block. */
  titleDisplay?: "none" | "visible" | "auto";
  /** Draw section titles (h2). Default true. */
  sectionTitles?: boolean;
  /** Decides which URLs reach `href`/`src`; return null to drop one. Default: `defaultSanitizeUrl`. */
  sanitizeUrl?: (url: string, kind: UrlKind) => string | null;
  /** `rel` of links that open a new tab. Default `noopener noreferrer`. */
  linkRel?: string;
  /** How many leading images load eagerly (the rest are lazy). Default 1. */
  eagerImages?: number;
  /** Wrapper element. Default `div`. */
  as?: "div" | "article" | "main" | "section";
  className?: string;
  style?: CSSProperties;
}

const CSS = `
.fpbv{container-type:inline-size;box-sizing:border-box;width:100%;margin:0 auto;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:var(--fb-ink)}
.fpbv *,.fpbv *::before,.fpbv *::after{box-sizing:border-box}
.fpbv-s{display:flex;flex-wrap:wrap;gap:var(--fb-space-field)}
.fpbv-s-t{margin:0 0 12px;font-size:15px;font-weight:700;color:var(--fb-ink);flex:0 0 100%}
.fpbv-f{min-width:0;flex:0 0 100%}
.fpbv-f.w2{flex-basis:calc(50% - var(--fb-space-field) / 2)}
.fpbv-f.w3{flex-basis:calc(33.3333% - var(--fb-space-field) * 2 / 3)}
.fpbv-p{overflow-wrap:anywhere}
.fpbv-a{display:block;text-decoration:none}
.fpbv-b{display:block;text-align:center;text-decoration:none}
.fpbv-b:hover{opacity:.9}
.fpbv-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@container (max-width:720px){.fpbv-f.w3{flex-basis:calc(50% - var(--fb-space-field) / 2)}}
@container (max-width:480px){.fpbv-f.w2,.fpbv-f.w3{flex-basis:100%}}
`;

const text = (value: LocalizedString | string | undefined, language: string): string => {
  if (typeof value === "string") return value;
  if (!value) return "";
  return value[language] || value.en || Object.values(value).find(Boolean) || "";
};

const WIDTH_CLASS = { "1/3": "w3", "1/2": "w2", "1/1": "" } as const;

const isH1 = (f: ViewerField, language: string) => f.type === "paragraph" && f.tag === "h1" && !!text(f.content, language);

export function FormViewer({
  document: doc, language = "en", theme, maxWidth, titleDisplay = "none", sectionTitles = true,
  sanitizeUrl = defaultSanitizeUrl, linkRel = "noopener noreferrer", eagerImages = 1, as: Root = "div", className, style,
}: FormViewerProps) {
  const resolved = resolveTheme(theme, doc?.themeOverrides);
  const sections = doc?.sections ?? [];
  const title = text(doc?.title, language);
  const hasH1 = sections.some((s) => s.fields?.some((f) => isH1(f, language)));
  let imagesSeen = 0;

  const renderField = (field: ViewerField): ReactNode => {
    if (field.type === "paragraph") {
      const content = text(field.content, language);
      if (!content) return null;
      const Tag = (TAG_TO_ELEMENT[field.tag ?? "p"] || "p") as ElementType;
      return <Tag className="fpbv-p" style={paragraphStyle({ ...field, color: safeColor(field.color) })}>{content}</Tag>;
    }

    if (field.type === "image") {
      const src = field.src ? sanitizeUrl(field.src, "image") : null;
      if (!src) return null;
      const eager = imagesSeen++ < eagerImages;
      const img = <img src={src} alt={text(field.alt, language)} loading={eager ? "eager" : "lazy"} decoding="async" style={imageStyle(field)} />;
      const href = field.link ? sanitizeUrl(field.link, "link") : null;
      return href ? <a className="fpbv-a" href={href} target="_blank" rel={linkRel}>{img}</a> : img;
    }

    if (field.type === "button") {
      if (field.action === "submit") return null;
      const href = field.href ? sanitizeUrl(field.href, "link") : null;
      const label = text(field.label, language);
      if (!href || !label) return null;
      const blank = field.target === "_blank";
      return (
        <a
          className="fpbv-b" href={href} {...(blank ? { target: "_blank", rel: linkRel } : {})}
          style={{ ...buttonStyle({ buttonStyle: { ...field.buttonStyle, color: safeColor(field.buttonStyle?.color) } }), marginTop: 0 }}
        >
          {label}
        </a>
      );
    }

    return null;
  };

  const rootStyle = {
    ...themeVars(resolved),
    maxWidth: maxWidth ?? resolved.layout.maxWidth,
    padding: "var(--fb-space-page)",
    background: "var(--fb-page-bg)",
    ...style,
  } as CSSProperties;

  return (
    <Root className={className ? `fpbv ${className}` : "fpbv"} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {title && titleDisplay !== "none" && (titleDisplay === "visible" || !hasH1) && (
        <h1 className={titleDisplay === "auto" ? "fpbv-sr" : undefined} style={titleDisplay === "visible" ? { margin: "0 0 20px", fontSize: 24, fontWeight: 700 } : undefined}>{title}</h1>
      )}
      {sections.map((section, i) => {
        const blocks = (section.fields ?? []).map((field, j) => {
          const node = renderField(field);
          if (!node) return null;
          const width = WIDTH_CLASS[field.width ?? "1/1"] ?? "";
          return (
            <div
              key={field.id ?? j} className={width ? `fpbv-f ${width}` : "fpbv-f"} data-field-id={field.id} data-field-type={field.type}
              style={{ alignSelf: ALIGN_MAP[field.verticalAlign ?? "top"] }}
            >
              {node}
            </div>
          );
        });
        if (blocks.every((b) => b === null)) return null;
        const heading = sectionTitles ? text(section.title, language) : "";
        const background = safeColor(section.background);
        return (
          <section
            key={section.id ?? i} className="fpbv-s" data-section-id={section.id}
            style={{ marginBottom: "var(--fb-space-section)", ...(background ? { background, padding: 16, borderRadius: 10 } : {}) }}
          >
            {heading && <h2 className="fpbv-s-t">{heading}</h2>}
            {blocks}
          </section>
        );
      })}
    </Root>
  );
}
