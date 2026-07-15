import type { ChangeEvent, ElementType } from "react";
import { CircleAlert } from "lucide-react";
import type { ChromeShape } from "../../i18n/chrome";
import type { StringsShape } from "../../i18n/strings";
import type { FieldPatch, FormField, ImageField, ParagraphField } from "../../types";
import { FONT_SIZE_OPTIONS, TAG_TO_ELEMENT } from "../../constants/typography";
import { getMeta } from "../../constants/fieldTypes";
import { ICON_LIBRARY, type IconComponent } from "../../constants/icons";
import { t } from "../../lib/bilingual";
import { styles } from "../../styles/styles";
import { ImageBlock } from "./ImageBlock";

export interface FieldBlockProps {
  field: FormField;
  lang: string;
  onFieldChange: (fieldId: string, patch: FieldPatch) => void;
  strings: StringsShape;
  chrome?: ChromeShape;
  error?: string | null;
  isBuild?: boolean;
}

export function FieldBlock({ field, lang, onFieldChange, strings, chrome, error, isBuild }: FieldBlockProps) {
  if (field.type === "image") return <ImageBlock field={field} lang={lang} />;

  if (field.type === "paragraph") {
    const fontPx = FONT_SIZE_OPTIONS.find((f) => f.value === field.fontSize)?.px || 14;
    const Tag = (TAG_TO_ELEMENT[field.tag] || "p") as ElementType;
    return (
      <Tag style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: fontPx, fontWeight: field.fontWeight === "bold" ? 700 : 400, fontStyle: field.fontStyle === "italic" ? "italic" : "normal", textAlign: field.textAlign || "left", color: field.color || "var(--fb-ink)", lineHeight: 1.6 }}>
        {t(field.content, lang) || "..."}
      </Tag>
    );
  }

  const meta = getMeta(field.type);
  const IconComp = field.showIcon && field.displayIcon ? ICON_LIBRARY[field.displayIcon] : null;
  const isInline = field.labelPosition === "inline" && !meta.boolean;
  const labelText = t(field.label, lang);
  const showLabel = !meta.boolean && !field.hideLabel;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: isInline ? "row" : "column", alignItems: isInline ? "center" : "stretch", gap: isInline ? 10 : 6 }}>
        {showLabel && (
          <label style={{ ...styles.previewLabel, marginBottom: isInline ? 0 : 6, flexShrink: 0, width: isInline ? 120 : "auto", display: "flex", alignItems: "center", gap: 6 }}>
            {IconComp && <IconComp size={14} color="#6B6E79" />}
            {labelText || (isBuild ? <span style={{ fontStyle: "italic", color: "var(--fb-muted)" }}>{chrome?.untitledField || "Untitled field"}</span> : "")}
            {field.required && <span style={{ color: "var(--fb-danger)" }}> *</span>}
          </label>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>{renderInteractive(field, lang, onFieldChange, IconComp, !!error, strings)}</div>
      </div>
      {error && (<div style={styles.fieldError}><CircleAlert size={12} /> {error}</div>)}
    </div>
  );
}

type InteractiveField = Exclude<FormField, ImageField | ParagraphField>;

function renderInteractive(
  field: InteractiveField,
  lang: string,
  onFieldChange: (fieldId: string, patch: FieldPatch) => void,
  IconComp: IconComponent | null,
  hasError: boolean,
  strings: StringsShape,
) {
  const value = field.defaultValue;
  const set = (v: string | boolean | string[]) => onFieldChange(field.id, { defaultValue: v });
  const inputStyle = hasError ? { ...styles.realInput, ...styles.realInputError } : styles.realInput;
  const common = { style: inputStyle, placeholder: t("placeholder" in field ? field.placeholder : undefined, lang), value: (value as string) || "", onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(e.target.value) };

  if (field.type === "input") {
    switch (field.inputType) {
      case "number": return <input type="number" {...common} min={field.min ?? undefined} max={field.max ?? undefined} />;
      case "email": return <input type="email" {...common} />;
      case "password": return <input type="password" {...common} maxLength={field.maxLength || undefined} />;
      case "phone": return <input type="tel" {...common} />;
      case "date": return <input type="date" {...common} />;
      case "time": return <input type="time" {...common} />;
      default: return <input type="text" {...common} maxLength={field.maxLength || undefined} />;
    }
  }

  switch (field.type) {
    case "textarea":
      return <textarea {...common} rows={3} maxLength={field.maxLength || undefined} />;
    case "select":
      return (
        <select style={inputStyle} value={(value as string) || ""} onChange={(e) => set(e.target.value)}>
          <option value="">{strings.selectPlaceholder}</option>
          {(field.options || []).map((o) => (<option key={o.value} value={o.value}>{t(o.label, lang)}</option>))}
        </select>
      );
    case "radio":
      return (<div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 4 }}>{(field.options || []).map((o) => (<label key={o.value} style={styles.previewRadio}><input type="radio" name={field.id} value={o.value} checked={value === o.value} onChange={(e) => set(e.target.value)} />{t(o.label, lang)}</label>))}</div>);
    case "checkboxGroup": {
      const vals = Array.isArray(value) ? value : [];
      return (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 4 }}>
          {(field.options || []).map((o) => { const checked = vals.includes(o.value); return (<label key={o.value} style={styles.previewRadio}><input type="checkbox" checked={checked} onChange={(e) => { const next = e.target.checked ? [...vals, o.value] : vals.filter((v) => v !== o.value); set(next); }} style={{ accentColor: "var(--fb-primary)" }} />{t(o.label, lang)}</label>); })}
        </div>
      );
    }
    case "checkbox":
      return (<label style={styles.previewRadio}><input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} style={{ accentColor: "var(--fb-primary)" }} />{IconComp && <IconComp size={14} color="#6B6E79" />}{t(field.label, lang)}{field.required && <span style={{ color: "var(--fb-danger)" }}> *</span>}</label>);
    case "toggle":
      return (<label style={styles.previewRadio}><input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} style={{ accentColor: "var(--fb-primary)" }} />{IconComp && <IconComp size={14} color="#6B6E79" />}{t(field.label, lang)}</label>);
    default:
      return <input type="text" {...common} />;
  }
}
