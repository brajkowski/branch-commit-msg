import { spawnSync } from "child_process";
import { writeFileSync } from "fs";
import { Config, RC_FILE_NAME } from "../../../src/config";

export function createRcFile(config: Config): void {
  createRcFileRaw(JSON.stringify(config));
}

export function createRcFileRaw(raw: string): void {
  writeFileSync(RC_FILE_NAME, raw);
}

export function deleteRcFile(): void {
  spawnSync("rm", ["-rf", RC_FILE_NAME]);
}
