import type { CSSProperties } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { ImageField } from "../../types";
import { t } from "../../lib/bilingual";
import { styles } from "../../styles/styles";

// No fixed pixel dimensions — width follows the field's grid column, height from aspect-ratio.
function buildImageStyle(field: ImageField): CSSProperties {
  const aspectRatio = field.shape === "banner" ? "16 / 5" : "1 / 1";
  return {
    width: "100%", aspectRatio, objectFit: "cover", display: "block",
    borderRadius: field.shape === "circle" ? "50%" : 8,
    background: "var(--fb-canvas)",
  };
}

export function ImageBlock({ field, lang }: { field: ImageField; lang: string }) {
  const shapeStyle = buildImageStyle(field);
  const img = field.src ? (
    <img src={field.src} alt={t(field.alt, lang || "en")} style={shapeStyle} />
  ) : (
    <div style={{ ...shapeStyle, ...styles.imagePlaceholder }}><ImageIcon size={20} color="var(--fb-muted)" /></div>
  );
  return field.link ? <a href={field.link} target="_blank" rel="noreferrer" style={{ display: "block" }}>{img}</a> : img;
}
