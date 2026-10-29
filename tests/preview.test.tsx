import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { DEFAULT_THEME } from "../src/theme/defaultTheme";
import type { FormDocument } from "../src/types";
import { createMemoryStorage } from "./testUtils";

const doc: FormDocument = {
  version: 5,
  title: { en: "Contact" },
  theme: DEFAULT_THEME,
  themeOverrides: {},
  sections: [
    {
      id: "s1",
      title: { en: "" },
      background: "",
      collapsed: false,
      fields: [
        {
          id: "f1", type: "input", label: { en: "Full name" }, hideLabel: false,
          width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type",
          inputType: "text", placeholder: { en: "" }, defaultValue: "", required: true,
        } as any,
        {
          id: "f2", type: "button", label: { en: "Submit" }, hideLabel: false,
          width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type",
          action: "submit", buttonStyle: { color: "", size: "md" }, href: "", target: "_self", submitScope: "form",
        } as any,
      ],
    },
  ],
};

async function renderInPreview(onSubmit = vi.fn()) {
  const user = userEvent.setup();
  render(<FormBuilder storage={createMemoryStorage()} initialDocument={doc} onSubmit={onSubmit} />);
  await screen.findByDisplayValue("Contact");
  await user.click(screen.getByRole("button", { name: "Preview" }));
  // the runtime field input has no accessible name (its <label> isn't
  // htmlFor-linked) — unlike the toolbar's "Form title" textbox, which is.
  await screen.findByRole("textbox", { name: "" });
  return { user, onSubmit };
}

describe("initialMode prop", () => {
  it("mounts straight into Preview when initialMode is \"preview\", with no Build canvas", async () => {
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={doc} initialMode="preview" />);
    await screen.findByDisplayValue("Contact");

    expect(screen.getByRole("textbox", { name: "" })).toBeInTheDocument();
    expect(screen.queryByText("Form Fields")).not.toBeInTheDocument();
  });

  it("locks to Preview-only, no tabs, when combined with features.previewMode: false", async () => {
    render(
      <FormBuilder
        storage={createMemoryStorage()}
        initialDocument={doc}
        initialMode="preview"
        features={{ previewMode: false }}
      />,
    );
    await screen.findByDisplayValue("Contact");

    expect(screen.queryByRole("button", { name: "Build" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Preview" })).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "" })).toBeInTheDocument();
  });
});

describe("onModeChange prop", () => {
  it("fires once on mount with the resolved initial mode", async () => {
    const onModeChange = vi.fn();
    render(
      <FormBuilder storage={createMemoryStorage()} initialDocument={doc} initialMode="preview" onModeChange={onModeChange} />,
    );
    await screen.findByDisplayValue("Contact");

    expect(onModeChange).toHaveBeenCalledTimes(1);
    expect(onModeChange).toHaveBeenCalledWith("preview");
  });

  it("fires again with the new mode on every Build/Preview toggle", async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={doc} onModeChange={onModeChange} />);
    await screen.findByDisplayValue("Contact");
    onModeChange.mockClear();

    await user.click(screen.getByRole("button", { name: "Preview" }));
    expect(onModeChange).toHaveBeenLastCalledWith("preview");

    await user.click(screen.getByRole("button", { name: "Build" }));
    expect(onModeChange).toHaveBeenLastCalledWith("build");
  });
});

