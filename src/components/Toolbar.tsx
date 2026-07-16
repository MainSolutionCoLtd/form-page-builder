import { Loader2, AlertCircle, Pencil, Eye, FilePlus2, FolderOpen, Save, Code2 } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { LanguageOption, LocalizedString } from "../types";
import { t } from "../lib/bilingual";
import { styles } from "../styles/styles";
import { LanguageToggle } from "./LanguageToggle";

export interface ToolbarProps {
  title: LocalizedString;
  language: string;
  languages: LanguageOption[];
  mode: "build" | "preview";
  saveState: "idle" | "saving" | "saved" | "error";
  chrome: ChromeShape;
  savedFormsCount: number;
  onTitleChange: (value: string) => void;
  onLanguageChange: (code: string) => void;
  onModeChange: (mode: "build" | "preview") => void;
  onNewForm: () => void;
  onOpenLibrary: () => void;
  onSaveExisting: () => void;
  onOpenJson: () => void;
}

export function Toolbar({
  title, language, languages, mode, saveState, chrome, savedFormsCount,
  onTitleChange, onLanguageChange, onModeChange, onNewForm, onOpenLibrary, onSaveExisting, onOpenJson,
}: ToolbarProps) {
  return (
    <div style={styles.toolbar}>
      <div style={styles.toolbarLeft}>
        <div style={styles.logoMark}>FB</div>
        <input value={t(title, language)} onChange={(e) => onTitleChange(e.target.value)} style={styles.titleInput} aria-label="Form title" />
      </div>
      <div style={styles.toolbarRight}>
        <span style={styles.saveStatus}>
          {saveState === "saving" && (<><Loader2 size={12} className="spin" /> {chrome.saving}</>)}
          {saveState === "saved" && chrome.saved}
          {saveState === "error" && (<span style={{ color: "var(--fb-danger)", display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} /> {chrome.saveFailed}</span>)}
        </span>
        <div style={styles.toolbarDivider} />
        <LanguageToggle languages={languages} value={language} onChange={onLanguageChange} />
        <div style={styles.toolbarDivider} />
        <button style={mode === "build" ? styles.tabBtnActive : styles.tabBtn} onClick={() => onModeChange("build")}><Pencil size={14} /> {chrome.build}</button>
        <button style={mode === "preview" ? styles.tabBtnActive : styles.tabBtn} onClick={() => onModeChange("preview")}><Eye size={14} /> {chrome.preview}</button>
        <div style={styles.toolbarDivider} />
        <button style={styles.ghostBtn} onClick={onNewForm} title={chrome.startNewForm}><FilePlus2 size={14} /> {chrome.newForm}</button>
        <button style={styles.ghostBtn} onClick={onOpenLibrary} title={chrome.openTemplatesTitle}>
          <FolderOpen size={14} /> {chrome.templates}
          {savedFormsCount > 0 && <span style={styles.countBadge}>{savedFormsCount}</span>}
        </button>
        <button style={styles.primaryBtn} onClick={onSaveExisting} title={chrome.saveToLibraryTitle}><Save size={14} /> {chrome.save}</button>
        <button style={styles.ghostBtn} onClick={onOpenJson}><Code2 size={14} /> {chrome.viewJson}</button>
      </div>
    </div>
  );
}
