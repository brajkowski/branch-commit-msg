import containerizedTest from "../containerized-test";

const yarnScriptArgs = process.argv.slice(2);

containerizedTest(
  "yarn",
  ["jest", "--testPathPattern=integration", "-i", ...yarnScriptArgs],
  {
    sharedHostFiles: [
      "node_modules",
      "package.json",
      "yarn.lock",
      "tsconfig.json",
      "src",
      "test",
      "coverage",
    ],
  }
);
