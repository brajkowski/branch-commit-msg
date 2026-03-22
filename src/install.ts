import { copyFileSync } from "fs";
import { join } from "path";
import { GitError, repoRootDir } from "./git-interop";

export function installAsGitHook(): void {
  const commitMsgBinPath = join(__dirname, "commit-msg");

  let root: string;
  try {
    root = repoRootDir();
  } catch (err) {
    if (err instanceof GitError) {
      throw new Error(
        "Could not find the root of the repository -- check that git is installed and that this install is running inside of a git repository.",
        { cause: err },
      );
    }
    throw err;
  }
  const installPath = join(root, ".git", "hooks", "commit-msg");
  copyFileSync(commitMsgBinPath, installPath);
  console.log(`Installed hook to ${installPath}`);
}
