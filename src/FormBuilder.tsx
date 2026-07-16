"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import type { CSSProperties } from "react";
import { Loader2 } from "lucide-react";
import type { FormBuilderHandle, FormBuilderProps } from "./types";
import { DEFAULT_LANGUAGES } from "./i18n/languages";
import { DEFAULT_STRINGS } from "./i18n/strings";
import { CHROME } from "./i18n/chrome";
import { t } from "./lib/bilingual";
import { localStorageAdapter } from "./lib/storage/localStorageAdapter";
import { migrateDocument } from "./lib/migrate";
import { useTheme } from "./hooks/useTheme";
import { useFormDocument } from "./hooks/useFormDocument";
import { usePersistence } from "./hooks/usePersistence";
import { useDragReorder } from "./hooks/useDragReorder";
import { Toolbar } from "./components/Toolbar";
import { Palette } from "./components/Palette";
import { Canvas } from "./components/Canvas";
import { Inspector } from "./components/Inspector";
import { PreviewPane } from "./components/PreviewPane";
import { JsonModal } from "./components/modals/JsonModal";
import { TemplatesModal } from "./components/modals/TemplatesModal";
import { SaveAsModal } from "./components/modals/SaveAsModal";
import { css } from "./styles/globalCss";
import { styles } from "./styles/styles";

