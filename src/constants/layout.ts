import { Monitor, Tablet, Smartphone } from "lucide-react";
import type { WidthOption } from "../types";
import type { ChromeShape } from "../i18n/chrome";
import { DEFAULT_THEME } from "../theme/defaultTheme";

export const WIDTH_OPTIONS: { value: WidthOption; label?: string; labelKey?: string }[] = [
  { value: "1/3", label: "1/3" }, { value: "1/2", label: "1/2" }, { value: "1/1", labelKey: "full" },
];
export const WIDTH_PERCENT: Record<WidthOption, string> = { "1/3": "33.3333%", "1/2": "50%", "1/1": "100%" };
export const ALIGN_MAP = { top: "flex-start", middle: "center", bottom: "flex-end" } as const;

export function effectiveWidth(width: WidthOption | undefined, device: string): WidthOption {
  if (device === "mobile") return "1/1";
  if (device === "tablet" && width === "1/3") return "1/2";
  return width || "1/1";
}

export const SPACING_FIELDS = [
  { key: "pagePadding", labelKey: "spacingPagePadding" },
  { key: "canvasPadding", labelKey: "spacingCanvasPadding" },
  { key: "sectionGap", labelKey: "spacingSectionGap" },
  { key: "fieldGap", labelKey: "spacingFieldGap" },
  { key: "toolbarPadding", labelKey: "spacingToolbarPadding" },
  { key: "panelPadding", labelKey: "spacingPanelPadding" },
  { key: "ticketPadding", labelKey: "spacingTicketPadding" },
] as const;

export interface DeviceOption {
  value: "laptop" | "tablet" | "mobile";
  label: string;
  icon: typeof Monitor;
  maxWidth: number;
}

export function buildDeviceOptions(baseMaxWidth: number, chrome: ChromeShape): DeviceOption[] {
  const mw = Number(baseMaxWidth) > 0 ? baseMaxWidth : DEFAULT_THEME.layout.maxWidth;
  return [
    { value: "laptop", label: chrome.deviceLaptop, icon: Monitor, maxWidth: mw },
    { value: "tablet", label: chrome.deviceTablet, icon: Tablet, maxWidth: Math.min(mw, 480) },
    { value: "mobile", label: chrome.deviceMobile, icon: Smartphone, maxWidth: Math.min(mw, 340) },
  ];
}
