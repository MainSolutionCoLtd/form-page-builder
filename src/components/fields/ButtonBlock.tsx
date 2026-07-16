import type { ButtonField } from "../../types";
import { resolveSubmitStyle } from "../../constants/submitStyle";
import { t } from "../../lib/bilingual";
import { styles } from "../../styles/styles";

export function ButtonBlock({ field, lang, onAction }: { field: ButtonField; lang: string; onAction?: (field: ButtonField) => void }) {
  return (
    <button type="button" style={{ ...styles.submitBtn, ...resolveSubmitStyle(field.buttonStyle) }} onClick={() => onAction?.(field)}>
      {t(field.label, lang) || "..."}
    </button>
  );
}
