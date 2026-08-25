import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { DEFAULT_THEME } from "../src/theme/defaultTheme";
import type { FormBuilderHandle } from "../src/types";
import { createMemoryStorage } from "./testUtils";

describe("FormBuilderHandle ref API", () => {
  it("getDocument/exportJson reflect fields added through the UI", async () => {
    const ref = createRef<FormBuilderHandle>();
    const user = userEvent.setup();
    render(<FormBuilder ref={ref} storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    await user.click(screen.getByRole("button", { name: "Input" }));

    const doc = ref.current!.getDocument();
    expect(doc.version).toBe(5);
    expect(doc.sections).toHaveLength(1);
    expect(doc.sections[0].fields).toHaveLength(1);
    expect(doc.sections[0].fields[0].type).toBe("input");

    const json = ref.current!.exportJson();
    expect(JSON.parse(json)).toEqual(doc);
  });

  it("loadDocument replaces the current document", async () => {
    const ref = createRef<FormBuilderHandle>();
    render(<FormBuilder ref={ref} storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");

    act(() => {
      ref.current!.loadDocument({
        version: 5,
        title: { en: "Loaded via ref" },
        theme: DEFAULT_THEME,
        themeOverrides: {},
        sections: [
          {
            id: "s1",
            title: { en: "" },
            background: "",
            collapsed: false,
            fields: [],
          },
        ],
      });
    });

    expect(await screen.findByDisplayValue("Loaded via ref")).toBeInTheDocument();
  });
});
