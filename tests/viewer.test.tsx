import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import { FormViewer, type ViewerDocument } from "../src/viewer";
import { defaultSanitizeUrl, safeColor } from "../src/lib/safeUrl";
import { paragraphStyle, imageStyle, buttonStyle } from "../src/lib/blockStyle";
import { FieldBlock } from "../src/components/fields/FieldBlock";
import { CHROME } from "../src/i18n/chrome";
import { DEFAULT_STRINGS } from "../src/i18n/strings";

const doc = (fields: any[], extra: Partial<ViewerDocument> = {}): ViewerDocument => ({ sections: [{ id: "s1", fields }], ...extra });
const html = (d: ViewerDocument | null, props: Record<string, unknown> = {}) => renderToStaticMarkup(<FormViewer document={d} {...props} />);

describe("FormViewer rendering", () => {
  it("renders paragraphs, images and link buttons on the server (no DOM, no hooks)", () => {
    const out = html(doc([
      { id: "a", type: "paragraph", tag: "h1", content: { en: "Welcome" } },
      { id: "b", type: "paragraph", tag: "p", content: { en: "About me" } },
      { id: "c", type: "image", src: "https://cdn.example/x.webp", alt: { en: "Me" }, shape: "banner" },
      { id: "d", type: "button", action: "link", label: { en: "Book" }, href: "https://example.com/book", target: "_blank" },
    ]));
    expect(out).toContain("<h1");
    expect(out).toContain("Welcome");
    expect(out).toContain('alt="Me"');
    expect(out).toContain('src="https://cdn.example/x.webp"');
    expect(out).toMatch(/<a[^>]*href="https:\/\/example.com\/book"[^>]*rel="noopener noreferrer"/);
    expect(out).toContain("16 / 5");
  });

  it("returns an empty root for a missing or empty document", () => {
    for (const d of [null, undefined, {}, { sections: [] }, { sections: [{ fields: [] }] }]) {
      const out = html(d as any);
      expect(out).toContain('class="fpbv"');
      expect(out).not.toContain("<section");
    }
  });

  it("skips form inputs and empty blocks", () => {
    const out = html(doc([
      { id: "1", type: "input", label: { en: "Name" } },
      { id: "3", type: "button", action: "link", label: { en: "" }, href: "https://ok.com" },
      { id: "4", type: "image", src: "" },
      { id: "5", type: "paragraph", content: { en: "" } },
    ]));
    expect(out).not.toContain("<section");
    expect(out).not.toContain("Name");
  });

  it("shows a submit button as an inert block", () => {
    const out = html(doc([{ id: "1", type: "button", action: "submit", label: { en: "Send" }, href: "https://ok.com" }]));
    expect(out).toContain("Send");
    expect(out).not.toContain("<a ");
  });

  it("treats a button without an action but with a link as a link button", () => {
    expect(html(doc([{ id: "1", type: "button", label: { en: "Go" }, href: "https://ok.com" }]))).toContain('href="https://ok.com"');
  });

  it("shows a link button that has text but no href as an inert block", () => {
    const out = html(doc([{ id: "1", type: "button", action: "link", label: { en: "Soon" } }]));
    expect(out).toContain("Soon");
    expect(out).not.toContain("<a ");
  });

  it("does not throw on malformed stored data", () => {
    const bad: any = { sections: [null, { id: "x", fields: [null, 5, { type: "button" }, { type: "button", label: "Go", action: "submit", href: 5 }] }, { id: "y", fields: "nope" }] };
    expect(() => html(bad)).not.toThrow();
    expect(html(bad)).toContain("Go");
    expect(() => html({ sections: "nope" } as any)).not.toThrow();
  });

  it("drops unsafe links and image sources", () => {
    const out = html(doc([
      { id: "1", type: "button", action: "link", label: { en: "Evil" }, href: "javascript:alert(1)" },
      { id: "2", type: "image", src: "javascript:alert(1)", alt: { en: "bad" } },
      { id: "3", type: "image", src: "https://ok.com/a.png", alt: { en: "ok" }, link: "data:text/html,x" },
    ]));
    expect(out).not.toContain("javascript");
    expect(out).not.toContain("Evil");
    expect(out).toContain('alt="ok"');
    expect(out).not.toContain("<a ");
  });

  it("lets the host replace the URL policy", () => {
    const only = (u: string) => (u.startsWith("https:") ? u : null);
    const out = html(doc([{ id: "1", type: "button", action: "link", label: { en: "Mail" }, href: "mailto:a@b.com" }]), { sanitizeUrl: only });
    expect(out).not.toContain("Mail");
  });

  it("reads the requested language, then English, then any translation", () => {
    const d = doc([
      { id: "1", type: "paragraph", content: { en: "Hello", ja: "こんにちは" } },
      { id: "2", type: "paragraph", content: { en: "", ja: "日本語のみ" } },
      { id: "3", type: "paragraph", content: "plain string" },
    ]);
    expect(html(d, { language: "ja" })).toContain("こんにちは");
    const en = html(d, { language: "en" });
    expect(en).toContain("Hello");
    expect(en).toContain("日本語のみ");
    expect(en).toContain("plain string");
    expect(html(doc([{ id: "1", type: "paragraph", content: { en: "Hi", ja: "" } }]), { language: "ja" })).toContain("Hi");
  });

  it("applies the document's own theme overrides over the host theme", () => {
    const out = html(doc([{ id: "1", type: "paragraph", content: { en: "x" } }], { themeOverrides: { primary: "#112233", layout: { sectionGap: 40 } } }), { theme: { primary: "#ff0000", ink: "#010203" } });
    expect(out).toContain("--fb-primary:#112233");
    expect(out).toContain("--fb-ink:#010203");
    expect(out).toContain("--fb-space-section:40px");
  });

  it("sizes the page by maxWidth, defaulting to the theme layout", () => {
    expect(html(doc([]))).toContain("max-width:1200px");
    expect(html(doc([]), { maxWidth: 768 })).toContain("max-width:768px");
    expect(html(doc([]), { maxWidth: "48rem" })).toContain("max-width:48rem");
  });

  it("maps widths to column classes and section backgrounds to safe colors only", () => {
    const d: ViewerDocument = { sections: [
      { id: "s1", background: "#eef", fields: [{ id: "a", type: "paragraph", width: "1/2", content: { en: "a" } }, { id: "b", type: "paragraph", width: "1/3", content: { en: "b" } }] },
      { id: "s2", background: "red; background:url(x)", fields: [{ id: "c", type: "paragraph", content: { en: "c" } }] },
    ] };
    const out = html(d);
    expect(out).toContain("fpbv-f w2");
    expect(out).toContain("fpbv-f w3");
    expect(out).toContain("background:#eef");
    expect(out).not.toContain("url(x)");
  });

  it("draws section titles unless turned off", () => {
    const d: ViewerDocument = { sections: [{ id: "s", title: { en: "Services" }, fields: [{ id: "a", type: "paragraph", content: { en: "a" } }] }] };
    expect(html(d)).toContain("<h2");
    expect(html(d, { sectionTitles: false })).not.toContain("Services");
  });

  it("title modes: none by default, visible, and a hidden h1 only when the document has no h1", () => {
    const withoutH1 = doc([{ id: "a", type: "paragraph", tag: "p", content: { en: "a" } }], { title: { en: "My page" } });
    const withH1 = doc([{ id: "a", type: "paragraph", tag: "h1", content: { en: "Headline" } }], { title: { en: "My page" } });
    expect(html(withoutH1)).not.toContain("My page");
    expect(html(withoutH1, { titleDisplay: "visible" })).toContain("My page");
    expect(html(withoutH1, { titleDisplay: "auto" })).toMatch(/<h1 class="fpbv-sr">My page<\/h1>/);
    expect(html(withH1, { titleDisplay: "auto" })).not.toContain("My page");
  });

  it("headingOffset pushes headings down (h1 to h2), caps at h6 and leaves body text alone", () => {
    const d = doc([
      { id: "a", type: "paragraph", tag: "h1", content: { en: "One" } },
      { id: "b", type: "paragraph", tag: "h3", content: { en: "Three" } },
      { id: "c", type: "paragraph", tag: "p", content: { en: "Body" } },
      { id: "d", type: "paragraph", tag: "caption", content: { en: "Cap" } },
    ]);
    expect(html(d)).toMatch(/<h1[^>]*>One<\/h1>/);
    const one = html(d, { headingOffset: 1 });
    expect(one).toMatch(/<h2[^>]*>One<\/h2>/);
    expect(one).toMatch(/<h4[^>]*>Three<\/h4>/);
    expect(one).not.toContain("<h1");
    expect(one).toMatch(/<p[^>]*>Body<\/p>/);
    expect(one).toMatch(/<span[^>]*>Cap<\/span>/);
    expect(html(d, { headingOffset: 9 })).toMatch(/<h6[^>]*>Three<\/h6>/);
    expect(html(d, { headingOffset: -2 })).toMatch(/<h1[^>]*>One<\/h1>/);
  });

  it("headingOffset also moves the section titles and the title", () => {
    const d: ViewerDocument = { title: { en: "My page" }, sections: [{ id: "s", title: { en: "Services" }, fields: [{ id: "a", type: "paragraph", content: { en: "a" } }] }] };
    const out = html(d, { headingOffset: 1, titleDisplay: "visible" });
    expect(out).toMatch(/<h3[^>]*>Services<\/h3>/);
    expect(out).toMatch(/<h2[^>]*>My page<\/h2>/);
  });

  it("loads the first image eagerly and the rest lazily", () => {
    const out = html(doc([
      { id: "1", type: "image", src: "https://a.com/1.png" }, { id: "2", type: "image", src: "https://a.com/2.png" },
    ]));
    expect(out.match(/loading="eager"/g)).toHaveLength(1);
    expect(out.match(/loading="lazy"/g)).toHaveLength(1);
    expect(html(doc([{ id: "1", type: "image", src: "https://a.com/1.png" }]), { eagerImages: 0 })).toContain('loading="lazy"');
  });

  it("renders compacted documents (defaults omitted)", () => {
    const out = html({ sections: [{ id: "s", fields: [{ id: "a", type: "paragraph", content: { en: "Hi" } }, { id: "b", type: "button", label: { en: "Go" }, action: "link", href: "https://a.com" }] }] });
    expect(out).toContain("Hi");
    expect(out).toContain("Go");
  });

  it("puts className and style on the root and supports another wrapper element", () => {
    const out = html(doc([]), { className: "mine", as: "article", style: { padding: 0 } });
    expect(out).toMatch(/^<article class="fpbv mine"/);
    expect(out).toContain("padding:0");
  });

  it("emits valid CSS in the style tag (not HTML-escaped)", () => {
    const out = html(doc([]));
    expect(out).toContain("@container (max-width:720px)");
    expect(out).not.toContain("&gt;");
  });

  it("hydrates in a browser DOM too", () => {
    render(<FormViewer document={doc([{ id: "a", type: "paragraph", tag: "h2", content: { en: "Hi there" } }])} />);
    expect(screen.getByRole("heading", { level: 2, name: "Hi there" })).toBeInTheDocument();
  });
});

