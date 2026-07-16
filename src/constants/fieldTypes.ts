import {
  Type, AlignLeft, ChevronDown, Circle, ListChecks, CheckSquare, ToggleLeft,
  FileText, Image as ImageIcon, MousePointerClick,
} from "lucide-react";
import type { IconKey, IconComponent } from "./icons";

export type FieldType =
  | "paragraph" | "image" | "button" | "input" | "textarea" | "select"
  | "radio" | "checkboxGroup" | "checkbox" | "toggle";

export interface FieldTypeMeta {
  type: FieldType;
  icon: IconComponent;
  isContent?: boolean;
  isImage?: boolean;
  placeholder?: boolean;
  hasSubtype?: boolean;
  options?: boolean;
  multiValue?: boolean;
  boolean?: boolean;
  defaultIcon: IconKey;
}

export const FIELD_TYPES: FieldTypeMeta[] = [
  { type: "paragraph", icon: FileText, isContent: true, defaultIcon: "FileText" },
  { type: "image", icon: ImageIcon, isContent: true, isImage: true, defaultIcon: "Type" },
  { type: "button", icon: MousePointerClick, isContent: true, defaultIcon: "Type" },
  { type: "input", icon: Type, placeholder: true, hasSubtype: true, defaultIcon: "Type" },
  { type: "textarea", icon: AlignLeft, placeholder: true, defaultIcon: "AlignLeft" },
  { type: "select", icon: ChevronDown, options: true, defaultIcon: "ChevronDown" },
  { type: "radio", icon: Circle, options: true, defaultIcon: "Circle" },
  { type: "checkboxGroup", icon: ListChecks, options: true, multiValue: true, defaultIcon: "ListChecks" },
  { type: "checkbox", icon: CheckSquare, boolean: true, defaultIcon: "CheckSquare" },
  { type: "toggle", icon: ToggleLeft, boolean: true, defaultIcon: "ToggleLeft" },
];
export const TYPE_MAP = Object.fromEntries(FIELD_TYPES.map((f) => [f.type, f])) as Record<FieldType, FieldTypeMeta>;
export const CONTENT_TYPES = FIELD_TYPES.filter((f) => f.isContent);
export const FORM_TYPES = FIELD_TYPES.filter((f) => !f.isContent);
export function getMeta(type: FieldType): FieldTypeMeta {
  return TYPE_MAP[type] || TYPE_MAP.input;
}

export const LEGACY_INPUT_TYPES = ["text", "email", "phone", "number", "password", "date"] as const;
export const INPUT_SUBTYPES = ["text", "email", "phone", "number", "password", "date", "time"] as const;
export const IMAGE_SHAPES = ["square", "circle", "banner"] as const;

export const FIELD_TYPE_CHROME_KEY: Record<FieldType, string> = {
  paragraph: "fieldTypeParagraph", image: "fieldTypeImage", button: "fieldTypeButton", input: "fieldTypeInput",
  textarea: "fieldTypeTextarea", select: "fieldTypeSelect", radio: "fieldTypeRadio",
  checkboxGroup: "fieldTypeCheckboxGroup", checkbox: "fieldTypeCheckbox", toggle: "fieldTypeToggle",
};
export const INPUT_SUBTYPE_CHROME_KEY: Record<string, string> = {
  text: "subtypeText", email: "subtypeEmail", phone: "subtypePhone", number: "subtypeNumber",
  password: "subtypePassword", date: "subtypeDate", time: "subtypeTime",
};
export const IMAGE_SHAPE_CHROME_KEY: Record<string, string> = {
  square: "shapeSquare", circle: "shapeCircle", banner: "shapeBanner",
};
