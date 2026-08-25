import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormBuilder, { DARK_THEME, DEFAULT_THEME } from "../src/index";
import { createMemoryStorage } from "./testUtils";

describe("theme", () => {
  it("exports DARK_THEME and DEFAULT_THEME as distinct, ready-made Theme objects", () => {
    expect(DEFAULT_THEME.ink).not.toBe(DARK_THEME.ink);
    expect(DEFAULT_THEME.surface).not.toBe(DARK_THEME.surface);
    expect(DARK_THEME.layout).toEqual(DEFAULT_THEME.layout);
  });

  it("wires theme colors onto .fb-root as CSS custom properties", async () => {
    const { container } = render(<FormBuilder storage={createMemoryStorage()} theme={DARK_THEME} />);
    await screen.findByLabelText("Form title");

    const root = container.querySelector(".fb-root") as HTMLElement;
    expect(root.style.getPropertyValue("--fb-ink")).toBe(DARK_THEME.ink);
    expect(root.style.getPropertyValue("--fb-surface")).toBe(DARK_THEME.surface);
    expect(root.style.getPropertyValue("--fb-primary")).toBe(DARK_THEME.primary);
  });
});
