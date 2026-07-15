import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import type { ParagraphField } from "../types";

export const FONT_SIZE_OPTIONS: { value: ParagraphField["fontSize"]; label: string; px: number }[] = [
  { value: "sm", label: "S", px: 12 }, { value: "md", label: "M", px: 14 },
  { value: "lg", label: "L", px: 18 }, { value: "xl", label: "XL", px: 24 },
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
export const TAG_TO_ELEMENT: Record<ParagraphField["tag"], string> = { h1: "h1", h2: "h2", h3: "h3", p: "p", caption: "span" };
export const TAG_CHROME_KEY: Partial<Record<ParagraphField["tag"], string>> = { p: "tagBody", caption: "tagCaption" };