describe("url and color policy", () => {
  it("links: http(s), mailto, tel and relative only", () => {
    for (const ok of ["https://a.com", "http://a.com", "mailto:a@b.com", "tel:+8190", "/p/1", "#top", "page"]) expect(defaultSanitizeUrl(ok, "link")).toBe(ok);
    for (const bad of ["javascript:alert(1)", " JaVa\nScRiPt:alert(1)", "data:text/html,x", "vbscript:x", "//evil.com", "", "  ", undefined, null]) expect(defaultSanitizeUrl(bad as any, "link")).toBeNull();
  });
  it("images: http(s), relative and raster data urls only", () => {
    expect(defaultSanitizeUrl("https://a.com/x.png", "image")).toBe("https://a.com/x.png");
    expect(defaultSanitizeUrl("data:image/png;base64,AAAA", "image")).toBe("data:image/png;base64,AAAA");
    for (const bad of ["mailto:a@b.com", "data:image/svg+xml;base64,AAAA", "data:text/html;base64,AAAA", "javascript:x"]) expect(defaultSanitizeUrl(bad, "image")).toBeNull();
  });
  it("colors: hex, rgb/hsl, var() and keywords only", () => {
    for (const ok of ["#fff", "#5584AC", "rgb(1, 2, 3)", "hsla(10 20% 30% / 0.5)", "var(--cpv-ink)", "red", "transparent"]) expect(safeColor(ok)).toBe(ok);
    for (const bad of ["red; x:y", "url(x)", "expression(1)", "", undefined]) expect(safeColor(bad as any)).toBeUndefined();
  });
});

