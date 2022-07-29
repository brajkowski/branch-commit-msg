import { spawnSync } from "child_process";

function shareWithContainer(
  hostCwd: string,
  hostCwdFile: string,
  containerWd: string
): string {
  return `-v ${hostCwd}/${hostCwdFile}:${containerWd}/${hostCwdFile}`;
}

export type ContainerizedTestOptions = {
  containerName?: string;
  containerWorkingDirectory?: string;
  dockerImage?: string;
  sharedHostFiles?: string[];
};

const defaultTestOptions: Required<ContainerizedTestOptions> = {
  containerName: "branch-commit-msg-test-env",
  containerWorkingDirectory: "/app",
  dockerImage: "node:16",
  sharedHostFiles: [],
};

export default function containerizedTest(
  testCmd: string,
  testOptions: ContainerizedTestOptions = {}
): never {
  const options = { ...defaultTestOptions, ...testOptions };
  const hostCwd = process.cwd();
  const containerWd = options.containerWorkingDirectory;
  const sharedFiles = options.sharedHostFiles
    .map((file) => shareWithContainer(hostCwd, file, containerWd))
    .join(" ");
  const dockerCmd = `docker run ${sharedFiles} --workdir ${containerWd} --name ${options.containerName} ${options.dockerImage} ${testCmd}`;
  const result = spawnSync(dockerCmd, { stdio: "inherit", shell: true }).status;
  spawnSync(`docker rm ${options.containerName}`, { shell: true });

  if (result === null) {
    process.exit(-1);
  }
  process.exit(result);
}
