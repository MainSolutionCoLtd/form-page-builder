import { useEffect, useRef, useState } from "react";
import type { ChromeShape } from "../i18n/chrome";
import type { DocumentFields, FormDocument, LocalizedString, SavedFormMeta, StorageAdapter, TemplateChange, ThemeOverrides } from "../types";
import { DRAFT_KEY, INDEX_KEY, formKey } from "../lib/storage/keys";
import { migrateDocument } from "../lib/migrate";
import { genFormId } from "../lib/id";
import { bi, t } from "../lib/bilingual";

export interface UsePersistenceArgs {
  storage: StorageAdapter;
  autosave: boolean;
  templateMax: number;
  /** false = pick-and-apply only (no create/overwrite/delete). */
  templateManage: boolean;
  language: string;
  chrome: ChromeShape;
  document: DocumentFields;
  initialDocument?: FormDocument;
  onLoadDocument: (doc: DocumentFields) => void;
  onLoadThemeOverrides: (overrides: ThemeOverrides) => void;
  onTitleChange: (title: LocalizedString) => void;
  onNewForm: () => void;
  onTemplateChange?: (change: TemplateChange) => void;
  ensureActiveSection: () => void;
}

export type TemplateState = "idle" | "loading" | "saving" | "saved" | "error";

function snapshotOf(d: DocumentFields): string {
  return JSON.stringify({ title: d.title, themeOverrides: d.themeOverrides, sections: d.sections });
}

export interface SaveAsPrompt {
  open: boolean;
  suggestedName: string;
}

/**
 * Draft autoload + autosave + the templates library, over a pluggable StorageAdapter.
 * Both effects live here because the load effect's `hasLoadedOnce` ref gates the autosave one.
 */
