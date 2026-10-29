import type { CSSProperties } from "react";
import type { ImageField, ParagraphField, SubmitStyle } from "../types";
import { FONT_SIZE_PX } from "../constants/typographyScale";
import { resolveSubmitStyle } from "../constants/submitStyle";

// Style of each content block, shared by the editor preview and the read-only FormViewer so they cannot drift.

export function paragraphStyle(field: Partial<Pick<ParagraphField, "fontSize" | "fontWeight" | "fontStyle" | "textAlign" | "color">>): CSSProperties {
  return {
    margin: 0, whiteSpace: "pre-wrap", fontSize: FONT_SIZE_PX[field.fontSize ?? "md"] || 14,
    fontWeight: field.fontWeight === "bold" ? 700 : 400, fontStyle: field.fontStyle === "italic" ? "italic" : "normal",
    textAlign: field.textAlign || "left", color: field.color || "var(--fb-ink)", lineHeight: 1.6,
  };
}

/** Default for `theme.layout.imageMaxWidth`: square and circle images never grow past this, however wide their column is. */
export const DEFAULT_IMAGE_MAX_WIDTH = 480;

// Width follows the grid column; height comes from aspect-ratio. Square/circle are capped and centred so a full-width
// column on a wide screen does not produce a page-tall picture; `auto` keeps the picture's own proportions.
export function imageStyle(field: Partial<Pick<ImageField, "shape">>): CSSProperties {
  const shape = field.shape ?? "square";
  const base: CSSProperties = { width: "100%", display: "block", borderRadius: shape === "circle" ? "50%" : 8, background: "var(--fb-canvas)" };
  if (shape === "banner") return { ...base, aspectRatio: "16 / 5", objectFit: "cover" };
  if (shape === "auto") return { ...base, height: "auto", maxHeight: "min(70vh, 640px)", objectFit: "contain" };
  return { ...base, aspectRatio: "1 / 1", objectFit: "cover", maxWidth: `var(--fb-image-max, ${DEFAULT_IMAGE_MAX_WIDTH}px)`, marginInline: "auto" };
}

export const BUTTON_BASE_STYLE: CSSProperties = { marginTop: 8, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, width: "100%" };

export function buttonStyle(field: { buttonStyle?: Partial<SubmitStyle> }): CSSProperties {
  return { ...BUTTON_BASE_STYLE, ...resolveSubmitStyle(field.buttonStyle) };
}
