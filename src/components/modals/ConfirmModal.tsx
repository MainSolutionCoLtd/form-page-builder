import { useEffect } from "react";
import { X } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import { styles } from "../../styles/styles";

export interface ConfirmModalProps {
  chrome: ChromeShape;
  title: string;
  message: string;
  /** Omit for a plain acknowledgement notice (single OK button). */
  onConfirm?: () => void;
  confirmLabel?: string;
  tone?: "default" | "danger";
  onClose: () => void;
}

/** In-widget replacement for window.alert / window.confirm. */
export function ConfirmModal({ chrome, title, message, onConfirm, confirmLabel, tone = "default", onClose }: ConfirmModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const confirmStyle =
    tone === "danger"
      ? { ...styles.primaryBtn, background: "var(--fb-danger)", borderColor: "var(--fb-danger)" }
      : styles.primaryBtn;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: 380 }} role="alertdialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
          <button type="button" style={styles.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div style={{ padding: 16 }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--fb-ink)" }}>{message}</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            {onConfirm ? (
              <>
                <button type="button" autoFocus style={styles.ghostBtn} onClick={onClose}>{chrome.cancel}</button>
                <button type="button" style={confirmStyle} onClick={onConfirm}>{confirmLabel ?? chrome.confirm}</button>
              </>
            ) : (
              <button type="button" autoFocus style={styles.primaryBtn} onClick={onClose}>{chrome.dismiss}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
