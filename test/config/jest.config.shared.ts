import type { Config } from "@jest/types";
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageReporters: ["clover"],
  collectCoverageFrom: [
    "src/**",
    "!src/commit-msg-hook.ts",
    "!src/index.ts",
    "!src/install.ts",
  ],
  rootDir: "../",
};

export default config;
