import { spawnSync } from "child_process";
import { writeFileSync } from "fs";
import { Config, rcFile } from "../../../src/config";

export function createRcFile(config: Config): void {
  writeFileSync(rcFile, JSON.stringify(config));
}

export function deleteRcFile(): void {
  spawnSync("rm", ["-rf", rcFile]);
}
