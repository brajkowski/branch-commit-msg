import containerizedTest, {
  SupportedNodeDockerImage,
} from "../containerized-test";

const yarnScriptArgs = process.argv.slice(2);
Object.values(SupportedNodeDockerImage).forEach((dockerImage) => {
  console.log(`Running tests for ${dockerImage}`);
  containerizedTest(
    "npx",
    ["jest", "--testPathPattern=smoke", ...yarnScriptArgs],
    {
      dockerImage,
      sharedHostFiles: ["node_modules", "tsconfig.json", "src", "test"],
    },
  );
});
