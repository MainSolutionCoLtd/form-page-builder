import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FormBuilder from "../src/FormBuilder";

const container = document.getElementById("root");
if (!container) throw new Error("#root element not found");

createRoot(container).render(
  <StrictMode>
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h2>Full-featured (default)</h2>
      <FormBuilder features={{ design: true }} />

      <h2 style={{ marginTop: 48 }}>Minimal (forms-only embed)</h2>
      <FormBuilder
        features={{
          naming: false,
          templates: false,
          newForm: false,
          autosave: false,
          jsonView: false,
          previewMode: false,
          languageSwitcher: false,
          design: false,
          blockStyling: false,
          contentBlocks: false,
          fieldTypes: ["input", "select", "checkbox"],
          sections: false,
          dragReorder: false,
        }}
      />
    </div>
  </StrictMode>,
);
