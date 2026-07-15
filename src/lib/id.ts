import type { FormField } from "../types";

export const genFormId = () => `form_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
export const genSectionId = () => `section_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

let idCounter = 1;
export const nextId = () => `field_${idCounter++}`;

export function resyncIdCounter(fields: FormField[]) {
  let max = 0;
  fields.forEach((f) => {
    const m = /^field_(\d+)$/.exec(f.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  idCounter = Math.max(idCounter, max + 1);
}
