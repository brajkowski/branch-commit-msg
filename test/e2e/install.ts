import { spawnSync } from "child_process";

export function installHook(): void {
  spawnSync("node", ["dist/index.mjs", "install"]);
}
