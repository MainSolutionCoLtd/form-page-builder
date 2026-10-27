import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBuilder from "../src/FormBuilder";
import { createMemoryStorage } from "./testUtils";

describe("field limit notice", () => {
  it("shows a live count and a limit message at features.maxFields", async () => {
    const user = userEvent.setup();
    render(<FormBuilder storage={createMemoryStorage()} features={{ maxFields: 1 }} />);
    await screen.findByLabelText("Form title");
    expect(screen.getByText("Fields: 0 / 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Textarea" }));
    expect(screen.getByText(/Field limit reached \(1\)/)).toBeInTheDocument();
  });

  it("shows nothing when maxFields is unset", async () => {
    render(<FormBuilder storage={createMemoryStorage()} />);
    await screen.findByLabelText("Form title");
    expect(screen.queryByText(/Fields: /)).not.toBeInTheDocument();
  });
});
