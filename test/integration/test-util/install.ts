import { copyFileSync } from "fs";

export function installHook(): void {
  copyFileSync("dist/commit-msg", ".git/hooks/commit-msg");
}
