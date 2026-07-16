import { useEffect, useRef, useState } from "react";
import type { ChromeShape } from "../i18n/chrome";
import type { DocumentFields, LocalizedString, SavedFormMeta, StorageAdapter, ThemeOverrides } from "../types";
import { DRAFT_KEY, INDEX_KEY, formKey } from "../lib/storage/keys";
import { migrateDocument } from "../lib/migrate";
import { genFormId } from "../lib/id";
import { bi, t } from "../lib/bilingual";

export const MAX_TEMPLATES = 5;

export interface UsePersistenceArgs {
  storage: StorageAdapter;
  language: string;
  chrome: ChromeShape;
  document: DocumentFields;
  onLoadDocument: (doc: DocumentFields) => void;
  onLoadThemeOverrides: (overrides: ThemeOverrides) => void;
  onTitleChange: (title: LocalizedString) => void;
  onNewForm: () => void;
  ensureActiveSection: () => void;
}

export interface SaveAsPrompt {
  open: boolean;
  suggestedName: string;
}

/**
 * Owns draft autoload + autosave + the saved-forms library, on top of a
 * pluggable StorageAdapter. Both the draft-load effect and the autosave
 * effect live in this single hook because `hasLoadedOnce` (set by the load
 * effect) gates the autosave effect from firing before the real draft has
 * loaded — splitting them would require sharing a ref across hooks.
 */
export function usePersistence({
  storage, language, chrome, document, onLoadDocument, onLoadThemeOverrides, onTitleChange, onNewForm, ensureActiveSection,
}: UsePersistenceArgs) {
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedForms, setSavedForms] = useState<SavedFormMeta[]>([]);
  const [saveAsPrompt, setSaveAsPrompt] = useState<SaveAsPrompt | null>(null);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedOnce = useRef(false);

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
        const raw = await storage.get(DRAFT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const doc = migrateDocument(parsed);
          if (doc) {
            onLoadDocument(doc);
            onLoadThemeOverrides(doc.themeOverrides);
          }
          if (parsed.currentFormId) setCurrentFormId(parsed.currentFormId);
        } else {
          ensureActiveSection();
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
    if (!hasLoadedOnce.current) return;
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
  }, [document.title, document.submitLabel, document.submitMode, document.submitStyle, document.themeOverrides, document.sections, currentFormId]);

  async function saveAs(name: string) {
    if (savedForms.length >= MAX_TEMPLATES) {
      alert(chrome.templatesLimitReached);
      return;
    }
    const id = genFormId();
    const now = Date.now();
    try {
      const newTitle = bi(name, "");
      await storage.set(formKey(id), JSON.stringify({ ...document, title: newTitle, id, updatedAt: now }));
      const next = [...savedForms, { id, title: name, updatedAt: now }];
      await storage.set(INDEX_KEY, JSON.stringify(next));
      setSavedForms(next);
      setCurrentFormId(id);
      onTitleChange(newTitle);
      setSaveAsPrompt(null);
    } catch (err) {
      alert("Couldn't save the form. Please try again.");
    }
  }

  async function saveExisting() {
    if (!currentFormId) {
      setSaveAsPrompt({ open: true, suggestedName: t(document.title, language) });
      return;
    }
    const now = Date.now();
    try {
      await storage.set(formKey(currentFormId), JSON.stringify({ ...document, id: currentFormId, updatedAt: now }));
      const next = savedForms.map((f) => (f.id === currentFormId ? { ...f, title: t(document.title, "en"), updatedAt: now } : f));
      setSavedForms(next);
      await storage.set(INDEX_KEY, JSON.stringify(next));
    } catch (err) {
      alert("Couldn't save the form. Please try again.");
    }
  }

  async function loadForm(id: string) {
    try {
      const raw = await storage.get(formKey(id));
      if (!raw) return;
      const doc = migrateDocument(JSON.parse(raw));
      if (!doc) return;
      onLoadDocument(doc);
      onLoadThemeOverrides(doc.themeOverrides);
      setCurrentFormId(id);
    } catch (err) {
      alert("Couldn't load that form.");
    }
  }

  async function deleteForm(id: string) {
    try {
      await storage.delete(formKey(id));
      const next = savedForms.filter((f) => f.id !== id);
      setSavedForms(next);
      await storage.set(INDEX_KEY, JSON.stringify(next));
      if (currentFormId === id) setCurrentFormId(null);
    } catch (err) {
      // Non-critical.
    }
  }

  function newForm() {
    onNewForm();
    setCurrentFormId(null);
  }

  function dismissSaveAsPrompt() {
    setSaveAsPrompt(null);
  }

  return {
    loadingDraft, saveState, savedForms, currentFormId,
    saveAs, saveExisting, loadForm, deleteForm, refreshLibrary, newForm,
    saveAsPrompt, dismissSaveAsPrompt,
  };
}

export type UsePersistenceResult = ReturnType<typeof usePersistence>;
