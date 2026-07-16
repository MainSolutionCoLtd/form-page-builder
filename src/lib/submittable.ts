import type { Section } from "../types";
import { getMeta } from "../constants/fieldTypes";

/** A section only produces a submit button at runtime once it holds at least one non-content (actually fillable) field. */
export function sectionHasFormFields(section: Section): boolean {
  return section.fields.some((f) => !getMeta(f.type).isContent);
}

export function formHasFormFields(sections: Section[]): boolean {
  return sections.some(sectionHasFormFields);
}

/** How many sections would actually render their own submit button in "perSection" mode. */
export function submittableSectionCount(sections: Section[]): number {
  return sections.filter(sectionHasFormFields).length;
}
