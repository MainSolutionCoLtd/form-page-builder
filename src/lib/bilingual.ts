import type { LocalizedString } from "../types";

export function bi(en = "", ja = ""): LocalizedString {
  return { en, ja };
}

export function t(val: LocalizedString | string | undefined, lang: string): string {
  if (val && typeof val === "object") return val[lang] || val.en || "";
  return val || "";
}

export function withLang(val: LocalizedString | string | undefined, lang: string, value: string): LocalizedString {
  const base = val && typeof val === "object" ? val : bi(typeof val === "string" ? val : "");
  return { ...base, [lang]: value };
}
