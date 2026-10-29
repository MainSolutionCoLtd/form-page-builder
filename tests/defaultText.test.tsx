import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import type { FormBuilderHandle, FormDocument } from "../src/types";
import { DEFAULT_THEME } from "../src/theme/defaultTheme";
import { collectDefaultTexts, dropStaleDefaults } from "../src/lib/defaultText";
import { createMemoryStorage } from "./testUtils";

const defaults = collectDefaultTexts();

describe("dropStaleDefaults", () => {
  it("empties another language that still holds a built-in default once one language is typed", () => {
    expect(dropStaleDefaults({ en: "Input", ja: "" }, { en: "Input", ja: "名前" }, defaults)).toEqual({ en: "", ja: "名前" });
    expect(dropStaleDefaults({ en: "Input", ja: "入力" }, { en: "Name", ja: "入力" }, defaults)).toEqual({ en: "Name", ja: "" });
  });

  it("leaves text the author wrote in the other language alone", () => {
    expect(dropStaleDefaults({ en: "Name", ja: "お名前" }, { en: "Full name", ja: "お名前" }, defaults)).toEqual({ en: "Full name", ja: "お名前" });
  });

  it("does nothing when nothing changed or when the edit empties a language", () => {
    const same = { en: "Input", ja: "" };
    expect(dropStaleDefaults(same, same, defaults)).toBe(same);
    expect(dropStaleDefaults({ en: "Input", ja: "名前" }, { en: "Input", ja: "" }, defaults)).toEqual({ en: "Input", ja: "" });
  });

  it("treats option seeds and the form title as defaults", () => {
    expect(dropStaleDefaults({ en: "Option 1", ja: "" }, { en: "Option 1", ja: "はい" }, defaults)).toEqual({ en: "", ja: "はい" });
    expect(dropStaleDefaults({ en: "Untitled form", ja: "" }, { en: "Untitled form", ja: "問い合わせ" }, defaults)).toEqual({ en: "", ja: "問い合わせ" });
  });
});

describe("editing a default in the inspector", () => {
  const doc: FormDocument = {
    version: 5, title: { en: "Form" }, theme: DEFAULT_THEME, themeOverrides: {},
    sections: [{ id: "s1", title: { en: "" }, background: "", collapsed: false, fields: [
      { id: "f1", type: "input", label: { en: "Input", ja: "" }, hideLabel: false, width: "1/1", verticalAlign: "top", labelPosition: "top", showIcon: false, displayIcon: "Type", inputType: "text", placeholder: { en: "" }, defaultValue: "", required: false } as any,
    ] }],
  };

  it("shows only the language's own text (the fallback is a hint) and clears the untouched English default", async () => {
    const user = userEvent.setup();
    const ref = createRef<FormBuilderHandle>();
    render(<FormBuilder ref={ref} storage={createMemoryStorage()} initialDocument={doc} language="ja" />);

    await user.click(await screen.findByText("Input"));
    const label = screen.getByPlaceholderText("Input");
    expect(label).toHaveValue("");

    await user.type(label, "名前");

    const field = ref.current!.getDocument().sections[0].fields[0] as any;
    expect(field.label.ja).toBe("名前");
    expect(field.label.en).toBe("");
  });
});
