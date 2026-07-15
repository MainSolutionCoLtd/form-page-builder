import { ArrowUp, ArrowDown, Copy, Trash2, GripVertical } from "lucide-react";
import type { ChromeShape } from "../i18n/chrome";
import type { StringsShape } from "../i18n/strings";
import type { FieldPatch, FormField } from "../types";
import { getMeta, FIELD_TYPE_CHROME_KEY, INPUT_SUBTYPE_CHROME_KEY } from "../constants/fieldTypes";
import { WIDTH_PERCENT, ALIGN_MAP } from "../constants/layout";
import { styles } from "../styles/styles";
import { FieldBlock } from "./fields/FieldBlock";

export interface FieldTicketProps {
  field: FormField;
  idx: number;
  sectionId: string;
  isSelected: boolean;
  isDragOver: boolean;
  chrome: ChromeShape;
  strings: StringsShape;
  language: string;
  onSelect: () => void;
  onFieldChange: (fieldId: string, patch: FieldPatch) => void;
  onMoveField: (fieldId: string, dir: 1 | -1) => void;
  onDuplicateField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  dropZoneHandlers: { onDragOver: (e: any) => void; onDragLeave: () => void; onDrop: () => void };
  dragHandleProps: { draggable: boolean; onDragStart: () => void };
}

export function FieldTicket({
  field, idx, isSelected, isDragOver, chrome, strings, language,
  onSelect, onFieldChange, onMoveField, onDuplicateField, onDeleteField,
  dropZoneHandlers, dragHandleProps,
}: FieldTicketProps) {
  const meta = getMeta(field.type);
  const Icon = meta.icon;
  const widthPct = WIDTH_PERCENT[field.width || "1/1"];

  return (
    <div
      {...dropZoneHandlers}
      onClick={onSelect}
      style={{
        ...styles.ticket,
        flex: `1 1 calc(${widthPct} - 10px)`,
        minWidth: 230,
        alignSelf: ALIGN_MAP[field.verticalAlign || "top"],
        ...(isSelected ? styles.ticketSelected : {}),
        ...(isDragOver ? styles.ticketDragOver : {}),
      }}
    >
      <div style={styles.ticketIndex}>{String(idx + 1).padStart(2, "0")}</div>
      <div style={styles.ticketPerforation} />
      <div style={styles.ticketBody}>
        <div style={styles.ticketTop}>
          <span {...dragHandleProps} style={{ cursor: "grab", display: "flex" }}><GripVertical size={14} color="#C4C6D0" /></span>
          <Icon size={13} color="var(--fb-primary)" />
          <span style={styles.typeBadge}>
            {(chrome as Record<string, unknown>)[FIELD_TYPE_CHROME_KEY[field.type]] as string || field.type}
            {field.type === "input" && field.inputType && field.inputType !== "text" ? ` · ${(chrome as Record<string, unknown>)[INPUT_SUBTYPE_CHROME_KEY[field.inputType]]}` : ""}
          </span>
          {field.required && <span style={styles.requiredBadge}>{chrome.required}</span>}
        </div>
        {(field.width && field.width !== "1/1") || field.labelPosition === "inline" || field.verticalAlign !== "top" || field.hideLabel ? (
          <div style={styles.chipRow}>
            {field.width && field.width !== "1/1" && <span style={styles.miniBadge}>{chrome.width} {field.width}</span>}
            {field.labelPosition === "inline" && <span style={styles.miniBadge}>{chrome.inline}</span>}
            {field.verticalAlign !== "top" && <span style={styles.miniBadge}>{chrome[field.verticalAlign as "middle" | "bottom"]}</span>}
            {field.hideLabel && <span style={styles.miniBadge}>{chrome.hideLabel}</span>}
          </div>
        ) : null}
        <div style={{ marginTop: 8 }}>
          <FieldBlock field={field} lang={language} onFieldChange={onFieldChange} strings={strings} chrome={chrome} isBuild />
        </div>
      </div>
      <div style={styles.ticketActions} onClick={(e) => e.stopPropagation()}>
        <button style={styles.iconBtn} title={chrome.moveUp} onClick={() => onMoveField(field.id, -1)}><ArrowUp size={13} /></button>
        <button style={styles.iconBtn} title={chrome.moveDown} onClick={() => onMoveField(field.id, 1)}><ArrowDown size={13} /></button>
        <button style={styles.iconBtn} title={chrome.duplicate} onClick={() => onDuplicateField(field.id)}><Copy size={13} /></button>
        <button style={{ ...styles.iconBtn, ...styles.iconBtnDanger }} title={chrome.delete} onClick={() => onDeleteField(field.id)}><Trash2 size={13} /></button>
      </div>
    </div>
  );
}