const FormBuilder = forwardRef<FormBuilderHandle, FormBuilderProps>(function FormBuilder({
  theme: themeOverrideProp,
  language: languageOverride,
  languages = DEFAULT_LANGUAGES,
  strings: stringsOverride,
  chrome: chromeOverride,
  themeEditable = false,
  storage: storageProp,
  onSubmit,
  initialDocument,
}, ref) {
  const storage = storageProp ?? localStorageAdapter;
  const { theme, updateThemeColor, updateThemeLayout, resetTheme, replaceThemeOverrides, themeOverrides } = useTheme(themeOverrideProp);

  const [language, setLanguage] = useState(languageOverride || languages[0]?.code || "en");
  const strings = { ...(DEFAULT_STRINGS[language as keyof typeof DEFAULT_STRINGS] || DEFAULT_STRINGS.en), ...((stringsOverride && stringsOverride[language]) || {}) };
  const chrome = { ...(CHROME[language as keyof typeof CHROME] || CHROME.en), ...((chromeOverride && chromeOverride[language]) || {}) };

  const doc = useFormDocument({ language, chrome });
  const drag = useDragReorder(doc.reorderWithinSection);

  const [mode, setMode] = useState<"build" | "preview">("build");
  const [showJson, setShowJson] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [copied, setCopied] = useState(false);

  const persistence = usePersistence({
    storage,
    language,
    chrome,
    document: {
      title: doc.title, submitLabel: doc.submitLabel, submitMode: doc.submitMode,
      submitStyle: doc.submitStyle, themeOverrides, sections: doc.sections,
    },
    initialDocument,
    onLoadDocument: doc.loadDocument,
    onLoadThemeOverrides: replaceThemeOverrides,
    onTitleChange: doc.setTitle,
    onNewForm: () => { doc.resetToBlank(); resetTheme(); },
    ensureActiveSection: () => doc.setActiveSectionId((prev) => prev ?? doc.sections[0]?.id ?? null),
  });

  const jsonDoc = {
    version: 4 as const,
    title: doc.title, submitLabel: doc.submitLabel, submitMode: doc.submitMode, submitStyle: doc.submitStyle, theme, themeOverrides,
    sections: doc.sections.map((s) => ({ id: s.id, title: s.title, background: s.background, collapsed: s.collapsed, submitStyle: s.submitStyle, submitLabel: s.submitLabel, fields: s.fields })),
  };
  const jsonString = JSON.stringify(jsonDoc, null, 2);

  function copyJson() {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  useImperativeHandle(ref, () => ({
    getDocument: () => jsonDoc,
    exportJson: () => jsonString,
    loadDocument: (raw) => {
      const migrated = migrateDocument(raw);
      if (!migrated) return;
      doc.loadDocument(migrated);
      replaceThemeOverrides(migrated.themeOverrides);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [jsonDoc, jsonString]);

  const activeSectionIdx = doc.sections.findIndex((s) => s.id === doc.activeSection?.id);
  const activeSectionLabel = t(doc.activeSection?.title, language) || `#${activeSectionIdx + 1}`;

  const rootStyle: CSSProperties = {
    ...styles.app,
    "--fb-primary": theme.primary, "--fb-primary-soft": theme.primarySoft,
    "--fb-danger": theme.danger, "--fb-danger-soft": theme.dangerSoft,
    "--fb-ink": theme.ink, "--fb-muted": theme.muted, "--fb-border": theme.border,
    "--fb-surface": theme.surface, "--fb-canvas": theme.canvas, "--fb-page-bg": theme.pageBackground,
    "--fb-space-page": `${theme.layout.pagePadding}px`, "--fb-space-canvas": `${theme.layout.canvasPadding}px`,
    "--fb-space-section": `${theme.layout.sectionGap}px`, "--fb-space-field": `${theme.layout.fieldGap}px`,
    "--fb-space-toolbar": `${theme.layout.toolbarPadding}px`, "--fb-space-panel": `${theme.layout.panelPadding}px`,
    "--fb-space-ticket": `${theme.layout.ticketPadding}px`,
  } as CSSProperties;

  return (
    <div className="fb-root" style={rootStyle}>
      <style>{css}</style>

      <Toolbar
        title={doc.title}
        language={language}
        languages={languages}
        mode={mode}
        saveState={persistence.saveState}
        chrome={chrome}
        savedFormsCount={persistence.savedForms.length}
        onTitleChange={doc.updateTitle}
        onLanguageChange={setLanguage}
        onModeChange={setMode}
        onNewForm={persistence.newForm}
        onOpenLibrary={() => setShowLibrary(true)}
        onSaveExisting={persistence.saveExisting}
        onOpenJson={() => setShowJson(true)}
      />

      {persistence.loadingDraft ? (
        <div style={styles.loadingScreen}>
          <Loader2 size={20} className="spin" />
          <span style={{ marginTop: 8, fontSize: 13, color: "var(--fb-muted)" }}>{chrome.loadingDraft}</span>
        </div>
      ) : mode === "build" ? (
        <div style={styles.workArea}>
          <Palette
            activeSectionLabel={activeSectionLabel}
            chrome={chrome}
            onAddField={doc.addField}
            themeEditable={themeEditable}
            theme={theme}
            sections={doc.sections}
            submitStyle={doc.submitStyle}
            updateThemeColor={updateThemeColor}
            updateThemeLayout={updateThemeLayout}
            onSubmitStyleChange={doc.updateSubmitStyle}
            resetTheme={resetTheme}
            submitLabel={doc.submitLabel}
            submitMode={doc.submitMode}
            language={language}
            strings={strings}
            onSubmitLabelChange={doc.updateSubmitLabel}
            onSubmitModeChange={doc.setSubmitMode}
          />

          <Canvas
            sections={doc.sections}
            activeSectionId={doc.activeSectionId}
            submitMode={doc.submitMode}
            submitStyle={doc.submitStyle}
            selectedId={doc.selectedId}
            dragOverKey={drag.dragOverKey}
            chrome={chrome}
            strings={strings}
            language={language}
            onActivateSection={doc.setActiveSectionId}
            onToggleSectionCollapse={doc.toggleSectionCollapse}
            onUpdateSectionTitle={doc.updateSectionTitle}
            onUpdateSectionBackground={doc.updateSectionBackground}
            onDuplicateSection={doc.duplicateSection}
            onMoveSection={doc.moveSection}
            onDeleteSection={doc.deleteSection}
            onUpdateSectionSubmitStyle={doc.updateSectionSubmitStyle}
            onUpdateSectionSubmitLabel={doc.updateSectionSubmitLabel}
            onClearSectionSubmitStyle={doc.clearSectionSubmitStyle}
            defaultSubmitLabel={doc.submitLabel}
            onAddSection={doc.addSection}
            onSelectField={(sectionId, fieldId) => { doc.setSelectedId(fieldId); doc.setActiveSectionId(sectionId); }}
            onFieldChange={doc.updateField}
            onMoveField={doc.moveField}
            onDuplicateField={doc.duplicateField}
            onDeleteField={doc.deleteField}
            getDropZoneHandlers={drag.getDropZoneHandlers}
            getDragHandleProps={drag.getDragHandleProps}
          />

          <Inspector
            selected={doc.selected}
            language={language}
            chrome={chrome}
            onUpdateField={(patch) => doc.selected && doc.updateField(doc.selected.id, patch)}
            onDeleteField={() => doc.selected && doc.deleteField(doc.selected.id)}
            onUpdateOption={(optIdx, patch) => doc.selected && doc.updateOption(doc.selected.id, optIdx, patch)}
            onAddOption={() => doc.selected && doc.addOption(doc.selected.id)}
            onRemoveOption={(optIdx) => doc.selected && doc.removeOption(doc.selected.id, optIdx)}
          />
        </div>
      ) : (
        <PreviewPane
          title={doc.title} sections={doc.sections} onFieldChange={doc.updateField} language={language}
          strings={strings} chrome={chrome} baseMaxWidth={theme.layout.maxWidth}
          submitLabel={doc.submitLabel} submitMode={doc.submitMode} submitStyle={doc.submitStyle}
          onSubmit={onSubmit}
        />
      )}

      {showJson && (
        <JsonModal chrome={chrome} jsonString={jsonString} copied={copied} onCopy={copyJson} onClose={() => setShowJson(false)} />
      )}

      {showLibrary && (
        <TemplatesModal
          chrome={chrome}
          savedForms={persistence.savedForms}
          currentFormId={persistence.currentFormId}
          onOpen={async (id) => { await persistence.loadForm(id); setShowLibrary(false); }}
          onDelete={persistence.deleteForm}
          onClose={() => setShowLibrary(false)}
        />
      )}

      {persistence.saveAsPrompt && (
        <SaveAsModal
          chrome={chrome}
          suggestedName={persistence.saveAsPrompt.suggestedName}
          onSave={persistence.saveAs}
          onClose={persistence.dismissSaveAsPrompt}
        />
      )}
    </div>
  );
});

export default FormBuilder;