describe("features.deviceToggle", () => {
  it("shows the Laptop/Tablet/Mobile switcher above Preview by default", async () => {
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={doc} initialMode="preview" />);
    await screen.findByDisplayValue("Contact");

    expect(screen.getByRole("button", { name: "Laptop" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tablet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mobile" })).toBeInTheDocument();
  });

  it("hides the switcher when features.deviceToggle is false, staying at the Laptop width", async () => {
    render(
      <FormBuilder
        storage={createMemoryStorage()}
        initialDocument={doc}
        initialMode="preview"
        features={{ deviceToggle: false }}
      />,
    );
    await screen.findByDisplayValue("Contact");

    expect(screen.queryByRole("button", { name: "Laptop" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Tablet" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Mobile" })).not.toBeInTheDocument();
  });
});

describe("features.formTitle", () => {
  it("does not render the form title as a heading in Preview by default", async () => {
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={doc} initialMode="preview" />);
    await screen.findByDisplayValue("Contact");

    expect(screen.queryByRole("heading", { name: "Contact" })).not.toBeInTheDocument();
  });

  it("renders the form title as a heading in Preview when formTitle is true", async () => {
    render(
      <FormBuilder
        storage={createMemoryStorage()}
        initialDocument={doc}
        initialMode="preview"
        features={{ formTitle: true }}
      />,
    );
    await screen.findByDisplayValue("Contact");

    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
  });
});

describe("structural class hooks", () => {
  it("tags the runtime form, section, and field wrappers with fb- classes", async () => {
    const { container } = render(
      <FormBuilder storage={createMemoryStorage()} initialDocument={doc} initialMode="preview" />,
    );
    await screen.findByDisplayValue("Contact");

    expect(container.querySelector(".fb-form")).toBeInTheDocument();
    expect(container.querySelector(".fb-section")).toBeInTheDocument();
    expect(container.querySelector(".fb-field.fb-field--input.fb-field--f1")).toBeInTheDocument();
    expect(container.querySelector(".fb-field--button")).toBeInTheDocument();
  });
});

describe("Preview mode submit flow", () => {
  it("blocks submit and shows a validation error when a required field is empty", async () => {
    const { user, onSubmit } = await renderInPreview();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("This field is required.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with buttonId/scope/values once required fields are filled", async () => {
    const { user, onSubmit } = await renderInPreview();

    await user.type(screen.getByRole("textbox", { name: "" }), "Jane Doe");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.buttonId).toBe("f2");
    expect(payload.scope).toBe("form");
    expect(payload.values).toEqual({ f1: "Jane Doe" });
  });

  it("clears a field's error as soon as it is edited", async () => {
    const { user } = await renderInPreview();

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByText("This field is required.")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "" }), "J");
    expect(screen.queryByText("This field is required.")).not.toBeInTheDocument();
  });

  it("treats a leftover submit button as a link when features.submitButtons is false", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const linkDoc = { ...doc, sections: [{ ...doc.sections[0], fields: [{ ...doc.sections[0].fields[1], href: "https://example.com/x" }] }] } as FormDocument;
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={linkDoc} initialMode="preview" features={{ submitButtons: false }} onSubmit={onSubmit} />);

    await user.click(await screen.findByRole("button", { name: "Submit" }));

    expect(open).toHaveBeenCalledWith("https://example.com/x", "_self", undefined);
    expect(onSubmit).not.toHaveBeenCalled();
    open.mockRestore();
  });

  it("does not open an unsafe link", async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const linkDoc = { ...doc, sections: [{ ...doc.sections[0], fields: [{ ...doc.sections[0].fields[1], action: "link", href: "javascript:alert(1)" }] }] } as FormDocument;
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={linkDoc} initialMode="preview" />);

    await user.click(await screen.findByRole("button", { name: "Submit" }));

    expect(open).not.toHaveBeenCalled();
    open.mockRestore();
  });

  it("shows the submitted summary's Yes/No in the current language", async () => {
    const user = userEvent.setup();
    const toggleDoc = { ...doc, sections: [{ ...doc.sections[0], fields: [
      { id: "t1", type: "toggle", label: { en: "News", ja: "ニュース" }, hideLabel: false, width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "ToggleLeft", defaultValue: true, required: false } as any,
      doc.sections[0].fields[1],
    ] }] } as FormDocument;
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={toggleDoc} initialMode="preview" language="ja" />);

    await user.click(await screen.findByRole("button", { name: "Submit" }));

    expect(await screen.findByText("はい")).toBeInTheDocument();
  });

  it("shows a button label written only in another language instead of a blank", async () => {
    const onlyJa = { ...doc, sections: [{ ...doc.sections[0], fields: [{ ...doc.sections[0].fields[1], label: { en: "", ja: "送る" } }] }] } as FormDocument;
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={onlyJa} initialMode="preview" />);

    expect(await screen.findByRole("button", { name: "送る" })).toBeInTheDocument();
  });

  it("shows content written in only one language when the language changes, instead of blanks or placeholders", async () => {
    const user = userEvent.setup();
    const base = { hideLabel: false, width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type" };
    const jaOnly = { ...doc, title: { en: "", ja: "お問い合わせ" }, sections: [{ ...doc.sections[0], title: { en: "", ja: "連絡先" }, fields: [
      { ...base, id: "r1", type: "radio", label: { en: "", ja: "性別" }, required: false, defaultValue: "", options: [{ label: { en: "", ja: "男性" }, value: "m" }, { label: { en: "", ja: "女性" }, value: "f" }] } as any,
      { ...base, id: "p1", type: "paragraph", content: { en: "", ja: "ようこそ" }, tag: "p", fontSize: "md", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "" } as any,
    ] }] } as FormDocument;
    render(<FormBuilder storage={createMemoryStorage()} initialDocument={jaOnly} language="en" />);

    // Build canvas: no "Untitled field" / "..." placeholder while a translation exists.
    expect(await screen.findByText("性別")).toBeInTheDocument();
    expect(screen.queryByText("Untitled field")).not.toBeInTheDocument();
    expect(screen.getByText("ようこそ")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Preview" }));
    expect(await screen.findByText("男性")).toBeInTheDocument();
    expect(screen.getByText("女性")).toBeInTheDocument();
    expect(screen.getByText("連絡先")).toBeInTheDocument();
  });
});
