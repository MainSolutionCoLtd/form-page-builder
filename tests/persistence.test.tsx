import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { DRAFT_KEY, INDEX_KEY, formKey } from "../src/lib/storage/keys";
import { DEFAULT_THEME } from "../src/theme/defaultTheme";
import { createMemoryStorage } from "./testUtils";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("autosave", () => {
  it("writes a draft ~600ms after a change when features.autosave is true (default)", async () => {
    const storage = createMemoryStorage();
    render(<FormBuilder storage={storage} />);
    await screen.findByLabelText("Form title");

    fireEvent.click(screen.getByRole("button", { name: "Input" }));
    await wait(750);

    const raw = await storage.get(DRAFT_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).sections[0].fields).toHaveLength(1);
  }, 2000);

  it("never writes a draft when features.autosave is false", async () => {
    const storage = createMemoryStorage();
    render(<FormBuilder storage={storage} features={{ autosave: false }} />);
    await screen.findByLabelText("Form title");

    fireEvent.click(screen.getByRole("button", { name: "Input" }));
    await wait(750);

    expect(await storage.get(DRAFT_KEY)).toBeNull();
  }, 2000);
});

describe("saved templates", () => {
  it("stamps the schema version and never adds a Submit button of its own", async () => {
    const storage = createMemoryStorage();
    const user = userEvent.setup();
    render(<FormBuilder storage={storage} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByRole("button", { name: "Input" }));
    await user.click(screen.getByRole("button", { name: "Save" }));
    const nameInput = await screen.findByLabelText("Template name");
    await user.clear(nameInput);
    await user.type(nameInput, "Company Default");
    await user.click(screen.getByRole("button", { name: "Save template" }));

    const [{ id }] = JSON.parse((await storage.get(INDEX_KEY))!);
    const stored = JSON.parse((await storage.get(formKey(id)))!);

    expect(stored.version).toBe(5);
    const fields = stored.sections.flatMap((s: { fields: { type: string }[] }) => s.fields);
    expect(fields).toHaveLength(1);
    expect(fields.some((f: { type: string }) => f.type === "button")).toBe(false);
  }, 3000);
});

describe("initialDocument", () => {
  it("renders the given document instead of loading a draft from storage", async () => {
    const storage = createMemoryStorage();
    await storage.set(DRAFT_KEY, JSON.stringify({ title: { en: "Should be ignored" }, sections: [] }));

    render(
      <FormBuilder
        storage={storage}
        initialDocument={{
          version: 5,
          title: { en: "Seeded form" },
          theme: DEFAULT_THEME,
          themeOverrides: {},
          sections: [{ id: "s1", title: { en: "" }, background: "", collapsed: false, fields: [] }],
        }}
      />,
    );

    expect(await screen.findByDisplayValue("Seeded form")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Should be ignored")).not.toBeInTheDocument();
  });
});
