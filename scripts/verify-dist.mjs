/* global console, process */
// Guards the server-safe viewer bundle: it must stay free of "use client", hooks and icon/editor code.
import { readFileSync } from "node:fs";

const failures = [];
for (const file of ["dist/viewer.js", "dist/viewer.cjs"]) {
  const code = readFileSync(file, "utf8");
  if (/^\s*["']use client["']/.test(code)) failures.push(`${file} starts with "use client"`);
  for (const bad of ["lucide-react", "lz-string", "useState", "useEffect", "useRef", "useMemo", "useCallback"]) {
    if (code.includes(bad)) failures.push(`${file} contains ${bad}`);
  }
}
if (!/^\s*["']use client["']/.test(readFileSync("dist/index.js", "utf8"))) failures.push('dist/index.js lost its "use client" banner');

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("dist ok: viewer bundle is server-safe");
