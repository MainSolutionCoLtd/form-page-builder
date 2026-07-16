import type { ChromeShape } from "../i18n/chrome";
import type { FieldType, FormField, Section } from "../types";
import { FIELD_TYPE_CHROME_KEY, getMeta } from "../constants/fieldTypes";
import { bi, withLang } from "./bilingual";
import { nextId, genSectionId } from "./id";

export function defaultFieldFor(type: FieldType, language: string, chrome: ChromeShape): FormField {
  const meta = getMeta(type);
  const seedLabel = (chrome as Record<string, unknown>)[FIELD_TYPE_CHROME_KEY[type]] as string | undefined || type;
  const base: Record<string, unknown> = {
    id: nextId(),
    type,
    label: withLang(bi(), language, seedLabel),
    hideLabel: false,
    width: "1/1",
    verticalAlign: "top",
    labelPosition: "top",
    showIcon: false,
    displayIcon: meta.defaultIcon,
  };
  if (!meta.isContent) base.required = false;
  if (meta.hasSubtype) base.inputType = "text";
  if (meta.placeholder) base.placeholder = bi();
  if (meta.options) {
    base.options = [
      { label: withLang(bi(), language, chrome.optionSeed(1)), value: "option_1" },
      { label: withLang(bi(), language, chrome.optionSeed(2)), value: "option_2" },
    ];
  }
  if (meta.isImage) {
    base.src = "";
    base.alt = bi();
    base.link = "";
    base.shape = "square";
  } else if (meta.boolean) {
    base.defaultValue = false;
  } else if (meta.multiValue) {
    base.defaultValue = [];
  } else if (type === "paragraph") {
    base.content = bi();
    base.tag = "p";
    base.fontSize = "md";
    base.fontWeight = "normal";
    base.fontStyle = "normal";
    base.textAlign = "left";
    base.color = "";
  } else {
    base.defaultValue = "";
  }
  // `base` is built up field-by-field depending on the type's metadata flags,
  // so it can only be soundly typed as FormField once fully assembled.
  return base as unknown as FormField;
}

export function defaultSection(titleEn = ""): Section {
  return { id: genSectionId(), title: bi(titleEn, ""), background: "", collapsed: false, submitStyle: null, submitLabel: null, fields: [] };
}
