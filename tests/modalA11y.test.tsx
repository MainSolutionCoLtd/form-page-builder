import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { createMemoryStorage } from "./testUtils";

describe("modal accessibility", () => {
  it("closes on Escape and returns focus to the opener", async () => {
    const user = userEvent.setup();
    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    const opener = screen.getByRole("button", { name: /Templates/ });
    await user.click(opener);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("traps Tab within the dialog", async () => {
    const user = userEvent.setup();
    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByRole("button", { name: /Templates/ }));
    const dialog = await screen.findByRole("dialog");

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.tab({ shift: true });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});
