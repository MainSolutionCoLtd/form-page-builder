import { useState } from "react";
import type { Theme, ThemeOverrides } from "../types";
import { DEFAULT_THEME } from "../theme/defaultTheme";

export interface UseThemeResult {
  theme: Theme;
  themeOverrides: ThemeOverrides;
  updateThemeColor: (key: keyof Omit<Theme, "layout">, value: string) => void;
  updateThemeLayout: (key: keyof Theme["layout"], value: number) => void;
  resetTheme: () => void;
  replaceThemeOverrides: (overrides: ThemeOverrides) => void;
}

export function useTheme(themeOverrideProp?: Partial<Theme>): UseThemeResult {
  const baseTheme: Theme = {
    ...DEFAULT_THEME,
    ...(themeOverrideProp || {}),
    layout: { ...DEFAULT_THEME.layout, ...((themeOverrideProp && themeOverrideProp.layout) || {}) },
  };
  const [themeOverrides, setThemeOverrides] = useState<ThemeOverrides>({});
  const theme: Theme = {
    ...baseTheme,
    ...themeOverrides,
    layout: { ...baseTheme.layout, ...(themeOverrides.layout || {}) },
  };

  function updateThemeColor(key: keyof Omit<Theme, "layout">, value: string) {
    setThemeOverrides((prev) => ({ ...prev, [key]: value }));
  }
  function updateThemeLayout(key: keyof Theme["layout"], value: number) {
    setThemeOverrides((prev) => ({ ...prev, layout: { ...prev.layout, [key]: value } }));
  }
  function resetTheme() {
    setThemeOverrides({});
  }
  function replaceThemeOverrides(overrides: ThemeOverrides) {
    setThemeOverrides(overrides);
  }

  return { theme, themeOverrides, updateThemeColor, updateThemeLayout, resetTheme, replaceThemeOverrides };
}
