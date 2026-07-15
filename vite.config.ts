import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This config builds the /dev demo harness (index.html -> dev/main.tsx),
// not the published package — that's tsup.config.ts, output to dist/.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? "/form-page-builder/" : "/",
  build: {
    outDir: "pages-dist",
  },
});
