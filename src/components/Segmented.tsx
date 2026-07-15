import type { ReactNode } from "react";
import type { IconComponent } from "../constants/icons";
import { styles } from "../styles/styles";

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: IconComponent;
}

export interface SegmentedProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string = string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div style={styles.segmented}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (
          <button key={opt.value} type="button" style={active ? styles.segmentedBtnActive : styles.segmentedBtn} onClick={() => onChange(opt.value)}>
            {Icon && <Icon size={13} />}{opt.label}
          </button>
        );
      })}
    </div>
  );
}
