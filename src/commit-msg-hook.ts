#!/usr/bin/env node
import escapeStringRegexp from "escape-string-regexp";
import { readFileSync, writeFileSync } from "fs";
import { exit } from "process";
import { getConfig } from "./config";
import { activeBranchName, GitError } from "./git-interop";

enum RegExpFlag {
  IGNORE_CASE = "i",
}

/**
 * Prevent messages that are already in the proper format
 * from being formatted again which would duplicate any matched
 * branch details and non formatting token characters in the final commit message.
 *
 * This allows amending a commit message to work as expected.
 *
 * @param currentCommitMsg
 * @param commitMsgFormat
 * @param branchMatches
 * @returns The current commit message removed of any formatting that may have already been applied.
 */
function dedupeCurrentCommitMsg(
  currentCommitMsg: string,
  commitMsgFormat: string,
  branchMatches: RegExpMatchArray
): string {
  const nonTokenChars = commitMsgFormat
    // Find all formatting tokens.
    .match(/(%m|%b[0-9]+)(\s\|\s(lower|upper))?/g)

    // Remove all formatting tokens -- what remains are the non formatting token characters.
    ?.reduce(
      (msgFormat, formatToken) => msgFormat.replace(formatToken, ""),
      commitMsgFormat
    );

  let currentCommitMsgDeduped = branchMatches.reduce(
    // Remove any matched branch details.
    (msg, branchDetail) =>
      msg.replace(new RegExp(branchDetail, RegExpFlag.IGNORE_CASE), ""),
    currentCommitMsg
  );
  if (nonTokenChars) {
    // Remove any non formatting token characters.
    currentCommitMsgDeduped = currentCommitMsgDeduped.replace(
      new RegExp(escapeStringRegexp(nonTokenChars), RegExpFlag.IGNORE_CASE),
      ""
    );
  }
  return currentCommitMsgDeduped;
}

let branchName: string;
const commitMsgFilePath = process.argv[process.argv.length - 1];
const currentCommitMsg = readFileSync(commitMsgFilePath)
  .toString()
  .replace(/^#.*(\r\n|\n|\r)?/gm, "")
  .trimEnd();
const hookConfig = getConfig();

if (hookConfig === undefined) {
  exit(0);
}

try {
  branchName = activeBranchName();
} catch (error) {
  if (!(error instanceof GitError)) {
    throw error;
  }
  exit(0);
}

const branchMatches = branchName.match(
  new RegExp(
    hookConfig.extractPattern,
    hookConfig.extractPatternMatchCase ? undefined : RegExpFlag.IGNORE_CASE
  )
);

if (!branchMatches) {
  exit(0);
}

const currentCommitMsgDeduped = dedupeCurrentCommitMsg(
  currentCommitMsg,
  hookConfig.commitMsgFormat,
  branchMatches
);

const newCommitMsg = branchMatches
  .reduce(
    (msg, branchDetail, index) =>
      msg
        .replace(`%b${index} | upper`, branchDetail.toUpperCase())
        .replace(`%b${index} | lower`, branchDetail.toLowerCase())
        .replace(`%b${index}`, branchDetail),
    hookConfig.commitMsgFormat
  )
  .replace("%m | upper", currentCommitMsgDeduped.toUpperCase())
  .replace("%m | lower", currentCommitMsgDeduped.toLowerCase())
  .replace("%m", currentCommitMsgDeduped);

writeFileSync(commitMsgFilePath, newCommitMsg);
