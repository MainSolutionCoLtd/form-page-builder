import { compressToUTF16, decompressFromUTF16 } from "lz-string";

/** Compresses a JSON string for storage in `localStorage`, cutting the character count used against the quota. */
export function compress(raw: string): string {
  return compressToUTF16(raw);
}

/**
 * Reverses `compress`. Returns null if `value` isn't valid compressed
 * output (e.g. a plain-JSON draft written before this format existed),
 * so callers can fall back to treating it as legacy uncompressed data.
 */
export function decompress(value: string): string | null {
  try {
    return decompressFromUTF16(value);
  } catch {
    return null;
  }
}
