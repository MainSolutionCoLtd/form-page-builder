import { defineConfig } from "tsup";

const shared = { format: ["esm", "cjs"] as ["esm", "cjs"], dts: true, sourcemap: true, splitting: false, external: ["react", "react-dom"] };

// `clean` is left to `npm run clean`: the two builds run in parallel and would delete each other's output.
export default defineConfig([
  { ...shared, entry: { index: "src/index.ts" }, banner: { js: '"use client";' } },
  // The viewer entry has no "use client" so a Next.js server component can render it without a client boundary.
  { ...shared, entry: { viewer: "src/viewer.ts" } },
]);
