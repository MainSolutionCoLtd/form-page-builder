import type { WidthOption } from "../types";

export const WIDTH_PERCENT: Record<WidthOption, string> = { "1/3": "33.3333%", "1/2": "50%", "2/3": "66.6667%", "1/1": "100%" };
export const ALIGN_MAP = { top: "flex-start", middle: "center", bottom: "flex-end" } as const;
