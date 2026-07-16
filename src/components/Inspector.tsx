import { Bold, Italic, X, Plus, Trash2 } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { FieldPatch, FormField, LocalizedString, Option } from "../types";
import { getMeta, INPUT_SUBTYPES, INPUT_SUBTYPE_CHROME_KEY, IMAGE_SHAPE_CHROME_KEY } from "../constants/fieldTypes";
import { IMAGE_SHAPES } from "../constants/fieldTypes";
import { PARAGRAPH_TAG_OPTIONS, TAG_CHROME_KEY, TAG_PRESETS, FONT_SIZE_OPTIONS, TEXT_ALIGN_OPTIONS } from "../constants/typography";
import { COLOR_SWATCHES, BUTTON_COLOR_SWATCHES } from "../constants/colors";
import { SUBMIT_SIZE_OPTIONS } from "../constants/submitStyle";
import { WIDTH_OPTIONS } from "../constants/layout";
import { ICON_LIBRARY } from "../constants/icons";
import { t, withLang } from "../lib/bilingual";
import { styles } from "../styles/styles";
import { Segmented } from "./Segmented";
import { DefaultValueEditor } from "./fields/DefaultValueEditor";

export interface InspectorProps {
  selected: FormField | null;
  language: string;
  chrome: ChromeShape;
  onUpdateField: (patch: FieldPatch) => void;
  onDeleteField: () => void;
  onUpdateOption: (optIdx: number, patch: Partial<Option>) => void;
  onAddOption: () => void;
  onRemoveOption: (optIdx: number) => void;
}

export function Inspector({ selected, language, chrome, onUpdateField, onDeleteField, onUpdateOption, onAddOption, onRemoveOption }: InspectorProps) {
  return (
    <div style={styles.inspector}>
      <div style={styles.panelHeading}>{chrome.properties}</div>
      {!selected ? (
        <div style={styles.inspectorEmpty}>{chrome.selectFieldHint}</div>
      ) : (
        <InspectorBody
          selected={selected}
          language={language}
          chrome={chrome}
          onUpdateField={onUpdateField}
          onDeleteField={onDeleteField}
          onUpdateOption={onUpdateOption}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
        />
      )}
    </div>
  );
}

