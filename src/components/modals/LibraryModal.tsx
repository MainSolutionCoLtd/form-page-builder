import { Trash2, X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import type { SavedFormMeta } from "../../types";
import { styles } from "../../styles/styles";

export interface LibraryModalProps {
  chrome: ChromeShape;
  savedForms: SavedFormMeta[];
  currentFormId: string | null;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function LibraryModal({ chrome, savedForms, currentFormId, onOpen, onDelete, onClose }: LibraryModalProps) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.myForms}</span><button style={styles.iconBtn} onClick={onClose}><X size={16} /></button></div>
        <div style={styles.libraryBody}>
          {savedForms.length === 0 ? (
            <div style={styles.inspectorEmpty}>{chrome.nothingSaved}</div>
          ) : (
            savedForms.map((f) => (
              <div key={f.id} style={styles.libraryRow}>
                <div style={{ minWidth: 0 }}>
                  <div style={styles.libraryRowTitle}>{f.title}{f.id === currentFormId && <span style={styles.currentBadge}>{chrome.current}</span>}</div>
                  <div style={styles.libraryRowMeta}>{chrome.updated} {new Date(f.updatedAt).toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button style={styles.ghostBtn} onClick={() => onOpen(f.id)}>{chrome.open}</button>
                  <button style={{ ...styles.iconBtn, ...styles.iconBtnDanger }} title={chrome.delete} onClick={() => onDelete(f.id)}><Trash2 size={13} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
