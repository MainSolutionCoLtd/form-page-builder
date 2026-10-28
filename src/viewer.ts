// Server-safe entry (`form-page-builder/viewer`): the read-only viewer only — no editor, no "use client".
export { FormViewer } from "./FormViewer";
export type { FormViewerProps, ViewerDocument, ViewerSection, ViewerField } from "./FormViewer";
export { defaultSanitizeUrl, safeColor } from "./lib/safeUrl";
export type { UrlKind } from "./lib/safeUrl";
export { DEFAULT_THEME } from "./theme/defaultTheme";
export type { Theme, ThemeOverrides, LocalizedString } from "./types";
