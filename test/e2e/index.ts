import containerizedTest from "../containerized-test";

const yarnScriptArgs = process.argv.slice(2);
const testCmd = [
  "yarn",
  "jest",
  "--testPathPattern=test/e2e",
  "-i",
  ...yarnScriptArgs,
].join(" ");

containerizedTest(testCmd, "node:16", [
  "node_modules",
  "package.json",
  "yarn.lock",
  "jest.config.shared.ts",
  "jest.config.e2e.ts",
  "tsconfig.json",
  "src",
  "test",
  "dist",
  "coverage",
]);
