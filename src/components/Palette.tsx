import { useState } from "react";
import { Plus } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { ContentBlockType, FieldType, InputFieldType, Theme } from "../types";
import type { ResolvedFeatures } from "../lib/features";
import { isContentBlockEnabled, isFieldTypeEnabled } from "../lib/features";
import { CONTENT_TYPES, FORM_TYPES, FIELD_TYPE_CHROME_KEY } from "../constants/fieldTypes";
import { styles } from "../styles/styles";
import { Segmented } from "./Segmented";
import { DesignPanel } from "./DesignPanel";

export interface PaletteProps {
  activeSectionLabel: string;
  chrome: ChromeShape;
  onAddField: (type: FieldType) => void;
  features: ResolvedFeatures;
  theme: Theme;
  updateThemeColor: (key: keyof Omit<Theme, "layout">, value: string) => void;
  updateThemeLayout: (key: keyof Theme["layout"], value: number) => void;
  resetTheme: () => void;
}

export function Palette({
  activeSectionLabel, chrome, onAddField, features, theme,
  updateThemeColor, updateThemeLayout, resetTheme,
}: PaletteProps) {
  const [tab, setTab] = useState<"blocks" | "design">("blocks");
  const contentTypes = CONTENT_TYPES.filter((f) => isContentBlockEnabled(features, f.type as ContentBlockType));
  const formTypes = FORM_TYPES.filter((f) => isFieldTypeEnabled(features, f.type as InputFieldType));

  return (
    <div style={styles.palette}>
      {features.design && (
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

      {tab === "design" && features.design ? (
        <DesignPanel
          chrome={chrome}
          theme={theme}
          updateThemeColor={updateThemeColor}
          updateThemeLayout={updateThemeLayout}
          resetTheme={resetTheme}
        />
      ) : (
        <>
          <div style={styles.activeSectionHint}>
            {chrome.addingTo} <strong>{activeSectionLabel}</strong>
          </div>
          {contentTypes.length > 0 && (
            <>
              <div style={styles.panelHeading}>{chrome.contentBlocks}</div>
              <div style={styles.paletteList}>
                {contentTypes.map((f) => {
                  const Icon = f.icon;
                  return (<button key={f.type} style={styles.paletteItem} onClick={() => onAddField(f.type)}><Icon size={16} color="var(--fb-primary)" /><span>{chrome[FIELD_TYPE_CHROME_KEY[f.type] as keyof ChromeShape] as string}</span><Plus size={13} color="var(--fb-muted)" style={{ marginLeft: "auto" }} /></button>);
                })}
              </div>
            </>
          )}
          {formTypes.length > 0 && (
            <>
              <div style={{ ...styles.panelHeading, marginTop: 16 }}>{chrome.formFields}</div>
              <div style={styles.paletteList}>
                {formTypes.map((f) => {
                  const Icon = f.icon;
                  return (<button key={f.type} style={styles.paletteItem} onClick={() => onAddField(f.type)}><Icon size={16} color="var(--fb-primary)" /><span>{chrome[FIELD_TYPE_CHROME_KEY[f.type] as keyof ChromeShape] as string}</span><Plus size={13} color="var(--fb-muted)" style={{ marginLeft: "auto" }} /></button>);
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
