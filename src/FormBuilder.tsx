"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Loader2, Menu, SlidersHorizontal } from "lucide-react";
import type { FormBuilderHandle, FormBuilderProps } from "./types";
import { getMeta } from "./constants/fieldTypes";
import { DEFAULT_LANGUAGES } from "./i18n/languages";
import { DEFAULT_STRINGS } from "./i18n/strings";
import { CHROME } from "./i18n/chrome";
import { t } from "./lib/bilingual";
import { mixHex } from "./lib/color";
import { localStorageAdapter } from "./lib/storage/localStorageAdapter";
import { migrateDocument } from "./lib/migrate";
import { parseTemplate, TEMPLATE_FORMAT } from "./lib/template";
import { resolveFeatures } from "./lib/features";
import { useTheme } from "./hooks/useTheme";
import { useFormDocument } from "./hooks/useFormDocument";
import { usePersistence } from "./hooks/usePersistence";
import { useTemplateClipboard } from "./hooks/useTemplateClipboard";
import { useDragReorder } from "./hooks/useDragReorder";
import { Toolbar } from "./components/Toolbar";
import { Palette } from "./components/Palette";
import { Canvas } from "./components/Canvas";
import { Inspector } from "./components/Inspector";
import { PreviewPane } from "./components/PreviewPane";
import { JsonModal } from "./components/modals/JsonModal";
import { TemplatesModal } from "./components/modals/TemplatesModal";
import { SaveAsModal } from "./components/modals/SaveAsModal";
import { ConfirmModal } from "./components/modals/ConfirmModal";
import { css } from "./styles/globalCss";
import { styles } from "./styles/styles";

