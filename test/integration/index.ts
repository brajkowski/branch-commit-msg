import { spawnSync } from "child_process";

const hostCwd = process.cwd();
const containerWd = "/app";

function shareWithContainer(hostCwdFile: string): string {
  return `-v ${hostCwd}/${hostCwdFile}:${containerWd}/${hostCwdFile}`;
}

const result = spawnSync(
  `docker run \
    ${shareWithContainer("node_modules")} \
    ${shareWithContainer("package.json")} \
    ${shareWithContainer("yarn.lock")} \
    ${shareWithContainer("jest.config.js")} \
    ${shareWithContainer("tsconfig.json")} \
    ${shareWithContainer("src")} \
    ${shareWithContainer("test")} \
    ${shareWithContainer("dist")} \
    --workdir ${containerWd} \
    node:16 \
    yarn jest --testPathPattern=test/integration -i`, // -i: Run tests sequentially.
  { stdio: "inherit", shell: true }
).status;

result === null ? process.exit(-1) : process.exit(result);
