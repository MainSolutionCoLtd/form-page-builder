import type { FormField } from "../types";
import { getMeta } from "../constants/fieldTypes";

type Json = Record<string, any>;

// Base props that `migrateField` restores when absent, so omitting them is lossless.
const BASE_DEFAULTS: Json = {
  hideLabel: false, width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, required: false,
};

/** Stamped on compacted documents so a future change to a default can still read old ones with the defaults they were written under. */
export const COMPACT_VERSION = 1;

// A missing language key reads the same as an empty one (`t()` falls back to `en`), so empty non-`en` entries are dropped.
const slimLocalized = (v: unknown) =>
  v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v as Json).filter(([lang, s]) => lang === "en" || s !== ""))
    : v;

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
    if (key === "label" || key === "placeholder" || key === "content" || key === "alt") out[key] = slimLocalized(value);
    else if (key === "options" && Array.isArray(value)) out[key] = value.map((o) => ({ ...o, label: slimLocalized(o.label) }));
    else out[key] = value;
  }
  return out;
}

/**
 * Drops every field/section prop that equals its default, so persisted documents are smaller.
 * Lossless: `migrateDocument` restores the defaults, so `migrateDocument(compactDocument(d))` equals `migrateDocument(d)`.
 * Empty non-`en` translations are dropped too, and the result carries `compact: COMPACT_VERSION`.
 * Extra top-level keys (`version`, `theme`, `themeOverrides`, …) pass through untouched.
 */
export function compactDocument<T extends { title?: unknown; sections: { title?: unknown; fields: FormField[]; background?: string; collapsed?: boolean }[] }>(doc: T): T {
  return {
    ...doc,
    compact: COMPACT_VERSION,
    ...(doc.title !== undefined ? { title: slimLocalized(doc.title) } : {}),
    sections: doc.sections.map((s) => {
      const { background, collapsed, fields, ...rest } = s;
      return {
        ...rest,
        ...(s.title !== undefined ? { title: slimLocalized(s.title) } : {}),
        ...(background ? { background } : {}),
        ...(collapsed ? { collapsed } : {}),
        fields: fields.map(compactField),
      };
    }),
  } as unknown as T;
}
