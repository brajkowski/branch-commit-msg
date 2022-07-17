import { copyFileSync } from "fs";
import { join } from "path";
import { repoRootDir } from "./git-interop";

export function installAsGitHook(): void {
  const commitMsgBinPath = join(__dirname, "commit-msg");
  const root = repoRootDir();
  const installPath = join(root, ".git", "hooks", "commit-msg");
  copyFileSync(commitMsgBinPath, installPath);
  console.log(`Installed hook to ${installPath}`);
}
