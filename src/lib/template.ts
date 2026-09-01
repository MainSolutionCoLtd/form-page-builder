import type { DocumentFields, FormDocument, FormTemplate } from "../types";
import { migrateDocument } from "./migrate";

/** Bumped only if the envelope shape (not the document shape) changes. */
export const TEMPLATE_FORMAT = 1;

export function serializeTemplate(document: FormDocument): string {
  const envelope: FormTemplate = { __fpb: "template", v: TEMPLATE_FORMAT, document };
  return JSON.stringify(envelope);
}

/**
 * Parses a serialized template back into a ready-to-load document. Accepts either
 * a `serializeTemplate` envelope or a bare document (e.g. copy-pasted "View JSON"
 * output). Runs everything through `migrateDocument`, so older/looser shapes are
 * tolerated. Returns `null` for anything that isn't valid JSON describing a document.
 */
export function parseTemplate(raw: string | null | undefined): DocumentFields | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  const candidate = obj.__fpb === "template" && obj.document ? obj.document : obj;
  return migrateDocument(candidate as Record<string, unknown>);
}
