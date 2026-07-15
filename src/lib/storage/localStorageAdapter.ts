import type { StorageAdapter } from "../../types";

function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/**
 * Default StorageAdapter, backed by window.localStorage. Availability is
 * checked inside each method (not once at module load) so the same module
 * behaves correctly whether it runs during SSR (no window) or later on the
 * client, within the same process.
 */
export const localStorageAdapter: StorageAdapter = {
  async get(key) {
    if (!hasLocalStorage()) return null;
    return window.localStorage.getItem(key);
  },
  async set(key, value) {
    if (!hasLocalStorage()) return;
    window.localStorage.setItem(key, value);
  },
  async delete(key) {
    if (!hasLocalStorage()) return;
    window.localStorage.removeItem(key);
  },
};
