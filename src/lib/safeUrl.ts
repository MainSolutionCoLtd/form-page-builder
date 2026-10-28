export type UrlKind = "link" | "image";

const LINK_SCHEMES = ["http:", "https:", "mailto:", "tel:"];
const IMAGE_SCHEMES = ["http:", "https:"];
const DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=]+$/i;

/**
 * Default URL policy of the viewer. Returns the URL to use, or null to drop it.
 * Links: http(s), mailto, tel and relative. Images: http(s), relative and raster data: URLs.
 */
export function defaultSanitizeUrl(url: string | undefined | null, kind: UrlKind): string | null {
  const value = typeof url === "string" ? url.trim() : "";
  if (!value) return null;
  // Browsers ignore whitespace/control characters inside a scheme ("java\nscript:").
  // eslint-disable-next-line no-control-regex
  const compact = value.replace(/[\u0000- \u007f-\u009f]/g, "");
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(compact)?.[1];
  if (scheme) {
    const s = `${scheme.toLowerCase()}:`;
    if (kind === "image" && s === "data:") return DATA_IMAGE.test(value) ? value : null;
    return (kind === "image" ? IMAGE_SCHEMES : LINK_SCHEMES).includes(s) ? value : null;
  }
  return compact.startsWith("//") ? null : value;
}

const COLOR = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d\s.,%/-]+\)|var\(--[\w-]+\)|[a-z]{3,20})$/i;

/** A CSS colour the viewer will accept in a style value (hex, rgb/hsl, a `var(--x)` or a keyword), else undefined. */
export function safeColor(value: string | undefined | null): string | undefined {
  const v = typeof value === "string" ? value.trim() : "";
  return v && COLOR.test(v) ? v : undefined;
}
