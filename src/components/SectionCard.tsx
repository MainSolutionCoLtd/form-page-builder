import { ChevronDown, ChevronRight, Copy, ArrowUp, ArrowDown, Trash2, RotateCcw } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { StringsShape } from "../i18n/strings";
import type { FieldPatch, Section, SubmitStyle } from "../types";
import { SECTION_BG_SWATCHES, BUTTON_COLOR_SWATCHES } from "../constants/colors";
import { SUBMIT_SIZE_OPTIONS } from "../constants/submitStyle";
import { styles } from "../styles/styles";
import { t } from "../lib/bilingual";
import { Segmented } from "./Segmented";
import { FieldTicket } from "./FieldTicket";

export interface SectionCardProps {
  section: Section;
  sIdx: number;
  sectionsLength: number;
  isActive: boolean;
  submitMode: "combined" | "perSection";
  submitStyle: SubmitStyle;
  selectedId: string | null;
  dragOverKey: string | null;
  chrome: ChromeShape;
  strings: StringsShape;
  language: string;
  onActivate: () => void;
  onToggleCollapse: () => void;
  onUpdateTitle: (value: string) => void;
  onUpdateBackground: (color: string) => void;
  onDuplicateSection: () => void;
  onMoveSection: (dir: 1 | -1) => void;
  onDeleteSection: () => void;
  onUpdateSectionSubmitStyle: (patch: Partial<SubmitStyle>) => void;
  onClearSectionSubmitStyle: () => void;
  onSelectField: (fieldId: string) => void;
  onFieldChange: (fieldId: string, patch: FieldPatch) => void;
  onMoveField: (fieldId: string, dir: 1 | -1) => void;
  onDuplicateField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  getDropZoneHandlers: (sectionId: string, idx: number) => { onDragOver: (e: any) => void; onDragLeave: () => void; onDrop: () => void };
  getDragHandleProps: (sectionId: string, idx: number) => { draggable: boolean; onDragStart: () => void };
}

export function SectionCard({
  section, sIdx, sectionsLength, isActive, submitMode, submitStyle, selectedId, dragOverKey, chrome, strings, language,
  onActivate, onToggleCollapse, onUpdateTitle, onUpdateBackground, onDuplicateSection, onMoveSection, onDeleteSection,
  onUpdateSectionSubmitStyle, onClearSectionSubmitStyle,
  onSelectField, onFieldChange, onMoveField, onDuplicateField, onDeleteField,
  getDropZoneHandlers, getDragHandleProps,
}: SectionCardProps) {
  return (
    <div
      style={{ ...styles.sectionBlock, background: section.background || "transparent", border: isActive ? "1px solid var(--fb-primary)" : "1px dashed var(--fb-border)" }}
      onClick={onActivate}
    >
      <div style={styles.sectionHeader}>
        <button style={styles.chevronBtn} onClick={(e) => { e.stopPropagation(); onToggleCollapse(); }}>
          {section.collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
        </button>
        <span style={{ ...styles.colorDot, background: section.background || "var(--fb-canvas)" }} />
        <input
          style={styles.sectionTitleInput}
          placeholder={chrome.sectionTitlePlaceholder(sIdx + 1)}
          value={t(section.title, language)}
          onChange={(e) => onUpdateTitle(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
        {section.collapsed && <span style={styles.miniBadge}>{chrome.fieldsCount(section.fields.length)}</span>}
        <div style={styles.sectionHeaderActions} onClick={(e) => e.stopPropagation()}>
          {!section.collapsed && (
            <div style={styles.swatchRow}>
              {SECTION_BG_SWATCHES.map((c) => (
                <button key={c || "none"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-canvas)", ...(section.background === c ? styles.swatchBtnActive : {}) }} onClick={() => onUpdateBackground(c)} />
              ))}
              <input type="color" title={chrome.customColor} value={/^#/.test(section.background) ? section.background : "#ffffff"} onChange={(e) => onUpdateBackground(e.target.value)} style={styles.colorPickerInput} />
            </div>
          )}
          <button style={styles.iconBtn} title={chrome.duplicate} onClick={onDuplicateSection}><Copy size={13} /></button>
          <button style={styles.iconBtn} title={chrome.moveUp} disabled={sIdx === 0} onClick={() => onMoveSection(-1)}><ArrowUp size={13} /></button>
          <button style={styles.iconBtn} title={chrome.moveDown} disabled={sIdx === sectionsLength - 1} onClick={() => onMoveSection(1)}><ArrowDown size={13} /></button>
          <button style={{ ...styles.iconBtn, ...styles.iconBtnDanger }} title={chrome.deleteSection} disabled={sectionsLength <= 1} onClick={onDeleteSection}><Trash2 size={13} /></button>
        </div>
      </div>

      {!section.collapsed && submitMode === "perSection" && (
        <div style={styles.submitStyleRow} onClick={(e) => e.stopPropagation()}>
          <span style={styles.miniLabel}>{chrome.submitStyle}</span>
          <div style={styles.swatchRow}>
            {BUTTON_COLOR_SWATCHES.map((c) => (
              <button key={c || "inherit"} type="button" title={c || chrome.none} style={{ ...styles.swatchBtn, background: c || "var(--fb-primary)", ...((section.submitStyle?.color || "") === c ? styles.swatchBtnActive : {}) }} onClick={() => onUpdateSectionSubmitStyle({ color: c })} />
            ))}
          </div>
          <Segmented options={SUBMIT_SIZE_OPTIONS} value={section.submitStyle?.size || submitStyle.size} onChange={(v) => onUpdateSectionSubmitStyle({ size: v })} />
          {section.submitStyle && (<button type="button" style={styles.resetLinkBtn} onClick={onClearSectionSubmitStyle}><RotateCcw size={11} /> {chrome.reset}</button>)}
        </div>
      )}

      {!section.collapsed && (
        section.fields.length === 0 ? (
          <div style={styles.sectionEmpty}>{chrome.noFieldsInSection}</div>
        ) : (
          <div style={styles.fieldList}>
            {section.fields.map((field, idx) => (
              <FieldTicket
                key={field.id}
                field={field}
                idx={idx}
                sectionId={section.id}
                isSelected={field.id === selectedId}
                isDragOver={dragOverKey === `${section.id}:${idx}`}
                chrome={chrome}
                strings={strings}
                language={language}
                onSelect={() => onSelectField(field.id)}
                onFieldChange={onFieldChange}
                onMoveField={onMoveField}
                onDuplicateField={onDuplicateField}
                onDeleteField={onDeleteField}
                dropZoneHandlers={getDropZoneHandlers(section.id, idx)}
                dragHandleProps={getDragHandleProps(section.id, idx)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
