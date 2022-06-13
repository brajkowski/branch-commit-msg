import { spawnSync, SpawnSyncReturns } from "child_process";

export class GitError extends Error {
  constructor(public status: number | null) {
    super(`git exited with status: ${status}`);
  }
}

export class ActiveBranchNotFoundError extends GitError {}

export class ActiveBranchNameExtractionError extends Error {}

export class CommitMessageNotFoundError extends GitError {}

export class CommitMessageExtractionError extends Error {}

export function gitCmd(args: string[]): SpawnSyncReturns<string> {
  return spawnSync("git", args, { stdio: "pipe", encoding: "utf-8" });
}

export function activeBranchName(git = gitCmd): string {
  const result = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  if (result.status !== 0) {
    throw new ActiveBranchNotFoundError(result.status);
  }
  if (result.output.length < 2 || !result.output[1]) {
    throw new ActiveBranchNameExtractionError(
      `Received unexpected output: ${result.output}`
    );
  }
  return result.output[1].trim();
}

export function latestCommitMessage(git = gitCmd): string {
  const result = git(["log", "-1", "--pretty=%B"]);
  if (result.status !== 0) {
    throw new CommitMessageNotFoundError(result.status);
  }
  if (result.output.length < 2 || !result.output[1]) {
    throw new CommitMessageExtractionError(
      `Received unexpected output: ${result.output}`
    );
  }
  return result.output[1].trim();
}