function InspectorBody({ selected, language, chrome, onUpdateField, onDeleteField, onUpdateOption, onAddOption, onRemoveOption }: Omit<InspectorProps, "selected"> & { selected: FormField }) {
  const meta = getMeta(selected.type);
  const f = selected as any;

  return (
    <div style={styles.inspectorBody}>
      {(!meta.isContent || selected.type === "button") && (
        <>
          <label style={styles.propLabel}>{selected.type === "button" ? chrome.buttonText : chrome.label}</label>
          <input style={styles.propInput} value={t(selected.label, language)} onChange={(e) => onUpdateField({ label: withLang(selected.label, language, e.target.value) })} />
          {!meta.isContent && (
            <label style={styles.toggleRow}>
              <input type="checkbox" checked={!!selected.hideLabel} onChange={(e) => onUpdateField({ hideLabel: e.target.checked })} style={{ width: 15, height: 15, accentColor: "var(--fb-primary)" }} />
              <span style={{ fontSize: 13, color: "#4A4D57" }}>{chrome.hideLabel}</span>
            </label>
          )}
        </>
      )}

      {meta.hasSubtype && (
        <>
          <label style={styles.propLabel}>{chrome.inputType}</label>
          <select style={styles.propInput} value={f.inputType || "text"} onChange={(e) => onUpdateField({ inputType: e.target.value as FieldPatch["inputType"] })}>
            {INPUT_SUBTYPES.map((s) => (<option key={s} value={s}>{chrome[INPUT_SUBTYPE_CHROME_KEY[s] as keyof ChromeShape] as string}</option>))}
          </select>
        </>
      )}

      {selected.type === "paragraph" && (
        <>
          <label style={styles.propLabel}>{chrome.content}</label>
          <textarea style={{ ...styles.propInput, minHeight: 70, resize: "vertical" }} value={t(selected.content, language)} onChange={(e) => onUpdateField({ content: withLang(selected.content, language, e.target.value) })} />

          <div style={styles.inspectorDivider} />
          <div style={styles.panelHeading}>{chrome.typography}</div>
          <label style={styles.propLabel}>{chrome.headingStyle}</label>
          <Segmented options={PARAGRAPH_TAG_OPTIONS.map((v) => ({ value: v, label: TAG_CHROME_KEY[v] ? (chrome[TAG_CHROME_KEY[v] as keyof ChromeShape] as string) : v.toUpperCase() }))} value={selected.tag || "p"} onChange={(v) => onUpdateField({ tag: v, ...TAG_PRESETS[v] })} />
          <label style={styles.propLabel}>{chrome.width}</label>
          <Segmented options={FONT_SIZE_OPTIONS} value={selected.fontSize || "md"} onChange={(v) => onUpdateField({ fontSize: v })} />
          <label style={styles.propLabel}>{chrome.style}</label>
          <div style={styles.styleToggleRow}>
            <button type="button" style={selected.fontWeight === "bold" ? styles.styleToggleActive : styles.styleToggle} onClick={() => onUpdateField({ fontWeight: selected.fontWeight === "bold" ? "normal" : "bold" })}><Bold size={14} /></button>
            <button type="button" style={selected.fontStyle === "italic" ? styles.styleToggleActive : styles.styleToggle} onClick={() => onUpdateField({ fontStyle: selected.fontStyle === "italic" ? "normal" : "italic" })}><Italic size={14} /></button>
          </div>
          <label style={styles.propLabel}>{chrome.align}</label>
          <Segmented options={TEXT_ALIGN_OPTIONS} value={selected.textAlign || "left"} onChange={(v) => onUpdateField({ textAlign: v })} />
          <label style={styles.propLabel}>{chrome.color}</label>
          <div style={styles.swatchRow}>
            {COLOR_SWATCHES.map((c) => (<button key={c || "default"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-ink)", ...(selected.color === c ? styles.swatchBtnActive : {}) }} onClick={() => onUpdateField({ color: c })} />))}
            <input type="color" value={selected.color || "#1B1E24"} onChange={(e) => onUpdateField({ color: e.target.value })} style={styles.colorPickerInput} />
          </div>
        </>
      )}

      {selected.type === "image" && (
        <>
          <label style={styles.propLabel}>{chrome.imageUrl}</label>
          <input style={styles.propInput} placeholder="https://..." value={selected.src || ""} onChange={(e) => onUpdateField({ src: e.target.value })} />
          <p style={styles.helperText}>{chrome.imageUrlHelper}</p>
          <label style={styles.propLabel}>{chrome.altText}</label>
          <input style={styles.propInput} value={t(selected.alt, language)} onChange={(e) => onUpdateField({ alt: withLang(selected.alt, language, e.target.value) })} />
          <label style={styles.propLabel}>{chrome.linkOptional}</label>
          <input style={styles.propInput} placeholder="https://..." value={selected.link || ""} onChange={(e) => onUpdateField({ link: e.target.value })} />
          <label style={styles.propLabel}>{chrome.shape}</label>
          <Segmented options={IMAGE_SHAPES.map((v) => ({ value: v, label: chrome[IMAGE_SHAPE_CHROME_KEY[v] as keyof ChromeShape] as string }))} value={selected.shape || "square"} onChange={(v) => onUpdateField({ shape: v })} />
          <p style={styles.helperText}>Fills the field's own width (set below under Layout) and scales height automatically — always responsive, never overflows.</p>
        </>
      )}

      {selected.type === "button" && (
        <>
          <div style={styles.inspectorDivider} />
          <div style={styles.panelHeading}>{chrome.buttonActionTitle}</div>
          <label style={styles.propLabel}>{chrome.buttonAction}</label>
          <Segmented options={[{ value: "link", label: chrome.actionLink }, { value: "submit", label: chrome.actionSubmit }]} value={selected.action || "submit"} onChange={(v) => onUpdateField({ action: v as FieldPatch["action"] })} />

          {selected.action === "link" ? (
            <>
              <label style={styles.propLabel}>{chrome.linkOptional}</label>
              <input style={styles.propInput} placeholder="https://..." value={selected.href || ""} onChange={(e) => onUpdateField({ href: e.target.value })} />
              <label style={styles.propLabel}>{chrome.openIn}</label>
              <Segmented options={[{ value: "_self", label: chrome.sameTab }, { value: "_blank", label: chrome.newTab }]} value={selected.target || "_self"} onChange={(v) => onUpdateField({ target: v as FieldPatch["target"] })} />
            </>
          ) : (
            <>
              <label style={styles.propLabel}>{chrome.submitScope}</label>
              <Segmented options={[{ value: "section", label: chrome.thisSection }, { value: "form", label: chrome.wholeForm }]} value={selected.submitScope || "form"} onChange={(v) => onUpdateField({ submitScope: v as FieldPatch["submitScope"] })} />
            </>
          )}

          <label style={styles.propLabel}>{chrome.color}</label>
          <div style={styles.swatchRow}>
            {BUTTON_COLOR_SWATCHES.map((c) => (<button key={c || "default"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-primary)", ...((selected.buttonStyle?.color || "") === c ? styles.swatchBtnActive : {}) }} onClick={() => onUpdateField({ buttonStyle: { ...selected.buttonStyle, color: c } })} />))}
            <input type="color" value={selected.buttonStyle?.color || "#5B5FEF"} onChange={(e) => onUpdateField({ buttonStyle: { ...selected.buttonStyle, color: e.target.value } })} style={styles.colorPickerInput} />
          </div>
          <label style={styles.propLabel}>{chrome.buttonSize}</label>
          <Segmented options={SUBMIT_SIZE_OPTIONS} value={selected.buttonStyle?.size || "md"} onChange={(v) => onUpdateField({ buttonStyle: { ...selected.buttonStyle, size: v } })} />
        </>
      )}

      {meta.placeholder && (
        <>
          <label style={styles.propLabel}>{chrome.placeholder}</label>
          <input style={styles.propInput} value={t(f.placeholder, language)} onChange={(e) => onUpdateField({ placeholder: withLang(f.placeholder, language, e.target.value) })} />
        </>
      )}

      {selected.type === "input" && (selected.inputType === "text" || selected.inputType === "password" || !selected.inputType) && (
        <><label style={styles.propLabel}>{chrome.maxLength}</label><input type="number" style={styles.propInput} placeholder={chrome.noLimit} value={selected.maxLength || ""} onChange={(e) => onUpdateField({ maxLength: e.target.value ? Number(e.target.value) : null })} /></>
      )}
      {selected.type === "input" && selected.inputType === "number" && (
        <>
          <label style={styles.propLabel}>{chrome.minValue}</label><input type="number" style={styles.propInput} value={selected.min ?? ""} onChange={(e) => onUpdateField({ min: e.target.value === "" ? null : Number(e.target.value) })} />
          <label style={styles.propLabel}>{chrome.maxValue}</label><input type="number" style={styles.propInput} value={selected.max ?? ""} onChange={(e) => onUpdateField({ max: e.target.value === "" ? null : Number(e.target.value) })} />
        </>
      )}
      {selected.type === "textarea" && (
        <><label style={styles.propLabel}>{chrome.maxLength}</label><input type="number" style={styles.propInput} placeholder={chrome.noLimit} value={selected.maxLength || ""} onChange={(e) => onUpdateField({ maxLength: e.target.value ? Number(e.target.value) : null })} /></>
      )}

      {meta.options && (
        <>
          <label style={styles.propLabel}>{chrome.options}</label>
          <div style={styles.optionList}>
            {((f.options || []) as Option[]).map((opt, i) => (
              <div key={i} style={styles.optionRow}>
                <input style={styles.optionInput} value={t(opt.label, language)} onChange={(e) => onUpdateOption(i, { label: withLang(opt.label, language, e.target.value) })} />
                <button style={styles.iconBtn} onClick={() => onRemoveOption(i)} disabled={(f.options || []).length <= 1}><X size={13} /></button>
              </div>
            ))}
            <button style={styles.addOptionBtn} onClick={onAddOption}><Plus size={13} /> {chrome.addOption}</button>
          </div>
        </>
      )}

      <DefaultValueEditor field={selected} meta={meta} lang={language} chrome={chrome} onChange={onUpdateField} />

      {!meta.isContent && (
        <label style={styles.toggleRow}>
          <input type="checkbox" checked={!!selected.required} onChange={(e) => onUpdateField({ required: e.target.checked })} style={{ width: 15, height: 15, accentColor: "var(--fb-primary)" }} />
          <span style={{ fontSize: 13, color: "#4A4D57" }}>{chrome.requiredField}</span>
        </label>
      )}

      <div style={styles.inspectorDivider} />
      <div style={styles.panelHeading}>{chrome.layout}</div>
      <label style={styles.propLabel}>{chrome.width}</label>
      <Segmented options={WIDTH_OPTIONS.map((o) => ({ ...o, label: o.labelKey ? chrome[o.labelKey as keyof ChromeShape] as string : o.label || "" }))} value={selected.width || "1/1"} onChange={(v) => onUpdateField({ width: v })} />
      <label style={styles.propLabel}>{chrome.verticalAlign}</label>
      <Segmented options={[{ value: "top", label: chrome.top }, { value: "middle", label: chrome.middle }, { value: "bottom", label: chrome.bottom }]} value={selected.verticalAlign || "top"} onChange={(v) => onUpdateField({ verticalAlign: v as FieldPatch["verticalAlign"] })} />
      {!meta.boolean && !meta.isContent && (
        <><label style={styles.propLabel}>{chrome.labelPosition}</label><Segmented options={[{ value: "top", label: chrome.above }, { value: "inline", label: chrome.inline }]} value={selected.labelPosition || "top"} onChange={(v) => onUpdateField({ labelPosition: v as FieldPatch["labelPosition"] })} /></>
      )}

      {!meta.isContent && (
        <>
          <div style={styles.inspectorDivider} />
          <div style={styles.panelHeading}>{chrome.icon}</div>
          <label style={styles.toggleRow}>
            <input type="checkbox" checked={!!selected.showIcon} onChange={(e) => onUpdateField({ showIcon: e.target.checked })} style={{ width: 15, height: 15, accentColor: "var(--fb-primary)" }} />
            <span style={{ fontSize: 13, color: "#4A4D57" }}>{chrome.showIcon}</span>
          </label>
          {selected.showIcon && (
            <div style={styles.iconGrid}>
              {Object.keys(ICON_LIBRARY).map((key) => {
                const IconComp = ICON_LIBRARY[key as keyof typeof ICON_LIBRARY];
                const active = selected.displayIcon === key;
                return (<button key={key} type="button" title={key} style={active ? styles.iconGridBtnActive : styles.iconGridBtn} onClick={() => onUpdateField({ displayIcon: key as FieldPatch["displayIcon"] })}><IconComp size={15} /></button>);
              })}
            </div>
          )}
        </>
      )}

      <div style={styles.inspectorDivider} />
      <button style={styles.deleteFieldBtn} onClick={onDeleteField}><Trash2 size={13} /> {chrome.deleteField}</button>
    </div>
  );
}
