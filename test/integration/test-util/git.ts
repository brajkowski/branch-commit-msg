import { spawnSync } from "child_process";
import { gitCmd } from "../../../src/git-interop";

export function createRepo(): void {
  gitCmd(["init", "--quiet"]);
  gitCmd(["config", "user.email", "test@test.com"]);
  gitCmd(["config", "user.name", "test"]);
}

export function deleteRepo(): void {
  spawnSync("rm", ["-rf", ".git"]);
}

export function checkoutBranch(branchName: string): void {
  gitCmd(["checkout", "-b", branchName]);
}

export function commit(message: string): void {
  gitCmd(["commit", "--allow-empty", "-m", message]);
}
