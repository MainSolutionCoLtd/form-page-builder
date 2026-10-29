import type { ChromeShape } from "../i18n/chrome";
import { CHROME } from "../i18n/chrome";
import type { LocalizedString } from "../types";
import { FIELD_TYPE_CHROME_KEY } from "../constants/fieldTypes";

export const DEFAULT_FORM_TITLE = "Untitled form";

const OPTION_SEED_COUNT = 30;

/** Every built-in default text a new block can start with, in every language: the field-type names, "Option n" and the form title. */
export function collectDefaultTexts(current?: ChromeShape): Set<string> {
  const texts = new Set<string>([DEFAULT_FORM_TITLE]);
  for (const chrome of [...Object.values(CHROME), ...(current ? [current] : [])] as ChromeShape[]) {
    for (const key of Object.values(FIELD_TYPE_CHROME_KEY)) {
      const text = (chrome as Record<string, unknown>)[key];
      if (typeof text === "string" && text) texts.add(text);
    }
    for (let n = 1; n <= OPTION_SEED_COUNT; n++) texts.add(chrome.optionSeed(n));
  }
  return texts;
}

/**
 * After the author types text in one language, empties the other languages that still hold an untouched default,
 * so a stale "Input" never sits next to their own wording. Text the author wrote is left alone, and nothing is
 * cleared when the edit empties a language. Display falls back across languages, so the cleared one shows the new text.
 */
export function dropStaleDefaults(prev: LocalizedString | undefined, next: LocalizedString, defaults: Set<string>): LocalizedString {
  const edited = Object.keys(next).filter((lang) => (next[lang] ?? "") !== (prev?.[lang] ?? ""));
  if (edited.length === 0 || edited.some((lang) => !next[lang])) return next;
  const out: LocalizedString = { ...next };
  for (const lang of Object.keys(out)) {
    if (!edited.includes(lang) && out[lang] && defaults.has(out[lang])) out[lang] = "";
  }
  return out;
}