export function usePersistence({
  storage, autosave, templateMax, templateManage, language, chrome, document, initialDocument, onLoadDocument, onLoadThemeOverrides, onTitleChange, onNewForm, onTemplateChange, ensureActiveSection,
}: UsePersistenceArgs) {
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [templateState, setTemplateState] = useState<TemplateState>("idle");
  const [savedForms, setSavedForms] = useState<SavedFormMeta[]>([]);
  const [saveAsPrompt, setSaveAsPrompt] = useState<SaveAsPrompt | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedOnce = useRef(false);
  // Document JSON as last synced with a template; compared to the live doc for the "Edited" flag. null = no active template.
  const savedSnapshot = useRef<string | null>(null);

  function flashSaved() {
    setTemplateState("saved");
    setTimeout(() => setTemplateState((s) => (s === "saved" ? "idle" : s)), 1500);
  }

  async function refreshLibrary() {
    try {
      const raw = await storage.get(INDEX_KEY);
      const list: SavedFormMeta[] = raw ? JSON.parse(raw) : [];
      setSavedForms(list.sort((a, b) => b.updatedAt - a.updatedAt));
    } catch (err) {
      setSavedForms([]);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (initialDocument) {
          const doc = migrateDocument(initialDocument);
          if (doc) {
            onLoadDocument(doc);
            onLoadThemeOverrides(doc.themeOverrides);
          } else {
            ensureActiveSection();
          }
        } else {
          const raw = await storage.get(DRAFT_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            const doc = migrateDocument(parsed);
            if (doc) {
              onLoadDocument(doc);
              onLoadThemeOverrides(doc.themeOverrides);
            }
            if (parsed.currentFormId && templateManage) {
              setCurrentFormId(parsed.currentFormId);
              // Snapshot the template record, not the draft, so "Edited" stays honest across reloads.
              try {
                const tplRaw = await storage.get(formKey(parsed.currentFormId));
                const tplDoc = tplRaw ? migrateDocument(JSON.parse(tplRaw)) : null;
                savedSnapshot.current = tplDoc ? snapshotOf(tplDoc) : null;
              } catch {
                savedSnapshot.current = null;
              }
            }
          } else {
            ensureActiveSection();
          }
        }
      } catch (err) {
        ensureActiveSection();
      } finally {
        setLoadingDraft(false);
        hasLoadedOnce.current = true;
      }
    })();
    refreshLibrary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasLoadedOnce.current || !autosave) return;
    setSaveState("saving");
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        await storage.set(DRAFT_KEY, JSON.stringify({ ...document, currentFormId }));
        setSaveState("saved");
      } catch (err) {
        setSaveState("error");
      }
    }, 600);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.title, document.themeOverrides, document.sections, currentFormId]);

  async function saveAs(name: string) {
    if (!templateManage) return;
    if (savedForms.length >= templateMax) {
      setNotice(chrome.templatesLimitReached(templateMax));
      return;
    }
    const id = genFormId();
    const now = Date.now();
    setTemplateState("saving");
    try {
      const newTitle = bi(name, "");
      const docToSave: DocumentFields = { ...document, title: newTitle };
      await storage.set(formKey(id), JSON.stringify({ ...docToSave, id, updatedAt: now }));
      const next = [...savedForms, { id, title: name, updatedAt: now }];
      await storage.set(INDEX_KEY, JSON.stringify(next));
      setSavedForms(next);
      setCurrentFormId(id);
      onTitleChange(newTitle);
      setSaveAsPrompt(null);
      savedSnapshot.current = snapshotOf(docToSave);
      flashSaved();
      onTemplateChange?.({ id, title: name, source: "new" });
    } catch (err) {
      setTemplateState("error");
    }
  }

  async function saveExisting() {
    if (!templateManage) return;
    if (!currentFormId) {
      setSaveAsPrompt({ open: true, suggestedName: t(document.title, language) });
      return;
    }
    const now = Date.now();
    setTemplateState("saving");
    try {
      await storage.set(formKey(currentFormId), JSON.stringify({ ...document, id: currentFormId, updatedAt: now }));
      const next = savedForms.map((f) => (f.id === currentFormId ? { ...f, title: t(document.title, "en"), updatedAt: now } : f));
      setSavedForms(next);
      await storage.set(INDEX_KEY, JSON.stringify(next));
      savedSnapshot.current = snapshotOf(document);
      flashSaved();
      onTemplateChange?.({ id: currentFormId, title: t(document.title, language), source: "saved" });
    } catch (err) {
      setTemplateState("error");
    }
  }

  async function loadForm(id: string): Promise<boolean> {
    setTemplateState("loading");
    try {
      const raw = await storage.get(formKey(id));
      if (!raw) { setTemplateState("error"); return false; }
      const doc = migrateDocument(JSON.parse(raw));
      if (!doc) { setTemplateState("error"); return false; }
      onLoadDocument(doc);
      onLoadThemeOverrides(doc.themeOverrides);
      // Pick-and-apply mode: template is just a seed, so don't bind currentFormId to it.
      const boundId = templateManage ? id : null;
      setCurrentFormId(boundId);
      savedSnapshot.current = boundId ? snapshotOf(doc) : null;
      setTemplateState("idle");
      onTemplateChange?.({ id, title: t(doc.title, language), source: "applied" });
      return true;
    } catch (err) {
      setTemplateState("error");
      return false;
    }
  }

  async function deleteForm(id: string) {
    if (!templateManage) return;
    const removed = savedForms.find((f) => f.id === id);
    try {
      await storage.delete(formKey(id));
      const next = savedForms.filter((f) => f.id !== id);
      setSavedForms(next);
      await storage.set(INDEX_KEY, JSON.stringify(next));
      if (currentFormId === id) {
        setCurrentFormId(null);
        savedSnapshot.current = null;
      }
      onTemplateChange?.({ id: currentFormId === id ? null : id, title: removed?.title ?? "", source: "deleted" });
    } catch (err) {
      setTemplateState("error");
    }
  }

  function newForm() {
    onNewForm();
    setCurrentFormId(null);
    savedSnapshot.current = null;
    setTemplateState("idle");
  }

  const activeTemplate = currentFormId ? savedForms.find((f) => f.id === currentFormId) ?? null : null;
  const isTemplateDirty = savedSnapshot.current !== null && snapshotOf(document) !== savedSnapshot.current;

  function dismissSaveAsPrompt() {
    setSaveAsPrompt(null);
  }

  return {
    loadingDraft, saveState, templateState, savedForms, currentFormId,
    activeTemplateTitle: activeTemplate?.title ?? null,
    isTemplateDirty,
    saveAs, saveExisting, loadForm, deleteForm, refreshLibrary, newForm,
    saveAsPrompt, dismissSaveAsPrompt,
    notice, dismissNotice: () => setNotice(null),
  };
}

export type UsePersistenceResult = ReturnType<typeof usePersistence>;
