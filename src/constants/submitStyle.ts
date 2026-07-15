import type { SubmitStyle } from "../types";

export const SUBMIT_SIZE_OPTIONS: { value: SubmitStyle["size"]; label: string }[] = [
  { value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" },
];
export const SUBMIT_SIZE_STYLES: Record<SubmitStyle["size"], { padding: string; fontSize: number }> = {
  sm: { padding: "7px 12px", fontSize: 12.5 }, md: { padding: "10px 16px", fontSize: 13.5 }, lg: { padding: "13px 22px", fontSize: 15 },
};

export function resolveSubmitStyle(style: Partial<SubmitStyle> | null | undefined) {
  const sizeStyle = SUBMIT_SIZE_STYLES[style?.size || "md"] || SUBMIT_SIZE_STYLES.md;
  return { ...sizeStyle, background: style?.color || "var(--fb-primary)" };
}
