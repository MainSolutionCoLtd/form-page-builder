import type { StorageAdapter } from "../../types";
import { compress, decompress } from "./compress";

function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/**
 * Default StorageAdapter over window.localStorage. Availability is checked per-call so it survives SSR.
 * Values are compressed on write; on read, a decompressed result is used only if it parses as JSON,
 * else the raw string is returned (so pre-compression drafts still load).
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
        // Not JSON once decompressed — fall through and return `raw` as legacy uncompressed data.
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
