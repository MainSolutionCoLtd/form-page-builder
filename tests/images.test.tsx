import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormViewer } from "../src/FormViewer";
import { ImageBlock } from "../src/components/fields/ImageBlock";
import { imageStyle, DEFAULT_IMAGE_MAX_WIDTH } from "../src/lib/blockStyle";
import { themeVars, resolveTheme } from "../src/lib/resolveTheme";
import { effectiveWidth, WIDTH_OPTIONS } from "../src/constants/layout";
import { WIDTH_PERCENT } from "../src/constants/widths";

const img = (shape: string) => ({ id: "i", type: "image", src: "https://a.com/i.png", alt: { en: "pic" }, shape }) as any;
const html = (fields: any[]) => renderToStaticMarkup(<FormViewer document={{ sections: [{ id: "s", fields }] }} />);

describe("image sizing", () => {
  it("caps and centres square and circle images", () => {
    for (const shape of ["square", "circle"] as const) {
      expect(imageStyle({ shape })).toMatchObject({ maxWidth: "var(--fb-image-max, 480px)", marginInline: "auto", aspectRatio: "1 / 1" });
    }
    expect(html([img("square")])).toContain("max-width:var(--fb-image-max, 480px)");
  });

  it("leaves banners full width and original-ratio images uncropped", () => {
    expect(imageStyle({ shape: "banner" })).not.toHaveProperty("maxWidth");
    expect(imageStyle({ shape: "auto" })).toMatchObject({ height: "auto", objectFit: "contain" });
    expect(imageStyle({ shape: "auto" })).not.toHaveProperty("aspectRatio");
  });

  it("treats a missing shape as square", () => {
    expect(imageStyle({})).toMatchObject({ aspectRatio: "1 / 1", maxWidth: `var(--fb-image-max, ${DEFAULT_IMAGE_MAX_WIDTH}px)` });
  });

  it("shows the placeholder instead of a broken image when the URL fails to load", () => {
    const { container } = render(<ImageBlock field={img("square")} lang="en" />);
    const el = screen.getByAltText("pic");
    fireEvent.error(el);
    expect(container.querySelector("img")).toBeNull();
  });

  it("sends no referrer so hotlink-protected hosts still serve the image", () => {
    expect(html([img("auto")]).toLowerCase()).toContain('referrerpolicy="no-referrer"');
  });
});

describe("theme.layout.imageMaxWidth", () => {
  it("defaults to 480px and can be changed by the host", () => {
    expect(themeVars(resolveTheme())["--fb-image-max"]).toBe("480px");
    expect(themeVars(resolveTheme({ layout: { imageMaxWidth: 640 } }))["--fb-image-max"]).toBe("640px");
  });

  it("falls back to 480px for a hand-built theme without the key", () => {
    const theme = resolveTheme();
    delete theme.layout.imageMaxWidth;
    expect(themeVars(theme)["--fb-image-max"]).toBe("480px");
  });

  it("reaches the viewer's root as a CSS variable", () => {
    const out = renderToStaticMarkup(<FormViewer document={{ sections: [] }} theme={{ layout: { imageMaxWidth: 640 } }} />);
    expect(out).toContain("--fb-image-max:640px");
  });
});

describe("2/3 width", () => {
  it("is an option with a percentage", () => {
    expect(WIDTH_OPTIONS.map((o) => o.value)).toEqual(["1/3", "1/2", "2/3", "1/1"]);
    expect(WIDTH_PERCENT["2/3"]).toBe("66.6667%");
  });

  it("pairs as two halves on tablet and stacks on mobile", () => {
    expect(effectiveWidth("1/3", "tablet")).toBe("1/2");
    expect(effectiveWidth("2/3", "tablet")).toBe("1/2");
    expect(effectiveWidth("2/3", "laptop")).toBe("2/3");
    expect(effectiveWidth("2/3", "mobile")).toBe("1/1");
  });

  it("gets its own column class in the viewer, collapsing with the container", () => {
    const out = html([{ id: "a", type: "paragraph", width: "1/3", content: { en: "A" } }, { id: "b", type: "paragraph", width: "2/3", content: { en: "B" } }]);
    expect(out).toContain("fpbv-f w3");
    expect(out).toContain("fpbv-f w23");
    expect(out).toContain(".fpbv-f.w23{flex-basis:calc(66.6667% - var(--fb-space-field) / 3)}");
    expect(out).toContain("(max-width:480px){.fpbv-f.w2,.fpbv-f.w3,.fpbv-f.w23{flex-basis:100%}}");
  });
});
