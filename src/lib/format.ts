import type { FormField } from "../types";
import type { StringsShape } from "../i18n/strings";
import { tAny } from "./bilingual";

export function formatValue(field: FormField, lang: string, strings: Pick<StringsShape, "yes" | "no">): string {
  const v = (field as any).defaultValue;
  if (Array.isArray(v)) {
    if (v.length === 0) return "—";
    return v.map((val: string) => tAny((field as any).options?.find((o: any) => o.value === val)?.label, lang) || val).join(", ");
  }
  if (typeof v === "boolean") return v ? strings.yes : strings.no;
  if ((field as any).options && v) return tAny((field as any).options.find((o: any) => o.value === v)?.label, lang) || v;
  if (v === undefined || v === null || v === "") return "—";
  return String(v);
}
