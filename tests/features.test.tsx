import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormBuilder from "../src/FormBuilder";
import { createMemoryStorage } from "./testUtils";

describe("features prop", () => {
  it("defaults to full-featured except the Design tab", async () => {
    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    expect(screen.getByRole("button", { name: "View JSON" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Templates" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Textarea" })).toBeInTheDocument();
    // `design` is the one feature that defaults off, matching the old `themeEditable` default.
    expect(screen.queryByRole("button", { name: "Design" })).not.toBeInTheDocument();
  });

  it("shows the Design tab only when features.design is true", async () => {
    render(<FormBuilder storage={createMemoryStorage()} features={{ design: true }} />);
    await screen.findByLabelText("Form title");
    expect(screen.getByRole("button", { name: "Design" })).toBeInTheDocument();
  });

  it("renders the title as plain text (not editable) when features.naming is false", async () => {
    render(<FormBuilder storage={createMemoryStorage()} features={{ naming: false }} />);
    await screen.findByText("Untitled form");
    expect(screen.queryByLabelText("Form title")).not.toBeInTheDocument();
  });

  it("hides View JSON / Templates / New / Preview when their features are off", async () => {
    render(
      <FormBuilder
        storage={createMemoryStorage()}
        features={{ jsonView: false, templates: false, newForm: false, previewMode: false }}
      />,
    );
    await screen.findByLabelText("Form title");

    expect(screen.queryByRole("button", { name: "View JSON" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Templates" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Preview" })).not.toBeInTheDocument();
  });

  it("restricts the Form Fields palette to a fieldTypes allowlist", async () => {
    render(<FormBuilder storage={createMemoryStorage()} features={{ fieldTypes: ["input", "select"] }} />);
    await screen.findByLabelText("Form title");

    expect(screen.getByRole("button", { name: "Input" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Select" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Textarea" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Radio group" })).not.toBeInTheDocument();
  });

  it("hides the Content block palette section when contentBlocks is false", async () => {
    render(<FormBuilder storage={createMemoryStorage()} features={{ contentBlocks: false }} />);
    await screen.findByLabelText("Form title");

    expect(screen.queryByRole("button", { name: "Paragraph" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Button" })).not.toBeInTheDocument();
    // Form Fields are unaffected by contentBlocks.
    expect(screen.getByRole("button", { name: "Input" })).toBeInTheDocument();
  });

  it("hides the Add section button when features.sections is false", async () => {
    render(<FormBuilder storage={createMemoryStorage()} features={{ sections: false }} />);
    await screen.findByLabelText("Form title");
    expect(screen.queryByRole("button", { name: /add section/i })).not.toBeInTheDocument();
  });
});
