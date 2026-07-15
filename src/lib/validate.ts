import type { FormField } from "../types";
import type { StringsShape } from "../i18n/strings";
import { getMeta } from "../constants/fieldTypes";

export function validateField(field: FormField, value: unknown, strings: StringsShape): string | null {
  const meta = getMeta(field.type);
  if (meta.isContent) return null;
  const isEmpty =
    value === undefined || value === null || value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (!!meta.boolean && !!field.required && value !== true);
  if (field.required && isEmpty) return strings.requiredError;
  if (isEmpty) return null;
  if (field.type === "input" && field.inputType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return strings.invalidEmail;
  if (field.type === "input" && field.inputType === "phone" && !/^[0-9+\-\s()]{7,20}$/.test(String(value))) return strings.invalidPhone;
  if (field.type === "input" && field.inputType === "number") {
    const num = Number(value);
    if (field.min !== undefined && field.min !== null && (field.min as unknown as string) !== "" && num < Number(field.min)) return strings.tooSmall(field.min);
    if (field.max !== undefined && field.max !== null && (field.max as unknown as string) !== "" && num > Number(field.max)) return strings.tooLarge(field.max);
  }
  if (
    (field.type === "textarea" || (field.type === "input" && !["number", "date", "time"].includes(field.inputType))) &&
    field.maxLength && String(value).length > field.maxLength
  ) {
    return strings.tooLong(field.maxLength);
  }
  return null;
}
