#!/usr/bin/env node
import escapeStringRegexp from "escape-string-regexp";
import { readFileSync, writeFileSync } from "fs";
import { exit } from "process";
import { getConfig } from "./config";
import { GitError, activeBranchName } from "./git-interop";

enum RegExpFlag {
  IGNORE_CASE = "i",
}

/**
 * Prevent commit subjects that are already in the proper format
 * from being formatted again which would duplicate any matched
 * branch details and non formatting token characters in the final commit subject.
 *
 * This allows amending a commit message to work as expected.
 *
 * @param currentCommitSubject
 * @param commitMsgFormat
 * @param branchMatches
 * @returns The current commit subject removed of any formatting that may have already been applied.
 */
function dedupeCurrentCommitSubject(
  currentCommitSubject: string,
  commitMsgFormat: string,
  branchMatches: RegExpMatchArray
): string {
  const appliedFormatting = branchMatches.reduce(
    (msg, branchDetail, index) =>
      msg
        .replace(`%b${index} | upper`, branchDetail.toUpperCase())
        .replace(`%b${index} | lower`, branchDetail.toLowerCase())
        .replace(`%b${index}`, branchDetail),
    commitMsgFormat
      .replace("%m | upper", "")
      .replace("%m | lower", "")
      .replace("%m", "")
  );
  return currentCommitSubject.replace(
    new RegExp(escapeStringRegexp(appliedFormatting), RegExpFlag.IGNORE_CASE),
    ""
  );
}

let branchName: string;
const commitMsgFilePath = process.argv[process.argv.length - 1];
const commitMsgFileLines = readFileSync(commitMsgFilePath)
  .toString()
  .split(/\r?\n/);
const currentCommitSubject = commitMsgFileLines[0];
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

const currentCommitSubjectDeduped = dedupeCurrentCommitSubject(
  currentCommitSubject,
  hookConfig.commitMsgFormat,
  branchMatches
);

const newCommitSubject = branchMatches
  .reduce(
    (msg, branchDetail, index) =>
      msg
        .replace(`%b${index} | upper`, branchDetail.toUpperCase())
        .replace(`%b${index} | lower`, branchDetail.toLowerCase())
        .replace(`%b${index}`, branchDetail),
    hookConfig.commitMsgFormat
  )
  .replace("%m | upper", currentCommitSubjectDeduped.toUpperCase())
  .replace("%m | lower", currentCommitSubjectDeduped.toLowerCase())
  .replace("%m", currentCommitSubjectDeduped);
commitMsgFileLines[0] = newCommitSubject;

writeFileSync(commitMsgFilePath, commitMsgFileLines.join("\n"));
