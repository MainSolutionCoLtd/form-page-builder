import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { INDEX_KEY, formKey } from "../src/lib/storage/keys";
import { createMemoryStorage } from "./testUtils";
import type { StorageAdapter } from "../src/types";

async function seedTemplate(storage: StorageAdapter, id: string, title: string) {
  const raw = await storage.get(INDEX_KEY);
  const list = raw ? JSON.parse(raw) : [];
  list.push({ id, title, updatedAt: 1 });
  await storage.set(INDEX_KEY, JSON.stringify(list));
  await storage.set(
    formKey(id),
    JSON.stringify({
      id,
      updatedAt: 1,
      title: { en: title },
      themeOverrides: {},
      sections: [{ id: `s_${id}`, title: { en: "" }, background: "", collapsed: false, fields: [] }],
    }),
  );
}

describe("features.templates", () => {
  it("shows both the Templates and Save buttons by default", async () => {
    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");
    expect(screen.getByRole("button", { name: /Templates/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("hides all template UI when features.templates is false", async () => {
    render(<FormBuilder storage={createMemoryStorage()} features={{ templates: false }} />);
    await screen.findByLabelText("Form title");
    expect(screen.queryByRole("button", { name: /Templates/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
  });

  it("keeps the Templates library but hides Save when features.templates.manage is false", async () => {
    render(<FormBuilder storage={createMemoryStorage()} features={{ templates: { manage: false } }} />);
    await screen.findByLabelText("Form title");
    expect(screen.getByRole("button", { name: /Templates/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
  });

  it("in pick-and-apply mode, the library lists templates with an Apply action and no delete", async () => {
    const storage = createMemoryStorage();
    await seedTemplate(storage, "tpl_1", "Company Default");
    const user = userEvent.setup();

    render(<FormBuilder storage={storage} features={{ templates: { manage: false } }} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByRole("button", { name: /Templates/ }));
    expect(await screen.findByText("Company Default")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(await screen.findByDisplayValue("Company Default")).toBeInTheDocument();
  });

  it("enforces features.templates.max when saving a new template", async () => {
    const storage = createMemoryStorage();
    await seedTemplate(storage, "tpl_1", "Only Slot");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const user = userEvent.setup();

    render(<FormBuilder storage={storage} features={{ templates: { max: 1 } }} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByRole("button", { name: "Save" }));
    await user.click(await screen.findByRole("button", { name: "Save template" }));

    expect(alertSpy).toHaveBeenCalledWith("You can save up to 1 template. Delete one to save another.");
    const index = JSON.parse((await storage.get(INDEX_KEY))!);
    expect(index).toHaveLength(1);
    alertSpy.mockRestore();
  });
});
