import type { DocumentFields, FormField, Section } from "../types";
import { LEGACY_INPUT_TYPES } from "../constants/fieldTypes";
import { bi } from "./bilingual";
import { defaultSection } from "./fieldDefaults";
import { genSectionId } from "./id";

/** Current document schema version — stamped on everything persisted. */
export const DOCUMENT_VERSION = 5 as const;

/** Raw JSON from storage or an older/hand-edited export — untyped on purpose, to absorb legacy shapes. */
type RawDocument = Record<string, any>;

export function migrateField(field: Record<string, any>): FormField {
  let f: Record<string, any> = { ...field };
  if (LEGACY_INPUT_TYPES.includes(f.type)) f = { ...f, type: "input", inputType: f.type };
  f.label = typeof f.label === "string" ? bi(f.label) : f.label || bi();
  f.hideLabel = !!f.hideLabel;
  if ("placeholder" in f) f.placeholder = typeof f.placeholder === "string" ? bi(f.placeholder) : f.placeholder || bi();
  if ("content" in f) f.content = typeof f.content === "string" ? bi(f.content) : f.content || bi();
  if ("alt" in f) f.alt = typeof f.alt === "string" ? bi(f.alt) : f.alt || bi();
  if (f.options) f.options = f.options.map((o: any) => ({ ...o, label: typeof o.label === "string" ? bi(o.label) : o.label || bi() }));
  if (f.type === "paragraph") {
    f.tag = f.tag || "p";
    f.fontSize = f.fontSize || "md";
    f.fontWeight = f.fontWeight || "normal";
    f.fontStyle = f.fontStyle || "normal";
    f.textAlign = f.textAlign || "left";
    f.color = f.color || "";
  }
  if (f.type === "button") {
    f.action = f.action === "link" ? "link" : "submit";
    f.buttonStyle = f.buttonStyle || { color: "", size: "md" };
    f.href = f.href || "";
    f.target = f.target === "_blank" ? "_blank" : "_self";
    f.submitScope = f.submitScope === "section" ? "section" : "form";
  }
  f.verticalAlign = f.verticalAlign || "top";
  return f as FormField;
}

export function migrateFields(fields: Record<string, any>[] | undefined): FormField[] {
  return (fields || []).map(migrateField);
}

export function migrateDocument(raw: RawDocument | null | undefined): DocumentFields | null {
  if (!raw) return null;
  const title = typeof raw.title === "string" ? bi(raw.title) : raw.title || bi();
  const themeOverrides = raw.themeOverrides || {};

  let sections: Section[];
  if (raw.sections) {
    sections = raw.sections.map((s: Record<string, any>): Section => ({
      id: s.id || genSectionId(),
      title: typeof s.title === "string" ? bi(s.title) : s.title || bi(),
      background: s.background || "",
      collapsed: !!s.collapsed,
      fields: migrateFields(s.fields || []),
    }));
  } else {
    sections = [{ ...defaultSection(), fields: migrateFields(raw.fields || []) }];
  }

  // A submit action is an explicit Button field — never synthesized. Older
  // documents that carried a document-level submitLabel/submitMode load without
  // one; add a Button field if you want a submit control.

  return { title, themeOverrides, sections };
}
