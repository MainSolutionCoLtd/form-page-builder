import type { ChromeShape } from "../../i18n/chrome";
import type { FieldPatch, FormField } from "../../types";
import type { FieldTypeMeta } from "../../constants/fieldTypes";
import { t } from "../../lib/bilingual";
import { styles } from "../../styles/styles";

export interface DefaultValueEditorProps {
  field: FormField;
  meta: FieldTypeMeta;
  lang: string;
  chrome: ChromeShape;
  onChange: (patch: FieldPatch) => void;
}

export function DefaultValueEditor({ field, meta, lang, chrome, onChange }: DefaultValueEditorProps) {
  if (meta.isContent) return null;
  const f = field as any;

  if (meta.boolean) {
    return (
      <>
        <label style={styles.propLabel}>{chrome.defaultValue}</label>
        <button style={styles.toggleRow} onClick={() => onChange({ defaultValue: !f.defaultValue })}>
          <span style={{ ...styles.toggleTrack, background: f.defaultValue ? "var(--fb-primary)" : "var(--fb-border)" }}><span style={{ ...styles.toggleThumb, transform: f.defaultValue ? "translateX(16px)" : "translateX(0)" }} /></span>
          <span style={{ fontSize: 13, color: "#4A4D57" }}>{f.defaultValue ? chrome.checked : chrome.unchecked}</span>
        </button>
      </>
    );
  }

  if (meta.multiValue) {
    const selectedVals: string[] = f.defaultValue || [];
    return (
      <>
        <label style={styles.propLabel}>{chrome.defaultChecked}</label>
        <div style={styles.optionList}>
          {(f.options || []).map((o: any) => {
            const checked = selectedVals.includes(o.value);
            return (
              <label key={o.value} style={{ ...styles.previewRadio, cursor: "pointer" }}>
                <input type="checkbox" checked={checked} onChange={(e) => { const next = e.target.checked ? [...selectedVals, o.value] : selectedVals.filter((v) => v !== o.value); onChange({ defaultValue: next }); }} style={{ accentColor: "var(--fb-primary)" }} />
                {t(o.label, lang)}
              </label>
            );
          })}
        </div>
      </>
    );
  }

  if (meta.options) {
    return (
      <>
        <label style={styles.propLabel}>{chrome.defaultValue}</label>
        <select style={styles.propInput} value={f.defaultValue || ""} onChange={(e) => onChange({ defaultValue: e.target.value })}>
          <option value="">{chrome.none}</option>
          {(f.options || []).map((o: any) => (<option key={o.value} value={o.value}>{t(o.label, lang)}</option>))}
        </select>
      </>
    );
  }

  const htmlType =
    field.type === "input" && field.inputType === "number" ? "number" :
    field.type === "input" && field.inputType === "date" ? "date" :
    field.type === "input" && field.inputType === "time" ? "time" : "text";
  return (
    <>
      <label style={styles.propLabel}>{chrome.defaultValue}</label>
      <input type={htmlType} style={styles.propInput} value={f.defaultValue || ""} onChange={(e) => onChange({ defaultValue: e.target.value })} />
    </>
  );
}
