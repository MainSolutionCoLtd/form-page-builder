import type { FormField } from "../types";
import { getMeta } from "../constants/fieldTypes";

type Json = Record<string, any>;

// Base props that `migrateField` restores when absent, so omitting them is lossless.
const BASE_DEFAULTS: Json = {
  hideLabel: false, width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, required: false,
};

const isEmptyLocalized = (v: unknown) =>
  !!v && typeof v === "object" && Object.values(v as Json).every((s) => !s);

const isEmptyDefault = (v: unknown) =>
  v === "" || v === false || (Array.isArray(v) && v.length === 0);

function compactField(field: FormField): Json {
  const out: Json = {};
  const meta = getMeta(field.type);
  for (const [key, value] of Object.entries(field)) {
    if (key in BASE_DEFAULTS && value === BASE_DEFAULTS[key]) continue;
    if (key === "displayIcon" && value === meta.defaultIcon) continue;
    if (key === "placeholder" && isEmptyLocalized(value)) continue;
    if (key === "defaultValue" && !meta.isContent && isEmptyDefault(value)) continue;
    out[key] = value;
  }
  return out;
}

/**
 * Drops every field/section prop that equals its default, so persisted documents are smaller.
 * Lossless: `migrateDocument` restores the defaults, so `migrateDocument(compactDocument(d))` equals `migrateDocument(d)`.
 * Extra top-level keys (`version`, `theme`, `themeOverrides`, …) pass through untouched.
 */
export function compactDocument<T extends { sections: { fields: FormField[]; background?: string; collapsed?: boolean }[] }>(doc: T): T {
  return {
    ...doc,
    sections: doc.sections.map((s) => {
      const { background, collapsed, fields, ...rest } = s;
      return {
        ...rest,
        ...(background ? { background } : {}),
        ...(collapsed ? { collapsed } : {}),
        fields: fields.map(compactField),
      };
    }),
  } as unknown as T;
}