describe("parity with the editor preview", () => {
  const base = { id: "x", label: { en: "" }, hideLabel: true, width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type" };
  const props = { lang: "en", onFieldChange: () => {}, strings: DEFAULT_STRINGS.en, chrome: CHROME.en };

  it("a paragraph has the same inline style in the editor and the viewer", () => {
    const field = { ...base, type: "paragraph", content: { en: "Same" }, tag: "h2", fontSize: "lg", fontWeight: "bold", fontStyle: "italic", textAlign: "center", color: "#336699" } as any;
    const editor = renderToStaticMarkup(<FieldBlock field={field} {...props} />);
    const viewer = html(doc([field]));
    const style = /style="([^"]*)"/.exec(editor)![1];
    expect(viewer).toContain(style);
    expect(editor).toContain("font-size:18px");
  });

  it("an image has the same inline style in both", () => {
    const field = { ...base, type: "image", src: "https://a.com/i.png", alt: { en: "I" }, link: "", shape: "circle" } as any;
    const style = /<img[^>]*style="([^"]*)"/.exec(renderToStaticMarkup(<FieldBlock field={field} {...props} />))![1];
    expect(html(doc([field]))).toContain(style);
  });

  it("button size and color come from the same function", () => {
    const field = { ...base, type: "button", action: "link", label: { en: "Go" }, href: "https://a.com", buttonStyle: { color: "#123456", size: "lg" } } as any;
    const editor = renderToStaticMarkup(<FieldBlock field={field} {...props} />);
    const viewer = html(doc([field]));
    for (const part of ["background:#123456", "font-size:15px", "padding:13px 22px"]) {
      expect(editor).toContain(part);
      expect(viewer).toContain(part);
    }
  });

  it("style helpers keep their defaults", () => {
    expect(paragraphStyle({})).toMatchObject({ fontSize: 14, fontWeight: 400, textAlign: "left", color: "var(--fb-ink)" });
    expect(imageStyle({})).toMatchObject({ aspectRatio: "1 / 1", borderRadius: 8 });
    expect(buttonStyle({})).toMatchObject({ background: "var(--fb-primary)", fontSize: 13.5, width: "100%" });
  });
});
