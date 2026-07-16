import { RotateCcw } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { StringsShape } from "../i18n/strings";
import type { LocalizedString, Section, SubmitStyle, Theme } from "../types";
import { BUTTON_COLOR_SWATCHES, SECTION_BG_SWATCHES } from "../constants/colors";
import { SPACING_FIELDS } from "../constants/layout";
import { SUBMIT_SIZE_OPTIONS } from "../constants/submitStyle";
import { DEFAULT_THEME } from "../theme/defaultTheme";
import { formHasFormFields, submittableSectionCount } from "../lib/submittable";
import { styles } from "../styles/styles";
import { t } from "../lib/bilingual";
import { Segmented } from "./Segmented";

export interface DesignPanelProps {
  chrome: ChromeShape;
  strings: StringsShape;
  theme: Theme;
  sections: Section[];
  submitStyle: SubmitStyle;
  submitLabel: LocalizedString;
  submitMode: "combined" | "perSection";
  language: string;
  updateThemeColor: (key: keyof Omit<Theme, "layout">, value: string) => void;
  updateThemeLayout: (key: keyof Theme["layout"], value: number) => void;
  onSubmitStyleChange: (patch: Partial<SubmitStyle>) => void;
  onSubmitLabelChange: (value: string) => void;
  onSubmitModeChange: (mode: "combined" | "perSection") => void;
  resetTheme: () => void;
}

export function DesignPanel({
  chrome, strings, theme, sections, submitStyle, submitLabel, submitMode, language,
  updateThemeColor, updateThemeLayout, onSubmitStyleChange, onSubmitLabelChange, onSubmitModeChange, resetTheme,
}: DesignPanelProps) {
  const hasSubmittableFields = formHasFormFields(sections);
  const canChooseSubmitMode = submittableSectionCount(sections) >= 2;
  return (
    <div>
      <div style={styles.layoutPanelHeader}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{chrome.theme}</span>
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

      {hasSubmittableFields && (
        <>
          <div style={styles.inspectorDivider} />
          <div style={styles.panelHeading}>{chrome.submitSectionTitle}</div>
          <label style={styles.propLabel}>{chrome.submitLabel}</label>
          <input type="text" style={styles.propInput} placeholder={strings.submit} value={t(submitLabel, language)} onChange={(e) => onSubmitLabelChange(e.target.value)} />
          {canChooseSubmitMode && (
            <>
              <label style={styles.propLabel}>{chrome.submitMode}</label>
              <Segmented options={[{ value: "combined", label: chrome.combined }, { value: "perSection", label: chrome.perSection }]} value={submitMode} onChange={onSubmitModeChange} />
            </>
          )}
          <label style={styles.propLabel}>{chrome.color}</label>
          <div style={styles.swatchRow}>
            {BUTTON_COLOR_SWATCHES.map((c) => (<button key={c || "default"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-primary)", ...((submitStyle.color || "") === c ? styles.swatchBtnActive : {}) }} onClick={() => onSubmitStyleChange({ color: c })} />))}
            <input type="color" value={submitStyle.color || "#5B5FEF"} onChange={(e) => onSubmitStyleChange({ color: e.target.value })} style={styles.colorPickerInput} />
          </div>
          <label style={styles.propLabel}>{chrome.buttonSize}</label>
          <Segmented options={SUBMIT_SIZE_OPTIONS} value={submitStyle.size} onChange={(v) => onSubmitStyleChange({ size: v })} />
        </>
      )}
    </div>
  );
}
