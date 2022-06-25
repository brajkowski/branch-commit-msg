import containerizedTest from "../containerized-test";

containerizedTest(
  "yarn jest --testPathPattern=test/integration -i",
  "node:16",
  [
    "node_modules",
    "package.json",
    "yarn.lock",
    "jest.config.js",
    "tsconfig.json",
    "src",
    "test",
  ]
);
