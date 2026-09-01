import { Loader2, AlertCircle, Pencil, Eye, FilePlus2, FolderOpen, Save, Code2, ClipboardCopy, ClipboardPaste, Check } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { LanguageOption, LocalizedString } from "../types";
import type { ResolvedFeatures } from "../lib/features";
import { t } from "../lib/bilingual";
import { styles } from "../styles/styles";
import { LanguageToggle } from "./LanguageToggle";

export interface ToolbarProps {
  title: LocalizedString;
  language: string;
  languages: LanguageOption[];
  mode: "build" | "preview";
  saveState: "idle" | "saving" | "saved" | "error";
  templateState: "idle" | "loading" | "saving" | "saved" | "error";
  activeTemplateTitle: string | null;
  templateDirty: boolean;
  chrome: ChromeShape;
  features: ResolvedFeatures;
  savedFormsCount: number;
  onTitleChange: (value: string) => void;
  onLanguageChange: (code: string) => void;
  onModeChange: (mode: "build" | "preview") => void;
  clipboardReady: boolean;
  templateCopied: boolean;
  onNewForm: () => void;
  onOpenLibrary: () => void;
  onSaveExisting: () => void;
  onOpenJson: () => void;
  onCopyTemplate: () => void;
  onPasteTemplate: () => void;
}

export function Toolbar({
  title, language, languages, mode, saveState, templateState, activeTemplateTitle, templateDirty, chrome, features, savedFormsCount,
  clipboardReady, templateCopied,
  onTitleChange, onLanguageChange, onModeChange, onNewForm, onOpenLibrary, onSaveExisting, onOpenJson, onCopyTemplate, onPasteTemplate,
}: ToolbarProps) {
  return (
    <div style={styles.toolbar}>
      <div style={styles.toolbarLeft}>
        <div style={styles.logoMark}>FB</div>
        {features.naming ? (
          <input value={t(title, language)} onChange={(e) => onTitleChange(e.target.value)} style={styles.titleInput} aria-label="Form title" />
        ) : (
          <span style={styles.titleInput}>{t(title, language)}</span>
        )}
        {templateState === "loading" ? (
          <span style={styles.saveStatus}><Loader2 size={12} className="spin" /> {chrome.templateLoading}</span>
        ) : activeTemplateTitle && (
          <span style={styles.templateTag} title={chrome.templateLabel(activeTemplateTitle)}>
            {chrome.templateLabel(activeTemplateTitle)}
            {templateDirty && <span style={styles.currentBadge}>{chrome.templateEdited}</span>}
          </span>
        )}
      </div>
      <div style={styles.toolbarRight}>
        <span style={styles.saveStatus}>
          {saveState === "saving" && (<><Loader2 size={12} className="spin" /> {chrome.saving}</>)}
          {saveState === "saved" && chrome.saved}
          {saveState === "error" && (<span style={{ color: "var(--fb-danger)", display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} /> {chrome.saveFailed}</span>)}
        </span>
        {features.languageSwitcher && (
          <>
            <div style={styles.toolbarDivider} />
            <LanguageToggle languages={languages} value={language} onChange={onLanguageChange} />
          </>
        )}
        {features.previewMode && (
          <>
            <div style={styles.toolbarDivider} />
            <button style={mode === "build" ? styles.tabBtnActive : styles.tabBtn} onClick={() => onModeChange("build")}><Pencil size={14} /> {chrome.build}</button>
            <button style={mode === "preview" ? styles.tabBtnActive : styles.tabBtn} onClick={() => onModeChange("preview")}><Eye size={14} /> {chrome.preview}</button>
          </>
        )}
        {(features.newForm || features.templates.enabled) && <div style={styles.toolbarDivider} />}
        {features.newForm && (
          <button style={styles.ghostBtn} onClick={onNewForm} title={chrome.startNewForm}><FilePlus2 size={14} /> {chrome.newForm}</button>
        )}
        {features.templates.enabled && (
          <>
            <button style={styles.ghostBtn} onClick={onOpenLibrary} title={chrome.openTemplatesTitle}>
              <FolderOpen size={14} /> {chrome.templates}
              {savedFormsCount > 0 && <span style={styles.countBadge}>{savedFormsCount}</span>}
            </button>
            {features.templates.manage && (
              <button style={styles.primaryBtn} onClick={onSaveExisting} title={chrome.saveToLibraryTitle}><Save size={14} /> {chrome.save}</button>
            )}
          </>
        )}
        {features.jsonView && (
          <button style={styles.ghostBtn} onClick={onOpenJson}><Code2 size={14} /> {chrome.viewJson}</button>
        )}
        {features.templateClipboard && (
          <>
            <button
              style={styles.iconBtn}
              onClick={onCopyTemplate}
              title={chrome.copyTemplateTitle}
              aria-label={chrome.copyTemplate}
            >
              {templateCopied ? <Check size={14} /> : <ClipboardCopy size={14} />}
            </button>
            <button
              style={styles.iconBtn}
              onClick={onPasteTemplate}
              disabled={!clipboardReady}
              title={chrome.pasteTemplateTitle}
              aria-label={chrome.pasteTemplate}
            >
              <ClipboardPaste size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
