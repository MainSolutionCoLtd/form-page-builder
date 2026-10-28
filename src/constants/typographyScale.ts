import type { ParagraphField } from "../types";

// Pure (no icons) so the server-safe viewer can import it.
export const FONT_SIZE_PX: Record<ParagraphField["fontSize"], number> = { sm: 12, md: 14, lg: 18, xl: 24 };
export const TAG_TO_ELEMENT: Record<ParagraphField["tag"], string> = { h1: "h1", h2: "h2", h3: "h3", p: "p", caption: "span" };
