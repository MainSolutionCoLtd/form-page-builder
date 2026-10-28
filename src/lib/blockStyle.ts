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

// No fixed pixel dimensions: width follows the grid column, height comes from aspect-ratio.
export function imageStyle(field: Partial<Pick<ImageField, "shape">>): CSSProperties {
  return {
    width: "100%", aspectRatio: field.shape === "banner" ? "16 / 5" : "1 / 1", objectFit: "cover", display: "block",
    borderRadius: field.shape === "circle" ? "50%" : 8, background: "var(--fb-canvas)",
  };
}

export const BUTTON_BASE_STYLE: CSSProperties = { marginTop: 8, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, width: "100%" };

export function buttonStyle(field: { buttonStyle?: Partial<SubmitStyle> }): CSSProperties {
  return { ...BUTTON_BASE_STYLE, ...resolveSubmitStyle(field.buttonStyle) };
}
