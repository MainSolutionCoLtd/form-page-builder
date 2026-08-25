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
});
