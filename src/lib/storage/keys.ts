export const DRAFT_KEY = "form-page-builder:draft";
export const INDEX_KEY = "form-page-builder:index";
export const formKey = (id: string) => `form-page-builder:saved:${id}`;
/** Template id from a `formKey` result, else null — lets a StorageAdapter route per-template keys. */
export const savedFormId = (key: string): string | null =>
  key.startsWith("form-page-builder:saved:") ? key.slice("form-page-builder:saved:".length) : null;
/** Copy/paste-template scratch slot — always localStorage, never the StorageAdapter. */
export const CLIPBOARD_KEY = "form-page-builder:clipboard";
