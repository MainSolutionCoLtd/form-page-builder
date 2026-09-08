import { describe, it, expect } from "vitest";
import { migrateDocument, DOCUMENT_VERSION } from "../src/lib/migrate";

const inputField = {
  id: "field_1", type: "input", label: { en: "Name" }, hideLabel: false,
  width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type",
  inputType: "text", placeholder: { en: "" }, defaultValue: "", required: false,
};

describe("migrateDocument — no synthesized submit button", () => {
  it("does not add a Button field to a version-less document with fillable fields", () => {
    const migrated = migrateDocument({
      title: { en: "Contact" },
      sections: [{ id: "s1", title: { en: "" }, background: "", collapsed: false, fields: [inputField] }],
    });

    const fields = migrated!.sections.flatMap((s) => s.fields);
    expect(fields).toHaveLength(1);
    expect(fields.some((f) => f.type === "button")).toBe(false);
  });

  it("no longer bakes a legacy document-level submitLabel into a Button field", () => {
    const migrated = migrateDocument({
      title: { en: "Legacy" },
      submitLabel: "Send",
      submitMode: "combined",
      submitStyle: { color: "", size: "md" },
      sections: [{ id: "s1", title: { en: "" }, background: "", collapsed: false, fields: [inputField] }],
    });

    expect(migrated!.sections.flatMap((s) => s.fields).some((f) => f.type === "button")).toBe(false);
  });

  it("keeps a Button field that is explicitly present in the document", () => {
    const migrated = migrateDocument({
      version: DOCUMENT_VERSION,
      title: { en: "Explicit" },
      sections: [{
        id: "s1", title: { en: "" }, background: "", collapsed: false,
        fields: [
          inputField,
          { id: "field_2", type: "button", label: { en: "Submit" }, hideLabel: false, width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type", action: "submit", buttonStyle: { color: "", size: "md" }, href: "", target: "_self", submitScope: "form" },
        ],
      }],
    });

    const buttons = migrated!.sections.flatMap((s) => s.fields).filter((f) => f.type === "button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0].id).toBe("field_2");
  });
});
