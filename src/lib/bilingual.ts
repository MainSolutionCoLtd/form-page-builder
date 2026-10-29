import type { LocalizedString } from "../types";

export function bi(en = "", ja = ""): LocalizedString {
  return { en, ja };
}

export function t(val: LocalizedString | string | undefined, lang: string): string {
  if (val && typeof val === "object") return val[lang] || val.en || "";
  return val || "";
}

/** What is stored for exactly this language (no fallback) — the value an editing input shows. */
export function ownText(val: LocalizedString | string | undefined, lang: string): string {
  if (val && typeof val === "object") return val[lang] ?? "";
  return val || "";
}

/** Display text: the language, then `en`, then any translation that has text — so a block written in one language never shows blank in another. */
export function tAny(val: LocalizedString | string | undefined, lang: string): string {
  if (val && typeof val === "object") return val[lang] || val.en || Object.values(val).find(Boolean) || "";
  return val || "";
}

export function withLang(val: LocalizedString | string | undefined, lang: string, value: string): LocalizedString {
  const base = val && typeof val === "object" ? val : bi(typeof val === "string" ? val : "");
  return { ...base, [lang]: value };
}
