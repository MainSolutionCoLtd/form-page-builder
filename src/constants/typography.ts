import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import type { ParagraphField } from "../types";
import { FONT_SIZE_PX, TAG_TO_ELEMENT } from "./typographyScale";

export { TAG_TO_ELEMENT };

export const FONT_SIZE_OPTIONS: { value: ParagraphField["fontSize"]; label: string; px: number }[] = [
  { value: "sm", label: "S", px: FONT_SIZE_PX.sm }, { value: "md", label: "M", px: FONT_SIZE_PX.md },
  { value: "lg", label: "L", px: FONT_SIZE_PX.lg }, { value: "xl", label: "XL", px: FONT_SIZE_PX.xl },
];
export const TEXT_ALIGN_OPTIONS: { value: ParagraphField["textAlign"]; label: string; icon: typeof AlignLeft }[] = [
  { value: "left", label: "", icon: AlignLeft }, { value: "center", label: "", icon: AlignCenter }, { value: "right", label: "", icon: AlignRight },
];

export const PARAGRAPH_TAG_OPTIONS: ParagraphField["tag"][] = ["h1", "h2", "h3", "p", "caption"];
export const TAG_PRESETS: Record<ParagraphField["tag"], { fontSize: ParagraphField["fontSize"]; fontWeight: ParagraphField["fontWeight"] }> = {
  h1: { fontSize: "xl", fontWeight: "bold" }, h2: { fontSize: "lg", fontWeight: "bold" },
  h3: { fontSize: "md", fontWeight: "bold" }, p: { fontSize: "md", fontWeight: "normal" },
  caption: { fontSize: "sm", fontWeight: "normal" },
};
export const TAG_CHROME_KEY: Partial<Record<ParagraphField["tag"], string>> = { p: "tagBody", caption: "tagCaption" };
