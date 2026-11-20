import { defineProject, mergeConfig } from "vitest/config";

import { sharedConfig } from "../../vitest.config";

// Starting from v22, Node adds its own `globalThis.localStorage`. We want to keep `jsdom`'s for testing.
const [nodeMajor] = process.versions.node.split(".").map(Number);
const execArgv = nodeMajor >= 25 ? ["--no-webstorage"] : nodeMajor >= 22 ? ["--no-experimental-webstorage"] : [];

export default mergeConfig(
  sharedConfig,
  defineProject({
    test: {
      environmentOptions: {
        jsdom: {
          storageQuota: 5000,
        },
      },
      execArgv,
    },
  })
);
