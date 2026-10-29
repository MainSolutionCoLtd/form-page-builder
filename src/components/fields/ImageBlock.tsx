import { Image as ImageIcon } from "lucide-react";
import type { ImageField } from "../../types";
import { tAny } from "../../lib/bilingual";
import { imageStyle } from "../../lib/blockStyle";
import { styles } from "../../styles/styles";

export function ImageBlock({ field, lang }: { field: ImageField; lang: string }) {
  const shapeStyle = imageStyle(field);
  const img = field.src ? (
    <img src={field.src} alt={tAny(field.alt, lang || "en")} style={shapeStyle} />
  ) : (
    <div style={{ ...shapeStyle, ...styles.imagePlaceholder }}><ImageIcon size={20} color="var(--fb-muted)" /></div>
  );
  return field.link ? <a href={field.link} target="_blank" rel="noreferrer" style={{ display: "block" }}>{img}</a> : img;
}
