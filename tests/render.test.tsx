import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { createMemoryStorage } from "./testUtils";

describe("FormBuilder default render", () => {
  it("renders the toolbar, palette, and an empty first section", async () => {
    render(<FormBuilder storage={createMemoryStorage()} />);

    expect(await screen.findByLabelText("Form title")).toHaveValue("Untitled form");
    expect(screen.getByRole("button", { name: "Build" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Paragraph" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Input" })).toBeInTheDocument();
    expect(screen.getByText(/No fields in this section yet/i)).toBeInTheDocument();
  });

  it("adds a field to the canvas and selects it in the Inspector when a palette button is clicked", async () => {
    const user = userEvent.setup();
    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByRole("button", { name: "Input" }));

    expect(screen.queryByText(/No fields in this section yet/i)).not.toBeInTheDocument();
    // the newly-added field is auto-selected, so the Inspector's Label input picks up its default label
    expect(screen.getByDisplayValue("Input")).toBeInTheDocument();
    expect(screen.queryByText("Select a field to edit its properties.")).not.toBeInTheDocument();
  });

  it("switches to Preview mode without crashing", async () => {
    const user = userEvent.setup();
    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByRole("button", { name: "Preview" }));

    expect(screen.getByRole("button", { name: "Build" })).toBeInTheDocument();
    // Preview mode has no fields yet, so it shows the "add fields" hint instead of the Palette
    expect(screen.queryByRole("button", { name: "Input" })).not.toBeInTheDocument();
  });
});
