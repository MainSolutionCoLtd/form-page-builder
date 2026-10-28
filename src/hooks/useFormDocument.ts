import { useState } from "react";
import type { ChromeShape } from "../i18n/chrome";
import type { DocumentFields, FieldPatch, FieldType, FormField, LocalizedString, Section } from "../types";
import { bi, withLang } from "../lib/bilingual";
import { defaultFieldFor, defaultSection } from "../lib/fieldDefaults";
import { genSectionId, nextId, resyncIdCounter } from "../lib/id";

export interface UseFormDocumentArgs {
  language: string;
  chrome: ChromeShape;
  /** New buttons default to a link action (no submit buttons in this host). */
  linkButtonsOnly?: boolean;
}

export function useFormDocument({ language, chrome, linkButtonsOnly }: UseFormDocumentArgs) {
  const [title, setTitle] = useState<LocalizedString>(bi("Untitled form", ""));
  const [sections, setSections] = useState<Section[]>([defaultSection()]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allFields = sections.flatMap((s) => s.fields);
  const selected = allFields.find((f) => f.id === selectedId) || null;
  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0] || defaultSection();

  function updateTitle(value: string) {
    setTitle((prev) => withLang(prev, language, value));
  }

  function addSection() {
    const s = defaultSection();
    setSections((prev) => [...prev, s]);
    setActiveSectionId(s.id);
  }
  function duplicateSection(sectionId: string) {
    const newSectionId = genSectionId();
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx === -1) return prev;
      const copy: Section = { ...prev[idx], id: newSectionId, fields: prev[idx].fields.map((f) => ({ ...f, id: nextId() })) };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setActiveSectionId(newSectionId);
  }
  function deleteSection(sectionId: string) {
    setSections((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((s) => s.id !== sectionId);
      setActiveSectionId((curr) => (curr === sectionId ? next[0].id : curr));
      return next;
    });
  }
  function moveSection(sectionId: string, dir: 1 | -1) {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      const swap = idx + dir;
      if (swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }
  function updateSectionTitle(sectionId: string, value: string) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, title: withLang(s.title, language, value) } : s)));
  }
  function updateSectionBackground(sectionId: string, color: string) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, background: color } : s)));
  }
  function toggleSectionCollapse(sectionId: string) {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s)));
  }

  function addField(type: FieldType) {
    const made = defaultFieldFor(type, language, chrome);
    const field = type === "button" && linkButtonsOnly ? ({ ...made, action: "link", target: "_blank" } as FormField) : made;
    const targetId = activeSectionId || sections[0]?.id;
    if (!targetId) return;
    setSections((prev) => prev.map((s) => (s.id === targetId ? { ...s, fields: [...s.fields, field] } : s)));
    setSelectedId(field.id);
  }
  function updateField(fieldId: string, patch: FieldPatch) {
    setSections((prev) => prev.map((s) => ({ ...s, fields: s.fields.map((f) => (f.id === fieldId ? ({ ...f, ...patch } as FormField) : f)) })));
  }
  function deleteField(fieldId: string) {
    setSections((prev) => prev.map((s) => ({ ...s, fields: s.fields.filter((f) => f.id !== fieldId) })));
    if (selectedId === fieldId) setSelectedId(null);
  }
  function duplicateField(fieldId: string) {
    const newId = nextId();
    setSections((prev) => prev.map((s) => {
      const idx = s.fields.findIndex((f) => f.id === fieldId);
      if (idx === -1) return s;
      const copy = { ...s.fields[idx], id: newId };
      const fields = [...s.fields];
      fields.splice(idx + 1, 0, copy);
      return { ...s, fields };
    }));
    setSelectedId(newId);
  }
  function moveField(fieldId: string, dir: 1 | -1) {
    setSections((prev) => prev.map((s) => {
      const idx = s.fields.findIndex((f) => f.id === fieldId);
      if (idx === -1) return s;
      const swap = idx + dir;
      if (swap < 0 || swap >= s.fields.length) return s;
      const fields = [...s.fields];
      [fields[idx], fields[swap]] = [fields[swap], fields[idx]];
      return { ...s, fields };
    }));
  }
  function reorderWithinSection(sectionId: string, fromIdx: number | null, toIdx: number | null) {
    if (fromIdx === toIdx || fromIdx == null || toIdx == null) return;
    setSections((prev) => prev.map((s) => {
      if (s.id !== sectionId) return s;
      const fields = [...s.fields];
      const [moved] = fields.splice(fromIdx, 1);
      fields.splice(toIdx, 0, moved);
      return { ...s, fields };
    }));
  }
  function updateOption(fieldId: string, optIdx: number, patch: { label?: LocalizedString; value?: string }) {
    setSections((prev) => prev.map((s) => ({
      ...s,
      fields: s.fields.map((f) => {
        if (f.id !== fieldId || !("options" in f) || !f.options) return f;
        return { ...f, options: f.options.map((o, i) => (i === optIdx ? { ...o, ...patch } : o)) };
      }),
    })));
  }
  function addOption(fieldId: string) {
    setSections((prev) => prev.map((s) => ({
      ...s,
      fields: s.fields.map((f) => {
        if (f.id !== fieldId || !("options" in f) || !f.options) return f;
        // Next free number, not length+1: after a removal that could repeat an existing value.
        const used = new Set(f.options.map((o) => o.value));
        let n = f.options.length + 1;
        while (used.has(`option_${n}`)) n++;
        return { ...f, options: [...f.options, { label: withLang(bi(), language, chrome.optionSeed(n)), value: `option_${n}` }] };
      }),
    })));
  }
  function removeOption(fieldId: string, optIdx: number) {
    setSections((prev) => prev.map((s) => ({
      ...s,
      fields: s.fields.map((f) => {
        if (f.id !== fieldId || !("options" in f) || !f.options) return f;
        const removed = f.options[optIdx]?.value;
        const options = f.options.filter((_, i) => i !== optIdx);
        // Keep defaultValue pointing only at options that still exist.
        if (f.type === "checkboxGroup") return { ...f, options, defaultValue: f.defaultValue.filter((v) => v !== removed) };
        if ((f.type === "select" || f.type === "radio") && f.defaultValue === removed) return { ...f, options, defaultValue: "" };
        return { ...f, options };
      }),
    })));
  }

  function loadDocument(doc: DocumentFields) {
    resyncIdCounter(doc.sections.flatMap((s) => s.fields));
    setSections(doc.sections);
    setActiveSectionId(doc.sections[0]?.id || null);
    setTitle(doc.title);
    setSelectedId(null);
  }

  function resetToBlank() {
    const s = defaultSection();
    setSections([s]);
    setActiveSectionId(s.id);
    setTitle(bi("Untitled form", ""));
    setSelectedId(null);
  }

  return {
    title, sections, activeSectionId, selectedId,
    allFields, selected, activeSection,
    setActiveSectionId, setSelectedId, setTitle,
    updateTitle,
    addSection, duplicateSection, deleteSection, moveSection,
    updateSectionTitle, updateSectionBackground, toggleSectionCollapse,
    addField, updateField, deleteField, duplicateField, moveField, reorderWithinSection,
    updateOption, addOption, removeOption,
    loadDocument, resetToBlank,
  };
}

export type UseFormDocumentResult = ReturnType<typeof useFormDocument>;
