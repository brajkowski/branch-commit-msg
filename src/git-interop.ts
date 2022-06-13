import { spawnSync, SpawnSyncReturns } from "child_process";

export class GitError extends Error {
  constructor(public status: number | null) {
    super(`git exited with status: ${status}`);
  }
}

export class ResultExtractionError extends Error {}

export function gitCmd(args: string[]): SpawnSyncReturns<string> {
  return spawnSync("git", args, { stdio: "pipe", encoding: "utf-8" });
}

function extractOutput(result: SpawnSyncReturns<string>): string {
  if (result.status !== 0) {
    throw new GitError(result.status);
  }
  if (result.output.length < 2 || !result.output[1]) {
    throw new ResultExtractionError(
      `Received unexpected output: ${result.output}`
    );
  }
  return result.output[1].trim();
}

export function activeBranchName(git = gitCmd): string {
  const result = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  return extractOutput(result);
}

export function latestCommitMessage(git = gitCmd): string {
  const result = git(["log", "-1", "--pretty=%B"]);
  return extractOutput(result);
}
