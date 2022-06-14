import { spawnSync } from "child_process";
import { copyFileSync, writeFileSync } from "fs";
import { Config, rcFile } from "../../src/config";
import { gitCmd } from "../../src/git-interop";

export function createGitRepo(): void {
  gitCmd(["init", "--quiet"]);
  gitCmd(["config", "user.email", "test@test.com"]);
  gitCmd(["config", "user.name", "test"]);
}

export function deleteGitRepo(): void {
  spawnSync("rm", ["-rf", ".git"]);
}

export function checkoutBranch(branchName: string): void {
  gitCmd(["checkout", "-b", branchName]);
}

export function commit(message: string): void {
  gitCmd(["commit", "--allow-empty", "-m", message]);
}

export function installHook(): void {
  copyFileSync("dist/commit-msg-hook.js", ".git/hooks/commit-msg");
  copyFileSync("dist/git-interop.js", ".git/hooks/git-interop.js");
  copyFileSync("dist/config.js", ".git/hooks/config.js");
}

export function createRcFile(config: Config): void {
  writeFileSync(rcFile, JSON.stringify(config));
}

export function deleteRcFile(): void {
  spawnSync("rm", ["-rf", rcFile]);
}
