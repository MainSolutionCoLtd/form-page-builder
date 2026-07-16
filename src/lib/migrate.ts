import type { DocumentFields, FormField, Section } from "../types";
import { LEGACY_INPUT_TYPES } from "../constants/fieldTypes";
import { bi } from "./bilingual";
import { defaultSection } from "./fieldDefaults";
import { genSectionId, nextId, resyncIdCounter } from "./id";
import { sectionHasFormFields } from "./submittable";

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

/** Bakes a legacy document/section-level submitLabel+submitStyle into a standalone button field. */
function synthesizeButtonField(label: any, style: any, scope: "section" | "form"): FormField {
  const resolvedLabel =
    typeof label === "string" && label ? bi(label) :
    label && typeof label === "object" && (label.en || label.ja) ? label :
    bi("Submit", "");
  return {
    id: nextId(),
    type: "button",
    label: resolvedLabel,
    hideLabel: false,
    width: "1/1",
    verticalAlign: "top",
    labelPosition: "top",
    showIcon: false,
    displayIcon: "Type",
    action: "submit",
    submitScope: scope,
    buttonStyle: style || { color: "", size: "md" },
    href: "",
    target: "_self",
  } as FormField;
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

  const legacy = raw.version === undefined || raw.version < 5;
  if (legacy) {
    // Synthesized button ids must not collide with ids already present in `sections`,
    // and the caller's own resyncIdCounter (post-migration) runs too late for that.
    resyncIdCounter(sections.flatMap((s) => s.fields));
    const submitMode = raw.submitMode === "perSection" ? "perSection" : "combined";
    const submitLabel = raw.submitLabel;
    const submitStyle = raw.submitStyle || { color: "", size: "md" };

    if (submitMode === "perSection" && raw.sections) {
      sections = sections.map((s, i) => {
        if (!sectionHasFormFields(s)) return s;
        const rawSection = raw.sections[i] || {};
        const label = rawSection.submitLabel || submitLabel;
        const style = rawSection.submitStyle || submitStyle;
        return { ...s, fields: [...s.fields, synthesizeButtonField(label, style, "section")] };
      });
    } else if (sections.some(sectionHasFormFields)) {
      const lastIdx = sections.length - 1;
      sections = sections.map((s, i) => (i === lastIdx ? { ...s, fields: [...s.fields, synthesizeButtonField(submitLabel, submitStyle, "form")] } : s));
    }
  }

  return { title, themeOverrides, sections };
}
