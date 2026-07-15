import { useState } from "react";
import { Ruler, RotateCcw } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { Theme } from "../types";
import { BUTTON_COLOR_SWATCHES, SECTION_BG_SWATCHES } from "../constants/colors";
import { SPACING_FIELDS } from "../constants/layout";
import { DEFAULT_THEME } from "../theme/defaultTheme";
import { styles } from "../styles/styles";

export interface LayoutPopoverProps {
  chrome: ChromeShape;
  theme: Theme;
  updateThemeColor: (key: keyof Omit<Theme, "layout">, value: string) => void;
  updateThemeLayout: (key: keyof Theme["layout"], value: number) => void;
  resetTheme: () => void;
}

export function LayoutPopover({ chrome, theme, updateThemeColor, updateThemeLayout, resetTheme }: LayoutPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button style={styles.iconBtn} title={chrome.spacing} onClick={() => setOpen((v) => !v)}><Ruler size={14} /></button>
      {open && (
        <div style={styles.layoutPanel}>
          <div style={styles.layoutPanelHeader}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{chrome.theme} / {chrome.spacing}</span>
            <button type="button" style={styles.resetLinkBtn} onClick={resetTheme}><RotateCcw size={11} /> {chrome.reset}</button>
          </div>
          <label style={styles.propLabel}>{chrome.primaryColor}</label>
          <div style={styles.swatchRow}>
            {BUTTON_COLOR_SWATCHES.slice(1).map((c) => (<button key={c} type="button" title={c} style={{ ...styles.swatchBtn, background: c, ...(theme.primary === c ? styles.swatchBtnActive : {}) }} onClick={() => updateThemeColor("primary", c)} />))}
            <input type="color" value={theme.primary} onChange={(e) => updateThemeColor("primary", e.target.value)} style={styles.colorPickerInput} />
          </div>
          <label style={styles.propLabel}>{chrome.pageBackground}</label>
          <div style={styles.swatchRow}>
            {SECTION_BG_SWATCHES.filter(Boolean).map((c) => (<button key={c} type="button" title={c} style={{ ...styles.swatchBtn, background: c, ...(theme.pageBackground === c ? styles.swatchBtnActive : {}) }} onClick={() => updateThemeColor("pageBackground", c)} />))}
            <input type="color" value={theme.pageBackground} onChange={(e) => updateThemeColor("pageBackground", e.target.value)} style={styles.colorPickerInput} />
          </div>
          <label style={styles.propLabel}>{chrome.maxWidthPx}</label>
          <input type="number" style={styles.propInput} value={theme.layout.maxWidth} onChange={(e) => updateThemeLayout("maxWidth", Number(e.target.value) || DEFAULT_THEME.layout.maxWidth)} />
          <div style={styles.inspectorDivider} />
          <div style={styles.panelHeading}>{chrome.spacing}</div>
          {SPACING_FIELDS.map(({ key, labelKey }) => (
            <div key={key} style={styles.spacingRow}>
              <span style={styles.spacingLabel}>{chrome[labelKey as keyof ChromeShape] as string}</span>
              <input type="number" style={styles.spacingInput} value={theme.layout[key as keyof Theme["layout"]]} onChange={(e) => updateThemeLayout(key as keyof Theme["layout"], Number(e.target.value) || 0)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
