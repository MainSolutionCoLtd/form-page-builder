import { useState } from "react";
import { AlertCircle, Loader2, Save, X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import { styles } from "../../styles/styles";

export interface SaveAsModalProps {
  chrome: ChromeShape;
  suggestedName: string;
  templateState: "idle" | "loading" | "saving" | "saved" | "error";
  onSave: (name: string) => void;
  onClose: () => void;
}

export function SaveAsModal({ chrome, suggestedName, templateState, onSave, onClose }: SaveAsModalProps) {
  const [name, setName] = useState(suggestedName);
  const saving = templateState === "saving";
  const canSave = !!name.trim() && !saving;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: 380 }} role="dialog" aria-modal="true" aria-label={chrome.saveForm} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.saveForm}</span><button style={styles.iconBtn} onClick={onClose}><X size={16} /></button></div>
        <div style={{ padding: 16 }}>
          <label style={styles.propLabel}>{chrome.formName}</label>
          <input autoFocus aria-label={chrome.formName} style={styles.propInput} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && canSave && onSave(name.trim())} />
          <button style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center", marginTop: 14 }} disabled={!canSave} onClick={() => onSave(name.trim())}>
            {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} {chrome.saveToLibrary}
          </button>
          {templateState === "error" && (
            <div style={{ fontSize: 12, color: "var(--fb-danger)", display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
              <AlertCircle size={12} /> {chrome.templateSaveFailed}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
