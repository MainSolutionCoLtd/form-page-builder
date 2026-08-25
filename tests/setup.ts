import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Without vitest's `globals: true`, @testing-library/react's automatic
// cleanup-after-each (which relies on a *global* `afterEach`) never
// registers, so unmounted components from earlier tests pile up in the DOM.
afterEach(cleanup);
