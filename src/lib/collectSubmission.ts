import type { FormField } from "../types";
import { getMeta } from "../constants/fieldTypes";

/** Raw (not display-formatted) `defaultValue` per non-content field, keyed by field id. */
export function collectFieldValues(fields: FormField[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  fields.forEach((f) => {
    if (getMeta(f.type).isContent) return;
    values[f.id] = (f as any).defaultValue;
  });
  return values;
}
