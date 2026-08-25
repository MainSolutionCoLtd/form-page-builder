import type { ContentBlockType, FormBuilderFeatures, InputFieldType } from "../types";

export interface ResolvedFeatures {
  naming: boolean;
  templates: boolean;
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
  dragReorder: boolean;
  maxFields?: number;
}

export const DEFAULT_FEATURES: ResolvedFeatures = {
  naming: true,
  templates: true,
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
  dragReorder: true,
};

export function resolveFeatures(features?: FormBuilderFeatures): ResolvedFeatures {
  return {
    ...DEFAULT_FEATURES,
    ...features,
    contentBlocks: Array.isArray(features?.contentBlocks) ? new Set(features.contentBlocks) : features?.contentBlocks ?? DEFAULT_FEATURES.contentBlocks,
    fieldTypes: Array.isArray(features?.fieldTypes) ? new Set(features.fieldTypes) : features?.fieldTypes ?? DEFAULT_FEATURES.fieldTypes,
  };
}

export function isContentBlockEnabled(features: ResolvedFeatures, type: ContentBlockType): boolean {
  return features.contentBlocks === true || (features.contentBlocks instanceof Set && features.contentBlocks.has(type));
}

export function isFieldTypeEnabled(features: ResolvedFeatures, type: InputFieldType): boolean {
  return features.fieldTypes === true || (features.fieldTypes instanceof Set && features.fieldTypes.has(type));
}
