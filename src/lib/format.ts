import type { FormField } from "../types";
import { t } from "./bilingual";

export function formatValue(field: FormField, lang: string): string {
  const v = (field as any).defaultValue;
  if (Array.isArray(v)) {
    if (v.length === 0) return "—";
    return v.map((val: string) => t((field as any).options?.find((o: any) => o.value === val)?.label, lang) || val).join(", ");
  }
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if ((field as any).options && v) return t((field as any).options.find((o: any) => o.value === v)?.label, lang) || v;
  if (v === undefined || v === null || v === "") return "—";
  return String(v);
}
