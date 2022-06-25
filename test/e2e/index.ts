import containerizedTest from "../containerized-test";

containerizedTest("yarn jest --testPathPattern=test/e2e -i", "node:16", [
  "node_modules",
  "package.json",
  "yarn.lock",
  "jest.config.js",
  "tsconfig.json",
  "src",
  "test",
  "dist",
]);
