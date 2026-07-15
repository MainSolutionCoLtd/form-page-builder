import type { FieldType } from "./constants/fieldTypes";
import type { IconKey } from "./constants/icons";
import type { ChromeShape } from "./i18n/chrome";
import type { StringsShape } from "./i18n/strings";
import type { LanguageOption } from "./i18n/languages";

export type { FieldType, IconKey, ChromeShape, StringsShape, LanguageOption };

// --- i18n / bilingual content ---
export interface LocalizedString {
  en: string;
  [lang: string]: string | undefined;
}

export interface Option {
  label: LocalizedString;
  value: string;
}

// --- field union ---
export type WidthOption = "1/3" | "1/2" | "1/1";
export type VerticalAlign = "top" | "middle" | "bottom";
export type LabelPosition = "top" | "inline";

interface BaseField {
  id: string;
  type: FieldType;
  label: LocalizedString;
  hideLabel: boolean;
  width: WidthOption;
  verticalAlign: VerticalAlign;
  labelPosition: LabelPosition;
  showIcon: boolean;
  displayIcon: IconKey;
  required?: boolean;
}

export interface InputField extends BaseField {
  type: "input";
  inputType: "text" | "email" | "phone" | "number" | "password" | "date" | "time";
  placeholder: LocalizedString;
  maxLength?: number | null;
  min?: number | null;
  max?: number | null;
  defaultValue: string;
  required: boolean;
}
export interface TextareaField extends BaseField {
  type: "textarea";
  placeholder: LocalizedString;
  maxLength?: number | null;
  defaultValue: string;
  required: boolean;
}
export interface SelectField extends BaseField {
  type: "select";
  options: Option[];
  defaultValue: string;
  required: boolean;
}
export interface RadioField extends BaseField {
  type: "radio";
  options: Option[];
  defaultValue: string;
  required: boolean;
}
export interface CheckboxGroupField extends BaseField {
  type: "checkboxGroup";
  options: Option[];
  defaultValue: string[];
  required: boolean;
}
export interface CheckboxField extends BaseField {
  type: "checkbox";
  defaultValue: boolean;
  required: boolean;
}
export interface ToggleField extends BaseField {
  type: "toggle";
  defaultValue: boolean;
  required: boolean;
}
export interface ParagraphField extends BaseField {
  type: "paragraph";
  content: LocalizedString;
  tag: "h1" | "h2" | "h3" | "p" | "caption";
  fontSize: "sm" | "md" | "lg" | "xl";
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textAlign: "left" | "center" | "right";
  color: string;
}
export interface ImageField extends BaseField {
  type: "image";
  src: string;
  alt: LocalizedString;
  link: string;
  shape: "square" | "circle" | "banner";
}

export type FormField =
  | InputField | TextareaField | SelectField | RadioField | CheckboxGroupField
  | CheckboxField | ToggleField | ParagraphField | ImageField;

/**
 * Flat, fully-optional patch type for updateField/updateOption call sites.
 * A strict `Partial<FormField>` doesn't typecheck for cross-type shallow
 * merges (e.g. `defaultValue: string` vs `boolean` collapses to `never`),
 * so mutation call sites use this instead of the discriminated union.
 */
export interface FieldPatch {
  label?: LocalizedString;
  hideLabel?: boolean;
  width?: WidthOption;
  verticalAlign?: VerticalAlign;
  labelPosition?: LabelPosition;
  showIcon?: boolean;
  displayIcon?: IconKey;
  required?: boolean;
  inputType?: InputField["inputType"];
  placeholder?: LocalizedString;
  maxLength?: number | null;
  min?: number | null;
  max?: number | null;
  options?: Option[];
  defaultValue?: string | boolean | string[];
  content?: LocalizedString;
  tag?: ParagraphField["tag"];
  fontSize?: ParagraphField["fontSize"];
  fontWeight?: ParagraphField["fontWeight"];
  fontStyle?: ParagraphField["fontStyle"];
  textAlign?: ParagraphField["textAlign"];
  color?: string;
  src?: string;
  alt?: LocalizedString;
  link?: string;
  shape?: ImageField["shape"];
}

// --- section / document ---
export interface SubmitStyle {
  color: string;
  size: "sm" | "md" | "lg";
}
export interface Section {
  id: string;
  title: LocalizedString;
  background: string;
  collapsed: boolean;
  submitStyle: SubmitStyle | null;
  fields: FormField[];
}

export interface DocumentFields {
  title: LocalizedString;
  submitLabel: LocalizedString;
  submitMode: "combined" | "perSection";
  submitStyle: SubmitStyle;
  themeOverrides: ThemeOverrides;
  sections: Section[];
}
/** Shape used only for the "View JSON" export (stamped with a version). */
export interface FormDocument extends DocumentFields {
  version: 4;
}
/** Shape persisted as the autosaved draft. */
export interface DraftRecord extends DocumentFields {
  currentFormId: string | null;
}
/** Shape persisted per saved form in the library. */
export interface SavedFormRecord extends DocumentFields {
  id: string;
  updatedAt: number;
}
export interface SavedFormMeta {
  id: string;
  title: string;
  updatedAt: number;
}

// --- theme ---
export interface ThemeLayout {
  maxWidth: number;
  pagePadding: number;
  canvasPadding: number;
  sectionGap: number;
  fieldGap: number;
  toolbarPadding: number;
  panelPadding: number;
  ticketPadding: number;
}
export interface Theme {
  primary: string;
  primarySoft: string;
  danger: string;
  dangerSoft: string;
  ink: string;
  muted: string;
  border: string;
  surface: string;
  canvas: string;
  pageBackground: string;
  layout: ThemeLayout;
}
export type ThemeOverrides = Partial<Omit<Theme, "layout">> & { layout?: Partial<ThemeLayout> };

// --- storage adapter (pluggable persistence) ---
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

// --- props ---
export interface FormBuilderProps {
  theme?: Partial<Theme>;
  language?: string;
  languages?: LanguageOption[];
  strings?: Record<string, Partial<StringsShape>>;
  chrome?: Record<string, Partial<ChromeShape>>;
  themeEditable?: boolean;
  storage?: StorageAdapter;
}
