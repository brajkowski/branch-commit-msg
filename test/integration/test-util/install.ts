import { copyFileSync } from "fs";

export function installHook(): void {
  copyFileSync("dist/commit-msg-hook.js", ".git/hooks/commit-msg");
  copyFileSync("dist/git-interop.js", ".git/hooks/git-interop.js");
  copyFileSync("dist/config.js", ".git/hooks/config.js");
}
