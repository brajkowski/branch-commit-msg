import containerizedTest from "../containerized-test";

const yarnScriptArgs = process.argv.slice(2);
const testCmd = [
  "yarn",
  "jest",
  "--testPathPattern=e2e",
  "-i",
  ...yarnScriptArgs,
].join(" ");

containerizedTest(testCmd, {
  sharedHostFiles: [
    "node_modules",
    "package.json",
    "yarn.lock",
    "tsconfig.json",
    "src",
    "test",
    "dist",
    "coverage",
  ],
});
