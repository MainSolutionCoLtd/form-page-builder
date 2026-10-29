import type { Theme, ThemeOverrides } from "../types";
import { DEFAULT_THEME } from "../theme/defaultTheme";
import { mixHex } from "./color";
import { DEFAULT_IMAGE_MAX_WIDTH } from "./blockStyle";

/** `DEFAULT_THEME`, then `base`, then `overrides` (layout merged key by key). */
export function resolveTheme(base?: ThemeOverrides, overrides?: ThemeOverrides): Theme {
  return {
    ...DEFAULT_THEME,
    ...(base || {}),
    ...(overrides || {}),
    layout: { ...DEFAULT_THEME.layout, ...(base?.layout || {}), ...(overrides?.layout || {}) },
  };
}

/** The `--fb-*` custom properties every builder/viewer root exposes to its children. */
export function themeVars(theme: Theme): Record<string, string> {
  return {
    "--fb-primary": theme.primary, "--fb-primary-soft": theme.primarySoft,
    "--fb-danger": theme.danger, "--fb-danger-soft": theme.dangerSoft,
    "--fb-ink": theme.ink, "--fb-muted": theme.muted, "--fb-border": theme.border,
    "--fb-surface": theme.surface, "--fb-canvas": theme.canvas, "--fb-page-bg": theme.pageBackground,
    "--fb-surface-2": mixHex(theme.surface, theme.ink, 0.06),
    "--fb-space-page": `${theme.layout.pagePadding}px`, "--fb-space-canvas": `${theme.layout.canvasPadding}px`,
    "--fb-space-section": `${theme.layout.sectionGap}px`, "--fb-space-field": `${theme.layout.fieldGap}px`,
    "--fb-space-toolbar": `${theme.layout.toolbarPadding}px`, "--fb-space-panel": `${theme.layout.panelPadding}px`,
    "--fb-space-ticket": `${theme.layout.ticketPadding}px`,
    "--fb-image-max": `${theme.layout.imageMaxWidth ?? DEFAULT_IMAGE_MAX_WIDTH}px`,
  };
}
