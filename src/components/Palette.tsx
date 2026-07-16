import { useState } from "react";
import { Plus } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { FieldType, SubmitStyle, Theme } from "../types";
import { CONTENT_TYPES, FORM_TYPES, FIELD_TYPE_CHROME_KEY } from "../constants/fieldTypes";
import { styles } from "../styles/styles";
import { Segmented } from "./Segmented";
import { DesignPanel } from "./DesignPanel";

export interface PaletteProps {
  activeSectionLabel: string;
  chrome: ChromeShape;
  onAddField: (type: FieldType) => void;
  themeEditable: boolean;
  theme: Theme;
  submitStyle: SubmitStyle;
  updateThemeColor: (key: keyof Omit<Theme, "layout">, value: string) => void;
  updateThemeLayout: (key: keyof Theme["layout"], value: number) => void;
  onSubmitStyleChange: (patch: Partial<SubmitStyle>) => void;
  resetTheme: () => void;
}

export function Palette({
  activeSectionLabel, chrome, onAddField, themeEditable, theme, submitStyle,
  updateThemeColor, updateThemeLayout, onSubmitStyleChange, resetTheme,
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
          theme={theme}
          submitStyle={submitStyle}
          updateThemeColor={updateThemeColor}
          updateThemeLayout={updateThemeLayout}
          onSubmitStyleChange={onSubmitStyleChange}
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
