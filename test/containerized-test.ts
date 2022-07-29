import { spawnSync } from "child_process";

const containerName = "branch-commit-msg-test-env";

function shareWithContainer(
  hostCwd: string,
  hostCwdFile: string,
  containerWd: string
): string {
  return `-v ${hostCwd}/${hostCwdFile}:${containerWd}/${hostCwdFile}`;
}

export default function containerizedTest(
  testCmd: string,
  dockerImage: string,
  sharedHostFiles: string[] = []
): never {
  const hostCwd = process.cwd();
  const containerWd = "/app";
  const sharedFiles = sharedHostFiles
    .map((file) => shareWithContainer(hostCwd, file, containerWd))
    .join(" ");
  const dockerCmd = `docker run ${sharedFiles} --workdir ${containerWd} --name ${containerName} ${dockerImage} ${testCmd}`;
  const result = spawnSync(dockerCmd, { stdio: "inherit", shell: true }).status;
  spawnSync(`docker rm ${containerName}`, { shell: true });

  if (result === null) {
    process.exit(-1);
  }
  process.exit(result);
}
