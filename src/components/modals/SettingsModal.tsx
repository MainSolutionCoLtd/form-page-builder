import { X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import type { StringsShape } from "../../i18n/strings";
import type { LocalizedString } from "../../types";
import { t } from "../../lib/bilingual";
import { styles } from "../../styles/styles";
import { Segmented } from "../Segmented";

export interface SettingsModalProps {
  chrome: ChromeShape;
  strings: StringsShape;
  submitLabel: LocalizedString;
  language: string;
  submitMode: "combined" | "perSection";
  onSubmitLabelChange: (value: string) => void;
  onSubmitModeChange: (mode: "combined" | "perSection") => void;
  onClose: () => void;
}

export function SettingsModal({
  chrome, strings, submitLabel, language, submitMode,
  onSubmitLabelChange, onSubmitModeChange, onClose,
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
        </div>
      </div>
    </div>
  );
}
