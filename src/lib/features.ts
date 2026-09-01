import type { ContentBlockType, FormBuilderFeatures, InputFieldType } from "../types";

export const DEFAULT_MAX_TEMPLATES = 5;

export interface ResolvedTemplates {
  /** Whether the Templates button/modal is available at all. */
  enabled: boolean;
  /** Whether the user can create/overwrite/delete templates (vs. only pick one to apply). */
  manage: boolean;
  /** How many templates can be stored. */
  max: number;
}

export interface ResolvedFeatures {
  naming: boolean;
  templates: ResolvedTemplates;
  templateClipboard: boolean;
  newForm: boolean;
  autosave: boolean;
  jsonView: boolean;
  previewMode: boolean;
  languageSwitcher: boolean;
  design: boolean;
  blockStyling: boolean;
  contentBlocks: boolean | Set<ContentBlockType>;
  fieldTypes: boolean | Set<InputFieldType>;
  sections: boolean;
  sectionBackground: boolean;
  dragReorder: boolean;
  deviceToggle: boolean;
  maxFields?: number;
}

export const DEFAULT_FEATURES: ResolvedFeatures = {
  naming: true,
  templates: { enabled: true, manage: true, max: DEFAULT_MAX_TEMPLATES },
  templateClipboard: true,
  newForm: true,
  autosave: true,
  jsonView: true,
  previewMode: true,
  languageSwitcher: true,
  design: false,
  blockStyling: true,
  contentBlocks: true,
  fieldTypes: true,
  sections: true,
  sectionBackground: true,
  dragReorder: true,
  deviceToggle: true,
};

function resolveTemplates(t: FormBuilderFeatures["templates"]): ResolvedTemplates {
  if (t === false) return { enabled: false, manage: false, max: DEFAULT_MAX_TEMPLATES };
  if (t === undefined || t === true) return { enabled: true, manage: true, max: DEFAULT_MAX_TEMPLATES };
  return { enabled: true, manage: t.manage ?? true, max: t.max ?? DEFAULT_MAX_TEMPLATES };
}

export function resolveFeatures(features?: FormBuilderFeatures): ResolvedFeatures {
  return {
    ...DEFAULT_FEATURES,
    ...features,
    templates: resolveTemplates(features?.templates),
    contentBlocks: Array.isArray(features?.contentBlocks) ? new Set(features.contentBlocks) : features?.contentBlocks ?? DEFAULT_FEATURES.contentBlocks,
    fieldTypes: Array.isArray(features?.fieldTypes) ? new Set(features.fieldTypes) : features?.fieldTypes ?? DEFAULT_FEATURES.fieldTypes,
    // Not explicitly set → inherit from `sections`, so a pre-existing `sections: false` keeps hiding the picker.
    sectionBackground: features?.sectionBackground ?? features?.sections ?? DEFAULT_FEATURES.sectionBackground,
  };
}

export function isContentBlockEnabled(features: ResolvedFeatures, type: ContentBlockType): boolean {
  return features.contentBlocks === true || (features.contentBlocks instanceof Set && features.contentBlocks.has(type));
}

export function isFieldTypeEnabled(features: ResolvedFeatures, type: InputFieldType): boolean {
  return features.fieldTypes === true || (features.fieldTypes instanceof Set && features.fieldTypes.has(type));
}
