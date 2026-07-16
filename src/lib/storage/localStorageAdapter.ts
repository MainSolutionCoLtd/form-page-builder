import type { StorageAdapter } from "../../types";
import { compress, decompress } from "./compress";

function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/**
 * Default StorageAdapter, backed by window.localStorage. Availability is
 * checked inside each method (not once at module load) so the same module
 * behaves correctly whether it runs during SSR (no window) or later on the
 * client, within the same process.
 *
 * Values are compressed before writing (drafts/templates are JSON with a lot
 * of repeated keys, which compresses well) to reduce how much of the quota
 * they use. On read, a decompressed result is only trusted if it's valid
 * JSON — anything else falls back to the raw stored string, so drafts
 * written before compression was added keep loading correctly.
 */
export const localStorageAdapter: StorageAdapter = {
  async get(key) {
    if (!hasLocalStorage()) return null;
    const raw = window.localStorage.getItem(key);
    if (raw == null) return null;
    const decompressed = decompress(raw);
    if (decompressed != null) {
      try {
        JSON.parse(decompressed);
        return decompressed;
      } catch {
        // Not valid JSON once decompressed — treat `raw` as legacy, uncompressed data below.
      }
    }
    return raw;
  },
  async set(key, value) {
    if (!hasLocalStorage()) return;
    window.localStorage.setItem(key, compress(value));
  },
  async delete(key) {
    if (!hasLocalStorage()) return;
    window.localStorage.removeItem(key);
  },
};
