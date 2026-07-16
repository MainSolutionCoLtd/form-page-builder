import type { LanguageOption } from "../types";
import { styles } from "../styles/styles";

export interface LanguageToggleProps {
  languages: LanguageOption[];
  value: string;
  onChange: (code: string) => void;
}

export function LanguageToggle({ languages, value, onChange }: LanguageToggleProps) {
  const activeIdx = Math.max(0, languages.findIndex((l) => l.code === value));
  const n = languages.length || 1;

  return (
    <div style={styles.langToggleTrack}>
      <div
        style={{
          ...styles.langToggleThumb,
          width: `calc(${100 / n}% - 3px)`,
          transform: `translateX(calc(${activeIdx * 100}% + ${activeIdx * 3}px))`,
        }}
      />
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          style={l.code === value ? styles.langToggleBtnActive : styles.langToggleBtn}
          onClick={() => onChange(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
