import type { DocumentFields, FormDocument, FormTemplate } from "../types";
import { migrateDocument } from "./migrate";

/** Envelope version — bump only if the wrapper shape changes, not the document. */
export const TEMPLATE_FORMAT = 1;

export function serializeTemplate(document: FormDocument): string {
  const envelope: FormTemplate = { __fpb: "template", v: TEMPLATE_FORMAT, document };
  return JSON.stringify(envelope);
}

/** Accepts a `serializeTemplate` envelope or a bare document (e.g. "View JSON" output); `null` if not a document. */
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
