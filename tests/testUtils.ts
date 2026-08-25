import type { StorageAdapter } from "../src/types";

/** In-memory StorageAdapter so tests never touch real localStorage and stay isolated from each other. */
export function createMemoryStorage(): StorageAdapter {
  const store = new Map<string, string>();
  return {
    async get(key) {
      return store.has(key) ? store.get(key)! : null;
    },
    async set(key, value) {
      store.set(key, value);
    },
    async delete(key) {
      store.delete(key);
    },
  };
}
