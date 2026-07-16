import { useState } from "react";
import { Plus } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { StringsShape } from "../i18n/strings";
import type { FieldType, LocalizedString, Section, SubmitStyle, Theme } from "../types";
import { CONTENT_TYPES, FORM_TYPES, FIELD_TYPE_CHROME_KEY } from "../constants/fieldTypes";
import { styles } from "../styles/styles";
import { Segmented } from "./Segmented";
import { DesignPanel } from "./DesignPanel";

export interface PaletteProps {
  activeSectionLabel: string;
  chrome: ChromeShape;
  strings: StringsShape;
  onAddField: (type: FieldType) => void;
  themeEditable: boolean;
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

export function Palette({
  activeSectionLabel, chrome, strings, onAddField, themeEditable, theme, sections, submitStyle, submitLabel, submitMode, language,
  updateThemeColor, updateThemeLayout, onSubmitStyleChange, onSubmitLabelChange, onSubmitModeChange, resetTheme,
}: PaletteProps) {
  const [tab, setTab] = useState<"blocks" | "design">("blocks");

  return (
    <div style={styles.palette}>
      {themeEditable && (
        <div style={{ marginBottom: 14 }}>
          <Segmented
            options={[
              { value: "blocks", label: chrome.paletteTabBlocks },
              { value: "design", label: chrome.paletteTabDesign },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>
      )}

      {tab === "design" && themeEditable ? (
        <DesignPanel
          chrome={chrome}
          strings={strings}
          theme={theme}
          sections={sections}
          submitStyle={submitStyle}
          submitLabel={submitLabel}
          submitMode={submitMode}
          language={language}
          updateThemeColor={updateThemeColor}
          updateThemeLayout={updateThemeLayout}
          onSubmitStyleChange={onSubmitStyleChange}
          onSubmitLabelChange={onSubmitLabelChange}
          onSubmitModeChange={onSubmitModeChange}
          resetTheme={resetTheme}
        />
      ) : (
        <>
          <div style={styles.activeSectionHint}>
            {chrome.addingTo} <strong>{activeSectionLabel}</strong>
          </div>
          <div style={styles.panelHeading}>{chrome.contentBlocks}</div>
          <div style={styles.paletteList}>
            {CONTENT_TYPES.map((f) => {
              const Icon = f.icon;
              return (<button key={f.type} style={styles.paletteItem} onClick={() => onAddField(f.type)}><Icon size={16} color="var(--fb-primary)" /><span>{chrome[FIELD_TYPE_CHROME_KEY[f.type] as keyof ChromeShape] as string}</span><Plus size={13} color="#A6A8B3" style={{ marginLeft: "auto" }} /></button>);
            })}
          </div>
          <div style={{ ...styles.panelHeading, marginTop: 16 }}>{chrome.formFields}</div>
          <div style={styles.paletteList}>
            {FORM_TYPES.map((f) => {
              const Icon = f.icon;
              return (<button key={f.type} style={styles.paletteItem} onClick={() => onAddField(f.type)}><Icon size={16} color="var(--fb-primary)" /><span>{chrome[FIELD_TYPE_CHROME_KEY[f.type] as keyof ChromeShape] as string}</span><Plus size={13} color="#A6A8B3" style={{ marginLeft: "auto" }} /></button>);
            })}
          </div>
        </>
      )}
    </div>
  );
}
