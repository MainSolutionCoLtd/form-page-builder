import { useState } from "react";
import { Save, X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import { styles } from "../../styles/styles";

export interface SaveAsModalProps {
  chrome: ChromeShape;
  suggestedName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

export function SaveAsModal({ chrome, suggestedName, onSave, onClose }: SaveAsModalProps) {
  const [name, setName] = useState(suggestedName);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, width: 380 }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.saveForm}</span><button style={styles.iconBtn} onClick={onClose}><X size={16} /></button></div>
        <div style={{ padding: 16 }}>
          <label style={styles.propLabel}>{chrome.formName}</label>
          <input autoFocus style={styles.propInput} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && name.trim() && onSave(name.trim())} />
          <button style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center", marginTop: 14 }} disabled={!name.trim()} onClick={() => onSave(name.trim())}><Save size={14} /> {chrome.saveToLibrary}</button>
        </div>
      </div>
    </div>
  );
}
