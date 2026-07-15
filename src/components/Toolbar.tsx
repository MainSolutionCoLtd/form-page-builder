import { Loader2, AlertCircle, Languages, Pencil, Eye, Settings, FilePlus2, FolderOpen, Save, Code2 } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { LanguageOption, LocalizedString, Theme } from "../types";
import { t } from "../lib/bilingual";
import { styles } from "../styles/styles";
import { Segmented } from "./Segmented";
import { LayoutPopover } from "./LayoutPopover";

export interface ToolbarProps {
  title: LocalizedString;
  language: string;
  languages: LanguageOption[];
  mode: "build" | "preview";
  saveState: "idle" | "saving" | "saved" | "error";
  chrome: ChromeShape;
  themeEditable: boolean;
  theme: Theme;
  savedFormsCount: number;
  onTitleChange: (value: string) => void;
  onLanguageChange: (code: string) => void;
  onModeChange: (mode: "build" | "preview") => void;
  onOpenSettings: () => void;
  onNewForm: () => void;
  onOpenLibrary: () => void;
  onSaveExisting: () => void;
  onOpenJson: () => void;
  updateThemeColor: (key: keyof Omit<Theme, "layout">, value: string) => void;
  updateThemeLayout: (key: keyof Theme["layout"], value: number) => void;
  resetTheme: () => void;
}

export function Toolbar({
  title, language, languages, mode, saveState, chrome, themeEditable, theme, savedFormsCount,
  onTitleChange, onLanguageChange, onModeChange, onOpenSettings, onNewForm, onOpenLibrary, onSaveExisting, onOpenJson,
  updateThemeColor, updateThemeLayout, resetTheme,
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
        <Languages size={14} color="var(--fb-muted)" />
        <Segmented options={languages.map((l) => ({ value: l.code, label: l.label }))} value={language} onChange={onLanguageChange} />
        <div style={styles.toolbarDivider} />
        <button style={mode === "build" ? styles.tabBtnActive : styles.tabBtn} onClick={() => onModeChange("build")}><Pencil size={14} /> {chrome.build}</button>
        <button style={mode === "preview" ? styles.tabBtnActive : styles.tabBtn} onClick={() => onModeChange("preview")}><Eye size={14} /> {chrome.preview}</button>
        <div style={styles.toolbarDivider} />
        {themeEditable && (
          <LayoutPopover chrome={chrome} theme={theme} updateThemeColor={updateThemeColor} updateThemeLayout={updateThemeLayout} resetTheme={resetTheme} />
        )}
        <button style={styles.iconBtn} title={chrome.settings} onClick={onOpenSettings}><Settings size={14} /></button>
        <button style={styles.ghostBtn} onClick={onNewForm} title={chrome.startNewForm}><FilePlus2 size={14} /> {chrome.newForm}</button>
        <button style={styles.ghostBtn} onClick={onOpenLibrary} title={chrome.openSavedForm}>
          <FolderOpen size={14} /> {chrome.myForms}
          {savedFormsCount > 0 && <span style={styles.countBadge}>{savedFormsCount}</span>}
        </button>
        <button style={styles.primaryBtn} onClick={onSaveExisting} title={chrome.saveToLibraryTitle}><Save size={14} /> {chrome.save}</button>
        <button style={styles.ghostBtn} onClick={onOpenJson}><Code2 size={14} /> {chrome.viewJson}</button>
      </div>
    </div>
  );
}
