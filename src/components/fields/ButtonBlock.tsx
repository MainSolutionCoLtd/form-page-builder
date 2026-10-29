import type { ButtonField } from "../../types";
import { tAny } from "../../lib/bilingual";
import { buttonStyle } from "../../lib/blockStyle";

export function ButtonBlock({ field, lang, onAction }: { field: ButtonField; lang: string; onAction?: (field: ButtonField) => void }) {
  return (
    <button type="button" style={buttonStyle(field)} onClick={() => onAction?.(field)}>
      {tAny(field.label, lang) || "..."}
    </button>
  );
}
