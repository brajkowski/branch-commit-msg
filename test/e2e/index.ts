import containerizedTest, {
  SupportedNodeDockerImage,
} from "../containerized-test";

const yarnScriptArgs = process.argv.slice(2);
Object.values(SupportedNodeDockerImage).forEach((dockerImage) => {
  console.log(`Running tests for ${dockerImage}`);
  containerizedTest(
    "npx",
    ["jest", "--testPathPattern=e2e", "-i", ...yarnScriptArgs],
    {
      dockerImage,
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
    },
  );
});
