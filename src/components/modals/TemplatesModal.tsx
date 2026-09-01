import { Trash2, X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import type { SavedFormMeta } from "../../types";
import { styles } from "../../styles/styles";

export interface TemplatesModalProps {
  chrome: ChromeShape;
  savedForms: SavedFormMeta[];
  currentFormId: string | null;
  /** When false, the user can only apply a template — no delete, and the action button reads "Apply" rather than "Open". */
  manage: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TemplatesModal({ chrome, savedForms, currentFormId, manage, onOpen, onDelete, onClose }: TemplatesModalProps) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.templates}</span><button style={styles.iconBtn} onClick={onClose}><X size={16} /></button></div>
        <div style={styles.libraryBody}>
          {savedForms.length === 0 ? (
            <div style={styles.inspectorEmpty}>{manage ? chrome.noTemplates : chrome.noTemplatesReadonly}</div>
          ) : (
            savedForms.map((f) => (
              <div key={f.id} style={styles.libraryRow}>
                <div style={{ minWidth: 0 }}>
                  <div style={styles.libraryRowTitle}>{f.title}{f.id === currentFormId && <span style={styles.currentBadge}>{chrome.current}</span>}</div>
                  <div style={styles.libraryRowMeta}>{chrome.updated} {new Date(f.updatedAt).toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button style={styles.ghostBtn} onClick={() => onOpen(f.id)}>{manage ? chrome.open : chrome.applyTemplate}</button>
                  {manage && (
                    <button style={{ ...styles.iconBtn, ...styles.iconBtnDanger }} title={chrome.delete} onClick={() => onDelete(f.id)}><Trash2 size={13} /></button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
