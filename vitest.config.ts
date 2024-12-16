import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
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
  },
});
