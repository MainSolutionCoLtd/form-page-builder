import { AlertCircle, Loader2, Trash2, X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import type { SavedFormMeta } from "../../types";
import { useModalA11y } from "../../hooks/useModalA11y";
import { styles } from "../../styles/styles";

export interface TemplatesModalProps {
  chrome: ChromeShape;
  savedForms: SavedFormMeta[];
  currentFormId: string | null;
  /** false = apply-only: no delete, action button reads "Apply". */
  manage: boolean;
  templateState: "idle" | "loading" | "saving" | "saved" | "error";
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TemplatesModal({ chrome, savedForms, currentFormId, manage, templateState, onOpen, onDelete, onClose }: TemplatesModalProps) {
  const busy = templateState === "loading";
  const panelRef = useModalA11y<HTMLDivElement>(onClose);
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div ref={panelRef} style={styles.modal} role="dialog" aria-modal="true" aria-label={chrome.templates} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}><span style={{ fontWeight: 600, fontSize: 14 }}>{chrome.templates}</span><button type="button" style={styles.iconBtn} onClick={onClose}><X size={16} /></button></div>
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
                  <button type="button" style={styles.ghostBtn} disabled={busy} onClick={() => onOpen(f.id)}>
                    {busy && <Loader2 size={12} className="spin" />} {manage ? chrome.open : chrome.applyTemplate}
                  </button>
                  {manage && (
                    <button type="button" style={{ ...styles.iconBtn, ...styles.iconBtnDanger }} disabled={busy} title={chrome.delete} onClick={() => onDelete(f.id)}><Trash2 size={13} /></button>
                  )}
                </div>
              </div>
            ))
          )}
          {templateState === "error" && (
            <div style={{ ...styles.libraryRowMeta, color: "var(--fb-danger)", display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              <AlertCircle size={12} /> {chrome.templateLoadFailed}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
