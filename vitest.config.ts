import { defineConfig } from "vitest/config";

import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      provider: "v8",
      exclude: [
        "node_modules/",
        "test/",
        "**/*.d.ts",
        "**/*.test.*",
        "**/*.config.*",
      ],
    },
    deps: {
      optimizer: {
        ssr: {
          enabled: true,
          include: ["@psm/core"],
        },
      },
    },
  },
  plugins: [tsconfigPaths()],
});
