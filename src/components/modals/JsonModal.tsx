import { Check, ClipboardCopy, X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import { styles } from "../../styles/styles";

export interface JsonModalProps {
  chrome: ChromeShape;
  jsonString: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

export function JsonModal({ chrome, jsonString, copied, onCopy, onClose }: JsonModalProps) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.formJson}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.ghostBtn} onClick={onCopy}>{copied ? <Check size={14} /> : <ClipboardCopy size={14} />}{copied ? chrome.copied : chrome.copy}</button>
            <button style={styles.iconBtn} onClick={onClose}><X size={16} /></button>
          </div>
        </div>
        <pre style={styles.jsonPre}>{jsonString}</pre>
      </div>
    </div>
  );
}
