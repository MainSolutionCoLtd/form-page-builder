import { describe, it, expect } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import FormBuilder from "../src/FormBuilder";
import { createMemoryStorage } from "./testUtils";

/**
 * jsdom's default viewport (1024px) never matches the `max-width: 720px`
 * media query that makes .fb-mobile-bar visible and turns Palette/Inspector
 * into overlays, so it stays `display: none` here — meaning it's correctly
 * hidden from the accessibility tree, and these queries need `hidden: true`
 * to see it at all. These tests only cover the underlying JS state
 * (data-mobile-panel / aria-pressed), not the CSS a real narrow viewport
 * renders it as.
 */
describe("mobile Palette/Inspector drawer state", () => {
  it("toggles data-mobile-panel when the Blocks button is clicked twice", async () => {
    const { container } = render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    const bar = within(container.querySelector(".fb-mobile-bar")!);
    const blocksBtn = bar.getByRole("button", { name: "Blocks", hidden: true });

    fireEvent.click(blocksBtn);
    expect(container.querySelector(".fb-work-area")).toHaveAttribute("data-mobile-panel", "palette");
    expect(blocksBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(blocksBtn);
    expect(container.querySelector(".fb-work-area")).toHaveAttribute("data-mobile-panel", "none");
    expect(blocksBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("closes the Palette drawer after adding a field", async () => {
    const { container } = render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    fireEvent.click(within(container.querySelector(".fb-mobile-bar")!).getByRole("button", { name: "Blocks", hidden: true }));
    expect(container.querySelector(".fb-work-area")).toHaveAttribute("data-mobile-panel", "palette");

    fireEvent.click(screen.getByRole("button", { name: "Input" }));
    expect(container.querySelector(".fb-work-area")).toHaveAttribute("data-mobile-panel", "none");
  });

  it("opens the Properties drawer when a field is selected in the canvas", async () => {
    const { container } = render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    fireEvent.click(screen.getByRole("button", { name: "Input" }));
    // addField auto-selects the field but bypasses Canvas's onSelectField (and
    // so the drawer-opening it wires up) — click the ticket itself instead,
    // via its "01" index badge, to exercise the actual canvas-selection path.
    fireEvent.click(screen.getByText("01"));

    const bar = within(container.querySelector(".fb-mobile-bar")!);
    expect(container.querySelector(".fb-work-area")).toHaveAttribute("data-mobile-panel", "inspector");
    expect(bar.getByRole("button", { name: "Properties", hidden: true })).toHaveAttribute("aria-pressed", "true");
  });
});
