import { defineConfig, defineProject, mergeConfig } from "vitest/config";

// Configuration to apply globally *and* to all projects.
// NOTE: `defineProject` is implementation-identical to `defineConfig`, but limits its arg type to
//   options that are valid on projects, to keep this valid to merge into package configs.
export const sharedConfig = defineProject({
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/es/**", "**/node_modules/**"],
  },
});

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      projects: ["packages/*"],
    },
  })
);
