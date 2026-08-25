import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormBuilder from "../src/FormBuilder";
import { DRAFT_KEY } from "../src/lib/storage/keys";
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
