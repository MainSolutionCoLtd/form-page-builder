export const DRAFT_KEY = "form-page-builder:draft";
export const INDEX_KEY = "form-page-builder:index";
export const formKey = (id: string) => `form-page-builder:saved:${id}`;
/** Cross-instance "copy template / paste template" scratch slot. Always localStorage, never the StorageAdapter. */
export const CLIPBOARD_KEY = "form-page-builder:clipboard";
