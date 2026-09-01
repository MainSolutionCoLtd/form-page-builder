import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { serializeTemplate, parseTemplate } from "../src/lib/template";
import { CLIPBOARD_KEY } from "../src/lib/storage/keys";
import { DEFAULT_THEME } from "../src/theme/defaultTheme";
import { createMemoryStorage } from "./testUtils";
import type { FormDocument } from "../src/types";

const sampleDoc: FormDocument = {
  version: 5,
  title: { en: "Pasted Form" },
  theme: DEFAULT_THEME,
  themeOverrides: { primary: "#ff0000" },
  sections: [{ id: "s1", title: { en: "" }, background: "", collapsed: false, fields: [] }],
};

describe("template serialization", () => {
  it("round-trips a document through serialize/parse", () => {
    const parsed = parseTemplate(serializeTemplate(sampleDoc));
    expect(parsed).not.toBeNull();
    expect(parsed!.title).toEqual({ en: "Pasted Form" });
    expect(parsed!.themeOverrides).toEqual({ primary: "#ff0000" });
  });

  it("accepts a bare document (e.g. copy-pasted View JSON output)", () => {
    const parsed = parseTemplate(JSON.stringify(sampleDoc));
    expect(parsed).not.toBeNull();
    expect(parsed!.sections).toHaveLength(1);
  });

  it("rejects non-JSON and unrelated JSON", () => {
    expect(parseTemplate("not json {")).toBeNull();
    expect(parseTemplate("null")).toBeNull();
    expect(parseTemplate('"a string"')).toBeNull();
    expect(parseTemplate("42")).toBeNull();
  });
});

describe("Copy template / Paste template", () => {
  beforeEach(() => {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  });

  it("disables Paste until something has been copied, then enables it in another instance", async () => {
    const user = userEvent.setup();
    const { container: a } = render(<FormBuilder storage={createMemoryStorage()} />);
    const { container: b } = render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findAllByLabelText("Form title");

    expect(within(b).getByLabelText("Paste template")).toBeDisabled();

    await user.click(within(a).getByLabelText("Copy template"));

    expect(within(b).getByLabelText("Paste template")).toBeEnabled();
    expect(within(a).getByLabelText("Paste template")).toBeEnabled();
  });

  it("pastes the copied template into the working document after confirmation", async () => {
    window.localStorage.setItem(CLIPBOARD_KEY, serializeTemplate(sampleDoc));
    const user = userEvent.setup();

    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByLabelText("Paste template"));
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Replace" }));

    expect(await screen.findByDisplayValue("Pasted Form")).toBeInTheDocument();
  });

  it("does not paste when confirmation is declined", async () => {
    window.localStorage.setItem(CLIPBOARD_KEY, serializeTemplate(sampleDoc));
    const user = userEvent.setup();

    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByLabelText("Paste template"));
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByDisplayValue("Pasted Form")).not.toBeInTheDocument();
  });

  it("dismisses the paste confirmation on Escape without pasting", async () => {
    window.localStorage.setItem(CLIPBOARD_KEY, serializeTemplate(sampleDoc));
    const user = userEvent.setup();

    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByLabelText("Paste template"));
    await screen.findByRole("alertdialog");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("Pasted Form")).not.toBeInTheDocument();
  });

  it("hides the copy/paste buttons when features.templateClipboard is false", async () => {
    render(<FormBuilder storage={createMemoryStorage()} features={{ templateClipboard: false }} />);
    await screen.findByLabelText("Form title");
    expect(screen.queryByLabelText("Copy template")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Paste template")).not.toBeInTheDocument();
  });
});

describe("ref getTemplate / loadTemplate", () => {
  it("exposes the document as a portable template and loads one back", async () => {
    const ref = { current: null as import("../src/types").FormBuilderHandle | null };
    render(<FormBuilder ref={ref} storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    const tpl = ref.current!.getTemplate();
    expect(tpl.__fpb).toBe("template");
    expect(tpl.document.version).toBe(5);

    expect(ref.current!.loadTemplate(serializeTemplate(sampleDoc))).toBe(true);
    expect(await screen.findByDisplayValue("Pasted Form")).toBeInTheDocument();

    expect(ref.current!.loadTemplate("garbage")).toBe(false);
  });
});
