import type { ButtonField } from "../../types";
import { t } from "../../lib/bilingual";
import { buttonStyle } from "../../lib/blockStyle";

export function ButtonBlock({ field, lang, onAction }: { field: ButtonField; lang: string; onAction?: (field: ButtonField) => void }) {
  return (
    <button type="button" style={buttonStyle(field)} onClick={() => onAction?.(field)}>
      {t(field.label, lang) || "..."}
    </button>
  );
}
