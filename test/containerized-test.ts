import { spawnSync } from "child_process";

function shareWithContainer(
  hostCwd: string,
  hostCwdFile: string,
  containerWd: string,
): string {
  return `-v ${hostCwd}/${hostCwdFile}:${containerWd}/${hostCwdFile}`;
}

function removeContainer(containerName: string): void {
  spawnSync(`docker rm ${containerName}`, { shell: true });
}

export enum SupportedNodeDockerImage {
  v14 = "node:14",
  v16 = "node:16",
  v18 = "node:18",
  vCurrent = "node:20",
}

export type ContainerizedTestOptions = {
  containerName?: string;
  containerWorkingDirectory?: string;
  dockerImage?: SupportedNodeDockerImage;
  sharedHostFiles?: string[];
};

const defaultTestOptions: Required<ContainerizedTestOptions> = {
  containerName: "branch-commit-msg-test-env",
  containerWorkingDirectory: "/app",
  dockerImage: SupportedNodeDockerImage.v16,
  sharedHostFiles: [],
};

export default function containerizedTest(
  testCommand: string,
  testCommandArgs: string[],
  testOptions: ContainerizedTestOptions = {},
): void {
  const options = { ...defaultTestOptions, ...testOptions };
  const hostCwd = process.cwd();
  const sharedFiles = options.sharedHostFiles.map((file) =>
    shareWithContainer(hostCwd, file, options.containerWorkingDirectory),
  );
  removeContainer(options.containerName);
  const result = spawnSync(
    "docker",
    [
      "run",
      sharedFiles,
      "--workdir",
      options.containerWorkingDirectory,
      "--name",
      options.containerName,
      options.dockerImage,
      testCommand,
      testCommandArgs,
    ].flat(),
    { stdio: "inherit", shell: true },
  ).status;
  removeContainer(options.containerName);

  if (result === null) {
    process.exit(-1);
  }

  if (result !== 0) {
    process.exit(result);
  }
}
