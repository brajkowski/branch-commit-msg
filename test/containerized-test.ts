import { spawnSync } from "child_process";

const hostCwd = process.cwd();
const containerWd = "/app";

function shareWithContainer(hostCwdFile: string): string {
  return `-v ${hostCwd}/${hostCwdFile}:${containerWd}/${hostCwdFile}`;
}

export default function containerizedTest(
  testCmd: string,
  dockerImage: string,
  sharedHostFiles: string[] = []
): never {
  const sharedFiles = sharedHostFiles.map(shareWithContainer).join(" ");
  const dockerCmd = `docker run ${sharedFiles} --workdir ${containerWd} ${dockerImage} ${testCmd}`;
  const result = spawnSync(dockerCmd, { stdio: "inherit", shell: true }).status;

  if (result === null) {
    process.exit(-1);
  }
  process.exit(result);
}
