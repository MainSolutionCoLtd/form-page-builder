import { describe, it, expect } from "vitest";
import { compactDocument } from "../src/lib/compact";
import { migrateDocument } from "../src/lib/migrate";

const base = { hideLabel: false, width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false };
const doc = {
  title: { en: "T", ja: "" },
  themeOverrides: {},
  sections: [{
    id: "s1", title: { en: "" }, background: "", collapsed: false,
    fields: [
      { id: "f1", type: "radio", label: { en: "Radio" }, ...base, displayIcon: "Circle", required: false, defaultValue: "option_2",
        options: [{ label: { en: "A" }, value: "option_1" }, { label: { en: "B" }, value: "option_2" }] },
      { id: "f2", type: "input", label: { en: "Name" }, ...base, displayIcon: "Type", required: true, inputType: "text", placeholder: { en: "", ja: "" }, defaultValue: "" },
      { id: "f3", type: "checkboxGroup", label: { en: "Tags" }, ...base, width: "1/2", displayIcon: "ListChecks", required: false, defaultValue: [],
        options: [{ label: { en: "X" }, value: "option_1" }] },
      { id: "f4", type: "toggle", label: { en: "On" }, ...base, displayIcon: "Star", required: false, defaultValue: false },
    ],
  }],
};

describe("compactDocument", () => {
  it("round-trips: migrating the compact form equals migrating the full form", () => {
    expect(migrateDocument(compactDocument(doc as never) as typeof doc as never)).toEqual(migrateDocument(doc as never));
  });

  it("is smaller and drops only default-valued props", () => {
    const compact = compactDocument(doc as never) as typeof doc;
    expect(JSON.stringify(compact).length).toBeLessThan(JSON.stringify(doc).length * 0.75);
    const [radio, input, group, toggle] = compact.sections[0].fields as unknown as Record<string, unknown>[];
    expect(radio.defaultValue).toBe("option_2"); // a real default is kept
    expect(radio).not.toHaveProperty("width");
    expect(input.required).toBe(true);
    expect(input).not.toHaveProperty("placeholder");
    expect(group.width).toBe("1/2");
    expect(toggle.displayIcon).toBe("Star"); // non-default icon is kept
  });

  it("still loads a legacy full document unchanged", () => {
    const migrated = migrateDocument(doc as never)!;
    expect(migrated.sections[0].fields[0]).toMatchObject({ width: "1/1", required: false, defaultValue: "option_2" });
  });
});
