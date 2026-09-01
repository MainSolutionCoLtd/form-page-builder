import { compressToUTF16, decompressFromUTF16 } from "lz-string";

/** Compresses a JSON string for storage in `localStorage`, cutting the character count used against the quota. */
export function compress(raw: string): string {
  return compressToUTF16(raw);
}

/** Reverses `compress`; null if `value` isn't compressed output (e.g. a pre-format plain-JSON draft). */
export function decompress(value: string): string | null {
  try {
    return decompressFromUTF16(value);
  } catch {
    return null;
  }
}
