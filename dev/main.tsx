import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FormBuilder from "../src/FormBuilder";

const container = document.getElementById("root");
if (!container) throw new Error("#root element not found");

createRoot(container).render(
  <StrictMode>
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <FormBuilder themeEditable />
    </div>
  </StrictMode>,
);
