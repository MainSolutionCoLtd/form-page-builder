import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { ImageField } from "../../types";
import { tAny } from "../../lib/bilingual";
import { imageStyle } from "../../lib/blockStyle";
import { styles } from "../../styles/styles";

export function ImageBlock({ field, lang }: { field: ImageField; lang: string }) {
  // A URL that does not load (typo, hotlink protection, not an image) shows the placeholder instead of a broken-image icon.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const shapeStyle = imageStyle(field);
  const img = field.src && failedSrc !== field.src ? (
    <img src={field.src} alt={tAny(field.alt, lang || "en")} style={shapeStyle} referrerPolicy="no-referrer" onError={() => setFailedSrc(field.src)} />
  ) : (
    <div style={{ ...shapeStyle, ...(field.shape === "auto" ? { aspectRatio: "16 / 9" } : {}), ...styles.imagePlaceholder }}><ImageIcon size={20} color="var(--fb-muted)" /></div>
  );
  return field.link ? <a href={field.link} target="_blank" rel="noreferrer" style={{ display: "block" }}>{img}</a> : img;
}