const FormBuilder = forwardRef<FormBuilderHandle, FormBuilderProps>(function FormBuilder({
  theme: themeOverrideProp,
  language: languageOverride,
  languages = DEFAULT_LANGUAGES,
  strings: stringsOverride,
  chrome: chromeOverride,
  features: featuresProp,
  storage: storageProp,
  onSubmit,
  initialDocument,
  initialMode,
  onModeChange,
  onTemplateChange,
  templateClipboardKey,
}, ref) {
  const features = resolveFeatures(featuresProp);
  const storage = storageProp ?? localStorageAdapter;
  const { theme, updateThemeColor, updateThemeLayout, resetTheme, replaceThemeOverrides, themeOverrides } = useTheme(themeOverrideProp);

  const [language, setLanguage] = useState(languageOverride || languages[0]?.code || "en");
  const strings = { ...(DEFAULT_STRINGS[language as keyof typeof DEFAULT_STRINGS] || DEFAULT_STRINGS.en), ...((stringsOverride && stringsOverride[language]) || {}) };
  const chrome = { ...(CHROME[language as keyof typeof CHROME] || CHROME.en), ...((chromeOverride && chromeOverride[language]) || {}) };

  const doc = useFormDocument({ language, chrome });
  const drag = useDragReorder(doc.reorderWithinSection);

  const [mode, setModeState] = useState<"build" | "preview">(initialMode ?? "build");
  const setMode = (next: "build" | "preview") => { setModeState(next); onModeChange?.(next); };
  useEffect(() => { onModeChange?.(mode); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [showJson, setShowJson] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);
  const [pastePrompt, setPastePrompt] = useState(false);
  const clipboard = useTemplateClipboard(templateClipboardKey);
  // Which drawer is open below the 720px breakpoint (see globalCss); ignored above it.
  const [mobilePanel, setMobilePanel] = useState<"none" | "palette" | "inspector">("none");

  const persistence = usePersistence({
    storage,
    autosave: features.autosave,
    templateMax: features.templates.max,
    templateManage: features.templates.manage,
    language,
    chrome,
    document: { title: doc.title, themeOverrides, sections: doc.sections },
    initialDocument,
    onLoadDocument: doc.loadDocument,
    onLoadThemeOverrides: replaceThemeOverrides,
    onTitleChange: doc.setTitle,
    onNewForm: () => { doc.resetToBlank(); resetTheme(); },
    onTemplateChange,
    ensureActiveSection: () => doc.setActiveSectionId((prev) => prev ?? doc.sections[0]?.id ?? null),
  });

  const jsonDoc = useMemo(() => ({
    version: 5 as const,
    title: doc.title, theme, themeOverrides,
    sections: doc.sections.map((s) => ({ id: s.id, title: s.title, background: s.background, collapsed: s.collapsed, fields: s.fields })),
  }), [doc.title, doc.sections, theme, themeOverrides]);
  const jsonString = useMemo(() => JSON.stringify(jsonDoc, null, 2), [jsonDoc]);

  function copyJson() {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }

  function applyDocument(migrated: ReturnType<typeof migrateDocument>) {
    if (!migrated) return false;
    doc.loadDocument(migrated);
    replaceThemeOverrides(migrated.themeOverrides);
    return true;
  }

  function copyTemplate() {
    clipboard.copyTemplate(jsonDoc);
    setTemplateCopied(true);
    setTimeout(() => setTemplateCopied(false), 1500);
  }

  function pasteTemplate() {
    if (clipboard.readTemplate()) setPastePrompt(true);
  }

  useImperativeHandle(ref, () => ({
    getDocument: () => jsonDoc,
    exportJson: () => jsonString,
    loadDocument: (raw) => { applyDocument(migrateDocument(raw)); },
    getTemplate: () => ({ __fpb: "template", v: TEMPLATE_FORMAT, document: jsonDoc }),
    loadTemplate: (input) => applyDocument(parseTemplate(typeof input === "string" ? input : JSON.stringify(input))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [jsonDoc, jsonString]);

  // Content blocks don't count toward `features.maxFields`.
  const fieldCount = doc.sections.reduce((n, s) => n + s.fields.filter((f) => !getMeta(f.type).isContent).length, 0);

  const activeSectionIdx = doc.sections.findIndex((s) => s.id === doc.activeSection?.id);
  const activeSectionLabel = t(doc.activeSection?.title, language) || `#${activeSectionIdx + 1}`;

  const rootStyle: CSSProperties = {
    ...styles.app,
    "--fb-primary": theme.primary, "--fb-primary-soft": theme.primarySoft,
    "--fb-danger": theme.danger, "--fb-danger-soft": theme.dangerSoft,
    "--fb-ink": theme.ink, "--fb-muted": theme.muted, "--fb-border": theme.border,
    "--fb-surface": theme.surface, "--fb-canvas": theme.canvas, "--fb-page-bg": theme.pageBackground,
    "--fb-surface-2": mixHex(theme.surface, theme.ink, 0.06),
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
        templateState={persistence.templateState}
        activeTemplateTitle={persistence.activeTemplateTitle}
        templateDirty={persistence.isTemplateDirty}
        chrome={chrome}
        features={features}
        savedFormsCount={persistence.savedForms.length}
        clipboardReady={clipboard.hasClipboard}
        templateCopied={templateCopied}
        onTitleChange={doc.updateTitle}
        onLanguageChange={setLanguage}
        onModeChange={setMode}
        onNewForm={persistence.newForm}
        onOpenLibrary={() => setShowLibrary(true)}
        onSaveExisting={persistence.saveExisting}
        onOpenJson={() => setShowJson(true)}
        onCopyTemplate={copyTemplate}
        onPasteTemplate={pasteTemplate}
      />

      {persistence.loadingDraft ? (
        <div style={styles.loadingScreen}>
          <Loader2 size={20} className="spin" />
          <span style={{ marginTop: 8, fontSize: 13, color: "var(--fb-muted)" }}>{chrome.loadingDraft}</span>
        </div>
      ) : mode === "build" ? (
        <div className="fb-work-area" style={styles.workArea} data-mobile-panel={mobilePanel}>
          <div className="fb-mobile-bar">
            <button
              type="button"
              className="fb-mobile-btn"
              aria-pressed={mobilePanel === "palette"}
              onClick={() => setMobilePanel((p) => (p === "palette" ? "none" : "palette"))}
            >
              <Menu size={14} /> {chrome.paletteTabBlocks}
            </button>
            <button
              type="button"
              className="fb-mobile-btn"
              aria-pressed={mobilePanel === "inspector"}
              onClick={() => setMobilePanel((p) => (p === "inspector" ? "none" : "inspector"))}
            >
              <SlidersHorizontal size={14} /> {chrome.properties}
            </button>
          </div>

          <div className="fb-canvas-area" style={styles.workArea}>
            {mobilePanel !== "none" && (
              <div className="fb-mobile-backdrop" onClick={() => setMobilePanel("none")} />
            )}

            <Palette
              activeSectionLabel={activeSectionLabel}
              chrome={chrome}
              onAddField={(type) => { doc.addField(type); setMobilePanel("none"); }}
              features={features}
              fieldCount={fieldCount}
              theme={theme}
              updateThemeColor={updateThemeColor}
              updateThemeLayout={updateThemeLayout}
              resetTheme={resetTheme}
            />

            <Canvas
              sections={doc.sections}
              activeSectionId={doc.activeSectionId}
              selectedId={doc.selectedId}
              dragOverKey={drag.dragOverKey}
              chrome={chrome}
              strings={strings}
              language={language}
              features={features}
              onActivateSection={doc.setActiveSectionId}
              onToggleSectionCollapse={doc.toggleSectionCollapse}
              onUpdateSectionTitle={doc.updateSectionTitle}
              onUpdateSectionBackground={doc.updateSectionBackground}
              onDuplicateSection={doc.duplicateSection}
              onMoveSection={doc.moveSection}
              onDeleteSection={doc.deleteSection}
              onAddSection={doc.addSection}
              onSelectField={(sectionId, fieldId) => { doc.setSelectedId(fieldId); doc.setActiveSectionId(sectionId); setMobilePanel("inspector"); }}
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
              features={features}
              onUpdateField={(patch) => doc.selected && doc.updateField(doc.selected.id, patch)}
              onDeleteField={() => doc.selected && doc.deleteField(doc.selected.id)}
              onUpdateOption={(optIdx, patch) => doc.selected && doc.updateOption(doc.selected.id, optIdx, patch)}
              onAddOption={() => doc.selected && doc.addOption(doc.selected.id)}
              onRemoveOption={(optIdx) => doc.selected && doc.removeOption(doc.selected.id, optIdx)}
            />
          </div>
        </div>
      ) : (
        <PreviewPane
          title={doc.title} sections={doc.sections} onFieldChange={doc.updateField} language={language}
          strings={strings} chrome={chrome} baseMaxWidth={theme.layout.maxWidth} features={features}
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
          manage={features.templates.manage}
          templateState={persistence.templateState}
          onOpen={async (id) => { if (await persistence.loadForm(id)) setShowLibrary(false); }}
          onDelete={persistence.deleteForm}
          onClose={() => setShowLibrary(false)}
        />
      )}

      {persistence.saveAsPrompt && (
        <SaveAsModal
          chrome={chrome}
          suggestedName={persistence.saveAsPrompt.suggestedName}
          templateState={persistence.templateState}
          onSave={persistence.saveAs}
          onClose={persistence.dismissSaveAsPrompt}
        />
      )}

      {pastePrompt && (
        <ConfirmModal
          chrome={chrome}
          title={chrome.pasteTemplate}
          message={chrome.pasteTemplateConfirm}
          confirmLabel={chrome.confirmReplace}
          tone="danger"
          onConfirm={() => { applyDocument(clipboard.readTemplate()); setPastePrompt(false); }}
          onClose={() => setPastePrompt(false)}
        />
      )}

      {persistence.notice && (
        <ConfirmModal
          chrome={chrome}
          title={persistence.notice.title}
          message={persistence.notice.message}
          onClose={persistence.dismissNotice}
        />
      )}
    </div>
  );
});

export default FormBuilder;
