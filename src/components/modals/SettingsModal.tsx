import { X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import type { StringsShape } from "../../i18n/strings";
import type { LocalizedString, SubmitStyle } from "../../types";
import { BUTTON_COLOR_SWATCHES } from "../../constants/colors";
import { SUBMIT_SIZE_OPTIONS } from "../../constants/submitStyle";
import { t } from "../../lib/bilingual";
import { styles } from "../../styles/styles";
import { Segmented } from "../Segmented";

export interface SettingsModalProps {
  chrome: ChromeShape;
  strings: StringsShape;
  submitLabel: LocalizedString;
  language: string;
  submitMode: "combined" | "perSection";
  submitStyle: SubmitStyle;
  onSubmitLabelChange: (value: string) => void;
  onSubmitModeChange: (mode: "combined" | "perSection") => void;
  onSubmitStyleChange: (patch: Partial<SubmitStyle>) => void;
  onClose: () => void;
}

export function SettingsModal({
  chrome, strings, submitLabel, language, submitMode, submitStyle,
  onSubmitLabelChange, onSubmitModeChange, onSubmitStyleChange, onClose,
}: SettingsModalProps) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, width: 400 }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.formSettings}</span><button style={styles.iconBtn} onClick={onClose}><X size={16} /></button></div>
        <div style={{ padding: 16 }}>
          <div style={styles.panelHeading}>{chrome.submitSectionTitle}</div>
          <label style={styles.propLabel}>{chrome.submitLabel}</label>
          <input style={styles.propInput} placeholder={strings.submit} value={t(submitLabel, language)} onChange={(e) => onSubmitLabelChange(e.target.value)} />
          <label style={styles.propLabel}>{chrome.submitMode}</label>
          <Segmented options={[{ value: "combined", label: chrome.combined }, { value: "perSection", label: chrome.perSection }]} value={submitMode} onChange={onSubmitModeChange} />

          <div style={styles.inspectorDivider} />
          <div style={styles.panelHeading}>{chrome.submitStyle}</div>
          <label style={styles.propLabel}>{chrome.color}</label>
          <div style={styles.swatchRow}>
            {BUTTON_COLOR_SWATCHES.map((c) => (<button key={c || "default"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-primary)", ...((submitStyle.color || "") === c ? styles.swatchBtnActive : {}) }} onClick={() => onSubmitStyleChange({ color: c })} />))}
            <input type="color" value={submitStyle.color || "#5B5FEF"} onChange={(e) => onSubmitStyleChange({ color: e.target.value })} style={styles.colorPickerInput} />
          </div>
          <label style={styles.propLabel}>{chrome.buttonSize}</label>
          <Segmented options={SUBMIT_SIZE_OPTIONS} value={submitStyle.size} onChange={(v) => onSubmitStyleChange({ size: v })} />
        </div>
      </div>
    </div>
  );
}
