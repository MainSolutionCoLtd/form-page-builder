import type { Theme } from "../types";
import { DEFAULT_THEME } from "./defaultTheme";

/** A ready-made dark palette — pass as the `theme` prop for a dark-mode `<FormBuilder />`. */
export const DARK_THEME: Theme = {
  primary: "#8B8FF5", primarySoft: "#262A45", danger: "#F0715B", dangerSoft: "#3A2420",
  ink: "#EDEEF2", muted: "#9096A8", border: "#2E313D", surface: "#1A1B23",
  canvas: "#121319", pageBackground: "#1A1B23",
  layout: DEFAULT_THEME.layout,
};
