import type { DocumentFields, FormField, Section } from "../types";
import { LEGACY_INPUT_TYPES } from "../constants/fieldTypes";
import { bi } from "./bilingual";
import { defaultSection } from "./fieldDefaults";
import { genSectionId } from "./id";

/**
 * Raw, untyped JSON as loaded from storage (draft, saved form, or a
 * hand-edited/older export). Its whole purpose is to absorb legacy/loose
 * shapes, so it's deliberately not typed against the current domain model.
 */
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
  f.verticalAlign = f.verticalAlign || "top";
  return f as FormField;
}

export function migrateFields(fields: Record<string, any>[] | undefined): FormField[] {
  return (fields || []).map(migrateField);
}

export function migrateDocument(raw: RawDocument | null | undefined): DocumentFields | null {
  if (!raw) return null;
  const title = typeof raw.title === "string" ? bi(raw.title) : raw.title || bi();
  const submitLabel = typeof raw.submitLabel === "string" ? bi(raw.submitLabel) : raw.submitLabel || bi();
  const submitMode = raw.submitMode === "perSection" ? "perSection" : "combined";
  const submitStyle = raw.submitStyle || { color: "", size: "md" };
  const themeOverrides = raw.themeOverrides || {};
  if (raw.sections) {
    return {
      title, submitLabel, submitMode, submitStyle, themeOverrides,
      sections: raw.sections.map((s: Record<string, any>): Section => ({
        id: s.id || genSectionId(),
        title: typeof s.title === "string" ? bi(s.title) : s.title || bi(),
        background: s.background || "",
        collapsed: !!s.collapsed,
        submitStyle: s.submitStyle || null,
        submitLabel: typeof s.submitLabel === "string" ? bi(s.submitLabel) : s.submitLabel || null,
        fields: migrateFields(s.fields || []),
      })),
    };
  }
  return { title, submitLabel, submitMode, submitStyle, themeOverrides, sections: [{ ...defaultSection(), fields: migrateFields(raw.fields || []) }] };
}
