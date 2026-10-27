import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormDocument } from "../src/hooks/useFormDocument";
import { CHROME } from "../src/i18n/chrome";

const setup = () => {
  const hook = renderHook(() => useFormDocument({ language: "en", chrome: CHROME.en }));
  act(() => hook.result.current.addField("radio"));
  return hook;
};
const field = (h: ReturnType<typeof setup>) => h.result.current.sections[0].fields[0] as unknown as { id: string; options: { value: string }[]; defaultValue: string };

describe("option values", () => {
  it("never repeats a value after an option is removed and another added", () => {
    const h = setup();
    const id = field(h).id;
    act(() => h.result.current.addOption(id)); // 1,2,3
    act(() => h.result.current.removeOption(id, 1)); // 1,3
    act(() => h.result.current.addOption(id));
    const values = field(h).options.map((o) => o.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it("clears a default that pointed at a removed option", () => {
    const h = setup();
    const id = field(h).id;
    act(() => h.result.current.updateField(id, { defaultValue: "option_2" }));
    act(() => h.result.current.removeOption(id, 1));
    expect(field(h).defaultValue).toBe("");
  });
});
