import { spawnSync } from "child_process";
import { writeFileSync } from "fs";
import { Config, RC_FILE_NAME } from "../../../src/config";

export function createRcFile(config: Config): void {
  writeFileSync(RC_FILE_NAME, JSON.stringify(config));
}

export function deleteRcFile(): void {
  spawnSync("rm", ["-rf", RC_FILE_NAME]);
}
