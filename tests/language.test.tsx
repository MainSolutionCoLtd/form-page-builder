import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { createMemoryStorage } from "./testUtils";

const storage = () => createMemoryStorage();

describe("language ownership", () => {
  it("keeps its own switcher when the host passes no language", async () => {
    render(<FormBuilder storage={storage()} />);
    expect(await screen.findByRole("button", { name: "日本語" })).toBeInTheDocument();
  });

  it("hides its switcher when the host passes language", async () => {
    render(<FormBuilder storage={storage()} language="ja" />);
    await screen.findByLabelText("Form title");
    expect(screen.queryByRole("button", { name: "日本語" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "作成" })).toBeInTheDocument();
  });

  it("follows the host when the language prop changes", async () => {
    const { rerender } = render(<FormBuilder storage={storage()} language="en" />);
    expect(await screen.findByRole("button", { name: "Build" })).toBeInTheDocument();

    rerender(<FormBuilder storage={storage()} language="ja" />);
    expect(await screen.findByRole("button", { name: "作成" })).toBeInTheDocument();

    rerender(<FormBuilder storage={storage()} language="en" />);
    expect(await screen.findByRole("button", { name: "Build" })).toBeInTheDocument();
  });

  it("shows the switcher anyway with features.languageSwitcher: true, and reports picks via onLanguageChange", async () => {
    const user = userEvent.setup();
    const onLanguageChange = vi.fn();
    render(<FormBuilder storage={storage()} language="en" features={{ languageSwitcher: true }} onLanguageChange={onLanguageChange} />);

    await user.click(await screen.findByRole("button", { name: "日本語" }));

    expect(onLanguageChange).toHaveBeenCalledWith("ja");
    expect(await screen.findByRole("button", { name: "作成" })).toBeInTheDocument();
  });

  it("still lets features.languageSwitcher: false hide the switcher when no language is passed", async () => {
    render(<FormBuilder storage={storage()} features={{ languageSwitcher: false }} />);
    await screen.findByLabelText("Form title");
    expect(screen.queryByRole("button", { name: "日本語" })).not.toBeInTheDocument();
  });
});
