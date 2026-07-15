import { Plus } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { FieldType } from "../types";
import { CONTENT_TYPES, FORM_TYPES, FIELD_TYPE_CHROME_KEY } from "../constants/fieldTypes";
import { styles } from "../styles/styles";

export interface PaletteProps {
  activeSectionLabel: string;
  chrome: ChromeShape;
  onAddField: (type: FieldType) => void;
}

export function Palette({ activeSectionLabel, chrome, onAddField }: PaletteProps) {
  return (
    <div style={styles.palette}>
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
    </div>
  );
}
